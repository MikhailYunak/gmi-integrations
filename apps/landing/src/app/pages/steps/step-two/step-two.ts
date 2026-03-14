import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import {
    UiButtonDirective,
    UiDropdown,
    UiHeadingDirective,
    UiInput,
    UiInputHintState,
    UiRadioCard,
    UiRadioCardGroup, UiTooltipDirective,
} from '@gmi-integrations/ui-kit';
import { StepTwoFormService } from './step-two-form.service';
import { US_STATES } from '../const/us-states';

@Component({
    selector: 'gmi-step-two',
    templateUrl: './step-two.html',
    styles: `
        :host {
            display: flex;
            flex-direction: column;
            align-items: center;
            row-gap: 24px;
            max-width: 664px;
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [StepTwoFormService],
    imports: [
        ReactiveFormsModule,
        UiInput,
        UiDropdown,
        UiRadioCard,
        UiRadioCardGroup,
        UiButtonDirective,
        UiHeadingDirective,
        UiTooltipDirective
    ]
})
export class StepTwo {
    protected readonly svc = inject(StepTwoFormService);

    protected readonly states = US_STATES;

    protected hintState(control: AbstractControl): UiInputHintState {
        this.svc.formChange();
        return control.invalid && control.touched ? 'error' : 'default';
    }

    protected hintMsg(control: AbstractControl): string {
        this.svc.formChange();
        if (!control.invalid || !control.touched) {
            return '';
        }
        if (control.errors?.['serverError']) {
            return control.errors['serverError'];
        }
        if (control.errors?.['required']) {
            return 'This field is required';
        }
        if (control.errors?.['pattern']) {
            const zip = this.svc.form.controls.primaryLocation.controls.zip;
            const mailingZip = this.svc.form.controls.mailingAddress.controls.zip;
            if (control === zip || control === mailingZip) {
                return 'Enter a 5-digit zip code';
            }
            return 'Enter a valid number (e.g. 500,000)';
        }
        return 'Invalid value';
    }
}
