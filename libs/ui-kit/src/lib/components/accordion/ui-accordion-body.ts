import { Component, computed, input } from '@angular/core';

@Component({
    selector: 'ui-accordion-body, [uiAccordionBody]',
    template: `
        <div
            class="ui-accordion-expanded-content"
            role="region"
            [attr.aria-labelledby]="ariaLabelledby()"
            [attr.id]="id()"
        >
            <div class="ui-accordion-expanded-content-body">
                <ng-content />
            </div>
        </div>
    `,
    exportAs: 'uiAccordionBody',
    host: {
        class: 'ui-accordion-expanded-wrapper'
    }
})
export class UiAccordionBody {
    readonly index = input.required<number>();

    readonly id = computed<string>(() => `ui-accordion-body-${this.index()}`);

    readonly ariaLabelledby = computed<string>(() => `ui-accordion-header-${this.index()}`);
}
