# {{product.name}} 솔루션 매뉴얼

**고객사:** {{customer.name}}
**제품 버전:** {{product.version}}
**매뉴얼 버전:** {{manual.version}} ({{manual.released_at}})

본 매뉴얼은 {{product.name}} 솔루션의 사용자 및 관리자 운영 가이드입니다. 좌측 상단의 탭을 통해 영역별 매뉴얼로 이동하실 수 있습니다.

## 빌드 출처

본 매뉴얼은 다음 환경을 기준으로 작성·검증되었습니다.

| 항목 | 값 |
|---|---|
| 솔루션 도메인 | <https://{{product.domain}}/> |
| GitLab 저장소 | `{{build.repository}}` |
| 기준 브랜치 | **`{{build.branch}}`** |
| 캡처 환경 | {{build.environment}} (`{{build.capture_url}}`) |

화면 캡처와 UI 문자열(메뉴명·버튼·placeholder)은 위 브랜치·환경 기준입니다. 다른 환경(운영/STG)은 일부 메뉴 라벨·정책 기본값이 다를 수 있으므로, 필요 시 해당 환경 기준 매뉴얼을 별도로 빌드해 참고하세요.

## 매뉴얼 구성

- **공통**: 솔루션 개요, 용어 정의 등 사용자/관리자 모두에게 필요한 내용
- **사용자**: 일반 사용자가 솔루션을 사용하기 위한 가이드
- **관리자**: 시스템 관리자가 솔루션을 운영하기 위한 가이드

## 문의

- 기술 지원: {{vars.support_email}}
