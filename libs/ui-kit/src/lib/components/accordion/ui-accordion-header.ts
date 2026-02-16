import { Component, computed, input } from '@angular/core';

@Component({
    selector: 'ui-accordion-header, [uiAccordionHeader]',
    template: `
        <ng-content />
    `,
    exportAs: 'uiAccordionHeader',
    host: {
        class: 'ui-accordion-header',
        'attr.role': 'button',
        '[attr.id]': 'this.id()',
        '[attr.aria-expanded]': 'this.expanded()',
        '[attr.aria-controls]': 'this.ariaControls()'
    }
})
export class UiAccordionHeader {
    readonly expanded = input.required<boolean>();

    readonly index = input.required<number>();

    readonly id = computed<string>(() => `ui-accordion-header-${this.index()}`);

    readonly ariaControls = computed<string>(() => `ui-accordion-body-${this.index()}`);
}
