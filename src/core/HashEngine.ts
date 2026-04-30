export class HashEngine {
  static async sha256(text: string): Promise<string> {
    const buf = new TextEncoder().encode(text);
    const hash = await crypto.subtle.digest('SHA-256', buf);
    return HashEngine.toHex(hash);
  }

  static async sha1(text: string): Promise<string> {
    const buf = new TextEncoder().encode(text);
    const hash = await crypto.subtle.digest('SHA-1', buf);
    return HashEngine.toHex(hash);
  }

  static fnv1a32(text: string): string {
    let h = 0x811c9dc5;
    for (let i = 0; i < text.length; i++) {
      h ^= text.charCodeAt(i);
      h = Math.imul(h, 0x01000193);
    }
    return (h >>> 0).toString(16).padStart(8, '0');
  }

  static djb2(text: string): number {
    let h = 5381;
    for (let i = 0; i < text.length; i++) h = (h * 33 + text.charCodeAt(i)) | 0;
    return h >>> 0;
  }

  static bitDiff(hexA: string, hexB: string): { diff: number; total: number } {
    const len = Math.max(hexA.length, hexB.length);
    const a = hexA.padStart(len, '0');
    const b = hexB.padStart(len, '0');
    let diff = 0;
    for (let i = 0; i < len; i++) {
      const da = parseInt(a[i] || '0', 16);
      const db = parseInt(b[i] || '0', 16);
      const x = da ^ db;
      diff += x
        .toString(2)
        .split('')
        .filter((c) => c === '1').length;
    }
    return { diff, total: len * 4 };
  }

  private static toHex(buf: ArrayBuffer): string {
    return Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }
}
