// 고객사명·ID 대외비 마스킹 — 단어별로 첫 글자만 노출 + 고정 'OOO' 치환.
// 구분자(공백·하이픈·괄호 등)는 그대로 유지하여 내부 관계자가 형태로 식별 가능.
//
// 예시:
//   "제주은행"  → "제OOO"
//   "jeju-bank" → "jOOO-bOOO"
//   "ACME은행"  → "AOOO"
//   "A"         → "A"           (1글자는 그대로)
export function maskCustomerLabel(s) {
  if (!s) return s;
  return String(s).replace(/[\p{L}\p{N}]+/gu, (run) => {
    if (run.length <= 1) return run;
    return run[0] + 'OOO';
  });
}
