import { HashEngine } from './HashEngine.js';

export class BloomFilter {
  bits: Uint8Array;

  constructor(
    public readonly bitSize: number,
    public readonly k: number,
  ) {
    this.bits = new Uint8Array(bitSize);
  }

  private positions(item: string): number[] {
    const out: number[] = [];
    let h = HashEngine.djb2(item);
    for (let i = 0; i < this.k; i++) {
      h = (Math.imul(h, 31) + i * 2654435761) | 0;
      out.push((h >>> 0) % this.bitSize);
    }
    return out;
  }

  add(item: string): number[] {
    const idxs = this.positions(item);
    for (const i of idxs) this.bits[i] = 1;
    return idxs;
  }

  has(item: string): boolean {
    return this.positions(item).every((i) => this.bits[i] === 1);
  }

  clear(): void {
    this.bits.fill(0);
  }

  fpr(n: number): number {
    return (1 - Math.exp((-this.k * n) / this.bitSize)) ** this.k;
  }
}
