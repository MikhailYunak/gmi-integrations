import { QuoteApplicationStatus } from '../models/steps.models';

const BASE_STATUS_ROUTE: Omit<Record<QuoteApplicationStatus, string[]>, 'COMPLETED'> = {
    STEP_ONE: ['/steps', 'step-one'],
    STEP_TWO: ['/steps', 'step-two'],
    STEP_THREE: ['/steps', 'step-three'],
    CANCELLED: ['/steps', 'step-one']
};

export const GENERAL_INFORMATION_STATUS_ROUTE: Record<QuoteApplicationStatus, string[]> = {
    ...BASE_STATUS_ROUTE,
    COMPLETED: ['/steps', 'step-one']
};

export const GENERAL_LIABILITY_STATUS_ROUTE: Record<QuoteApplicationStatus, string[]> = {
    ...BASE_STATUS_ROUTE,
    COMPLETED: ['/quotes']
};
