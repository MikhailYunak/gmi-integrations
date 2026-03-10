import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { filter, map, startWith } from 'rxjs';

export interface StepperStep {
    label: string;
    route: string;
}

interface ComputedStep extends StepperStep {
    isActive: boolean;
    isCompleted: boolean;
    isNavigable: boolean;
}

@Component({
    selector: 'gmi-form-stepper',
    templateUrl: './form-stepper.html',
    styleUrl: './form-stepper.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterLink, NgOptimizedImage]
})
export class FormStepper {
    readonly steps = input.required<StepperStep[]>();

    readonly completedSteps = input<string[]>([]);

    private readonly _router = inject(Router);

    private readonly _activeRoute = toSignal(
        this._router.events.pipe(
            filter((e) => e instanceof NavigationEnd),
            map(() => this._router.url),
            startWith(this._router.url)
        )
    );

    readonly computedSteps = computed<ComputedStep[]>(() => {
        const steps = this.steps();
        const completed = this.completedSteps();
        const url = this._activeRoute() ?? '';

        return steps.map((step, i) => ({
            ...step,
            isActive: url.includes(step.route),
            isCompleted: completed.includes(step.route),
            isNavigable: steps.slice(0, i).every((s) => completed.includes(s.route))
        }));
    });
}
