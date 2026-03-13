import { Routes } from '@angular/router';
import { Type } from '@angular/core';
import { NotFoundPage } from '@gmi-integrations/shared';

export const LANDING_ROUTES: Routes = [
    {
        path: '',
        loadComponent: (): Promise<Type<unknown>> => import('./pages/general/general').then((c) => c.General),
        title: 'Safe.Insure'
    },
    {
        path: 'steps',
        loadComponent: (): Promise<Type<unknown>> => import('./pages/steps/steps').then((c) => c.Steps),
        loadChildren: () => import('./pages/steps/steps.routes').then((r) => r.INSURANCE_ROUTES)
    },
    {
        path: 'quotes',
        loadComponent: (): Promise<Type<unknown>> => import('./pages/quotes/quotes').then((c) => c.Quotes)
    },
    {
        path: '',
        redirectTo: 'general',
        pathMatch: 'full'
    },
    { path: '**', component: NotFoundPage }
];
