import { describe, it, expect } from 'vitest';
import { HashTable } from '../src/core/HashTable.js';

describe('HashTable (chaining)', () => {
  it('inserts and retrieves', () => {
    const t = new HashTable<number>(8);
    t.set('apple', 1);
    t.set('banana', 2);
    expect(t.get('apple')).toBe(1);
    expect(t.get('banana')).toBe(2);
    expect(t.get('missing')).toBeUndefined();
  });

  it('detects collisions on chaining', () => {
    const t = new HashTable<number>(2);
    const r1 = t.set('a', 1);
    const r2 = t.set('b', 2);
    expect(r1.collided).toBe(false);
    expect([r1.bucket, r2.bucket]).toContain(0);
    expect(r2.collided || r2.bucket !== r1.bucket).toBeTruthy();
  });

  it('updates existing key without collision flag', () => {
    const t = new HashTable<number>(8);
    t.set('apple', 1);
    const r = t.set('apple', 99);
    expect(r.collided).toBe(false);
    expect(t.get('apple')).toBe(99);
  });
});

describe('HashTable (open addressing)', () => {
  it('probes next slot on collision', () => {
    const t = new HashTable<number>(4, 'open');
    for (let i = 0; i < 4; i++) t.set(`k${i}`, i);
    for (let i = 0; i < 4; i++) expect(t.get(`k${i}`)).toBe(i);
  });

  it('clear empties everything', () => {
    const t = new HashTable<number>(4, 'open');
    t.set('a', 1);
    t.clear();
    expect(t.get('a')).toBeUndefined();
  });
});
