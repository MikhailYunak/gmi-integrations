import { Component, input, ViewEncapsulation } from '@angular/core';
import { UiCdkAccordion } from '../../cdk';

@Component({
    selector: 'ui-accordion, [uiAccordion]',
    template: `<ng-content />`,
    exportAs: 'uiAccordion',
    host: {
        class: 'ui-accordion',
        '[class.ui-accordion-expansion-animations-enabled]': 'this.enableAnimations()',
    },
    styleUrl: `./ui-accordion.scss`,
    encapsulation: ViewEncapsulation.None,
    hostDirectives: [
        {
            directive: UiCdkAccordion,
            inputs: ['multi'],
        },
    ],
})
export class UiAccordion {
    readonly enableAnimations = input<boolean>(true);
}
