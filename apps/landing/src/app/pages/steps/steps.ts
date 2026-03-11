import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormStepper, StepperStep } from '@gmi-integrations/shared';
import { LocalStorageService } from '../../services/local-storage.service';
import { STATUS_TO_COMPLETED } from './const/insurance-steps-status';

const INSURANCE_STEPS: StepperStep[] = [
    { label: 'General Information', route: 'step-one' },
    { label: 'About Your Restaurant', route: 'step-two' },
    { label: 'General Liability', route: 'step-three' }
];

@Component({
    selector: 'gmi-insurance',
    template: `
        <gmi-form-stepper [steps]="steps" [completedSteps]="completedSteps()" />

        <router-outlet />
    `,
    styles: `
        :host {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-top: -82px;
            padding-left: 16px;
            padding-right: 16px;

            @media (width >= 64rem /* 768px */) {
                padding-left: 48px;
                padding-right: 48px;
            }
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterOutlet, FormStepper]
})
export class Steps {
    private readonly _storage = inject(LocalStorageService);

    readonly steps = INSURANCE_STEPS;
    readonly completedSteps = signal<string[]>(this._storage.getCompletedSteps(STATUS_TO_COMPLETED));
}
