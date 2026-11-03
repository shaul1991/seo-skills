---
name: indexnow
description: >-
  IndexNow로 새로 만들거나 바뀌거나 삭제된 URL을 네이버·Bing 등 참여 검색엔진에 알리기: 키 파일 생성·배치, 단건 GET·다건 POST,
  응답 코드 처리, 배포 후 자동 전송. "IndexNow", "네이버에 바로 알리기", "색인 요청 자동화", "Bing 색인" 요청에 사용.
---

# IndexNow

근거(확인 2026-11-04): [indexnow.org 문서](https://www.indexnow.org/documentation), [FAQ](https://www.indexnow.org/faq), 네이버 [IndexNow 소개](https://searchadvisor.naver.com/guide/indexnow-about)·[API Key](https://searchadvisor.naver.com/guide/indexnow-api-key)·[페이지 갱신 요청](https://searchadvisor.naver.com/guide/indexnow-request).

- IndexNow는 변경을 빨리 **알리는** 프로토콜이며 색인을 보장하지 않습니다(네이버 명시).
- 참여 검색엔진끼리 제출 URL을 자동 공유합니다(indexnow.org, 네이버 모두 명시). 한 곳에 보내면 됩니다.
- Google: 이번 확인 범위의 Google Search Central 문서에는 IndexNow 안내가 없습니다. Google은 사이트맵·Search Console을 씁니다(`google-search`).

## 1. 키 만들기·올리기

- 키: UTF-8, `a-f A-F 0-9 -`만, 8~128자. 예: `openssl rand -hex 16`
- 루트에 `https://example.com/<키>.txt`, 내용은 키 문자열 그대로(권장).
- 다른 위치에 두면 요청마다 `keyLocation`을 보내야 하고, 그 키는 **그 디렉터리 아래 URL에만** 유효합니다.
- 도메인(호스트)마다 별도 키.
- 키는 공개 파일이라 비밀값이 아니지만, 이 키로 타인이 거짓 갱신을 보낼 수 있으므로 저장소에 하드코딩할지 환경변수로 둘지 정합니다.

## 2. 보내기

단건:

```bash
curl -s -o /dev/null -w "%{http_code}\n" \
  "https://searchadvisor.naver.com/indexnow?url=https://example.com/events/123&key=$INDEXNOW_KEY"
```

다건(한 번에 최대 10,000개):

```bash
curl -s -o /dev/null -w "%{http_code}\n" -X POST https://searchadvisor.naver.com/indexnow \
  -H "Content-Type: application/json; charset=utf-8" \
  -d '{"host":"example.com","key":"'"$INDEXNOW_KEY"'","urlList":["https://example.com/events/123","https://example.com/events/124"]}'
```

- 다른 참여 엔진에 보낼 때는 호스트만 바꿉니다(`https://<searchengine>/indexnow`). 엔드포인트는 각 엔진 문서에서 확인합니다.

## 3. 응답 코드

| 코드 | 뜻 | 할 일 |
| --- | --- | --- |
| 200 | 성공 | — |
| 202 | 수신, 키 확인 중 | 키 파일 접근 가능 여부 확인 |
| 400 | 형식 오류 | JSON·URL 인코딩(RFC 3986) 확인 |
| 403 | 키 무효 | 키 파일 내용·위치 확인 |
| 422 | URL이 키·호스트와 불일치 | `host`, `keyLocation` 범위 확인 |
| 429 | 과다 요청 | 간격을 두고 재시도, 변경분만 전송 |
| 500 | 서버 오류 | 나중에 재시도 |

## 4. 언제 보내나

- 상세 페이지 생성·내용 변경·삭제(삭제 후 404/410) 직후, 배포 파이프라인에서 **변경된 URL만**.
- 변경 없는 URL을 주기적으로 반복 전송하지 않습니다(429·스팸 판단 위험 — 비서 판단, 네이버 수집 요청 가이드의 "반복 요청 불필요"와 같은 방향).
- 사이트맵 `lastmod` 갱신과 함께 씁니다.
