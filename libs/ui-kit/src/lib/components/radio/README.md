# UiRadio

Single radio button item with a custom visual, label, and tooltip. Implements `ControlValueAccessor`. Use multiple `ui-radio` items with the same `formControlName` to build a radio group.

## Import

```typescript
import { UiRadio } from '@gmi-integrations/ui-kit';

@Component({
  imports: [UiRadio, ReactiveFormsModule],
})
```

---

## Basic usage

```html
<ui-radio label="Monthly" [value]="'monthly'" [formControl]="planControl" />
<ui-radio label="Annual"  [value]="'annual'"  [formControl]="planControl" />
```

---

## Inputs

| Input      | Type      | Default | Description                                               |
|------------|-----------|---------|-----------------------------------------------------------|
| `label`    | `string`  | `''`    | Label text shown next to the radio                        |
| `value`    | `unknown` | `null`  | The value this radio option represents                    |
| `required` | `boolean` | `false` | Shows `*` after the label                                 |
| `tooltip`  | `string`  | `''`    | Shows `?` icon next to the label; value is the title      |
| `name`     | `string`  | `''`    | Native `name` attribute; needed for keyboard group behaviour |

---

## Visual states

| State      | Condition                            | Visual                                   |
|------------|--------------------------------------|------------------------------------------|
| `default`  | not selected                         | white circle, gray border                |
| `hover`    | mouse over (not selected)            | green border on circle                   |
| `focused`  | keyboard focus                       | green border + outer glow                |
| `selected` | value matches form control           | dark green filled circle + white dot     |
| `disabled` | `[disabled]="true"` or form control  | everything at 40% opacity, no interaction|

---

## Examples

### Simple yes/no

```html
<ui-radio label="Yes" [value]="true"  [formControl]="agreesControl" />
<ui-radio label="No"  [value]="false" [formControl]="agreesControl" />
```

### With required and tooltip

```html
<ui-radio
  label="Restaurant"
  [value]="'restaurant'"
  [required]="true"
  tooltip="Select if your business primarily serves food on-site"
  [formControl]="businessTypeControl"
/>
```

### Disabled option

```html
<ui-radio label="Enterprise (contact sales)" [value]="'enterprise'" [disabled]="true" />
```

---

## With Reactive Forms

### Radio group via FormControl

```typescript
@Component({
  imports: [UiRadio, ReactiveFormsModule],
  template: `
    <fieldset>
      <legend>Billing period</legend>

      <ui-radio label="Monthly"  [value]="'monthly'" [formControl]="billingControl" />
      <ui-radio label="Quarterly" [value]="'quarterly'" [formControl]="billingControl" />
      <ui-radio label="Annual"   [value]="'annual'"   [formControl]="billingControl" />
    </fieldset>

    <p>Selected: {{ billingControl.value }}</p>
  `,
})
export class BillingPeriodComponent {
  readonly billingControl = new FormControl<string | null>(null, Validators.required);
}
```

### Radio group inside a FormGroup

```typescript
@Component({
  imports: [UiRadio, ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()">
      <fieldset>
        <legend>Business type <span aria-hidden="true">*</span></legend>

        @for (type of businessTypes; track type.value) {
          <ui-radio
            [label]="type.label"
            [value]="type.value"
            formControlName="businessType"
          />
        }

        @if (form.controls.businessType.invalid && form.controls.businessType.touched) {
          <p role="alert" style="color: #ef4444; font-size: 12px;">
            Please select a business type
          </p>
        }
      </fieldset>

      <button uiButton type="submit" [disabled]="form.invalid">Continue</button>
    </form>
  `,
})
export class BusinessTypeStepComponent {
  readonly businessTypes = [
    { label: 'Restaurant',    value: 'restaurant' },
    { label: 'Retail',        value: 'retail' },
    { label: 'Healthcare',    value: 'healthcare' },
    { label: 'Technology',    value: 'technology' },
  ];

  readonly form = new FormGroup({
    businessType: new FormControl<string | null>(null, Validators.required),
  });

  submit() {
    if (this.form.valid) console.log(this.form.value);
  }
}
```

### Combining radios, checkboxes, and inputs

```typescript
@Component({
  imports: [UiRadio, UiCheckbox, UiInput, ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()">
      <!-- Radio group -->
      <fieldset>
        <legend>Coverage type *</legend>
        <ui-radio label="General Liability" [value]="'general'"  formControlName="coverageType" />
        <ui-radio label="Property"          [value]="'property'" formControlName="coverageType" />
        <ui-radio label="Workers Comp"      [value]="'workers'"  formControlName="coverageType" />
      </fieldset>

      <!-- Checkbox -->
      <ui-checkbox label="I confirm the information above is accurate" formControlName="confirmed" />

      <button uiButton type="submit" [disabled]="form.invalid">Submit application</button>
    </form>
  `,
})
export class InsuranceApplicationComponent {
  readonly form = new FormGroup({
    coverageType: new FormControl<string | null>(null, Validators.required),
    confirmed: new FormControl(false, Validators.requiredTrue),
  });

  submit() {
    if (this.form.valid) console.log(this.form.value);
  }
}
```

---

## Accessibility

- Uses a visually hidden native `<input type="radio">` for full browser/AT support
- Custom visual is `aria-hidden="true"` — all semantics come from the native input
- Label wraps the input so click area covers the entire row
- `aria-required` is set when `required="true"`
- Focus ring is visible on keyboard navigation (`:focus-visible` only)
- Disabled state is conveyed via native `disabled` attribute and visual opacity
- Wrap multiple `ui-radio` items in a `<fieldset>` + `<legend>` for proper group labelling
