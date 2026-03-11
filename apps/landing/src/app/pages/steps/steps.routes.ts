import { Routes } from '@angular/router';
import { Type } from '@angular/core';

export const INSURANCE_ROUTES: Routes = [
    {
        path: 'step-one',
        loadComponent: (): Promise<Type<unknown>> =>
            import('./step-one/step-one').then((c) => c.StepOne)
    },
    {
        path: 'step-two',
        loadComponent: (): Promise<Type<unknown>> =>
            import('./step-two/step-two').then((c) => c.StepTwo)
    },
    {
        path: 'step-three',
        loadComponent: (): Promise<Type<unknown>> =>
            import('./step-three/step-three').then((c) => c.StepThree)
    },
    {
        path: '',
        redirectTo: 'step-one',
        pathMatch: 'full'
    }
];
