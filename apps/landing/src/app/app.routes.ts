import { Routes } from '@angular/router';
import { Type } from '@angular/core';
import { NotFoundPage } from '@gmi-integrations/shared';

export const LANDING_ROUTES: Routes = [
    {
        path: 'general',
        loadComponent: (): Promise<Type<unknown>> => import('./pages/general/general').then((c) => c.General)
    },
    {
        path: 'insurance',
        loadComponent: (): Promise<Type<unknown>> => import('./pages/insurance/insurance').then((c) => c.Insurance),
        loadChildren: () => import('./pages/insurance/insurance.routes').then((r) => r.INSURANCE_ROUTES)
    },
    {
        path: '',
        redirectTo: 'general',
        pathMatch: 'full'
    },
    { path: '**', component: NotFoundPage }
];
