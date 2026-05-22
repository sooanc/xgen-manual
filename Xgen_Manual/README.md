# Xgen_Manual

Xgen 솔루션의 사용자/관리자 매뉴얼을 **표준 솔루션 매뉴얼(base)** 과 **고객사별 fork(복사 후 자유 수정)** 모델로 작성하고, **HTML / DOCX / PDF / PPT** 포맷으로 빌드하는 시스템입니다.

> ⚠ **편집 작업 전 [AUTHORING.md](AUTHORING.md) 를 먼저 읽으세요.** 용어 규칙(예: 거버넌스 챕터 "에이전트" 사용)·UI 사실·고객사명 마스킹 등 영속 규칙이 모여 있습니다. 새 규칙이 정해지면 즉시 AUTHORING.md 에 추가.

## 작업 모델

```
                     [base/]
                         │
                         │  (신규 고객사 생성 시 통째 복사)
                         ▼
              [customers/<id>/manual/]
                         │
                         │  (이후 자유롭게 수정 — base와 독립)
                         ▼
                    [고객사 매뉴얼]
```

| 영역 | 역할 |
|---|---|
| `base/` | 표준 솔루션 매뉴얼. **이곳을 유지보수**하면 이후 추가되는 신규 고객사가 자동으로 최신 base를 받음 |
| `customers/<id>/manual/` | 고객사 전용 매뉴얼. 처음에는 base 사본이지만, 이후 자유롭게 수정 |
| `customers/<id>/customer.yml` | 고객사 메타데이터, 변수, 빌드 옵션 |
| `customers/<id>/branding/` | 로고, reference.docx, 표지 등 |

> **주의:** 일단 `customers/<id>/manual/` 이 만들어지면 base 변경은 자동으로 흐르지 않습니다. base 갱신을 고객사로 가져올 때는 수동 비교·복사가 필요합니다 (sync 도구 추후 추가 예정).

## 디렉토리 구조

```
Xgen_Manual/
├── base/                              # 표준 솔루션 매뉴얼 (마스터)
│   ├── index.md, .pages
│   ├── common/                        # 공통 챕터
│   ├── user/                          # 사용자 영역
│   └── admin/                         # 관리자 영역
├── customers/                         # 고객사 fork
│   ├── _schema.json                   # customer.yml JSON Schema
│   ├── _template/                     # 수동 생성 시 참고용
│   └── <customer-id>/
│       ├── customer.yml               # 메타·변수·옵션
│       ├── manual/                    # 매뉴얼 본문 (base에서 복사된 후 자유 수정)
│       └── branding/                  # 로고, reference.docx 등
├── shared/
│   ├── styles/                        # GNB, 가독성 보정 등 공통 CSS
│   ├── scripts/                       # 헤더 네비게이션 JS 등
│   └── templates/                     # 기본 reference.default.docx 등
├── build/
│   ├── compose.mjs                    # 매뉴얼 → 합성된 빌드 트리
│   ├── build.mjs                      # 빌드 오케스트레이터
│   ├── new-customer.mjs               # 신규 고객사 추가 (base 복사)
│   ├── deploy.mjs                     # 운영 배포
│   └── lib/                           # 포맷별 빌더, 관리자 페이지 생성기
├── deploy.config.yml                  # 배포 환경별 정책
├── mkdocs.base.yml                    # MkDocs 공통 설정
├── package.json
└── .gitignore
```

빌드 산출물(`.build/`, `dist/`)은 git 제외.

## 사전 준비

| 도구 | 용도 | 권장 버전 |
|---|---|---|
| Node.js | 빌드 스크립트 | 20+ |
| Python | MkDocs 실행 | 3.11+ |
| Pandoc | DOCX 변환 | 3.0+ |

설치 (Windows):

```powershell
winget install --id JohnMacFarlane.Pandoc -e
pip install mkdocs-material mkdocs-macros-plugin mkdocs-awesome-pages-plugin mkdocs-glightbox mkdocs-git-revision-date-localized-plugin pymdown-extensions
npm install
```

> `mkdocs.exe`가 PATH에 없어도 빌드 스크립트는 `python -m mkdocs`로 호출하므로 동작합니다.

## 일상 작업 흐름

### A. 표준 매뉴얼(base) 유지보수

```powershell
# 1. base/ 안의 .md 파일을 수정 (이후 추가되는 신규 고객사가 받게 될 내용)
# 2. base 미리보기로 확인
npm run serve:base
# → http://127.0.0.1:8000/
```

### B. 신규 고객사 추가

```powershell
node build/new-customer.mjs --id acme-bank --name "ACME은행" --industry financial
# → customers/acme-bank/manual/ 가 base 복사본으로 생성됨
# → customer.yml 자동 생성

# 매뉴얼 커스터마이징 시작:
# customers/acme-bank/manual/ 안의 파일을 자유롭게 편집·추가·삭제
```

### C. 고객사 매뉴얼 빌드

```powershell
# 단일 고객사 — HTML만
node build/build.mjs --customer <customer-id> --formats html

# 단일 고객사 — HTML + DOCX
node build/build.mjs --customer <customer-id> --formats html,docx

# 전 고객사 HTML 일괄 빌드 (배포용)
node build/build.mjs --customer all --formats html

# 등록된 고객사 목록
node build/build.mjs --list
```

### D. 운영 배포

```powershell
# 사전 검증
node build/deploy.mjs --target production --dry-run

# 실행
node build/deploy.mjs --target production
```

자세한 가이드는 빌드 후 `dist/site/admin/deploy.html` 참조.

## 산출물 위치

| 포맷 | 경로 |
|---|---|
| HTML | `dist/site/docs/<customer-id>/` |
| 메인 인덱스 | `dist/site/index.html` (고객사 카드 목록, 내부용) |
| 관리자 페이지 | `dist/site/admin/index.html`, `dist/site/admin/deploy.html` |
| DOCX | `dist/docx/<customer-id>/Xgen_Manual_사용자_v<x.y.z>_<id>.docx` 외 |
| 배포 패키지 | `dist/deploy/<target>/` (deploy.mjs 실행 후) |

## 변수 치환

`.md` 본문에서 `{{customer.name}}`, `{{product.version}}`, `Xgen 솔루션 관리자` 등을 사용하면 빌드 시 `customer.yml` 값으로 치환됩니다. base 작성 시에도 동일하게 사용 가능 (각 고객사 빌드 시점에 그 고객사의 값으로 치환됨).

## base 변경을 고객사로 가져오기 (수동)

현재는 sync 도구가 없습니다. base 갱신을 특정 고객사에 반영하려면 수동으로:

```powershell
# 어느 파일이 다른지 확인 (Git Bash 등)
diff -r base customers/<customer-id>/manual

# 특정 파일을 base에서 가져오기
copy base\common\00-overview.md customers\<customer-id>\manual\common\00-overview.md
```

추후 `node build/sync-from-base.mjs --customer <id>` 도구를 추가할 예정 (자동 diff + 선택적 적용).

## 다음 단계 (로드맵)

- [ ] **sync-from-base 도구**: base 변경을 고객사 manual로 선택적 동기화
- [ ] PDF 빌더 (Puppeteer 기반 HTML 인쇄)
- [ ] PPT 빌더 (Marp, slides/ 디렉토리 별도 소스)
- [ ] customer.yml JSON Schema 자동 검증 (ajv)
- [ ] 변경된 고객사만 빌드하는 증분 빌드 (`--changed`)
- [ ] CI(GitHub Actions): PR마다 전 고객사 smoke build
