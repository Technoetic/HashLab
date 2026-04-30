# Step 018 API 계약

## 외부 API

없음(전적으로 클라이언트 사이드).

## 내부 모듈 인터페이스(예정)

```ts
// src/hash/hash-engine.ts
class HashEngine {
  async sha256(text: string): Promise<string>
  async sha1(text: string): Promise<string>
  async md5Approx(text: string): Promise<string>  // 데모용 자체 구현
  bitDiff(hashA: string, hashB: string): { diffBits: number; total: number }
}

// src/hash/hash-table.ts
class HashTable<K, V> {
  constructor(size: number)
  set(key: K, value: V): { bucketIndex: number; collided: boolean }
  get(key: K): V | undefined
  buckets: Array<Array<[K, V]>>  // 시각화용 노출
}

// src/hash/bloom-filter.ts
class BloomFilter {
  constructor(bitSize: number, hashCount: number)
  add(item: string): number[]   // 점등된 비트 인덱스
  has(item: string): boolean
  bits: Uint8Array               // 시각화용
}
```

## 이벤트(클래스 외부 통신)

CustomEvent로 시각화 컴포넌트와 엔진 분리:
- `hash:computed` { hash, input, algo }
- `hashtable:inserted` { key, bucketIndex, collided }
- `bloom:added` { item, indexes }

## 결론

순수 클라이언트, 외부 API 없음. 클래스 인터페이스 명확.
