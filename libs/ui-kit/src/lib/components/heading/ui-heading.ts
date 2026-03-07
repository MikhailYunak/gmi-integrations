import { Directive, input } from '@angular/core';

/**
 * Heading Directive
 *
 * Usage:
 * <h1 uiHeading>H1 DM Sans Medium</h1>
 * <h2 uiHeading variant="italic">H2 Playfair Display Italic</h2>
 */
@Directive({
  selector: '[uiHeading]',
  host: {
    '[attr.data-variant]': 'variant()',
  },
})
export class UiHeadingDirective {
  /**
   * Heading variant
   * 'normal'  — DM Sans Medium/Regular
   * 'italic'  — Playfair Display Italic
   */
  readonly variant = input<'normal' | 'italic'>('normal');
}
