import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

const folder = path.dirname(fileURLToPath(import.meta.url))
function load(name, dependencies = {}) {
  const source = fs.readFileSync(path.join(folder, name), 'utf8')
  const output = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS } }).outputText
  const moduleRecord = { exports: {} }
  vm.runInNewContext(output, { module: moduleRecord, exports: moduleRecord.exports, require: (id) => {
    if (!(id in dependencies)) throw new Error('Unexpected test dependency: ' + id)
    return dependencies[id]
  } })
  return moduleRecord.exports
}
const sizes = load('../../lib/constants/product-sizes.ts')
const model = load('cart-model.ts', { '@/lib/constants/product-sizes': sizes })
const drafts = load('checkout-draft.ts', { './cart-model': model, '@/lib/constants/product-sizes': sizes })
const item = (id = 'ca-phe-den', quantity = 1, size = 'M') => ({ productId: id, size, name: 'Coffee', unitPrice: 19000, imageUrl: '/images/drinks/ca-phe-den.jpg', quantity })
const encoded = (items, version = 1) => JSON.stringify({ version, items })
const plain = (value) => JSON.parse(JSON.stringify(value))

test('cart survives storage roundtrip with distinct quantities and prices', () => {
  const items = [item('ca-phe-den', 2), item('tra-dau', 3)]
  assert.deepEqual(plain(model.parseCart(encoded(items)).items), items)
  assert.equal(model.parseCart(encoded(items)).notice, null)
})

test('legacy carts default to M and current carts keep separate sizes', () => {
  const legacy = { ...item(), size: undefined }
  assert.deepEqual(plain(model.parseCart(encoded([legacy])).items), [item()])
  assert.deepEqual(plain(model.parseCart(encoded([item('coffee', 2, 'S'), item('coffee', 3, 'L')], 2)).items), [item('coffee', 2, 'S'), item('coffee', 3, 'L')])
  assert.equal(model.parseCart(encoded([item('coffee', 1, 'S'), item('coffee', 1, 'L')], 2)).notice, null)
})

test('size prices use M base with positive S floor and upper guard', () => {
  assert.equal(sizes.getSizePrice(19000, 'S'), 14000)
  assert.equal(sizes.getSizePrice(19000, 'M'), 19000)
  assert.equal(sizes.getSizePrice(19000, 'L'), 24000)
  assert.equal(sizes.getSizePrice(3000, 'S'), 1000)
  assert.equal(sizes.getSizePrice(10_000_000, 'L'), null)
})

test('cart rejects unknown schema, duplicate products, malformed prices and counts', () => {
  for (const raw of [
    'broken json', encoded([item()], 3), encoded([item(), item()]), encoded([item('coffee', 1, 'XL')], 2),
    encoded([{ ...item(), unitPrice: -1 }]), encoded([item('ca-phe-den', 0)]),
    encoded([item('ca-phe-den', 21)]), encoded([{ ...item(), imageUrl: 'javascript:alert(1)' }]),
  ]) {
    const result = model.parseCart(raw)
    assert.equal(result.items.length, 0)
    assert.equal(typeof result.notice, 'string')
  }
})

test('cart quantity limits allow exactly 20 per item and 50 per order', () => {
  const items = [item('coffee', 20), item('matcha', 20), item('tea', 9)]
  assert.equal(model.quantityError(items, 'tea', 10), null)
  assert.equal(typeof model.quantityError(items, 'tea', 11), 'string')
  assert.equal(typeof model.quantityError(items, 'coffee', 21), 'string')
  const twentyItems = Array.from({ length: 20 }, (_, index) => item('drink-' + index))
  assert.equal(typeof model.quantityError(twentyItems, 'extra', 1), 'string')
  assert.equal(model.quantityError(twentyItems, 'drink-0', 2), null)
})

test('successful order removes only ordered quantities and preserves later additions', () => {
  const remaining = model.subtractOrderedItems([item('coffee', 4), item('tea', 2)], [{ productId: 'coffee', quantity: 3 }])
  assert.deepEqual(plain(remaining), [item('coffee', 1), item('tea', 2)])
})

test('quantity and removal affect the matching size only', () => {
  const items = [item('coffee', 3, 'S'), item('coffee', 2, 'M')]
  assert.equal(model.quantityError(items, 'coffee', 20, 'S'), null)
  assert.deepEqual(plain(model.subtractOrderedItems(items, [{ productId: 'coffee', size: 'S', quantity: 2 }])), [item('coffee', 1, 'S'), item('coffee', 2, 'M')])
})

function pending() {
  return {
    version: 1,
    input: {
      idempotencyKey: '12345678-1234-4234-8234-123456789012',
      fulfillment: 'delivery',
      customer: { name: 'Demo', phone: '0912345678', address: 'Demo delivery address' },
      note: '',
      items: [{ productId: 'ca-phe-den', quantity: 2 }],
    },
    items: [item('ca-phe-den', 2)],
  }
}

test('pending retry preserves the exact key and request after reload', () => {
  const original = pending()
  const restored = drafts.parsePendingOrder(JSON.stringify(original))
  assert.equal(restored.invalid, false)
  assert.deepEqual(plain(restored.pending), original)
  assert.equal(JSON.stringify(restored.pending.input), JSON.stringify(original.input))
})

test('legacy pending retry keeps request bytes while restoring M item display', () => {
  const original = pending()
  delete original.items[0].size
  const restored = drafts.parsePendingOrder(JSON.stringify(original))
  assert.equal(restored.invalid, false)
  assert.equal(restored.pending.items[0].size, 'M')
  assert.equal(JSON.stringify(restored.pending.input), JSON.stringify(original.input))
})

test('pending draft rejects pickup, schema mismatch and altered item snapshots', () => {
  const pickup = pending(); pickup.input.fulfillment = 'pickup'
  const version = pending(); version.version = 3
  const mismatch = pending(); mismatch.input.items[0].quantity = 5
  const sizeMismatch = pending(); sizeMismatch.input.items[0].size = 'S'
  for (const draft of [pickup, version, mismatch, sizeMismatch]) {
    const result = drafts.parsePendingOrder(JSON.stringify(draft))
    assert.equal(result.pending, null)
    assert.equal(result.invalid, true)
  }
})

const access = load('browser-storage.ts', { react: {} })
test('private order access rejects missing, malformed and wrong-version credentials', () => {
  const token = 'a'.repeat(43)
  assert.equal(access.readAccessToken(JSON.stringify({ version: 1, accessToken: token })), token)
  for (const raw of [null, 'broken', JSON.stringify({ version: 2, accessToken: token }), JSON.stringify({ version: 1, accessToken: 'short' })]) {
    assert.equal(access.readAccessToken(raw), null)
  }
})
