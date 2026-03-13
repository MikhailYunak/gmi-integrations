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
            padding-inline: calc(var(--spacing) * 16) /* 16px */;
            padding-top: 48px;
            padding-bottom: 80px;
            max-width: calc(var(--spacing) * 1440);
            scroll-margin-top: calc(var(--spacing) * 70) /* 70px */;
            overflow: hidden;
            background-image: url(/img/radial-violet.svg), url(/img/circle-violet.svg), url(/img/circles-yellow.svg);
            background-repeat: no-repeat;
            background-position:
                -10px 174px,
                -18px 164px,
                top 500px right -24px;

            @media (width >= 64rem /* 1024px */) {
                flex-direction: row;
                column-gap: 32px;
                justify-content: space-between;
                padding-inline: calc(var(--spacing) * 48) /* 48px */;
                padding-top: 110px;
                padding-bottom: 110px;
                scroll-margin-top: calc(var(--spacing) * 90) /* 90px */;
                background-position:
                    124px 148px,
                    102px 142px,
                    top 440px left 516px;
            }

            .frequently-asked-questions-left {
                display: flex;
                flex-direction: column;
                row-gap: 16px;
                text-align: center;

                @media (width >= 64rem /* 1024px */) {
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
