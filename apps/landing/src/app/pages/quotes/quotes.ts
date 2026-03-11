import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Footer } from '@gmi-integrations/shared';
import { LocalStorageService } from '../../services/local-storage.service';
import { QuotesSubHeader } from './sub-header/quotes-sub-header';
import {HelpBlock} from "./help-block/help-block.component";

type BillingCycle = 'monthly' | 'yearly';

type CoterieQuote = {
    monthlyPremium: number;
    annualPremium: number;
};

@Component({
    selector: 'gmi-quotes',
    templateUrl: './quotes.html',
    styleUrl: './quotes.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        Footer,
        QuotesSubHeader,
        HelpBlock
    ]
})
export class Quotes {
    private readonly _storage = inject(LocalStorageService);

    protected readonly _billingCycle = signal<BillingCycle>('monthly');

    private readonly _coterieQuote = computed((): CoterieQuote | null => {
        const raw = this._storage.get()?.coterieResponse;
        return raw ? (raw as CoterieQuote) : null;
    });

    protected readonly _monthlyPremium = computed(() => this._coterieQuote()?.monthlyPremium ?? null);

    protected readonly _annualPremium = computed(() => this._coterieQuote()?.annualPremium ?? null);

    protected readonly _annualSavings = computed(() => {
        const monthly = this._monthlyPremium();
        const annual = this._annualPremium();
        if (monthly === null || annual === null) {
            return null;
        }
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
