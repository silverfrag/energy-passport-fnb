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
const model = load('cart-model.ts')
const drafts = load('checkout-draft.ts', { './cart-model': model })
const item = (id = 'ca-phe-den', quantity = 1) => ({ productId: id, name: 'Coffee', unitPrice: 19000, imageUrl: '/images/drinks/ca-phe-den.jpg', quantity })
const encoded = (items, version = 1) => JSON.stringify({ version, items })
const plain = (value) => JSON.parse(JSON.stringify(value))

test('cart survives storage roundtrip with distinct quantities and prices', () => {
  const items = [item('ca-phe-den', 2), item('tra-dau', 3)]
  assert.deepEqual(plain(model.parseCart(encoded(items)).items), items)
  assert.equal(model.parseCart(encoded(items)).notice, null)
})

test('cart rejects unknown schema, duplicate products, malformed prices and counts', () => {
  for (const raw of [
    'broken json', encoded([item()], 2), encoded([item(), item()]),
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

test('pending draft rejects pickup, schema mismatch and altered item snapshots', () => {
  const pickup = pending(); pickup.input.fulfillment = 'pickup'
  const version = pending(); version.version = 3
  const mismatch = pending(); mismatch.input.items[0].quantity = 5
  for (const draft of [pickup, version, mismatch]) {
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
