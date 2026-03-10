import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import {CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {CustomTooltipComponent, UiAmountPicker, UiButtonDirective } from "@gmi-integrations/ui-kit";

export type BillingCycle = 'monthly' | 'yearly';

@Component({
    selector: 'gmi-pricing-card',
    templateUrl: './pricing-card.html',
    styles: `
        :host {
            position: relative;
            display: flex;
            flex-direction: column;
            row-gap: 1px;
            width: 320px;
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgOptimizedImage, FormsModule, UiAmountPicker, UiButtonDirective, CustomTooltipComponent, CurrencyPipe]
})
export class PricingCard {
    readonly logoSrc = input.required<string>();

    readonly logoAlt = input.required<string>();

    readonly badge = input<string>();

    readonly monthlyPrice = input.required<number>();

    readonly totalMonthlyPrice = input.required<number>();

    readonly yearlyPrice = input.required<number>();

    readonly totalYearlyPrice = input.required<number>();

    readonly savingsMessage = input<string>();

    readonly currency = input<string>('USD');

    readonly ctaLabel = input<string>();

    readonly ctaClick = output<BillingCycle>();

    protected readonly _cycleOptions = ['Monthly', 'Yearly'];

    protected readonly _billingCycle = signal<BillingCycle>('monthly');

    protected readonly _currentPrice = computed(() =>
        this._billingCycle() === 'monthly' ? this.monthlyPrice().toFixed(2) : this.yearlyPrice().toFixed(2)
    );
}
