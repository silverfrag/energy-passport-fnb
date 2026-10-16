/* Live HTTP + Supabase persistence test, NEVER a real payment.
 * Run only with explicit authorization: node scripts/orders-integration.test.cjs --allow-live-fixtures
 * Starts a separate Next app on 127.0.0.1:3381. A loopback-only Supabase proxy overrides
 * GET payment-settings for this process; actual bank settings are read-only and stay disabled.
 * Test orders are real database rows. Exact cleanup UUIDs are recorded before assertions.
 */
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const http = require('node:http')
const { spawn, spawnSync } = require('node:child_process')
const { randomUUID, randomBytes, createHash, createHmac } = require('node:crypto')
const { createClient } = require('@supabase/supabase-js')
const { loadEnvConfig } = require('@next/env')
const ts = require('typescript')

if (!process.argv.includes('--allow-live-fixtures')) {
  console.error('Refusing live fixture writes without --allow-live-fixtures. Read the script header first.')
  process.exit(2)
}
const root = path.resolve(__dirname, '..')
loadEnvConfig(root, true, { info() {}, error() {} })
const realUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const secret = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
if (!realUrl || !secret || !anon) throw new Error('Missing Supabase server configuration; no fixtures created.')
if (new URL(realUrl).protocol !== 'https:') throw new Error('Expected real Supabase HTTPS endpoint.')
const db = createClient(realUrl, secret, { auth: { persistSession: false, autoRefreshToken: false } })
const publicDb = createClient(realUrl, anon, { auth: { persistSession: false, autoRefreshToken: false } })
const base = 'http://127.0.0.1:3381'
const adminSecret = randomBytes(48).toString('base64url')
const adminPasskey = randomBytes(32).toString('base64url')
const output = path.join(root, 'output')
const runtime = path.join(path.dirname(root), '.fame-order-integration-runtime', `run-${Date.now()}`)
const cleanupPath = path.join(output, 'orders-test-cleanup.json')
const reportPath = path.join(output, 'orders-integration-results.json')
fs.mkdirSync(output, { recursive: true })
const runId = randomUUID()
const cleanup = fs.existsSync(cleanupPath) ? JSON.parse(fs.readFileSync(cleanupPath, 'utf8')) : { orderIds: [], idempotencyKeys: [], rateLimitKeys: [], runs: [] }
cleanup.runs ||= []
cleanup.runs.push(runId)
const saveCleanup = () => fs.writeFileSync(cleanupPath, JSON.stringify(cleanup, null, 2))
const record = (field, value) => { if (!cleanup[field].includes(value)) cleanup[field].push(value); saveCleanup() }
const checkResults = []
const check = (name) => { checkResults.push(name); console.log(`PASS ${name}`) }
for (const [scope, identifier] of [['create-order-ip', 'local'], ['create-order-phone', '0900000000'], ['order-lookup', 'local'], ['payment-review', 'local'], ['admin-login', 'local']]) {
  record('rateLimitKeys', createHmac('sha256', adminSecret).update(`${scope}:${identifier}`).digest('hex'))
}

const modules = new Map()
function loadTs(file) {
  file = path.resolve(root, file.endsWith('.ts') ? file : `${file}.ts`)
  if (modules.has(file)) return modules.get(file).exports
  const loadedModule = { exports: {} }; modules.set(file, loadedModule)
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText
  new Function('require', 'module', 'exports', code)((name) => name.startsWith('@/') ? loadTs(`src/${name.slice(2)}`) : name.startsWith('.') ? loadTs(path.resolve(path.dirname(file), name)) : require(name), loadedModule, loadedModule.exports)
  return loadedModule.exports
}

async function api(route, { method = 'GET', body, token, cookie, origin = base } = {}) {
  const headers = { Origin: origin }
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (token) headers.Authorization = `Bearer ${token}`
  if (cookie) headers.Cookie = cookie
  const response = await fetch(`${base}${route}`, { method, headers, body: body === undefined ? undefined : JSON.stringify(body), signal: AbortSignal.timeout(90_000) })
  const data = await response.json().catch(() => null)
  return { status: response.status, data, headers: response.headers }
}

let proxy
let child
let settingsBefore
let completed = false
async function startIsolatedServer() {
  fs.mkdirSync(runtime, { recursive: true })
  fs.writeFileSync(path.join(runtime, '.gitignore'), '*\n')
  for (const name of ['node_modules']) {
    const destination = path.join(runtime, name)
    if (!fs.existsSync(destination)) fs.symlinkSync(path.join(root, name), destination, process.platform === 'win32' ? 'junction' : 'dir')
    assert.equal(fs.realpathSync(destination), fs.realpathSync(path.join(root, name)), 'Unexpected test runtime junction target')
  }
  // Next's route discovery does not reliably traverse src junctions on Windows.
  // Copy production API code and dependencies, keeping a minimal non-visual app shell.
  for (const name of ['lib', 'types', 'data']) fs.cpSync(path.join(root, 'src', name), path.join(runtime, 'src', name), { recursive: true })
  fs.cpSync(path.join(root, 'src/app/api'), path.join(runtime, 'src/app/api'), { recursive: true })
  fs.copyFileSync(path.join(root, 'src/middleware.ts'), path.join(runtime, 'src/middleware.ts'))
  fs.writeFileSync(path.join(runtime, 'src/app/layout.tsx'), 'export default function Layout({children}:{children: React.ReactNode}) { return <html><body>{children}</body></html> }\n')
  fs.mkdirSync(path.join(runtime, 'src/app/api/integration-origin'), { recursive: true })
  fs.writeFileSync(path.join(runtime, 'src/app/api/integration-origin/route.ts'), "export function GET(request:Request) { return Response.json({url:request.url,origin:request.headers.get('origin'),host:request.headers.get('host'),forwardedHost:request.headers.get('x-forwarded-host'),protocol:request.headers.get('x-forwarded-proto'),site:request.headers.get('sec-fetch-site')}) }\n")
  for (const name of ['package.json', 'package-lock.json', 'tsconfig.json']) fs.copyFileSync(path.join(root, name), path.join(runtime, name))
  fs.writeFileSync(path.join(runtime, 'next.config.js'), "module.exports = { distDir: '.next' }\n")
  const settings = { id: 'primary', enabled: true, bank_bin: '970415', bank_name: 'TEST ONLY - NO TRANSFER', account_number: '000000000', account_name: 'AUTOMATED TEST DO NOT PAY', delivery_fee: 0, version: 1 }
  proxy = http.createServer(async (request, response) => {
    try {
      const url = new URL(request.url, 'http://127.0.0.1')
      if (url.pathname === '/rest/v1/online_payment_settings') {
        if (request.method !== 'GET') { response.writeHead(403); response.end(); return }
        const accept = request.headers.accept || ''
        response.writeHead(200, { 'content-type': 'application/json', 'cache-control': 'no-store' })
        response.end(JSON.stringify(accept.includes('vnd.pgrst.object') ? settings : [settings])); return
      }
      const allowed = ['/rest/v1/online_orders', '/rest/v1/products', '/rest/v1/rpc/fd_consume_rate_limit', '/auth/v1/user']
      if (!allowed.includes(url.pathname)) { response.writeHead(403); response.end(); return }
      const chunks = []
      for await (const chunk of request) chunks.push(chunk)
      const headers = { ...request.headers }
      delete headers.host; delete headers.connection; delete headers['content-length']; delete headers['accept-encoding']
      const upstream = await fetch(new URL(request.url, realUrl), { method: request.method, headers, body: ['GET', 'HEAD'].includes(request.method) ? undefined : Buffer.concat(chunks), signal: AbortSignal.timeout(30_000) })
      response.writeHead(upstream.status, { 'content-type': upstream.headers.get('content-type') || 'application/json', 'cache-control': 'no-store', ...(upstream.headers.has('content-range') ? { 'content-range': upstream.headers.get('content-range') } : {}) })
      response.end(Buffer.from(await upstream.arrayBuffer()))
    } catch { response.writeHead(502, { 'content-type': 'application/json' }); response.end('{"error":"test proxy upstream failure"}') }
  })
  await new Promise((resolve) => proxy.listen(0, '127.0.0.1', resolve))
  const proxyPort = proxy.address().port
  const env = { ...process.env, NEXT_PUBLIC_SUPABASE_URL: `http://127.0.0.1:${proxyPort}`, ADMIN_SESSION_SECRET: adminSecret, ADMIN_PASSKEY: adminPasskey, NODE_ENV: 'development', NEXT_TELEMETRY_DISABLED: '1', PORT: '3381' }
  delete env.VERCEL
  child = spawn(process.execPath, [path.join(root, 'node_modules/next/dist/bin/next'), 'dev', runtime, '--webpack', '--hostname', '127.0.0.1', '--port', '3381'], { cwd: runtime, env, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] })
  // Consume diagnostics without echoing environment or credentials.
  child.stdout.on('data', () => {})
  child.stderr.on('data', () => {})
  const until = Date.now() + 120_000
  while (Date.now() < until) {
    if (child.exitCode !== null) throw new Error('Isolated Next server exited before ready.')
    try {
      const result = await api('/api/orders/config')
      if (result.status === 200 && result.data?.orderingAvailable === true) return
    } catch { /* Wait for only this new server. */ }
    await new Promise((resolve) => setTimeout(resolve, 500))
  }
  throw new Error('Isolated Next server did not become ready in time.')
}

async function main() {
  const initial = await db.from('online_payment_settings').select('*').eq('id', 'primary').single()
  assert.equal(initial.error, null, 'Order migration/settings not available')
  assert.equal(initial.data.enabled, false, 'Refusing fixtures when actual ordering is enabled')
  settingsBefore = JSON.stringify(initial.data)
  await startIsolatedServer()
  check('isolated localhost settings override; actual payment settings remain disabled')
  const diagnostic = await api('/api/integration-origin')
  console.log('Local request origin diagnostics:', JSON.stringify(diagnostic.data))

  const catalog = loadTs('src/lib/constants/products').STANDARD_PRODUCTS
  const item = catalog.find((product) => product.slug === 'tra-dau' && product.active)
  assert.ok(item && Number.isInteger(item.price))
  const key = randomUUID(); record('idempotencyKeys', key)
  const input = { idempotencyKey: key, fulfillment: 'delivery', customer: { name: `AUTOMATED TEST ${runId.slice(0, 8)} - DO NOT FULFILL`, phone: '0900000000', address: 'TEST ONLY - NO DELIVERY - automated integration fixture' }, note: `AUTOMATED TEST ${runId}; no real payment or delivery`, items: [{ productId: item.slug, quantity: 2 }], total: 1, deliveryFee: -999, paymentStatus: 'paid' }
  const created = await api('/api/orders', { method: 'POST', body: input })
  if (created.data?.order?.id) record('orderIds', created.data.order.id)
  assert.equal(created.status, 201, `Create failed with code ${created.data?.code || 'unknown'}`)
  const id = created.data.order.id
  const token = created.data.accessToken
  assert.equal(created.data.order.total, item.price * 2)
  assert.equal(created.data.order.deliveryFee, 0)
  assert.equal(created.data.order.paymentStatus, 'awaiting_payment')
  const stored = await db.from('online_orders').select('*').eq('id', id).single()
  assert.equal(stored.error, null)
  assert.equal(stored.data.total, item.price * 2)
  assert.equal(stored.data.access_token_hash, createHash('sha256').update(token).digest('hex'))
  assert.ok(!JSON.stringify(created.data.order).includes('access_token_hash'))
  check('HTTP create ignores client prices/paid claim; real DB has server total and hashed private token')

  const replay = await api('/api/orders', { method: 'POST', body: input })
  assert.equal(replay.status, 200)
  assert.equal(replay.data.order.id, id)
  assert.equal(replay.data.accessToken, token)
  const count = await db.from('online_orders').select('id', { count: 'exact', head: true }).eq('idempotency_key', key)
  assert.equal(count.count, 1)
  const conflict = await api('/api/orders', { method: 'POST', body: { ...input, items: [{ productId: item.slug, quantity: 3 }] } })
  assert.equal(conflict.status, 409)
  assert.equal(conflict.data.code, 'IDEMPOTENCY_CONFLICT')
  const pickup = await api('/api/orders', { method: 'POST', body: { ...input, fulfillment: 'pickup' } })
  assert.equal(pickup.status, 400)
  check('idempotent retry creates exactly one durable order; changed payload and pickup rejected')

  assert.equal((await api(`/api/orders/${id}`, { token })).status, 200)
  assert.equal((await api(`/api/orders/${id}`, { token: randomBytes(32).toString('base64url') })).status, 404)
  assert.equal((await api(`/api/orders/${id}`)).status, 404)
  assert.equal((await api('/api/admin/orders', { cookie: 'ep_admin_session=true; fd_admin_session=true' })).status, 401)
  assert.equal((await api('/api/admin/payment-settings')).status, 401)
  for (const table of ['online_orders', 'online_order_events', 'online_payment_settings', 'online_rate_limits']) {
    const denied = await publicDb.from(table).select('*').limit(1)
    assert.ok(denied.error && denied.status >= 400, `Anon unexpectedly accessed ${table}`)
  }
  check('wrong/missing receipt token, forged admin cookie, and direct anon table access denied')

  const login = await api('/api/admin/session', { method: 'POST', body: { passkey: adminPasskey } })
  assert.equal(login.status, 200)
  const cookie = login.headers.getSetCookie().find((value) => value.startsWith('fd_admin_session=')).split(';')[0]
  const review = await api(`/api/orders/${id}/payment-review`, { method: 'POST', token })
  assert.equal(review.status, 200)
  assert.equal(review.data.order.paymentStatus, 'payment_review')
  assert.equal(review.data.order.paidAt, null)
  const stale = await api(`/api/admin/orders/${id}`, { method: 'PATCH', cookie, body: { version: 1, action: 'confirm_payment' } })
  assert.equal(stale.status, 409)
  assert.equal(stale.data.code, 'VERSION_CONFLICT')
  const confirmed = await api(`/api/admin/orders/${id}`, { method: 'PATCH', cookie, body: { version: review.data.order.version, action: 'confirm_payment' } })
  assert.equal(confirmed.status, 200)
  assert.equal(confirmed.data.order.paymentStatus, 'paid')
  assert.equal(confirmed.data.order.fulfillmentStatus, 'confirmed')
  assert.equal(confirmed.data.order.payment, null)
  check('customer report remains unpaid; only signed admin confirms money; stale version rejected')

  const concurrent = await Promise.all([0, 1].map(() => api(`/api/admin/orders/${id}`, { method: 'PATCH', cookie, body: { version: confirmed.data.order.version, action: 'set_fulfillment', status: 'preparing' } })))
  assert.deepEqual(concurrent.map((result) => result.status).sort(), [200, 409])
  let order = concurrent.find((result) => result.status === 200).data.order
  const cancelPaid = await api(`/api/admin/orders/${id}`, { method: 'PATCH', cookie, body: { version: order.version, action: 'cancel' } })
  assert.equal(cancelPaid.status, 409)
  const wrongStep = await api(`/api/admin/orders/${id}`, { method: 'PATCH', cookie, body: { version: order.version, action: 'set_fulfillment', status: 'ready' } })
  assert.equal(wrongStep.status, 409)
  const crossOrigin = await api(`/api/admin/orders/${id}`, { method: 'PATCH', cookie, origin: 'https://untrusted.invalid', body: { version: order.version, action: 'set_fulfillment', status: 'out_for_delivery' } })
  assert.equal(crossOrigin.status, 403)
  for (const status of ['out_for_delivery', 'completed']) {
    const result = await api(`/api/admin/orders/${id}`, { method: 'PATCH', cookie, body: { version: order.version, action: 'set_fulfillment', status } })
    assert.equal(result.status, 200)
    order = result.data.order
    assert.equal(order.fulfillmentStatus, status)
  }
  const events = await db.from('online_order_events').select('version').eq('order_id', id).order('version')
  assert.equal(events.error, null)
  assert.deepEqual(events.data.map((event) => event.version), [1, 2, 3, 4, 5, 6])
  check('simultaneous updates produce one success/one409; delivery lifecycle and DB audit sequence hold')

  const finalSettings = await db.from('online_payment_settings').select('*').eq('id', 'primary').single()
  assert.equal(finalSettings.error, null)
  assert.equal(JSON.stringify(finalSettings.data), settingsBefore)
  check('actual bank settings unchanged; no real payment or customer notification performed')
  completed = true
}

main().catch((error) => {
  // Report only assertion text we authored, never API payloads or environment contents.
  console.error(`Integration check failed: ${error.message.split('\n')[0]}`)
  process.exitCode = 1
}).finally(async () => {
  saveCleanup()
  fs.writeFileSync(reportPath, JSON.stringify({ runId, completed, checks: checkResults, fixtureOrderIds: cleanup.orderIds, settingsMutated: false }, null, 2))
  if (child && child.pid) {
    if (process.platform === 'win32') spawnSync('taskkill.exe', ['/PID', String(child.pid), '/T', '/F'], { windowsHide: true, stdio: 'ignore' })
    else child.kill('SIGTERM')
  }
  if (proxy) { proxy.closeAllConnections(); await new Promise((resolve) => proxy.close(resolve)) }
  console.log(`Completed ${checkResults.length} live checks. Fixture UUIDs recorded in output/orders-test-cleanup.json for authorized SQL cleanup.`)
})
