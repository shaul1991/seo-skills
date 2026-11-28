# 변경 이력

## 1.0.0 (2026-11-28)

- 사이트를 한 명령으로 감사하고 HTTP 상태, robots.txt, 색인 가능성, canonical, 사이트맵과 주요 페이지의 기술 SEO를 확인합니다. `seo-check`는 배포 점검에 사용할 수 있는 종료 코드와 JSON을 제공합니다.
- Google Search Console의 다국어 CSV와 직접 기록한 AI 답변 출처를 한국어·영어 HTML 및 JSON 보고서로 정리합니다. 공유 플랫폼의 소유 프로필 URL도 인용 집계에 포함할 수 있습니다.
- `search-visibility init`으로 실측 설정을 만들고 `search-visibility compare`로 배포 전후 진단 결과, 검색 실적과 AI 출처 집계를 비교합니다.
- 한영 README에서 검색 콘솔, 구조화 데이터, 공유 미리보기, 성능 도구와 AI 답변 인용 관측 절차를 안내합니다.
- npm 패키지에 CLI 두 개를 제공하고 Agent Skills 개별 설치와 Claude Code 마켓플레이스 설치를 지원합니다. Node.js 18과 24에서 배포 구성을 테스트합니다.
