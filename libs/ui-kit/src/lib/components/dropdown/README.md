# UiDropdown

Dropdown select component with label, hint, and all visual states. Implements `ControlValueAccessor` — works with Reactive Forms out of the box.

## Import

```typescript
import { UiDropdown, UiDropdownOption } from '@gmi-integrations/ui-kit';

@Component({
  imports: [UiDropdown, ReactiveFormsModule],
})
```

---

## Basic usage

```html
<!-- Standalone (no form) -->
<ui-dropdown
  label="Insurance type"
  placeholder="Select an option"
  [options]="options"
/>

<!-- Reactive Forms -->
<ui-dropdown
  label="Insurance type"
  [options]="options"
  [formControl]="typeControl"
/>
```

```typescript
options: UiDropdownOption[] = [
  { label: 'General Liability', value: 'general' },
  { label: 'Commercial Property', value: 'property' },
  { label: 'Workers Compensation', value: 'workers' },
];
```

---

## Inputs

| Input         | Type                                              | Default           | Description                          |
|---------------|---------------------------------------------------|-------------------|--------------------------------------|
| `label`       | `string`                                          | `''`              | Label text above the dropdown        |
| `required`    | `boolean`                                         | `false`           | Shows `*` after the label            |
| `tooltip`     | `string`                                          | `''`              | Shows `?` icon; value is the title   |
| `placeholder` | `string`                                          | `'Виберіть...'`   | Text shown when no value is selected |
| `options`     | `UiDropdownOption[]`                              | `[]`              | List of available options            |
| `hint`        | `string`                                          | `''`              | Helper text below the dropdown       |
| `hintState`   | `'default' \| 'success' \| 'warning' \| 'error'` | `'default'`       | Controls hint icon and color         |

### `UiDropdownOption` interface

```typescript
interface UiDropdownOption {
  label: string;           // displayed text
  value: string | number;  // stored value
}
```

---

## Visual states

| State      | Trigger                               | Visual                                       |
|------------|---------------------------------------|----------------------------------------------|
| `default`  | initial                               | gray border                                  |
| `hover`    | mouse over                            | green border                                 |
| `focused`  | keyboard focus on trigger             | green border + outer glow                    |
| `opened`   | dropdown panel is open                | green border + glow + rotated arrow          |
| `filled`   | a value is selected                   | dark border                                  |
| `success`  | `hintState="success"`                 | green hint text + `check_circle` icon        |
| `warning`  | `hintState="warning"`                 | orange hint text + `warning` icon            |
| `error`    | `hintState="error"`                   | red border + red hint text + `warning` icon  |
| `disabled` | `[disabled]="true"` or form control   | gray background, no interaction              |

---

## Examples

### With tooltip

```html
<ui-dropdown
  label="Coverage type"
  tooltip="Select the primary type of coverage for your business"
  placeholder="Choose coverage"
  [options]="coverageOptions"
/>
```

### Required field with error state

```html
<ui-dropdown
  label="State"
  [required]="true"
  placeholder="Select state"
  [options]="stateOptions"
  hint="This field is required"
  hintState="error"
/>
```

### Disabled

```html
<ui-dropdown
  label="Plan tier"
  placeholder="Not available"
  [options]="tierOptions"
  [disabled]="true"
  hint="Contact support to change your plan"
/>
```

---

## With Reactive Forms

### Single control

```typescript
@Component({
  imports: [UiDropdown, ReactiveFormsModule],
  template: `
    <ui-dropdown
      label="Business type"
      placeholder="Select your business type"
      [required]="true"
      [options]="businessTypes"
      [hint]="businessTypeHint()"
      [hintState]="businessTypeState()"
      [formControl]="businessTypeControl"
    />
  `,
})
export class BusinessFormComponent {
  readonly businessTypes: UiDropdownOption[] = [
    { label: 'Restaurant', value: 'restaurant' },
    { label: 'Retail', value: 'retail' },
    { label: 'Healthcare', value: 'healthcare' },
    { label: 'Technology', value: 'technology' },
  ];

  readonly businessTypeControl = new FormControl<string | null>(null, Validators.required);

  readonly businessTypeHint = computed(() =>
    this.businessTypeControl.invalid && this.businessTypeControl.touched
      ? 'Please select a business type'
      : 'Choose the category that best describes your business'
  );

  readonly businessTypeState = computed((): UiDropdownHintState =>
    this.businessTypeControl.invalid && this.businessTypeControl.touched ? 'error' : 'default'
  );
}
```

### Inside a FormGroup

```typescript
@Component({
  imports: [UiDropdown, UiInput, ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()">
      <ui-dropdown
        label="State"
        [required]="true"
        placeholder="Select state"
        [options]="stateOptions"
        [hint]="fieldHint('state')"
        [hintState]="fieldState('state')"
        formControlName="state"
      />

      <ui-dropdown
        label="Coverage amount"
        [required]="true"
        placeholder="Select amount"
        [options]="coverageOptions"
        [hint]="fieldHint('coverage')"
        [hintState]="fieldState('coverage')"
        formControlName="coverage"
      />

      <button uiButton type="submit" [disabled]="form.invalid">Continue</button>
    </form>
  `,
})
export class InsuranceStepComponent {
  readonly stateOptions: UiDropdownOption[] = [
    { label: 'California', value: 'CA' },
    { label: 'Texas', value: 'TX' },
    { label: 'New York', value: 'NY' },
    { label: 'Florida', value: 'FL' },
  ];

  readonly coverageOptions: UiDropdownOption[] = [
    { label: '$500,000', value: 500000 },
    { label: '$1,000,000', value: 1000000 },
    { label: '$2,000,000', value: 2000000 },
  ];

  readonly form = new FormGroup({
    state: new FormControl<string | null>(null, Validators.required),
    coverage: new FormControl<number | null>(null, Validators.required),
  });

  fieldHint(name: 'state' | 'coverage'): string {
    const ctrl = this.form.controls[name];
    if (ctrl.invalid && ctrl.touched) return 'This field is required';
    return 'Hint';
  }

  fieldState(name: 'state' | 'coverage'): UiDropdownHintState {
    const ctrl = this.form.controls[name];
    return ctrl.invalid && ctrl.touched ? 'error' : 'default';
  }

  submit() {
    if (this.form.valid) {
      console.log(this.form.value);
    }
  }
}
```

### With success confirmation

```typescript
@Component({
  imports: [UiDropdown, ReactiveFormsModule],
  template: `
    <ui-dropdown
      label="Preferred contact method"
      [options]="contactOptions"
      [hint]="hint()"
      [hintState]="state()"
      [formControl]="contactControl"
    />
  `,
})
export class ContactPreferenceComponent {
  readonly contactOptions: UiDropdownOption[] = [
    { label: 'Email', value: 'email' },
    { label: 'Phone call', value: 'phone' },
    { label: 'Text message', value: 'sms' },
  ];

  readonly contactControl = new FormControl<string | null>(null);

  readonly hint = computed(() =>
    this.contactControl.value ? 'Preference saved' : 'Choose how we should reach you'
  );

  readonly state = computed((): UiDropdownHintState =>
    this.contactControl.value ? 'success' : 'default'
  );
}
```

---

## Combining UiInput and UiDropdown

A typical insurance form step:

```typescript
@Component({
  imports: [UiInput, UiDropdown, ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()">
      <ui-input
        label="Business name"
        placeholder="Acme LLC"
        [required]="true"
        [hint]="hint('businessName')"
        [hintState]="state('businessName')"
        formControlName="businessName"
      />

      <ui-dropdown
        label="Business type"
        [required]="true"
        placeholder="Select type"
        [options]="businessTypes"
        [hint]="hint('businessType')"
        [hintState]="state('businessType')"
        formControlName="businessType"
      />

      <ui-input
        label="Annual revenue"
        type="number"
        [required]="true"
        [hint]="hint('revenue')"
        [hintState]="state('revenue')"
        formControlName="revenue"
      >
        <span uiInputPrefix>$</span>
        <span uiInputSuffix>USD</span>
      </ui-input>

      <ui-input
        label="Number of employees"
        type="stepper"
        [min]="1"
        [max]="10000"
        formControlName="employees"
      />

      <button uiButton type="submit" [disabled]="form.invalid">
        Next step
      </button>
    </form>
  `,
})
export class GeneralInfoStepComponent {
  readonly businessTypes: UiDropdownOption[] = [
    { label: 'Restaurant', value: 'restaurant' },
    { label: 'Retail', value: 'retail' },
    { label: 'Healthcare', value: 'healthcare' },
  ];

  readonly form = new FormGroup({
    businessName: new FormControl('', Validators.required),
    businessType: new FormControl<string | null>(null, Validators.required),
    revenue: new FormControl<number | null>(null, Validators.required),
    employees: new FormControl(1),
  });

  hint(name: keyof typeof this.form.controls): string {
    const ctrl = this.form.controls[name];
    return ctrl.invalid && ctrl.touched ? 'This field is required' : '';
  }

  state(name: keyof typeof this.form.controls): UiDropdownHintState {
    const ctrl = this.form.controls[name];
    return ctrl.invalid && ctrl.touched ? 'error' : 'default';
  }

  submit() {
    if (this.form.valid) {
      console.log(this.form.value);
    }
  }
}
```

---

## Accessibility

- Trigger button has `aria-expanded` (reflects open/closed state)
- Trigger button has `aria-haspopup="listbox"`
- Panel has `role="listbox"`; each option has `role="option"` and `aria-selected`
- `aria-labelledby` links the trigger and panel to the label
- `aria-required` is set when `required="true"`
- `aria-invalid` is set when `hintState="error"`
- `aria-describedby` links the trigger to hint text
- Error hint has `role="alert"` for screen reader announcements
- Clicking outside the component closes the panel automatically
