// add-support-label.mjs
//
// 매뉴얼 본문 모든 {{vars.support_email}} 자리에 일반화된 "XGen 관리자"
// 라벨을 함께 표기하도록 일괄 치환.
//
//   - Korean (.md, .ko.md, base/ 한국어):  {{vars.support_email}} → **XGen 관리자**({{vars.support_email}})
//   - English (.en.md):                     {{vars.support_email}} → **XGen Administrator**({{vars.support_email}})
//   - `<{{vars.support_email}}>` 형태(mailto-friendly) 는 mailto-friendly 유지:
//        <**XGen 관리자**({{vars.support_email}})> 가 어색하므로 → **XGen 관리자**(<{{vars.support_email}}>)
//
// 이미 라벨이 붙어 있으면 중복 부착하지 않도록 idempotent.
//
//   cd C:\xgen-manual && node scripts/add-support-label.mjs

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', 'Xgen_Manual');

const KO_LABEL = 'XGen 관리자';
const EN_LABEL = 'XGen Administrator';

/** 재귀로 .md 파일 모음 (단, .build / dist / node_modules / shared 제외) */
function listMd(dir, acc = []) {
  const skip = new Set(['.build', 'dist', 'node_modules', '.git']);
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (skip.has(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) listMd(p, acc);
    else if (e.isFile() && e.name.endsWith('.md')) acc.push(p);
  }
  return acc;
}

function isEnglish(file) {
  return /\.en\.md$/i.test(file);
}

function transform(text, file) {
  const label = isEnglish(file) ? EN_LABEL : KO_LABEL;
  // 1) Idempotency 가드: 이미 `**LABEL**({{vars.support_email}})` 또는
  //    `**LABEL**(<{{vars.support_email}}>)` 패턴이 있으면 그 인스턴스는 건드리지 않음.
  //    naive 한 치환은 중첩을 야기하므로 토큰화 후 한 칸씩 처리한다.
  const tokens = [];
  let i = 0;
  const ANGLE = '<{{vars.support_email}}>';
  const BARE = '{{vars.support_email}}';
  const ALREADY_PREFIX = `**${label}**(`;

  while (i < text.length) {
    // 이미 라벨이 붙어 있는 패턴인지 검사
    if (text.startsWith(`${ALREADY_PREFIX}${ANGLE})`, i)) {
      tokens.push(text.slice(i, i + ALREADY_PREFIX.length + ANGLE.length + 1));
      i += ALREADY_PREFIX.length + ANGLE.length + 1;
      continue;
    }
    if (text.startsWith(`${ALREADY_PREFIX}${BARE})`, i)) {
      tokens.push(text.slice(i, i + ALREADY_PREFIX.length + BARE.length + 1));
      i += ALREADY_PREFIX.length + BARE.length + 1;
      continue;
    }
    if (text.startsWith(ANGLE, i)) {
      tokens.push(`**${label}**(${ANGLE})`);
      i += ANGLE.length;
      continue;
    }
    if (text.startsWith(BARE, i)) {
      tokens.push(`**${label}**(${BARE})`);
      i += BARE.length;
      continue;
    }
    tokens.push(text[i]);
    i++;
  }
  return tokens.join('');
}

const files = listMd(ROOT).filter((f) => fs.readFileSync(f, 'utf8').includes('{{vars.support_email}}'));
let changed = 0;
for (const f of files) {
  const orig = fs.readFileSync(f, 'utf8');
  const next = transform(orig, f);
  if (next !== orig) {
    fs.writeFileSync(f, next, 'utf8');
    changed++;
    console.log(`[support-label] updated ${path.relative(process.cwd(), f)}`);
  }
}
console.log(`[support-label] ${changed} / ${files.length} files modified`);
