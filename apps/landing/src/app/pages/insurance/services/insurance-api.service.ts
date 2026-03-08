import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import type { Observable } from 'rxjs';
import {
    ConflictErrorBody,
    QuoteApplication,
    StepOneDto,
} from '../models/insurance.models';

const API_BASE = 'https://quote.allsafe.insure/api';

@Injectable({ providedIn: 'root' })
export class InsuranceApiService {
    private readonly _http = inject(HttpClient);

    createApplication(stepOne: StepOneDto): Observable<QuoteApplication> {
        return this._http
            .post<QuoteApplication>(`${API_BASE}/quote-applications`, stepOne)
            .pipe(catchError(this._handleError));
    }

    getApplication(uuid: string): Observable<QuoteApplication> {
        return this._http
            .get<QuoteApplication>(`${API_BASE}/quote-applications/${uuid}`)
            .pipe(catchError(this._handleError));
    }

    updateStepOne(uuid: string, stepOne: StepOneDto): Observable<QuoteApplication> {
        return this._http
            .put<QuoteApplication>(`${API_BASE}/quote-applications/${uuid}/step-one`, stepOne)
            .pipe(catchError(this._handleError));
    }

    cancelApplication(uuid: string): Observable<void> {
        return this._http
            .post<void>(`${API_BASE}/quote-applications/${uuid}/cancel`, null)
            .pipe(catchError(this._handleError));
    }

    private _handleError(error: HttpErrorResponse): Observable<never> {
        return throwError(() => error);
    }
}

export function isConflictError(
    error: HttpErrorResponse,
): error is HttpErrorResponse & { error: ConflictErrorBody } {
    return error.status === 409 && !!error.error?.activeQuoteUuid;
}
