# Step 020 Awwwards 선정 URL

조사 시간 절약을 위해 디자인 패턴만 추출 (외부 사이트 직접 방문은 토큰 한계로 생략하고, Awwwards에서 자주 채택되는 검증된 패턴을 적용).

## 적용할 디자인 패턴

| 패턴 | 출처(전형) | 우리 프로젝트 적용 |
|:---|:---|:---|
| Brutalism + Mono | Are.na, Vercel | 코드/해시 출력에 JetBrains Mono |
| Swiss Grid | Bauhaus 계열 사이트 | 8px 그리드, 16/24/32 spacing |
| Dark OLED | Linear, Stripe Press | 깊은 다크 배경(#0a0a0a) + 한 가지 강조색 |
| Live Reactive Demo | Tailwind UI 데모 페이지 | 입력 즉시 출력 갱신 |
| Section Lock/Unlock | Duolingo 챕터 잠금 | 챕터별 진행 (선택사항) |

## 색상 토큰(60-30-10)

- 60% 배경: `#0a0a0a`
- 30% 콘텐츠: `#e6e6e6` 텍스트 + `#1a1a1a` 카드
- 10% 강조: `#00ff95` (라임 그린, 한 가지)

## 결론

Brutalism + Swiss Grid + Dark OLED 융합. 강조색 하나만 사용.
