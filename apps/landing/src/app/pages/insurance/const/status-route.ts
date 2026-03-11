import { QuoteApplicationStatus } from '../models/insurance.models';

const BASE_STATUS_ROUTE: Omit<Record<QuoteApplicationStatus, string[]>, 'COMPLETED'> = {
    STEP_ONE: ['/insurance', 'general-information'],
    STEP_TWO: ['/insurance', 'about-your-restaurant'],
    STEP_THREE: ['/insurance', 'general-liability'],
    CANCELLED: ['/insurance', 'general-information']
};

export const GENERAL_INFORMATION_STATUS_ROUTE: Record<QuoteApplicationStatus, string[]> = {
    ...BASE_STATUS_ROUTE,
    COMPLETED: ['/insurance', 'general-information']
};

export const GENERAL_LIABILITY_STATUS_ROUTE: Record<QuoteApplicationStatus, string[]> = {
    ...BASE_STATUS_ROUTE,
    COMPLETED: ['/summary']
};
