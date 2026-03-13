import { Injectable, signal } from '@angular/core';
import { QuoteResult } from '../pages/steps/models/steps.models';

@Injectable({ providedIn: 'root' })
export class GlobalState {
    readonly quoteResult = signal<QuoteResult | null>(null);

    set(result: QuoteResult): void {
        this.quoteResult.set(result);
    }

    clear(): void {
        this.quoteResult.set(null);
    }
}
