// fetch-stg-node-catalog.mjs
// stg 로그인 후 /api/node/get 호출 → 노드 카탈로그(id·한글명) 덤프 + 특정 노드 상세 출력.
//   node scripts/fetch-stg-node-catalog.mjs [검색어]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ENV = process.env.ENVFILE ? path.resolve(process.env.ENVFILE) : path.join(path.resolve(__dirname, '..'), '.env.xgen-stg');
const env = {};
fs.readFileSync(ENV, 'utf8').split(/\r?\n/).forEach((l) => {
  const t = l.trim(); if (!t || t.startsWith('#')) return;
  const i = t.indexOf('='); if (i < 0) return;
  if (!(t.slice(0, i).trim() in env)) env[t.slice(0, i).trim()] = t.slice(i + 1).trim().replace(/^["']|["']$/g, '');
});
const BASE = env.XGEN_BASE_URL.replace(/\/$/, '');
const EMAIL = env.XGEN_LOGIN_EMAIL, PASS = env.XGEN_LOGIN_PASSWORD;
const QUERY = process.argv[2] || '';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await (await browser.newContext({ locale: 'ko-KR' })).newPage();
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle', timeout: 60_000 });
  if (await page.$('#login-email')) {
    await page.fill('#login-email', EMAIL); await page.fill('#login-password', PASS);
    await Promise.all([
      page.waitForResponse(r => /\/api\/auth\/login\b/.test(r.url()) && r.request().method() === 'POST', { timeout: 30_000 }),
      page.click('button[type="submit"]'),
    ]);
    await page.waitForURL(u => !u.toString().includes('/login'), { timeout: 30_000 });
  } else {
    const eb = page.getByRole('textbox', { name: '이메일을 입력해 주세요' });
    if (await eb.isVisible({ timeout: 3000 }).catch(() => false)) {
      await eb.fill(EMAIL);
      await page.getByRole('textbox', { name: '패스워드를 입력해 주세요' }).fill(PASS);
      await page.getByRole('button', { name: '로그인', exact: true }).click();
      await page.waitForURL(u => !u.toString().includes('/login'), { timeout: 30_000 });
    }
  }
  const data = await page.evaluate(async () => {
    const res = await fetch('/api/node/get', { credentials: 'include' });
    return { status: res.status, body: await res.json().catch(() => null) };
  });
  console.error('status', data.status);
  const cats = data.body || [];
  const flat = [];
  for (const c of cats) for (const fn of (c.functions || [])) for (const n of (fn.nodes || [])) flat.push({ fn: fn.functionId, id: n.id, ko: n.nodeNameKo, en: n.nodeName });
  console.error('total nodes:', flat.length);
  if (QUERY) {
    const hit = cats.flatMap(c => (c.functions || []).flatMap(fn => (fn.nodes || []))).filter(n => (n.nodeNameKo || '').includes(QUERY) || (n.id || '').toLowerCase().includes(QUERY.toLowerCase()) || (n.nodeName || '').toLowerCase().includes(QUERY.toLowerCase()));
    console.log(JSON.stringify(hit, null, 2));
  } else {
    console.log(flat.map(n => `${n.id}\t${n.ko}\t(${n.en})`).join('\n'));
  }
  await browser.close();
})().catch(e => { console.error('FATAL', e); process.exit(1); });
