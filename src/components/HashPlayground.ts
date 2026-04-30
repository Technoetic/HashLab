import { HashEngine } from '../core/HashEngine.js';
import { BaseComponent } from './BaseComponent.js';

export class HashPlayground extends BaseComponent {
  render(): void {
    this.root.innerHTML = `
      <div class="demo">
        <header><span>Demo · 즉석 해시 계산기</span><span aria-live="polite" id="hp-status">대기</span></header>
        <div class="field">
          <label for="hp-input">아무 글자나 입력해 보세요</label>
          <input type="text" id="hp-input" placeholder="hello" autocomplete="off" spellcheck="false" value="hello" />
        </div>
        <div class="field"><label>SHA-256 (256 bit)</label><code class="hash-out" id="hp-256"></code></div>
        <div class="field"><label>SHA-1 (160 bit)</label><code class="hash-out" id="hp-1"></code></div>
        <div class="field"><label>FNV-1a (32 bit · 빠른 비암호 해시)</label><code class="hash-out" id="hp-fnv"></code></div>
      </div>
    `;
    const input = this.$('#hp-input') as HTMLInputElement;
    const compute = async () => {
      const v = input.value;
      this.$('#hp-status')!.textContent = '계산 중…';
      const [s256, s1] = await Promise.all([HashEngine.sha256(v), HashEngine.sha1(v)]);
      (this.$('#hp-256') as HTMLElement).textContent = s256;
      (this.$('#hp-1') as HTMLElement).textContent = s1;
      (this.$('#hp-fnv') as HTMLElement).textContent = HashEngine.fnv1a32(v);
      this.$('#hp-status')!.textContent = `${v.length} 글자 → 길이 고정`;
    };
    this.on(input, 'input', () => compute());
    void compute();
  }
}
