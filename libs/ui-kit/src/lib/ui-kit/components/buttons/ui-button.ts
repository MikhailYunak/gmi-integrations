import { Directive, effect, ElementRef, inject, input, Renderer2 } from '@angular/core';

/**
 * Button Directive
 *
 * Usage:
 * <button uiButton>Primary Button</button>
 * <button uiButton="outline">Outline Button</button>
 * <button uiButton size="lg">Large Button</button>
 * <button uiButton [loading]="true">Loading Button</button>
 */
@Directive({
  selector: '[uiButton]',
  host: {
    '[attr.data-variant]': 'variant()',
    '[attr.data-size]': 'size()',
    '[attr.data-loading]': 'loading()',
    '[attr.data-block]': 'block()',
    '[attr.data-rounded]': 'rounded()',
    '[attr.data-icon]': 'icon()',
    '[class.loading]': 'loading()',
  },
})
export class UiButtonDirective {
  private readonly _elementRef = inject(ElementRef);

  private readonly _renderer = inject(Renderer2);

  private _loaderElement: HTMLElement | null = null;

  /**
   * Button variant
   * Possible values: 'primary' | 'outline' | 'ghost' | 'text'
   */
  readonly variant = input('primary', { alias: 'uiButton' });

  /**
   * Button size
   * Possible values: 'sm' | 'md' | 'lg'
   */
  readonly size = input<'sm' | 'md' | 'lg'>('md');

  /**
   * Loading state
   */
  readonly loading = input(false, { transform: (value: boolean | string) => value === true || value === 'true' });

  /**
   * Full width button
   */
  readonly block = input(false, { transform: (value: boolean | string) => value === true || value === 'true' });

  /**
   * Rounded button
   */
  readonly rounded = input(false, { transform: (value: boolean | string) => value === true || value === 'true' });

  /**
   * Icon button (square)
   */
  readonly icon = input(false, { transform: (value: boolean | string) => value === true || value === 'true' });

  constructor() {
    effect(() => {
      if (this.loading()) {
        this._createLoader();
      } else {
        this._removeLoader();
      }
    });
  }

  private _createLoader(): void {
    if (this._loaderElement) {
        return;
    }

    const loader = this._renderer.createElement('div');
    this._renderer.addClass(loader, 'ui-loader');

    for (let i = 0; i < 5; i++) {
      const span = this._renderer.createElement('span');
      this._renderer.appendChild(loader, span);
    }

    this._renderer.appendChild(this._elementRef.nativeElement, loader);
    this._loaderElement = loader;
  }

  private _removeLoader(): void {
    if (this._loaderElement) {
      this._renderer.removeChild(this._elementRef.nativeElement, this._loaderElement);
      this._loaderElement = null;
    }
  }
}
