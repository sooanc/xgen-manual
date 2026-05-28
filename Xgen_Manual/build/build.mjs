// build.mjs — 빌드 오케스트레이터
// Usage:
//   node build/build.mjs --customer <id> --formats html,docx
//   node build/build.mjs --customer all --formats html
//   node build/build.mjs --base-only --formats html --serve
//   node build/build.mjs --list

import { parseArgs } from 'node:util';
import { join } from 'node:path';
import { existsSync } from 'node:fs';
import { mkdir, writeFile, readFile, copyFile } from 'node:fs/promises';
import { compose, listCustomers, ROOT } from './compose.mjs';
import { buildHtml } from './lib/html.mjs';
import { buildDocx } from './lib/docx.mjs';
import { buildSiteIndex } from './lib/site-index.mjs';

const DIST = join(ROOT, 'dist');
const CUSTOMERS = join(ROOT, 'customers');

async function regenerateAdminPages() {
  const siteRoot = join(DIST, 'site');
  await buildSiteIndex({ siteRoot, customersRoot: CUSTOMERS });
  console.log('[index] dist/site/index.html, /admin/index.html 갱신됨');
}

function parseCli() {
  const { values } = parseArgs({
    options: {
      customer: { type: 'string' },
      formats: { type: 'string', default: 'html' },
      'base-only': { type: 'boolean', default: false },
      serve: { type: 'boolean', default: false },
      list: { type: 'boolean', default: false },
      'index-only': { type: 'boolean', default: false },
    },
    strict: false,
  });
  return values;
}

async function buildOne(customerId, formats, { serve }) {
  console.log(`\n[build:${customerId}] start (formats=${formats.join(',')})`);
  const r = await compose(customerId);
  console.log(`[build:${customerId}] composed → ${r.composedRoot}`);

  if (formats.includes('html')) {
    await buildHtml({
      composedRoot: r.composedRoot,
      mkdocsConfig: r.mkdocsConfig,
      serve,
    });
    if (!serve) console.log(`[build:${customerId}] html OK`);
  }

  if (formats.includes('docx')) {
    await buildDocx({
      composedRoot: r.composedRoot,
      docsDir: r.docsDir,
      customerConfig: r.customerConfig,
      distRoot: DIST,
    });
    console.log(`[build:${customerId}] docx OK`);
  }

  if (formats.includes('pdf') || formats.includes('pptx')) {
    console.warn(
      `[build:${customerId}] pdf/pptx 빌더는 아직 미구현 — 다음 단계에서 추가됩니다.`
    );
  }
}

// 표준 매뉴얼 미리보기 — xgen-standard 빌드와 동일.
// customers/xgen-standard/customer.yml 가 이미 정식 entity로 존재하므로 별도 fake 설정 불필요.
async function buildStandardPreview({ formats, serve }) {
  await buildOne('xgen-standard', formats, { serve });
}

async function main() {
  const args = parseCli();
  const formats = String(args.formats || 'html')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  if (args.list) {
    const ids = await listCustomers();
    console.log('등록된 고객사:');
    ids.forEach((id) => console.log('  -', id));
    return;
  }

  if (args['index-only']) {
    await regenerateAdminPages();
    return;
  }

  if (args['base-only']) {
    await buildStandardPreview({ formats, serve: !!args.serve });
    if (formats.includes('html') && !args.serve) {
      await regenerateAdminPages();
    }
    return;
  }

  if (!args.customer) {
    console.error(
      'Usage: node build/build.mjs --customer <id|all> --formats html,docx [--serve]\n' +
        '       node build/build.mjs --base-only --formats html --serve\n' +
        '       node build/build.mjs --list'
    );
    process.exit(1);
  }

  const ids =
    args.customer === 'all' ? await listCustomers() : [String(args.customer)];

  for (const id of ids) {
    await buildOne(id, formats, { serve: !!args.serve && ids.length === 1 });
  }

  // 모든 빌드가 끝나면 관리자 페이지(고객사 목록·배포 가이드) 갱신.
  if (formats.includes('html') && !args.serve) {
    await regenerateAdminPages();
  }
}

main().catch((e) => {
  console.error('\n[build] FAIL:', e.message);
  process.exit(1);
});
