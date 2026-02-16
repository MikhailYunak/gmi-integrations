import { Directive, inject } from '@angular/core';
import { CdkAccordionItem } from '@angular/cdk/accordion';

@Directive({
    selector: 'ui-cdk-accordion-item, [uiCdkAccordionItem]',
    exportAs: 'uiCdkAccordionItem',
    hostDirectives: [CdkAccordionItem],
})
export class UiCdkAccordionItem {
    protected readonly _cdkAccordionItem = inject(CdkAccordionItem);

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
