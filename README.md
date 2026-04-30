# HashLab — 해시 함수 인터랙티브 튜토리얼

초보자가 해시 함수의 본질·대중 앱 사례·해시 테이블 동작을 직접 손으로 만지며 30분 안에 직관적으로 이해하는 웹 튜토리얼.

## 빠른 시작

```bash
npm install --legacy-peer-deps
npm run dev      # http://127.0.0.1:5173
```

## 빌드 & 미리보기

```bash
npm run build    # dist/ 생성 (JS 31KB, CSS 9.4KB)
npm run preview  # http://127.0.0.1:4173
```

## 테스트

```bash
npm test         # vitest 15 tests
```

## 챕터 구성 (총 30분)

| # | 제목 | 핵심 인터랙션 |
|:---|:---|:---|
| 0 | 환영합니다 | 즉석 SHA-256/SHA-1/FNV-1a 다이제스트 |
| 1 | 해시란 무엇인가 | 입력 길이 변경 → 출력은 항상 64자 hex |
| 2 | 4대 성질 + Avalanche | 한 글자 차이 → 비트 50% 뒤집힘 시각화 |
| 3 | 비밀번호 저장 | 평문 vs SHA-256 vs salt+SHA-256 비교 |
| 4 | 해시 테이블 16버킷 | 단어 입력 → djb2 → 버킷 분포 |
| 5 | 충돌 처리 + Bloom Filter | Chaining/Open Addressing 토글, 64bit Bloom |
| 6 | Git 커밋 ID | 1글자 변경 → SHA-1 완전 변화 |
| 7 | 비트코인 마이닝 | 난이도 슬라이더 + nonce 자동 증가 |
| 8 | 마무리 퀴즈 | 5문항 즉각 채점 |

## 기술 스택

- TypeScript + Vite (번들 31KB)
- Web Crypto API (외부 해시 라이브러리 0개)
- Class 지향: `core/` 순수 로직, `components/` DOM, `chapters/` 조립
- Helvetica Neue + JetBrains Mono, Dark OLED + 라임 강조 (60-30-10)

## 키보드 단축키

- `←` / `→` : 이전/다음 챕터
- `Esc` : 모바일 메뉴 닫기
