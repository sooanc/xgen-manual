// new-customer.mjs
// 신규 고객사를 추가한다. base/ 트리를 customers/<id>/manual/ 로 복사하고
// customer.yml 초기 파일을 생성한다.
//
// Usage:
//   node build/new-customer.mjs --id acme-bank --name "ACME은행"
//   node build/new-customer.mjs --id acme-bank --name "ACME은행" --industry financial
//   node build/new-customer.mjs --id acme-bank --name "ACME은행" --product-version 2.3.0 --domain xgen.acmebank.co.kr
//
// 한 번 만들어진 customers/<id>/manual/ 은 base와 독립이며, 자유롭게 수정 가능합니다.

import { parseArgs } from 'node:util';
import { cp, mkdir, writeFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const BASE = join(ROOT, 'base');
const CUSTOMERS = join(ROOT, 'customers');

function fail(msg) {
  console.error(`[new-customer] ✗ ${msg}`);
  process.exit(1);
}

async function main() {
  const { values: args } = parseArgs({
    options: {
      id: { type: 'string' },
      name: { type: 'string' },
      industry: { type: 'string', default: 'other' },
      'product-version': { type: 'string', default: '1.0.0' },
      'manual-version': { type: 'string' },
      'manual-released-at': { type: 'string' },
      domain: { type: 'string' },
      'support-email': { type: 'string' },
      force: { type: 'boolean', default: false },
    },
    strict: false,
  });

  if (!args.id || !args.name) {
    console.error(
      'Usage: node build/new-customer.mjs --id <customer-id> --name "고객사명" [옵션]\n' +
        '  옵션:\n' +
        '    --industry <financial|manufacturing|public|retail|healthcare|other>\n' +
        '    --product-version <x.y.z>           제품 솔루션 빌드 버전\n' +
        '    --manual-version <x.y.z-revN>       매뉴얼 리비전 (기본: <product-version>-rev1)\n' +
        '    --manual-released-at <YYYY-MM-DD>   매뉴얼 발행일 (기본: 오늘)\n' +
        '    --domain <xgen.example.com>\n' +
        '    --support-email <x2bee_tech@plateer.com>\n' +
        '    --force                              기존 폴더가 있어도 덮어쓰기'
    );
    process.exit(1);
  }

  if (!/^[a-z0-9-]+$/.test(args.id)) {
    fail(`--id는 소문자/숫자/하이픈만 허용됩니다: ${args.id}`);
  }
  if (args.id.startsWith('_')) {
    fail(`--id는 밑줄로 시작할 수 없습니다 (예약 prefix)`);
  }

  const customerDir = join(CUSTOMERS, args.id);
  const manualDir = join(customerDir, 'manual');

  if (existsSync(customerDir) && !args.force) {
    fail(
      `이미 존재하는 고객사입니다: customers/${args.id}/\n` +
        `  → 덮어쓰려면 --force 추가, 또는 직접 삭제 후 재실행`
    );
  }

  if (!existsSync(BASE)) fail(`base/ 디렉토리가 없습니다: ${BASE}`);

  // 1. base/ → customers/<id>/manual/ 복사
  console.log(`[new-customer] base/ → customers/${args.id}/manual/ 복사 중...`);
  await mkdir(manualDir, { recursive: true });
  await cp(BASE, manualDir, { recursive: true });

  // 2. branding 디렉토리 생성 (빈)
  await mkdir(join(customerDir, 'branding'), { recursive: true });

  // 3. customer.yml 생성
  const supportEmail =
    args['support-email'] || `support@${args.domain || `${args.id}.example.com`}`;
  const domain = args.domain || `xgen.${args.id}.example.com`;
  const manualVersion = args['manual-version'] || `${args['product-version']}-rev1`;
  const today = new Date().toISOString().slice(0, 10);
  const releasedAt = args['manual-released-at'] || today;
  const yml = `# ${args.name} 고객사 설정
# 매뉴얼 본문은 manual/ 디렉토리에서 자유롭게 수정합니다.

customer:
  id: ${args.id}
  name: "${args.name}"
  industry: ${args.industry}

product:
  name: "Xgen"
  version: "${args['product-version']}"
  domain: "${domain}"

# 매뉴얼 문서 자체의 리비전 — 같은 product.version에 여러 매뉴얼 버전이 존재 가능
manual:
  version: "${manualVersion}"
  released_at: "${releasedAt}"
  channel: draft

# 본문에서 {{vars.<키>}} 형태로 치환됨
vars:
  support_email: "${supportEmail}"

outputs:
  html:
    base_url: "/docs/${args.id}"
  docx: {}
  pdf:
    page_size: A4
    header: "${args.name} 전용 - 대외비"
`;
  await writeFile(join(customerDir, 'customer.yml'), yml, 'utf8');

  // 4. 결과 안내
  const fileCount = (await flatList(manualDir)).length;
  console.log(`\n[new-customer] ✓ 신규 고객사 생성 완료`);
  console.log(`  ID:       ${args.id}`);
  console.log(`  이름:     ${args.name}`);
  console.log(`  매뉴얼:   customers/${args.id}/manual/ (${fileCount}개 파일, base에서 복사됨)`);
  console.log(`  설정:     customers/${args.id}/customer.yml`);
  console.log(`\n다음 단계:`);
  console.log(`  1. customer.yml 검토·수정`);
  console.log(`  2. customers/${args.id}/manual/ 안의 파일을 자유롭게 커스터마이징`);
  console.log(`  3. 빌드: node build/build.mjs --customer ${args.id} --formats html,docx`);
}

async function flatList(dir) {
  const out = [];
  async function walk(d) {
    const entries = await readdir(d, { withFileTypes: true });
    for (const e of entries) {
      const f = join(d, e.name);
      if (e.isDirectory()) await walk(f);
      else out.push(f);
    }
  }
  await walk(dir);
  return out;
}

main().catch((e) => {
  console.error('[new-customer] FAIL:', e.message);
  process.exit(1);
});
