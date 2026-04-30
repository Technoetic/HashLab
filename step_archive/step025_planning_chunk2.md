# Step 025 기획 chunk2 - 클래스 설계 (Class 지향)

## 모듈 구조

```
src/
├── main.ts                  # 부트스트랩
├── styles/
│   ├── tokens.css           # 디자인 토큰
│   ├── reset.css
│   └── app.css
├── core/
│   ├── HashEngine.ts        # 해시 계산 (Web Crypto)
│   ├── HashTable.ts         # 16버킷 + 체이닝/오픈 어드레싱
│   ├── BloomFilter.ts
│   └── EventBus.ts          # CustomEvent 래퍼
├── components/
│   ├── BaseComponent.ts     # 추상 클래스
│   ├── HashPlayground.ts
│   ├── AvalancheCompare.ts
│   ├── HashTableViz.ts
│   ├── BloomFilterViz.ts
│   ├── MiningSim.ts
│   ├── PasswordDemo.ts
│   ├── GitCommitDemo.ts
│   └── QuizCard.ts
├── chapters/
│   ├── ChapterRegistry.ts
│   └── chapter[0-8].ts      # 각 챕터의 콘텐츠 + 컴포넌트 조립
└── ui/
    ├── Sidebar.ts
    ├── Progress.ts
    └── Theme.ts
```

## 주요 클래스 인터페이스

```ts
abstract class BaseComponent {
  protected root: HTMLElement;
  constructor(root: HTMLElement) { this.root = root; }
  abstract render(): void;
  abstract destroy(): void;
}

class HashEngine {
  static async sha256(text: string): Promise<string>;
  static async sha1(text: string): Promise<string>;
  static md5Approx(text: string): string;     // 데모용 단순 폴리필
  static bitDiff(a: string, b: string): { diff: number; total: number };
}

class HashTable<V> {
  private buckets: Array<Array<{ key: string; value: V }>>;
  constructor(public readonly size: number);
  set(key: string, value: V): { bucket: number; collided: boolean };
  get(key: string): V | undefined;
  delete(key: string): boolean;
}

class BloomFilter {
  private bits: Uint8Array;
  constructor(public readonly bitSize: number, public readonly k: number);
  add(item: string): number[];     // 점등된 인덱스
  has(item: string): boolean;
  fpr(n: number): number;          // 예측 false positive rate
}
```

## 책임 분리(SoC)

- **core/** : 순수 로직, DOM 무지(無知)
- **components/** : DOM + 이벤트, core를 사용
- **chapters/** : 콘텐츠 + 컴포넌트 조립
- **ui/** : 글로벌 UI(사이드바·진행바·테마)

## 데이터 흐름

```
사용자 입력 → Component → core/HashEngine → 결과 → Component.render()
                              ↓ (선택)
                         EventBus → 다른 Component 갱신
```

테스트 가능: core는 100% 단위 테스트, components는 통합 테스트.
