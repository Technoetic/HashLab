import { HashEngine } from '../core/HashEngine.js';
import { BaseComponent } from './BaseComponent.js';

export class PasswordDemo extends BaseComponent {
  render(): void {
    this.root.innerHTML = `
      <div class="demo">
        <header><span>Demo · 비밀번호는 어떻게 저장될까?</span></header>
        <p style="font-size:14px;color:var(--fg-muted);margin-bottom:12px">
          평문 저장은 사고 시 즉시 모든 사용자가 위험. 단순 SHA-256은 레인보우 테이블에 취약. <strong style="color:var(--accent)">salt + 느린 해시</strong>가 표준입니다.
        </p>
        <div class="field"><label>비밀번호</label>
          <input type="text" id="pw-in" value="myCat123!" autocomplete="off" spellcheck="false" />
        </div>
        <div class="field"><label>① DB가 평문으로 저장 (절대 금지!)</label>
          <code class="hash-out" id="pw-plain"></code>
        </div>
        <div class="field"><label>② SHA-256 (레인보우에 약함)</label>
          <code class="hash-out" id="pw-sha"></code>
        </div>
        <div class="field"><label>③ SHA-256(salt + password) — salt: <code style="color:var(--accent)" id="pw-salt"></code></label>
          <code class="hash-out" id="pw-salted"></code>
        </div>
        <button class="btn" id="pw-resalt">새 salt 생성</button>
      </div>
    `;
    const inp = this.$('#pw-in') as HTMLInputElement;
    const saltLabel = this.$('#pw-salt')!;
    let salt = this.gen();
    saltLabel.textContent = salt;

    const update = async () => {
      const v = inp.value;
      this.$('#pw-plain')!.textContent = v;
      this.$('#pw-sha')!.textContent = await HashEngine.sha256(v);
      this.$('#pw-salted')!.textContent = await HashEngine.sha256(salt + ':' + v);
    };
    this.on(inp, 'input', () => update());
    this.on(this.$('#pw-resalt')!, 'click', () => {
      salt = this.gen();
      saltLabel.textContent = salt;
      void update();
    });
    void update();
  }

  private gen(): string {
    const buf = new Uint8Array(8);
    crypto.getRandomValues(buf);
    return Array.from(buf)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }
}
