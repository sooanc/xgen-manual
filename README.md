# xgen-manual

Xgen 솔루션 매뉴얼 — 캡처 자동화 + MkDocs 빌드 + GitLab Pages 배포.

`xgen-frontend` 본 레포(`xgen2.0/xgen-frontend`)와 분리된 별도 저장소입니다.
매뉴얼 캡처는 `stg-xgen.x2bee.com` 라이브 서버를 Playwright로 호출하므로
xgen-frontend 소스 의존성은 없습니다.

## 디렉토리 구조

```
xgen-manual/
├── Xgen_Manual/              # 매뉴얼 본문 + MkDocs 빌드 시스템
│   ├── base/                 # 표준 매뉴얼 (마스터)
│   ├── customers/            # 고객사 fork
│   ├── build/                # 빌드 스크립트
│   ├── shared/               # 공통 CSS/JS/템플릿
│   ├── mkdocs.base.yml
│   └── deploy.config.yml
├── scripts/
│   ├── capture-manual-user.mjs   # 사용자 매뉴얼용 22개 화면
│   └── capture-manual-admin.mjs  # 관리자 매뉴얼용 19개 화면
├── .env.xgen-stg.sample      # 자격증명 템플릿
├── .gitlab-ci.yml            # GitLab Pages 자동 배포
└── package.json
```

## 사전 준비

| 도구 | 용도 | 권장 버전 |
|---|---|---|
| Node.js | 빌드/캡처 | 20+ |
| Python | MkDocs 실행 | 3.11+ |
| Pandoc | DOCX 변환 (선택) | 3.0+ |

```powershell
# 1. 의존성 설치
npm install
cd Xgen_Manual && npm install && cd ..

# 2. Python 의존성
pip install mkdocs-material mkdocs-macros-plugin mkdocs-awesome-pages-plugin mkdocs-glightbox mkdocs-git-revision-date-localized-plugin pymdown-extensions mkdocs-static-i18n

# 3. Playwright 브라우저
npx playwright install chromium

# 4. 자격증명 설정
cp .env.xgen-stg.sample .env.xgen-stg
# .env.xgen-stg 편집해서 이메일/비밀번호 입력
```

## 일상 작업

```powershell
# 캡처 (stg-xgen.x2bee.com 기반)
npm run capture:user        # 사용자 화면 22개
npm run capture:admin       # 관리자 화면 19개
npm run capture:all         # 둘 다

# 빌드
npm run build               # xgen-standard만 HTML
npm run build:all           # 전 고객사 HTML

# 미리보기 (http://127.0.0.1:8000/)
npm run serve
```

## 자동 배포 (GitLab Pages)

`main` 브랜치 push 시 [.gitlab-ci.yml](.gitlab-ci.yml) 의 `pages` 잡이 실행되어
빌드 결과를 GitLab Pages에 게시합니다. 캡처는 CI에서 안 돌고 로컬에서
수동 갱신 후 PNG를 커밋하는 모델입니다 (stg 접속 자격증명을 CI에 두지 않기 위함).

배포 URL 패턴: `https://xgen2-0.gitlab.io/xgen-manual/` (GitLab 그룹 설정에 따라 다를 수 있음)

## 자격증명 보호

`.env.xgen-stg`, `.env.xgen-test`, `.env.local` 등 자격증명 파일은
`.gitignore` 처리되어 절대 커밋되지 않습니다. 새 환경에서는
`.env.xgen-stg.sample` 을 복사해서 값을 채우세요.
