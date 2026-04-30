import { describe, it, expect, beforeAll } from 'vitest';
import { HashEngine } from '../src/core/HashEngine.js';

beforeAll(() => {
  if (!globalThis.crypto?.subtle) {
    const { webcrypto } = require('node:crypto');
    Object.defineProperty(globalThis, 'crypto', { value: webcrypto, configurable: true });
  }
});

describe('HashEngine', () => {
  it('SHA-256("hello") matches known hex', async () => {
    expect(await HashEngine.sha256('hello')).toBe(
      '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824',
    );
  });

  it('SHA-1("") = empty string hash', async () => {
    expect(await HashEngine.sha1('')).toBe('da39a3ee5e6b4b0d3255bfef95601890afd80709');
  });

  it('SHA-256 output is 64 hex regardless of input length', async () => {
    const a = await HashEngine.sha256('a');
    const b = await HashEngine.sha256('a'.repeat(10000));
    expect(a).toHaveLength(64);
    expect(b).toHaveLength(64);
  });

  it('determinism: same input → same output', async () => {
    expect(await HashEngine.sha256('x')).toBe(await HashEngine.sha256('x'));
  });

  it('avalanche: 1-char change flips many bits', async () => {
    const h1 = await HashEngine.sha256('hello');
    const h2 = await HashEngine.sha256('hellp');
    const { diff, total } = HashEngine.bitDiff(h1, h2);
    expect(total).toBe(256);
    expect(diff).toBeGreaterThan(80);
  });

  it('FNV-1a is deterministic and 8 hex chars', () => {
    expect(HashEngine.fnv1a32('hello')).toMatch(/^[0-9a-f]{8}$/);
    expect(HashEngine.fnv1a32('hello')).toBe(HashEngine.fnv1a32('hello'));
  });
});
