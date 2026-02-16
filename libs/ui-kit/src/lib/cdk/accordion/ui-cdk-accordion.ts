import { Directive, effect, inject, input } from '@angular/core';
import { CdkAccordion } from '@angular/cdk/accordion';

@Directive({
    selector: 'ui-cdk-accordion, [uiCdkAccordion]',
    exportAs: 'uiCdkAccordion',
    hostDirectives: [CdkAccordion],
})
export class UiCdkAccordion {
    protected readonly _cdkAccordion = inject(CdkAccordion);

    readonly multi = input<boolean>();

    constructor() {
        effect(() => {
            this._cdkAccordion.multi = this.multi() ?? false;
        });
    }
}

