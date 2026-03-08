# UiCheckbox

Single checkbox with a custom visual, label, and tooltip. Implements `ControlValueAccessor` — works with Reactive Forms as a `boolean` control.

## Import

```typescript
import { UiCheckbox } from '@gmi-integrations/ui-kit';

@Component({
  imports: [UiCheckbox, ReactiveFormsModule],
})
```

---

## Basic usage

```html
<ui-checkbox label="I agree to the terms and conditions" [formControl]="agreeControl" />
```

---

## Inputs

| Input      | Type      | Default | Description                                          |
|------------|-----------|---------|------------------------------------------------------|
| `label`    | `string`  | `''`    | Label text shown next to the checkbox                |
| `required` | `boolean` | `false` | Shows `*` after the label                            |
| `tooltip`  | `string`  | `''`    | Shows `?` icon next to the label; value is the title |

---

## Visual states

| State        | Condition                           | Visual                                        |
|--------------|-------------------------------------|-----------------------------------------------|
| `default`    | unchecked                           | white rounded square, gray border             |
| `hover`      | mouse over (unchecked)              | green border                                  |
| `focused`    | keyboard focus                      | green border + outer glow                     |
| `checked`    | value is `true`                     | dark green filled square + white checkmark    |
| `disabled`   | `[disabled]="true"` or form control | everything at 40% opacity, no interaction     |

---

## Examples

### Simple agreement checkbox

```html
<ui-checkbox
  label="I confirm this information is accurate"
  [required]="true"
  [formControl]="confirmedControl"
/>
```

### With tooltip

```html
<ui-checkbox
  label="Opt in to marketing emails"
  tooltip="We send a maximum of 2 emails per month with updates and offers"
  [formControl]="marketingControl"
/>
```

### Disabled

```html
<ui-checkbox
  label="Auto-renew subscription"
  [disabled]="true"
  hint="Manage this in billing settings"
/>
```

### Multiple independent checkboxes

```html
<ui-checkbox label="General Liability"      [formControl]="form.controls.gl" />
<ui-checkbox label="Commercial Property"    [formControl]="form.controls.property" />
<ui-checkbox label="Workers Compensation"   [formControl]="form.controls.workers" />
```

---

## With Reactive Forms

### Required agreement

```typescript
@Component({
  imports: [UiCheckbox, ReactiveFormsModule],
  template: `
    <ui-checkbox
      label="I agree to the Terms of Service and Privacy Policy"
      [required]="true"
      [formControl]="termsControl"
    />

    @if (termsControl.invalid && termsControl.touched) {
      <p role="alert" style="color: #ef4444; font-size: 12px;">
        You must accept the terms to continue
      </p>
    }

    <button uiButton [disabled]="termsControl.invalid">Create account</button>
  `,
})
export class TermsStepComponent {
  readonly termsControl = new FormControl(false, Validators.requiredTrue);
}
```

### Inside a FormGroup

```typescript
@Component({
  imports: [UiCheckbox, UiInput, UiDropdown, ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()">
      <ui-input
        label="Business name"
        placeholder="Acme LLC"
        [required]="true"
        formControlName="businessName"
      />

      <ui-dropdown
        label="State"
        [required]="true"
        placeholder="Select state"
        [options]="stateOptions"
        formControlName="state"
      />

      <!-- Consent checkboxes -->
      <ui-checkbox
        label="I confirm the information above is accurate"
        [required]="true"
        formControlName="confirmedAccuracy"
      />

      <ui-checkbox
        label="I agree to the Terms of Service"
        [required]="true"
        formControlName="agreedToTerms"
      />

      <ui-checkbox
        label="Subscribe to product updates (optional)"
        formControlName="marketingOptIn"
      />

      <button uiButton type="submit" [disabled]="form.invalid">Submit application</button>
    </form>
  `,
})
export class ApplicationFormComponent {
  readonly stateOptions = [
    { label: 'California', value: 'CA' },
    { label: 'Texas', value: 'TX' },
    { label: 'New York', value: 'NY' },
  ];

  readonly form = new FormGroup({
    businessName: new FormControl('', Validators.required),
    state: new FormControl<string | null>(null, Validators.required),
    confirmedAccuracy: new FormControl(false, Validators.requiredTrue),
    agreedToTerms: new FormControl(false, Validators.requiredTrue),
    marketingOptIn: new FormControl(false),
  });

  submit() {
    if (this.form.valid) console.log(this.form.value);
  }
}
```

### Checkbox group with array value (manual approach)

```typescript
@Component({
  imports: [UiCheckbox, ReactiveFormsModule],
  template: `
    <fieldset>
      <legend>Services you offer</legend>

      @for (service of services; track service.value) {
        <ui-checkbox
          [label]="service.label"
          [checked]="isSelected(service.value)"
          (change)="toggleService(service.value)"
        />
      }
    </fieldset>
  `,
})
export class ServicesCheckboxGroupComponent {
  readonly services = [
    { label: 'Dine-in',   value: 'dine_in' },
    { label: 'Takeaway',  value: 'takeaway' },
    { label: 'Delivery',  value: 'delivery' },
    { label: 'Catering',  value: 'catering' },
  ];

  readonly selected = signal<string[]>([]);

  isSelected(value: string): boolean {
    return this.selected().includes(value);
  }

  toggleService(value: string): void {
    this.selected.update((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  }
}
```

---

## Accessibility

- Uses a visually hidden native `<input type="checkbox">` for full browser/AT support
- Custom visual is `aria-hidden="true"` — all semantics come from the native input
- Label wraps the input so the entire row is clickable
- `aria-required` is set when `required="true"`
- Focus ring is visible on keyboard navigation (`:focus-visible` only)
- Disabled state is conveyed via native `disabled` attribute and visual opacity
- For grouped checkboxes, wrap in `<fieldset>` + `<legend>` for proper AT labelling
