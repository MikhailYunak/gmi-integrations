import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { UiHeadingDirective } from '@gmi-integrations/ui-kit';
import { RouterLink } from '@angular/router';
import { PricingCard, BillingCycle } from '@gmi-integrations/shared';
import { QuoteStateService } from '../../state/quote-state.service';
import {WINDOW} from "@gmi-integrations/cdk";

@Component({
    selector: 'gmi-summary-sub-header',
    template: `
        @let pricing = _pricing();
        <section class="flex flex-col gap-y-28">
            <h1 uiHeading class="text-white pr-40 lg:pr-0 capitalize">
                <span uiHeading variant="italic">Business Insurance</span>
                Quote
            </h1>
            <p class="text-lime-400 lg:text-2xl lg:max-w-2/4">
                Based On Your Request, We Have Found The Most Popular Insurance Policies For You.
            </p>
        </section>

        <section class="mx-auto">
            <div class="flex flex-col items-center gap-y-34 max-w-654">
                @if (pricing) {
                    <gmi-pricing-card
                        logoSrc="/img/coterie-logo.png"
                        logoAlt="Coterie"
                        [monthlyPrice]="pricing!.monthlyPremium"
                        [totalMonthlyPrice]="pricing!.month1Owed"
                        [yearlyPrice]="pricing!.yearlyPremium"
                        [totalYearlyPrice]="pricing!.yearlyTotalOwed"
                        [savingsMessage]="_savingsMessage()"
                        (ctaClick)="_onPay($event)"
                    />
                }
                <p class="text-white text-sm lg:text-lg">
                    This quotes are customized using the information you provided, public, and third-party data. You can
                    <a [routerLink]="['/steps']" class="underline hover:italic hover:font-(--font-primary)">
                        review your application
                    </a>
                    and make edits if needed.
                </p>
            </div>
        </section>
    `,
    styles: `
        :host {
            display: flex;
            flex-direction: column;
            row-gap: 48px;
            margin-top: 120px;
            padding-bottom: 102px;

            @media (width >= 64rem) {
                margin-top: 164px;
                padding-bottom: 116px;
                row-gap: 80px;
            }
        }
    `,
    host: {
        class: 'sub-summary-sub-header'
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [UiHeadingDirective, RouterLink, PricingCard]
})
export class SummarySubHeader {
    private readonly _quoteState = inject(QuoteStateService);

    private readonly _window = inject(WINDOW).window;

    protected readonly _pricing = computed(() => this._quoteState.quoteResult()?.pricing ?? null);

    protected readonly _savingsMessage = computed(() => {
        const savings = this._pricing()?.savingsPayingInFull;
        return savings != null ? `Save $${savings.toFixed(0)} in fees by paying in full` : undefined;
    });

    protected _onPay(_event: BillingCycle): void {
        const { applicationUrl } = this._quoteState.quoteResult() ?? {};
        this._window.open(applicationUrl, '_blank');
    }
}
