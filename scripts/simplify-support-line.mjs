// simplify-support-line.mjs
//
// 매뉴얼 본문 모든 문의 채널 문구를 사용자 표현으로 일괄 단순화:
//   - 구 패턴(여러 변형): **XGen 관리자**({{vars.support_email}}) ...
//                         + dashboard 변형(또는 사이드바 ... 1:1 관리자 문의로 등록 ...)
//   - 신 패턴:           Xgen 솔루션 관리자에게 문의해 주세요.
//
// 이메일·fallback 채널 안내 모두 제거. 라벨 표기도 'XGen' → 'Xgen' (소문자 g),
// 직함은 '관리자' → '솔루션 관리자'.
//
// idempotent: 이미 신 패턴이면 무시.
//
//   cd C:\xgen-manual && node scripts/simplify-support-line.mjs

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', 'Xgen_Manual');

const SKIP = new Set(['.build', 'dist', 'node_modules', '.git']);

function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (e.isFile() && /\.md$/i.test(e.name)) acc.push(p);
  }
  return acc;
}

function isEnglish(file) { return /\.en\.md$/i.test(file); }

// Korean 변환 — 가장 구체적인 전체 문장 패턴부터 일반 토큰 순으로.
const KO_RULES = [
  // dashboard 변형 (대시보드 챕터)
  [
    '**XGen 관리자**(<{{vars.support_email}}>) 또는 사이드바 **기술지원 → 1:1 관리자 문의**로 등록해 주세요.',
    'Xgen 솔루션 관리자에게 문의해 주세요.',
  ],
  // 표준 챕터 말미 "문의" 절
  [
    '**XGen 관리자**({{vars.support_email}}) 로 연락해 주세요.',
    'Xgen 솔루션 관리자에게 문의해 주세요.',
  ],
  [
    '**XGen 관리자**(<{{vars.support_email}}>) 로 연락해 주세요.',
    'Xgen 솔루션 관리자에게 문의해 주세요.',
  ],
  // 11-login.md (jeju) 등의 인라인 문장
  [
    '**XGen 관리자**({{vars.support_email}})로 문의하세요.',
    'Xgen 솔루션 관리자에게 문의해 주세요.',
  ],
  [
    '**XGen 관리자**({{vars.support_email}}) 로 문의하세요.',
    'Xgen 솔루션 관리자에게 문의해 주세요.',
  ],
  // admin/30-dashboard.md 의 "그래도 안 되면 ... 로 화면 캡처와 함께 문의" 류
  [
    '**XGen 관리자**({{vars.support_email}}) 로 화면 캡처와 함께 문의',
    'Xgen 솔루션 관리자에게 화면 캡처와 함께 문의',
  ],
  // 리스트 아이템 등 verb 가 뒤에 없는 mid-sentence 패턴 — 토큰만 교체
  ['**XGen 관리자**(<{{vars.support_email}}>)', 'Xgen 솔루션 관리자'],
  ['**XGen 관리자**({{vars.support_email}})', 'Xgen 솔루션 관리자'],
];

// English 변환
const EN_RULES = [
  // dashboard 변형
  [
    '**XGen Administrator**(<{{vars.support_email}}>) or open a ticket via sidebar **Technical Support → 1:1 Admin Inquiry**.',
    'the Xgen Solution Administrator.',
  ],
  // 표준 챕터 말미
  [
    'please contact **XGen Administrator**({{vars.support_email}}).',
    'please contact the Xgen Solution Administrator.',
  ],
  [
    'please contact **XGen Administrator**(<{{vars.support_email}}>).',
    'please contact the Xgen Solution Administrator.',
  ],
  // contact mid-sentence
  ['contact **XGen Administrator**({{vars.support_email}})', 'contact the Xgen Solution Administrator'],
  ['contact **XGen Administrator**(<{{vars.support_email}}>)', 'contact the Xgen Solution Administrator'],
  ['email **XGen Administrator**(<{{vars.support_email}}>)', 'email the Xgen Solution Administrator'],
  ['email **XGen Administrator**({{vars.support_email}})', 'email the Xgen Solution Administrator'],
  // 'Technical support: X' / 'Still missing — X' 류 라벨
  ['**XGen Administrator**(<{{vars.support_email}}>)', 'Xgen Solution Administrator'],
  ['**XGen Administrator**({{vars.support_email}})', 'Xgen Solution Administrator'],
];

function applyRules(text, rules) {
  let out = text;
  for (const [from, to] of rules) {
    out = out.split(from).join(to);
  }
  return out;
}

const mds = walk(ROOT).filter((f) => {
  const s = fs.readFileSync(f, 'utf8');
  return s.includes('XGen 관리자') || s.includes('XGen Administrator');
});

let changed = 0;
for (const f of mds) {
  const orig = fs.readFileSync(f, 'utf8');
  const next = applyRules(orig, isEnglish(f) ? EN_RULES : KO_RULES);
  if (next !== orig) {
    fs.writeFileSync(f, next, 'utf8');
    changed++;
    console.log(`[simplify-support] updated ${path.relative(process.cwd(), f)}`);
  }
}
console.log(`[simplify-support] ${changed} / ${mds.length} files modified`);

// 사후 점검: 잔존 패턴이 있는지 보고
const remaining = mds.filter((f) => {
  const s = fs.readFileSync(f, 'utf8');
  return s.includes('XGen 관리자') || s.includes('XGen Administrator');
});
if (remaining.length) {
  console.log(`\n[simplify-support] WARN — 잔존 패턴이 있는 파일 ${remaining.length}개:`);
  remaining.forEach((f) => console.log(`  ${path.relative(process.cwd(), f)}`));
}
