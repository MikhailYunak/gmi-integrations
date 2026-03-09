import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import {
    UiButtonDirective,
    UiCheckboxCard,
    UiDropdown,
    UiDropdownOption,
    UiHeadingDirective,
    UiInput,
    UiInputHintState,
    UiLinkComponent,
    UiRadioCard,
    UiRadioCardGroup,
    UiTextarea
} from '@gmi-integrations/ui-kit';
import { GeneralInformationFormService } from './general-information-form.service';

// ── US States list ─────────────────────────────────────────────────────────────
const US_STATES: UiDropdownOption[] = [
    { label: 'Alabama', value: 'AL' },
    { label: 'Alaska', value: 'AK' },
    { label: 'Arizona', value: 'AZ' },
    { label: 'Arkansas', value: 'AR' },
    { label: 'California', value: 'CA' },
    { label: 'Colorado', value: 'CO' },
    { label: 'Connecticut', value: 'CT' },
    { label: 'Delaware', value: 'DE' },
    { label: 'Florida', value: 'FL' },
    { label: 'Georgia', value: 'GA' },
    { label: 'Hawaii', value: 'HI' },
    { label: 'Idaho', value: 'ID' },
    { label: 'Illinois', value: 'IL' },
    { label: 'Indiana', value: 'IN' },
    { label: 'Iowa', value: 'IA' },
    { label: 'Kansas', value: 'KS' },
    { label: 'Kentucky', value: 'KY' },
    { label: 'Louisiana', value: 'LA' },
    { label: 'Maine', value: 'ME' },
    { label: 'Maryland', value: 'MD' },
    { label: 'Massachusetts', value: 'MA' },
    { label: 'Michigan', value: 'MI' },
    { label: 'Minnesota', value: 'MN' },
    { label: 'Mississippi', value: 'MS' },
    { label: 'Missouri', value: 'MO' },
    { label: 'Montana', value: 'MT' },
    { label: 'Nebraska', value: 'NE' },
    { label: 'Nevada', value: 'NV' },
    { label: 'New Hampshire', value: 'NH' },
    { label: 'New Jersey', value: 'NJ' },
    { label: 'New Mexico', value: 'NM' },
    { label: 'New York', value: 'NY' },
    { label: 'North Carolina', value: 'NC' },
    { label: 'North Dakota', value: 'ND' },
    { label: 'Ohio', value: 'OH' },
    { label: 'Oklahoma', value: 'OK' },
    { label: 'Oregon', value: 'OR' },
    { label: 'Pennsylvania', value: 'PA' },
    { label: 'Rhode Island', value: 'RI' },
    { label: 'South Carolina', value: 'SC' },
    { label: 'South Dakota', value: 'SD' },
    { label: 'Tennessee', value: 'TN' },
    { label: 'Texas', value: 'TX' },
    { label: 'Utah', value: 'UT' },
    { label: 'Vermont', value: 'VT' },
    { label: 'Virginia', value: 'VA' },
    { label: 'Washington', value: 'WA' },
    { label: 'West Virginia', value: 'WV' },
    { label: 'Wisconsin', value: 'WI' },
    { label: 'Wyoming', value: 'WY' }
];

@Component({
    selector: 'gmi-general-information',
    templateUrl: './general-information.html',
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
    providers: [GeneralInformationFormService],
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
export class GeneralInformation {
    protected readonly svc = inject(GeneralInformationFormService);

    protected readonly states = US_STATES;

    // ── Validation helpers (reads formChange to stay reactive in OnPush) ───────

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
        if (control.errors?.['email']) {
            return 'Please enter a valid email address';
        }
        if (control.errors?.['pattern']) {
            if (control === this.svc.form.controls.generalInfo.controls.phone) {
                return 'Enter 10 digits, no spaces (e.g. 2125551234)';
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
