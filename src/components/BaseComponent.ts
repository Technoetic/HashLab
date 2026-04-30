export abstract class BaseComponent {
  protected root: HTMLElement;
  protected disposers: Array<() => void> = [];

  constructor(root: HTMLElement) {
    this.root = root;
  }

  abstract render(): void;

  destroy(): void {
    this.disposers.forEach((d) => d());
    this.disposers = [];
    this.root.innerHTML = '';
  }

  protected on<K extends keyof HTMLElementEventMap>(
    el: HTMLElement | Document | Window,
    type: K | string,
    handler: (e: Event) => void,
  ): void {
    el.addEventListener(type, handler as EventListener);
    this.disposers.push(() => el.removeEventListener(type, handler as EventListener));
  }

  protected $(selector: string): HTMLElement | null {
    return this.root.querySelector(selector);
  }

  protected debounce<F extends (...a: unknown[]) => void>(fn: F, ms: number): F {
    let t: ReturnType<typeof setTimeout> | undefined;
    return ((...a: unknown[]) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...a), ms);
    }) as F;
  }
}
