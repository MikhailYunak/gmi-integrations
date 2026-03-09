import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import {
    UiAmountPicker,
    UiButtonDirective,
    UiCheckboxCard,
    UiHeadingDirective,
    UiInput,
    UiInputHintState,
    UiRadioCard,
    UiRadioCardGroup
} from '@gmi-integrations/ui-kit';
import { GeneralLiabilityFormService } from './general-liability-form.service';

@Component({
    selector: 'gmi-general-liability',
    templateUrl: './general-liability.html',
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
    providers: [GeneralLiabilityFormService],
    imports: [
        ReactiveFormsModule,
        UiAmountPicker,
        UiInput,
        UiCheckboxCard,
        UiRadioCard,
        UiRadioCardGroup,
        UiButtonDirective,
        UiHeadingDirective
    ]
})
export class GeneralLiability {
    protected readonly svc = inject(GeneralLiabilityFormService);

    protected readonly glLimitOptions = [300000, 500000, 1000000, 2000000];

    protected hintState(control: AbstractControl): UiInputHintState {
        this.svc.formChange();
        return control.invalid && control.touched ? 'error' : 'default';
    }

    protected hintMsg(control: AbstractControl): string {
        this.svc.formChange();
        if (!control.invalid || !control.touched) {
            return '';
        }
        if (control.errors?.['required']) {
            return 'This field is required';
        }
        if (control.errors?.['pattern']) {
            return 'Enter a valid number (e.g. 50000)';
        }
        return 'Invalid value';
    }
}
