// fix-i18n-home.mjs — mkdocs-static-i18n(1.3.1) 홈 링크 버그 후처리
//
// 증상: 영문(en) 페이지의 상단 탭 + 좌측 사이드바 "Home" 링크가
//   href="(../)*index.md" 로 남는다. 이는 (1) 존재하지 않는 .md 파일이라 404 이고,
//   (2) 한국어 루트(index.md)를 가리켜 영문 홈으로 가지 않는다.
//
// 원인: nav 의 다른 항목(tasks/common/user/admin)은 "디렉토리" 참조라
//   i18n 플러그인이 en 트윈(index.en.md → en/<dir>/index.html)으로 정상 로컬라이즈하지만,
//   루트의 "파일" 참조(base/.pages 의 `홈: index.md`)만 en 빌드에서 로컬라이즈되지 않아
//   원본 소스 경로가 그대로 노출된다. 한국어(기본 로케일) 페이지는 정상이라 영향 없음.
//
// 처리: 각 고객사 site 산출물의 en/ 서브트리에서 깨진 홈 링크만 정확히 교정한다.
//   변환 규칙 — 깨진 href 는 "현재 파일 → 한국어 루트" 상대경로이므로,
//   앞의 `../` 하나를 제거하고 확장자를 .html 로 바꾸면 "현재 파일 → 영문 홈(en/index.html)"이 된다.
//     en/index.html:        "../index.md"    → "index.html"      (영문 홈 자신)
//     en/user/index.html:   "../../index.md" → "../index.html"   (en/index.html)
//   KO 페이지에는 index.md href 자체가 없어 대상에서 자연히 제외된다.

import { readdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

// href="../<...>index.md" 에서 맨 앞 ../ 하나를 떼고 .html 로 교체.
// 반드시 최소 하나의 ../ 로 시작하는 홈 링크만 매칭한다(본문 내 동일 디렉토리 링크는 건드리지 않음).
const BROKEN_HOME_HREF = /href="\.\.\/((?:\.\.\/)*)index\.md"/g;

async function* walkHtml(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* walkHtml(full);
    else if (entry.isFile() && entry.name.endsWith('.html')) yield full;
  }
}

// siteRoot: dist/site/docs/<customer> — 이 아래 en/ 만 대상.
export async function fixI18nHomeLinks(siteRoot) {
  const enRoot = join(siteRoot, 'en');
  if (!existsSync(enRoot)) return { files: 0, links: 0 };

  let files = 0;
  let links = 0;
  for await (const file of walkHtml(enRoot)) {
    const html = await readFile(file, 'utf8');
    let count = 0;
    const fixed = html.replace(BROKEN_HOME_HREF, (_m, rest) => {
      count += 1;
      return `href="${rest}index.html"`;
    });
    if (count > 0) {
      await writeFile(file, fixed, 'utf8');
      files += 1;
      links += count;
    }
  }
  return { files, links };
}
