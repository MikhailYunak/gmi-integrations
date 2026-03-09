// ── Step 1 DTO ────────────────────────────────────────────────────────────────

export type PreviousClaimModel = {
    claimAmount: number;
    claimDescription: string;
}

export type StepOneModel = {
    generalInfo: {
        fullName: string;
        email: string;
        phone: string; // E.164, e.g. "+12125551234"
    };
    businessInfo: {
        legalBusinessName: string;
        dba?: string;
        businessState: string;
        businessStartDate: string; // ISO "YYYY-MM-DD"
        numEmployees: number;
        businessZipCode: string;
    };
    hasPreviousClaims: boolean;
    previousClaims?: PreviousClaimModel[];
}

// ── Step 2 DTO ────────────────────────────────────────────────────────────────

export type AddressModel = {
    street: string;
    city: string;
    state: string;
    zip: string;
}

export type StepTwoModel = {
    financials: {
        annualEarnings: number;
        annualPayroll: number;
    };
    primaryLocation: AddressModel;
    isMailingSameAsPrimary: boolean;
    mailingAddress: AddressModel;
}

// ── Quote application ─────────────────────────────────────────────────────────

export type QuoteApplicationStatus =
    | 'STEP_ONE'
    | 'STEP_TWO'
    | 'STEP_THREE'
    | 'COMPLETED'
    | 'CANCELLED';

export type QuoteApplication = {
    uuid: string;
    status: QuoteApplicationStatus;
}

export type QuoteApplicationFull = {
    id: number;
    uuid: string;
    status: string;
    step1Data: StepOneModel | null;
    step2Data: StepTwoModel | null;
    step3Data: unknown | null;
    coterieResponse: unknown | null;
    coterieApplicationId: string | null;
    integrationId: string | null;
    userId: number;
    createdAt: string;
    updatedAt: string;
}

// ── API error shapes ──────────────────────────────────────────────────────────

export type ConflictErrorBody = {
    activeQuoteUuid: string;
    message: string;
}
