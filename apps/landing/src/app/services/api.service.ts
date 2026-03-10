import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import type { Observable } from 'rxjs';

import type { Faq, Client, Rating } from '../models';

export type { Faq, Client, Rating };

const API_BASE = 'https://api.allsafe.insure/api';

export type Lang = 'en' | 'es';

@Injectable({ providedIn: 'root' })
export class ApiService {
    private readonly _http = inject(HttpClient);

    getFaqs(lang?: Lang): Observable<Faq[]> {
        return this._http
            .get<Faq[]>(`${API_BASE}/landing/faqs`, { params: lang ? { lang } : {} })
            .pipe(catchError(this._handleError));
    }

    getClients(lang?: Lang): Observable<Client[]> {
        return this._http
            .get<Client[]>(`${API_BASE}/landing/clients`, { params: lang ? { lang } : {} })
            .pipe(catchError(this._handleError));
    }

    getRatings(): Observable<Rating[]> {
        return this._http
            .get<Rating[]>(`${API_BASE}/landing/ratings`)
            .pipe(catchError(this._handleError));
    }

    private _handleError(error: HttpErrorResponse): Observable<never> {
        return throwError(() => error);
    }
}
