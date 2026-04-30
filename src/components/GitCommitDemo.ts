import { HashEngine } from '../core/HashEngine.js';
import { BaseComponent } from './BaseComponent.js';

export class GitCommitDemo extends BaseComponent {
  render(): void {
    this.root.innerHTML = `
      <div class="demo">
        <header><span>Demo · Git 커밋 ID 처럼</span></header>
        <p style="font-size:14px;color:var(--fg-muted);margin-bottom:12px">
          Git 커밋은 (이전 커밋 + 트리 + 메시지)의 SHA-1입니다. 코드 한 글자만 바뀌어도 커밋 ID가 완전히 달라져 변조를 즉시 감지합니다.
        </p>
        <div class="row">
          <div class="col">
            <div class="field"><label>코드 v1</label>
              <textarea id="g-a" rows="4">function hello() {\n  return "world";\n}</textarea>
            </div>
            <div class="field"><label>커밋 ID (SHA-1)</label><code class="hash-out" id="g-ha"></code></div>
          </div>
          <div class="col">
            <div class="field"><label>코드 v2 — 1글자 수정</label>
              <textarea id="g-b" rows="4">function hello() {\n  return "World";\n}</textarea>
            </div>
            <div class="field"><label>커밋 ID (SHA-1)</label><code class="hash-out" id="g-hb"></code></div>
          </div>
        </div>
      </div>
    `;
    const a = this.$('#g-a') as HTMLTextAreaElement;
    const b = this.$('#g-b') as HTMLTextAreaElement;
    const update = async () => {
      const [ha, hb] = await Promise.all([HashEngine.sha1(a.value), HashEngine.sha1(b.value)]);
      this.$('#g-ha')!.textContent = ha;
      this.$('#g-hb')!.textContent = hb;
    };
    this.on(a, 'input', () => update());
    this.on(b, 'input', () => update());
    void update();
  }
}
