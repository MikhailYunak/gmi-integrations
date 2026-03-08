import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UiAccordion, UiAccordionBody, UiAccordionHeader, UiAccordionItem } from '@gmi-integrations/ui-kit';
import { UiHeadingDirective } from '@gmi-integrations/ui-kit';

type FaqItem = {
    question: string;
    answer: string;
};

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

            @media (min-width: 768px) {
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

                @media (width >= 48rem /* 768px */) {
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
    readonly faqs: FaqItem[] = [
        {
            question: 'DO I NEED SMALL BUSINESS INSURANCE?',
            answer: "Very likely you do need small business insurance to secure your investment in your business. Even if you're a home-based business or new business, you likely have assets you want to protect. By speaking with an agent or broker, they can help you better understand if you need insurance coverage, and what specific type of policy (or policies) would be best for you."
        },
        {
            question: 'KEY TAKEAWAYS ABOUT BUSINESS LIABILITY INSURANCE?',
            answer: 'Business liability insurance protects your company from claims that result from normal business operations. It covers legal costs and any resulting judgments or settlements. Without this coverage, you could face significant financial losses.'
        },
        {
            question: 'WHAT DOES BUSINESS INSURANCE NOT COVER?',
            answer: "Standard business insurance typically does not cover intentional acts, employee injuries (covered by workers' compensation), professional mistakes (covered by professional liability insurance), or damage from floods and earthquakes (which require separate policies)."
        },
        {
            question: 'WHAT HAPPENS IF I EXPERIENCE A LOSS?',
            answer: 'If you experience a covered loss, you should contact your insurance provider as soon as possible to file a claim. Document the damage with photos and keep records of all related expenses. An adjuster will be assigned to evaluate the claim and determine the payout.'
        },
        {
            question: 'DO YOU REQUIRE A DEPOSIT FOR PROJECTS?',
            answer: 'Deposit requirements vary depending on the type and scope of the project. Generally, a deposit may be required to initiate coverage for larger or more complex insurance projects. Contact our team to discuss the specific requirements for your situation.'
        }
    ];
}
