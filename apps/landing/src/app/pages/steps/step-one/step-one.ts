import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import {
    UiButtonDirective,
    UiCheckboxCard,
    UiDropdown,
    UiHeadingDirective,
    UiInput,
    UiInputHintState,
    UiLinkComponent,
    UiRadioCard,
    UiRadioCardGroup,
    UiTextarea
} from '@gmi-integrations/ui-kit';
import { StepOneFormService } from './step-one-form.service';
import { US_STATES } from '../const/us-states';

@Component({
    selector: 'gmi-step-one',
    templateUrl: './step-one.html',
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
    providers: [StepOneFormService],
    imports: [
        ReactiveFormsModule,
        UiInput,
        UiDropdown,
        UiTextarea,
        UiRadioCard,
        UiRadioCardGroup,
        UiButtonDirective,
        UiHeadingDirective,
        UiCheckboxCard,
        UiLinkComponent
    ]
})
export class StepOne {
    protected readonly svc = inject(StepOneFormService);

    protected readonly states = US_STATES;

    // ── Validation helpers (reads formChange to stay reactive in OnPush) ───────

    protected _hintState(control: AbstractControl): UiInputHintState {
        this.svc.formChange();
        return control.invalid && control.touched ? 'error' : 'default';
    }

    protected _hintMsg(control: AbstractControl): string {
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
        if (control.errors?.['email']) {
            return 'Please enter a valid email address';
        }
        if (control.errors?.['pattern']) {
            if (control === this.svc.form.controls.generalInfo.controls.phone) {
                return 'Enter 10 digits (e.g. 212 555 1234)';
            }
            if (control === this.svc.form.controls.businessInfo.controls.businessStartDate) {
                return 'Use MM/YYYY format (e.g. 01/2020)';
            }
            if (control === this.svc.form.controls.businessInfo.controls.businessZipCode) {
                return 'Enter a 5-digit zip code';
            }
            return 'Invalid format';
        }
        return 'Invalid value';
    }
}
