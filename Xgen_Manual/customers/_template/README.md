# 신규 고객사 추가 절차

## 권장: CLI로 한 번에 생성

```powershell
node build/new-customer.mjs --id <customer-id> --name "고객사 정식명"
```

옵션 전체:

```powershell
node build/new-customer.mjs `
  --id acme-bank `
  --name "ACME은행" `
  --industry financial `
  --product-version 2.3.0 `
  --domain xgen.acmebank.co.kr `
  --support-email support@acmebank.co.kr
```

이 명령은 다음을 자동 수행합니다.

1. `customers/<id>/manual/` ← `base/` 트리 통째 복사
2. `customers/<id>/customer.yml` 생성 (입력값 반영)
3. `customers/<id>/branding/` 빈 폴더 생성

## 이후 작업 흐름

1. `customer.yml` 검토 (변수, 도메인 등)
2. `customers/<id>/manual/` 안에서 자유롭게 매뉴얼 수정
   - 챕터 추가: `manual/admin/30-compliance.md` 등 새 파일 생성
   - 챕터 삭제: 해당 `.md` 파일 삭제
   - 챕터 수정: 그냥 편집
3. (선택) `branding/` 에 reference.docx, 로고 등 배치
4. 빌드:
   ```powershell
   node build/build.mjs --customer <id> --formats html,docx
   ```

## 디렉토리 구조

```
<customer-id>/
├── customer.yml         # 메타·변수·빌드 옵션
├── manual/              # 매뉴얼 본문 (base에서 복사된 후 자유 수정)
│   ├── index.md
│   ├── common/
│   ├── user/
│   └── admin/
└── branding/            # 로고, reference.docx, 표지 등
```

## base와의 관계 (중요)

- `manual/` 은 처음 생성 시점의 `base/` 사본입니다.
- 그 이후로는 base와 **독립**입니다 — base가 수정되어도 자동 반영되지 않습니다.
- base의 새 변경을 가져오려면 (TODO: 추후 sync 도구 추가 예정) 수동 비교·복사 필요.
