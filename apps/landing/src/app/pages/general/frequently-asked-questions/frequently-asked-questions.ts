import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { UiAccordion, UiAccordionBody, UiAccordionHeader, UiAccordionItem } from '@gmi-integrations/ui-kit';
import { UiHeadingDirective } from '@gmi-integrations/ui-kit';
import { ApiService } from '../../../services/api.service';

@Component({
    selector: 'gmi-frequently-asked-questions',
    templateUrl: 'frequently-asked-questions.html',
    styles: `
        :host {
            display: flex;
            flex-direction: column;
            row-gap: 32px;
            width: 100%;
            padding-top: 48px;
            padding-bottom: 80px;

            @media (width >= 64rem) {
                flex-direction: row;
                column-gap: 32px;
                justify-content: space-between;
                padding-top: 110px;
                padding-bottom: 110px;
            }

            .frequently-asked-questions-left {
                display: flex;
                flex-direction: column;
                row-gap: 16px;
                text-align: center;

                @media (width >= 64rem /* 768px */) {
                    padding-left: calc(163px - 48px);
                    text-align: left;
                    justify-content: center;
                }
            }
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [UiAccordion, UiAccordionItem, UiAccordionHeader, UiAccordionBody, UiHeadingDirective]
})
export class FrequentlyAskedQuestions {
    private readonly _api = inject(ApiService);

    readonly faqs = toSignal(this._api.getFaqs(), { initialValue: [] });
}
