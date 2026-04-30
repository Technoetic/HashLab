import { HashEngine } from './HashEngine.js';

export type Strategy = 'chaining' | 'open';

export interface Entry<V> {
  key: string;
  value: V;
}

export interface InsertResult {
  bucket: number;
  collided: boolean;
  probes: number;
}

export class HashTable<V> {
  buckets: Array<Array<Entry<V>>>;

  constructor(
    public readonly size: number,
    public strategy: Strategy = 'chaining',
  ) {
    this.buckets = Array.from({ length: size }, () => []);
  }

  hash(key: string): number {
    return HashEngine.djb2(key) % this.size;
  }

  set(key: string, value: V): InsertResult {
    const idx = this.hash(key);
    if (this.strategy === 'chaining') {
      const existing = this.buckets[idx].findIndex((e) => e.key === key);
      if (existing >= 0) {
        this.buckets[idx][existing].value = value;
        return { bucket: idx, collided: false, probes: 1 };
      }
      const collided = this.buckets[idx].length > 0;
      this.buckets[idx].push({ key, value });
      return { bucket: idx, collided, probes: 1 };
    }
    let probes = 0;
    let i = idx;
    while (probes < this.size) {
      probes++;
      if (this.buckets[i].length === 0) {
        this.buckets[i].push({ key, value });
        return { bucket: i, collided: probes > 1, probes };
      }
      if (this.buckets[i][0].key === key) {
        this.buckets[i][0].value = value;
        return { bucket: i, collided: false, probes };
      }
      i = (i + 1) % this.size;
    }
    return { bucket: -1, collided: true, probes };
  }

  get(key: string): V | undefined {
    const idx = this.hash(key);
    if (this.strategy === 'chaining') {
      return this.buckets[idx].find((e) => e.key === key)?.value;
    }
    let i = idx;
    for (let p = 0; p < this.size; p++) {
      if (this.buckets[i].length === 0) return undefined;
      if (this.buckets[i][0].key === key) return this.buckets[i][0].value;
      i = (i + 1) % this.size;
    }
    return undefined;
  }

  clear(): void {
    this.buckets = Array.from({ length: this.size }, () => []);
  }
}
