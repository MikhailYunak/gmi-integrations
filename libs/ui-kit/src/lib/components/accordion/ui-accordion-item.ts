import { Component, inject } from '@angular/core';
import { UiCdkAccordionItem } from '../../cdk';

@Component({
    selector: 'ui-accordion-item, [uiAccordionItem]',
    template: `<ng-content />`,
    exportAs: 'uiAccordionItem',
    host: {
        class: 'ui-accordion-item',
        '[class.ui-accordion-expanded]': 'this.expanded',
    },
    hostDirectives: [UiCdkAccordionItem],
})
export class UiAccordionItem {
    protected readonly _cdkAccordionItem = inject(UiCdkAccordionItem);

    get expanded(): boolean {
        return this._cdkAccordionItem.expanded;
    }

    toggle(): void {
        this._cdkAccordionItem.toggle();
    }

    close(): void {
        this._cdkAccordionItem.close();
    }

    open(): void {
        this._cdkAccordionItem.open();
    }
}
