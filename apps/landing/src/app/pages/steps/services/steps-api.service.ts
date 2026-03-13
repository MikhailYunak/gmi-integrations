import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import type { Observable } from 'rxjs';
import {
    ConflictErrorBody,
    QuoteApplicationFull,
    QuoteResult,
    StepOneModel,
    StepThreeModel,
    StepTwoModel
} from '../models/steps.models';

const API_BASE = 'https://quote.allsafe.insure/api';

@Injectable({ providedIn: 'root' })
export class StepsApiService {
    private readonly _http = inject(HttpClient);

    createApplication(stepOne: StepOneModel): Observable<QuoteApplicationFull> {
        return this._http
            .post<QuoteApplicationFull>(`${API_BASE}/quote-applications`, stepOne)
            .pipe(catchError(this._handleError));
    }

    getApplication(uuid: string): Observable<QuoteApplicationFull> {
        return this._http
            .get<QuoteApplicationFull>(`${API_BASE}/quote-applications/${uuid}`)
            .pipe(catchError(this._handleError));
    }

    updateStepOne(uuid: string, stepOne: StepOneModel): Observable<QuoteApplicationFull> {
        return this._http
            .put<QuoteApplicationFull>(`${API_BASE}/quote-applications/${uuid}/step-one`, stepOne)
            .pipe(catchError(this._handleError));
    }

    updateStepTwo(uuid: string, stepTwo: StepTwoModel): Observable<QuoteApplicationFull> {
        return this._http
            .put<QuoteApplicationFull>(`${API_BASE}/quote-applications/${uuid}/step-two`, stepTwo)
            .pipe(catchError(this._handleError));
    }

    updateStepThree(uuid: string, stepThree: StepThreeModel): Observable<QuoteApplicationFull> {
        return this._http
            .put<QuoteApplicationFull>(`${API_BASE}/quote-applications/${uuid}/step-three`, stepThree)
            .pipe(catchError(this._handleError));
    }

    cancelApplication(uuid: string): Observable<void> {
        return this._http
            .post<void>(`${API_BASE}/quote-applications/${uuid}/cancel`, null)
            .pipe(catchError(this._handleError));
    }

    submitApplication(uuid: string): Observable<QuoteResult> {
        return this._http
            .post<QuoteResult>(`${API_BASE}/quote-applications/${uuid}/submit`, null)
            .pipe(catchError(this._handleError));
    }

    private _handleError(error: HttpErrorResponse): Observable<never> {
        return throwError(() => error);
    }
}

export function isConflictError(error: HttpErrorResponse): error is HttpErrorResponse & { error: ConflictErrorBody } {
    return error.status === 409 && !!error.error?.activeQuoteUuid;
}
