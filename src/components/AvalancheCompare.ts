import { HashEngine } from '../core/HashEngine.js';
import { BaseComponent } from './BaseComponent.js';

export class AvalancheCompare extends BaseComponent {
  render(): void {
    this.root.innerHTML = `
      <div class="demo">
        <header><span>Demo · 눈사태(Avalanche) 효과</span><span id="av-stat" aria-live="polite"></span></header>
        <p style="font-size:14px;color:var(--fg-muted);margin-bottom:12px">
          왼쪽과 오른쪽 입력의 단 한 글자만 다르게 해 보세요. SHA-256 결과의 절반이 뒤집힙니다.
        </p>
        <div class="row">
          <div class="col">
            <div class="field"><label>입력 A</label>
              <input type="text" id="av-a" value="hello" autocomplete="off" spellcheck="false" />
            </div>
            <div class="field"><label>SHA-256(A)</label><code class="hash-out" id="av-ha"></code></div>
          </div>
          <div class="col">
            <div class="field"><label>입력 B</label>
              <input type="text" id="av-b" value="hellp" autocomplete="off" spellcheck="false" />
            </div>
            <div class="field"><label>SHA-256(B) — 다른 글자 비교</label><code class="hash-out" id="av-hb"></code></div>
          </div>
        </div>
      </div>
    `;
    const a = this.$('#av-a') as HTMLInputElement;
    const b = this.$('#av-b') as HTMLInputElement;
    const out = async () => {
      const [ha, hb] = await Promise.all([HashEngine.sha256(a.value), HashEngine.sha256(b.value)]);
      const eA = this.$('#av-ha') as HTMLElement;
      const eB = this.$('#av-hb') as HTMLElement;
      eA.textContent = ha;
      eB.innerHTML = '';
      for (let i = 0; i < hb.length; i++) {
        const span = document.createElement('span');
        span.textContent = hb[i];
        if (hb[i] !== ha[i]) span.className = 'diff';
        eB.appendChild(span);
      }
      const { diff, total } = HashEngine.bitDiff(ha, hb);
      const pct = ((diff / total) * 100).toFixed(1);
      this.$('#av-stat')!.textContent = `${diff}/${total} bit 다름 (${pct}%)`;
    };
    this.on(a, 'input', () => out());
    this.on(b, 'input', () => out());
    void out();
  }
}
