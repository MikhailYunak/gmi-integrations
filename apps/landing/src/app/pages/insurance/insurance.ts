import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormStepper, StepperStep } from '@gmi-integrations/shared';

const INSURANCE_STEPS: StepperStep[] = [
    { label: 'General Information', route: 'general-information' },
    { label: 'About Your Restaurant', route: 'about-your-restaurant' },
    { label: 'General Liability', route: 'general-liability' },
];

@Component({
    selector: 'gmi-insurance',
    template: `
        <gmi-form-stepper [steps]="steps" [completedSteps]="completedSteps()" />

        <router-outlet />
    `,
    styles: `
        :has {
            padding-left: 16px;
            padding-right: 16px;

            @media (width >= 48rem /* 768px */) {
                padding-left: 48px;
                padding-right: 48px;
            }
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterOutlet, FormStepper]
})
export class Insurance {
    readonly steps = INSURANCE_STEPS;
    readonly completedSteps = signal<string[]>([]);
}
