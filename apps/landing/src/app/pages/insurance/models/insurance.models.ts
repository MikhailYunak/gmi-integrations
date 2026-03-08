// ── Step 1 DTO ────────────────────────────────────────────────────────────────

export type PreviousClaimDto = {
    claimAmount: number;
    claimDescription: string;
}

export type StepOneDto = {
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
    previousClaims?: PreviousClaimDto[];
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

// ── API error shapes ──────────────────────────────────────────────────────────

export type ConflictErrorBody = {
    activeQuoteUuid: string;
    message: string;
}
