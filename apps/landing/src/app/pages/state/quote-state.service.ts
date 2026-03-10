import { Injectable, signal } from '@angular/core';
import { QuoteResult } from '../insurance/models/insurance.models';

@Injectable({ providedIn: 'root' })
export class QuoteStateService {
    readonly quoteResult = signal<QuoteResult | null>(null);

    set(result: QuoteResult): void {
        this.quoteResult.set(result);
    }

    clear(): void {
        this.quoteResult.set(null);
    }
}
