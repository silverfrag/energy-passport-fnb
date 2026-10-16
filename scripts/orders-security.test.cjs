/* Run: node scripts/orders-security.test.cjs
 * Security/business-logic regression tests. No network, no payment, no production mutations.
 * The loader compiles TS only for these Node tests; server-only remains enforced by Next builds.
 */
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const ts = require('typescript')
const { test } = require('node:test')

const cache = new Map()
function load(name) {
  let file = path.resolve(__dirname, '..', name)
  if (!file.endsWith('.ts')) file += '.ts'
  if (cache.has(file)) return cache.get(file).exports
  const loadedModule = { exports: {} }
  cache.set(file, loadedModule)
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText
  function localRequire(specifier) {
    if (specifier === 'server-only') return {}
    if (specifier.startsWith('@/')) return load(`src/${specifier.slice(2)}`)
    if (specifier.startsWith('.')) return load(path.resolve(path.dirname(file), specifier))
    return require(specifier)
  }
  new Function('require', 'module', 'exports', code)(localRequire, loadedModule, loadedModule.exports)
  return loadedModule.exports
}

const validation = load('src/lib/orders/validation')
const crypto = load('src/lib/orders/crypto')
const state = load('src/lib/orders/state')
const qr = load('src/lib/orders/qr')
const http = load('src/lib/orders/http')
const service = load('src/lib/orders/service')
const validInput = () => ({ idempotencyKey: 'd0a31e8d-41ed-4dcf-a764-ed29e64b9b4b', fulfillment: 'delivery', customer: { name: 'Khách Kiểm Thử', phone: '+84 908 111 222', address: 'Địa chỉ kiểm thử, Đà Nẵng' }, items: [{ productId: 'tra-dau', quantity: 2 }], total: 1, paymentStatus: 'paid' })
const bank = { bankBin: '970415', bankName: 'TEST BANK', accountNumber: '123456789', accountName: 'TEST ONLY' }
const validOrder = () => ({ id: 'd0a31e8d-41ed-4dcf-a764-ed29e64b9b4b', code: 'FD001122334455', fulfillment: 'delivery', customer_name: 'Khách kiểm thử', customer_phone: '0908111222', customer_address: 'Địa chỉ kiểm thử', note: null, items: [], subtotal: 80000, delivery_fee: 0, total: 80000, bank_snapshot: bank, payment_status: 'awaiting_payment', fulfillment_status: 'unconfirmed', version: 1, paid_at: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() })

test('checkout rejects pickup and missing address; strips client totals/payment claims', () => {
  const input = validation.parseCreateOrder(validInput())
  assert.equal(input.customer.phone, '0908111222')
  assert.equal(input.fulfillment, 'delivery')
  assert.equal('total' in input, false)
  assert.equal('paymentStatus' in input, false)
  assert.throws(() => validation.parseCreateOrder({ ...validInput(), fulfillment: 'pickup' }), /chỉ nhận đơn giao/)
  assert.throws(() => validation.parseCreateOrder({ ...validInput(), customer: { ...validInput().customer, address: '' } }))
})

test('checkout rejects duplicate, fractional, oversized and injected item identifiers', () => {
  for (const items of [[{ productId: 'tra-dau', quantity: -1 }], [{ productId: 'tra-dau', quantity: 1.5 }], [{ productId: 'tra-dau', quantity: 21 }], [{ productId: 'slug,id.eq.any', quantity: 1 }], [{ productId: 'tra-dau', quantity: 1 }, { productId: 'tra-dau', quantity: 1 }]]) {
    assert.throws(() => validation.parseCreateOrder({ ...validInput(), items }))
  }
})

test('demo fee remains zero even if browser attempts to configure a fee', () => {
  const settings = validation.parsePaymentSettings({ ...bank, enabled: true, version: 1, deliveryFee: 100000 })
  assert.equal(settings.deliveryFee, 0)
  assert.throws(() => validation.parsePaymentSettings({ ...settings, bankBin: 'javascript:bad' }))
  assert.throws(() => validation.parsePaymentSettings({ ...settings, accountNumber: '1'.repeat(20) }))
})

test('signed sessions reject legacy boolean, corruption, expiry, and wrong signing secret', () => {
  process.env.ADMIN_SESSION_SECRET = 'test-only-random-secret-never-for-production-123456789'
  process.env.ADMIN_PASSKEY = 'test-only-password-long'
  const now = Date.now()
  const token = crypto.createAdminSession(now)
  assert.equal(crypto.verifyAdminSession(token, now), true)
  assert.equal(crypto.verifyAdminSession('true', now), false)
  assert.equal(crypto.verifyAdminSession(token + 'a', now), false)
  assert.equal(crypto.verifyAdminSession(token, now + crypto.SESSION_SECONDS * 1000), false)
  assert.equal(crypto.validPasskey('1212'), false)
  assert.equal(crypto.validPasskey('test-only-password-long'), true)
  process.env.ADMIN_SESSION_SECRET = 'a-different-test-only-secret-never-use-123456789'
  assert.equal(crypto.verifyAdminSession(token, now), false)
})

test('missing/weak admin configuration fails closed', () => {
  const secret = process.env.ADMIN_SESSION_SECRET
  delete process.env.ADMIN_SESSION_SECRET
  assert.throws(() => crypto.createAdminSession(), /Chưa cấu hình/)
  process.env.ADMIN_SESSION_SECRET = secret
  process.env.ADMIN_PASSKEY = '1212'
  assert.throws(() => crypto.validPasskey('1212'), /Chưa cấu hình/)
})

test('only admin confirmation transitions awaiting/review into paid+confirmed', () => {
  const order = validOrder()
  assert.throws(() => state.planAdminUpdate(order, { version: 1, action: 'set_fulfillment', status: 'preparing' }), /xác nhận đã nhận tiền/)
  const patch = state.planAdminUpdate(order, { version: 1, action: 'confirm_payment' })
  assert.equal(patch.payment_status, 'paid')
  assert.equal(patch.fulfillment_status, 'confirmed')
  assert.equal(patch.version, 2)
  assert.ok(patch.paid_at)
  assert.throws(() => state.planAdminUpdate({ ...order, ...patch }, { version: 1, action: 'confirm_payment' }), /vừa được cập nhật/)
})

test('delivery lifecycle cannot skip preparation, use pickup-ready, or silently cancel paid orders', () => {
  let order = { ...validOrder(), payment_status: 'paid', fulfillment_status: 'confirmed', paid_at: new Date().toISOString() }
  assert.throws(() => state.planAdminUpdate(order, { version: 1, action: 'set_fulfillment', status: 'completed' }))
  assert.throws(() => state.planAdminUpdate(order, { version: 1, action: 'cancel' }), /hoàn tiền/)
  for (const status of ['preparing', 'out_for_delivery', 'completed']) {
    assert.throws(() => state.planAdminUpdate(order, { version: order.version, action: 'set_fulfillment', status: 'ready' }))
    order = { ...order, ...state.planAdminUpdate(order, { version: order.version, action: 'set_fulfillment', status }) }
  }
  assert.throws(() => state.planAdminUpdate(order, { version: order.version, action: 'confirm_payment' }), /kết thúc/)
})

test('bank QR has known CRC algorithm, exact amount/content and no customer PII', () => {
  assert.equal(qr.crc16('123456789'), '29B1')
  const payload = qr.createBankQr(bank, 80000, 'FD001122334455')
  assert.ok(payload.includes('540580000'))
  assert.ok(payload.includes('FD001122334455'))
  assert.ok(payload.includes('QRIBFTTA'))
  assert.equal(payload.slice(-4), qr.crc16(payload.slice(0, -4)))
  assert.throws(() => qr.createBankQr(bank, 0, 'FD001122334455'))
  assert.throws(() => qr.createBankQr(bank, 80000, 'arbitrary\ncontent'))
})

test('public order DTO omits secrets; payment instructions disappear when paid/cancelled', () => {
  const row = { ...validOrder(), access_token_hash: 'secret', idempotency_key: 'private', request_hash: 'private' }
  const dto = service.publicOrder(row)
  assert.equal('access_token_hash' in dto, false)
  assert.equal('idempotency_key' in dto, false)
  assert.equal(dto.payment.amount, 80000)
  assert.equal(service.publicOrder({ ...row, payment_status: 'paid' }).payment, null)
  assert.equal(service.publicOrder({ ...row, fulfillment_status: 'cancelled' }).payment, null)
})

test('cross-origin mutation rejected and API errors have safe contract', async () => {
  assert.throws(() => http.assertSameOrigin(new Request('https://fame.test/api/orders', { method: 'POST', headers: { origin: 'https://attacker.test' } })))
  http.assertSameOrigin(new Request('https://fame.test/api/orders', { method: 'POST', headers: { origin: 'https://fame.test' } }))
  http.assertSameOrigin(new Request('http://localhost:3381/api/orders', { method: 'POST', headers: { host: '127.0.0.1:3381', origin: 'http://127.0.0.1:3381' } }))
  assert.throws(() => http.assertSameOrigin(new Request('https://fame.test/api/orders', { method: 'POST', headers: { host: 'fame.test', origin: 'https://attacker.test', 'x-forwarded-host': 'attacker.test' } })))
  assert.throws(() => http.assertSameOrigin(new Request('https://fame.test/api/orders', { method: 'POST', headers: { origin: 'https://fame.test', 'sec-fetch-site': 'cross-site' } })))
  const response = await http.api(async () => { throw new Error('secret database credential') })
  assert.equal(response.status, 500)
  assert.ok(!(await response.text()).includes('secret database'))
})

test('JSON parser caps payloads, and absent service key never creates a pretend order', async () => {
  await assert.rejects(() => http.readJson(new Request('https://fame.test', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ note: 'a'.repeat(17000) }) })), /quá dài/)
  delete process.env.SUPABASE_SERVICE_ROLE_KEY
  delete process.env.SUPABASE_SECRET_KEY
  await assert.rejects(() => service.createOrder(validation.parseCreateOrder(validInput())), error => error.status === 503)
})

test('legacy catalog writes fail visibly without durable storage and never mutate local JSON', async () => {
  const catalog = load('src/lib/store/catalog-service')
  const productFile = path.resolve(__dirname, '../src/data/products-store.json')
  const actionFile = path.resolve(__dirname, '../src/data/actions-store.json')
  const beforeProducts = fs.readFileSync(productFile, 'utf8')
  const beforeActions = fs.readFileSync(actionFile, 'utf8')
  assert.equal((await catalog.saveAdminProduct({ slug: 'test-no-write', name: 'Must not persist' })).success, false)
  assert.equal((await catalog.saveAdminAction({ slug: 'test-no-write', title: 'Must not persist' })).success, false)
  assert.equal((await catalog.deleteOrToggleAdminProduct('tra-dau', false)).success, false)
  assert.equal((await catalog.deleteOrToggleAdminAction('test-no-write', false)).success, false)
  assert.equal(fs.readFileSync(productFile, 'utf8'), beforeProducts)
  assert.equal(fs.readFileSync(actionFile, 'utf8'), beforeActions)
})
