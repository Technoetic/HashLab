import { HashEngine } from '../core/HashEngine.js';
import { BaseComponent } from './BaseComponent.js';

export class MiningSim extends BaseComponent {
  private running = false;
  private nonce = 0;
  private attempts = 0;

  render(): void {
    this.root.innerHTML = `
      <div class="demo">
        <header><span>Demo · 비트코인식 작업증명 미니게임</span><span id="m-stat" aria-live="polite">대기</span></header>
        <p style="font-size:14px;color:var(--fg-muted);margin-bottom:12px">
          블록 데이터 + nonce를 SHA-256 → 결과 해시가 0으로 시작하는 글자(hex)가 N개 이상이면 "발견!".
          난이도 N을 올리면 평균 시도 수가 16배씩 늘어납니다.
        </p>
        <div class="field"><label>블록 데이터</label>
          <input type="text" id="m-data" value="HashLab Block #1" autocomplete="off" spellcheck="false" />
        </div>
        <div class="range">
          <header><span>난이도 (앞 0의 개수)</span><span id="m-diff-val">3</span></header>
          <input type="range" id="m-diff" min="1" max="6" value="3" />
        </div>
        <div class="mining-display" id="m-out">시작 버튼을 누르세요</div>
        <div style="display:flex;gap:8px">
          <button class="btn primary" id="m-start">⛏ 마이닝 시작</button>
          <button class="btn danger" id="m-stop">중단</button>
          <button class="btn" id="m-reset">리셋</button>
        </div>
      </div>
    `;
    const data = this.$('#m-data') as HTMLInputElement;
    const diff = this.$('#m-diff') as HTMLInputElement;
    const diffVal = this.$('#m-diff-val')!;
    const start = this.$('#m-start') as HTMLButtonElement;
    const stop = this.$('#m-stop') as HTMLButtonElement;
    const reset = this.$('#m-reset') as HTMLButtonElement;

    this.on(diff, 'input', () => {
      diffVal.textContent = diff.value;
    });
    this.on(start, 'click', () => this.startMine(data.value, parseInt(diff.value, 10)));
    this.on(stop, 'click', () => {
      this.running = false;
    });
    this.on(reset, 'click', () => {
      this.running = false;
      this.nonce = 0;
      this.attempts = 0;
      this.$('#m-out')!.innerHTML = '시작 버튼을 누르세요';
      this.$('#m-stat')!.textContent = '대기';
    });
  }

  private async startMine(data: string, n: number): Promise<void> {
    if (this.running) return;
    this.running = true;
    this.nonce = 0;
    this.attempts = 0;
    const target = '0'.repeat(n);
    const out = this.$('#m-out')!;
    const stat = this.$('#m-stat')!;
    const tick = async () => {
      const batch = 50;
      for (let i = 0; i < batch; i++) {
        if (!this.running) return;
        const h = await HashEngine.sha256(`${data}|${this.nonce}`);
        this.attempts++;
        if (h.startsWith(target)) {
          this.running = false;
          out.innerHTML = `
            <div>nonce: <strong style="color:var(--accent)">${this.nonce}</strong></div>
            <div style="margin-top:8px"><span class="leading-zero">${target}</span><span>${h.slice(n)}</span></div>
          `;
          stat.textContent = `발견! 시도 ${this.attempts}회`;
          return;
        }
        this.nonce++;
      }
      const h = await HashEngine.sha256(`${data}|${this.nonce}`);
      out.innerHTML = `
        <div>nonce: ${this.nonce}</div>
        <div style="margin-top:8px"><span class="target">${target}</span><span>...</span><span>${h.slice(0, 32)}…</span></div>
      `;
      stat.textContent = `시도 ${this.attempts}회…`;
      if (this.running) requestAnimationFrame(() => void tick());
    };
    await tick();
  }
}
