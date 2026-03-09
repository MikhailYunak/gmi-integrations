import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Footer } from '@gmi-integrations/shared';
import { UiButtonDirective, UiHeadingDirective } from '@gmi-integrations/ui-kit';
import { InsuranceStorageService } from '../insurance/services/insurance-storage.service';

type BillingCycle = 'monthly' | 'yearly';

type CoterieQuote = {
    monthlyPremium: number;
    annualPremium: number;
};

const HELP_ITEMS = [
    'Obtain Your Certificate Of Insurance',
    'Billing And Payments',
    'Assistance Filing A Claim',
    'Assistance Filing A Claim',
    'Explore FAQs',
] as const;

@Component({
    selector: 'gmi-summary',
    templateUrl: './summary.html',
    styleUrl: './summary.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgOptimizedImage, RouterLink, Footer, UiHeadingDirective, UiButtonDirective, CurrencyPipe],
})
export class Summary {
    private readonly _storage = inject(InsuranceStorageService);

    protected readonly _billingCycle = signal<BillingCycle>('monthly');

    protected readonly _helpItems = HELP_ITEMS;

    private readonly _coterieQuote = computed((): CoterieQuote | null => {
        const raw = this._storage.get()?.coterieResponse;
        return raw ? (raw as CoterieQuote) : null;
    });

    protected readonly _monthlyPremium = computed(() => this._coterieQuote()?.monthlyPremium ?? null);

    protected readonly _annualPremium = computed(() => this._coterieQuote()?.annualPremium ?? null);

    protected readonly _annualSavings = computed(() => {
        const monthly = this._monthlyPremium();
        const annual = this._annualPremium();
        if (monthly === null || annual === null) {return null;}
        return Math.round(monthly * 12 - annual);
    });

    protected readonly _displayPrice = computed(() => {
        if (this._billingCycle() === 'yearly') {
            const annual = this._annualPremium();
            return annual !== null ? annual / 12 : null;
        }
        return this._monthlyPremium();
    });
}
