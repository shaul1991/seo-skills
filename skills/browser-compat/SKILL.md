---
name: browser-compat
description: >-
  브라우저별 표시·차단 대응: Brave(Shields 광고·추적기 차단, De-AMP), Safari·Chrome·Edge·Samsung Internet·Whale 등에서 보이는
  파비콘·apple-touch-icon·theme-color·웹 앱 manifest, 분석 도구 과소 집계, 서드파티 위젯 깨짐. "Brave에서 안 보여요", "Brave 대응",
  "브라우저 호환", "theme-color", "manifest", "홈 화면 아이콘" 요청에 사용.
---

# 브라우저 대응

근거(2026-11-04 확인): [Brave Shields](https://support.brave.app/hc/en-us/articles/360022973471-What-is-Shields), [Brave De-AMP](https://support.brave.app/hc/en-us/articles/8611298579981-What-is-Brave-s-De-AMP-feature), [MDN theme-color](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name/theme-color), [MDN Web app manifest](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest), [네이버 파비콘](https://searchadvisor.naver.com/guide/markup-favicon).

검색 노출은 브라우저가 아니라 각 검색엔진이 정합니다(`other-search-engines`). 이 Skill은 **사용자의 브라우저에서 사이트가 제대로 보이고 측정되는지**를 다룹니다.

## Brave

- **Shields 기본 동작:** 대부분의 광고와 추적기 차단, 방문한 사이트 외의 쿠키 폐기, 핑거프린팅 방지, 가능한 경우 HTTPS로 업그레이드, 악성 코드 차단. 사용자가 JavaScript·모든 쿠키를 막으면 사이트가 깨질 수 있습니다.
- 영향(비서 판단): 서드파티 분석·광고 픽셀(GA, Meta 픽셀 등)은 Brave 사용자에서 **집계가 빠질 수 있습니다.** 방문 수는 서버 로그나 자사 도메인 기반 분석과 함께 봅니다. 핵심 기능(검색·목록·공식 링크 이동)이 서드파티 스크립트에 의존하지 않게 합니다.
- **De-AMP:** Brave는 AMP 페이지를 게시자의 원래 페이지로 자동 이동시킵니다(Yandex Turbo도 동일). AMP만 있고 일반 페이지가 없으면 안 됩니다. AMP를 쓴다면 canonical 일반 페이지를 유지합니다.
- **HTTPS:** Strict HTTPS 업그레이드가 있으므로 http/https 혼용, 혼합 콘텐츠를 없앱니다.
- 확인: Brave에서 Shields 기본값으로 주요 흐름을 직접 열어 봅니다(`ego-browser`나 실제 기기). Shields를 끈 결과와 비교합니다.

## 아이콘·색상·설치 정보 (`<head>`)

```html
<link rel="icon" href="https://example.com/favicon.svg" type="image/svg+xml">
<link rel="icon" href="https://example.com/favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="https://example.com/apple-touch-icon.png">  <!-- 180×180 권장(일반적 관례) -->
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#111111" media="(prefers-color-scheme: dark)">
```

- 파비콘 href는 **절대 URL**로 두면 네이버 조건(절대 경로)과 브라우저 모두 만족합니다. 정사각형 32px 이상 권장(네이버).
- `theme-color`: 브라우저 UI 색을 제안하는 메타. MDN 기준 **Baseline이 아님(일부 주요 브라우저 미지원)** — 없어도 기능에 문제가 없게 합니다. `media`로 라이트·다크를 나눌 수 있습니다.
- `manifest`: PWA 설치에 쓰는 JSON(이름·아이콘·`display`·`background_color` 등). 모든 멤버는 선택이지만 설치 가능 여부는 브라우저마다 요구가 다릅니다. 설치형 앱이 목적이 아니면 필수는 아닙니다.
- `apple-touch-icon`의 180×180 크기는 이번에 Apple 원문으로 확인하지 않은 관례입니다.

## 점검 순서

1. Chrome·Safari(iOS)·Samsung Internet·Brave(Shields 기본)·Edge·네이버 Whale 중 실제 사용자 비중이 큰 2~3개에서 주요 흐름 확인. 비중은 자사 분석의 브라우저 분포로 정합니다.
2. 서드파티 스크립트가 막혀도 본문·링크·버튼이 동작하는지.
3. 파비콘·apple-touch-icon·theme-color가 각 브라우저 탭·홈 화면에서 보이는지.
4. 분석 수치는 Shields·추적 방지로 과소 집계될 수 있음을 보고서에 적습니다.
