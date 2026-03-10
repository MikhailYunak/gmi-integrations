import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import type { Observable } from 'rxjs';

export interface ContactRequestBody {
    fullName: string;
    phone: string;
    email: string;
    question: string;
}

export interface ValidationErrorBody {
    status: number;
    errors: Record<string, string>;
}

export function isValidationError(error: unknown): error is HttpErrorResponse & { error: ValidationErrorBody } {
    return error instanceof HttpErrorResponse && error.status === 422 && !!error.error?.errors;
}

const API_BASE = 'https://api.allsafe.insure/api';

@Injectable({ providedIn: 'root' })
export class ContactAgentDialogService {
    private readonly _http = inject(HttpClient);

    createContactRequest(body: ContactRequestBody): Observable<void> {
        return this._http
            .post<void>(`${API_BASE}/contact-requests`, body)
            .pipe(catchError(this._handleError));
    }

    private _handleError(error: HttpErrorResponse): Observable<never> {
        return throwError(() => error);
    }
}
