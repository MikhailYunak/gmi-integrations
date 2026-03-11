import { Injectable } from '@angular/core';
import { QuoteApplicationFull, StepOneModel, StepThreeModel, StepTwoModel } from '../models/insurance.models';

const STORAGE_KEY = 'quoteApplication';

@Injectable({ providedIn: 'root' })
export class InsuranceStorageService {

    save(application: QuoteApplicationFull): void {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(application));
        } catch { /* storage unavailable */ }
    }

    get(): QuoteApplicationFull | null {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? (JSON.parse(raw) as QuoteApplicationFull) : null;
        } catch {
            return null;
        }
    }

    getUuid(): string | null {
        return this.get()?.uuid ?? null;
    }

    getStep1Data(): StepOneModel | null {
        return this.get()?.step1Data ?? null;
    }

    getStep2Data(): StepTwoModel | null {
        return this.get()?.step2Data ?? null;
    }

    getStep3Data(): StepThreeModel | null {
        return this.get()?.step3Data ?? null;
    }

    getCompletedSteps(statusMap: Record<string, string[]>): string[] {
        const status = this.get()?.status;
        return statusMap[status ?? ''] ?? [];
    }

    clear(): void {
        localStorage.removeItem(STORAGE_KEY);
    }
}
