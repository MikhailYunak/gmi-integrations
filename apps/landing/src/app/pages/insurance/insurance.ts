import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormStepper, StepperStep } from '@gmi-integrations/shared';

const INSURANCE_STEPS: StepperStep[] = [
    { label: 'General Information', route: 'general-information' },
    { label: 'About Your Restaurant', route: 'about-your-restaurant' },
    { label: 'General Liability', route: 'general-liability' },
];

const STATUS_TO_COMPLETED: Record<string, string[]> = {
    step1_completed: ['general-information'],
    step2_completed: ['general-information', 'about-your-restaurant'],
    step3_completed: ['general-information', 'about-your-restaurant', 'general-liability']
};

function readCompletedSteps(): string[] {
    try {
        const raw = localStorage.getItem('quoteApplication');
        if (!raw) return [];
        const parsed = JSON.parse(raw) as { status?: string };
        return STATUS_TO_COMPLETED[parsed.status ?? ''] ?? [];
    } catch {
        return [];
    }
}

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
export class Insurance {
    readonly steps = INSURANCE_STEPS;

    readonly completedSteps = signal<string[]>(readCompletedSteps());
}
