import { describe, it, expect } from 'vitest';
import { BloomFilter } from '../src/core/BloomFilter.js';

describe('BloomFilter', () => {
  it('definitely-no for never-added items (in low-load case)', () => {
    const bf = new BloomFilter(256, 3);
    bf.add('apple');
    bf.add('banana');
    expect(bf.has('apple')).toBe(true);
    expect(bf.has('banana')).toBe(true);
    expect(bf.has('zzznever_added')).toBe(false);
  });

  it('add returns k positions', () => {
    const bf = new BloomFilter(64, 3);
    const idxs = bf.add('x');
    expect(idxs).toHaveLength(3);
    idxs.forEach(i => {
      expect(i).toBeGreaterThanOrEqual(0);
      expect(i).toBeLessThan(64);
    });
  });

  it('clear empties bits', () => {
    const bf = new BloomFilter(64, 3);
    bf.add('a');
    bf.clear();
    expect(bf.has('a')).toBe(false);
  });

  it('fpr formula sane', () => {
    const bf = new BloomFilter(1000, 5);
    expect(bf.fpr(0)).toBeCloseTo(0, 5);
    expect(bf.fpr(10000)).toBeGreaterThan(0.5);
  });
});
