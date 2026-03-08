import { Routes } from '@angular/router';
import { Type } from '@angular/core';

export const INSURANCE_ROUTES: Routes = [
    {
        path: 'general-information',
        loadComponent: (): Promise<Type<unknown>> =>
            import('./general-information/general-information').then((c) => c.GeneralInformation)
    },
    {
        path: 'about-your-restaurant',
        loadComponent: (): Promise<Type<unknown>> =>
            import('./about-your-restaurant/about-your-restaurant').then((c) => c.AboutYourRestaurant)
    },
    {
        path: 'general-liability',
        loadComponent: (): Promise<Type<unknown>> =>
            import('./general-liability/general-liability').then((c) => c.GeneralLiability)
    },
    {
        path: '',
        redirectTo: 'general-information',
        pathMatch: 'full'
    }
];
