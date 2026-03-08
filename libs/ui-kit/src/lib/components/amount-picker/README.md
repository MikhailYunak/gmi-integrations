# UiAmountPicker

Horizontal pill-selector for choosing a numeric amount from preset options, with an optional free-text custom amount pill. Implements `ControlValueAccessor` — the value is `number | null`.

## Import

```typescript
import { UiAmountPicker } from '@gmi-integrations/ui-kit';

@Component({
  imports: [UiAmountPicker, ReactiveFormsModule],
})
```

---

## Basic usage

```html
<!-- Preset amounts only -->
<ui-amount-picker [formControl]="limitControl" />

<!-- Custom presets -->
<ui-amount-picker
  [options]="[500000, 1000000, 2000000, 5000000]"
  [formControl]="limitControl"
/>

<!-- With custom free-text pill -->
<ui-amount-picker [allowCustom]="true" [formControl]="limitControl" />
```

---

## Inputs

| Input         | Type       | Default                    | Description                                              |
|---------------|------------|----------------------------|----------------------------------------------------------|
| `options`     | `number[]` | `[500, 1000, 2500, 5000]`  | Preset amounts shown as selectable pills                 |
| `currency`    | `string`   | `'$'`                      | Symbol shown inside the circle icon on each pill         |
| `allowCustom` | `boolean`  | `false`                    | Adds an editable pill at the start for a custom amount   |

---

## Visual states

| State              | Condition                           | Visual                                         |
|--------------------|-------------------------------------|------------------------------------------------|
| `default`          | unselected preset                   | transparent bg, gray border, gray text         |
| `hover`            | mouse over unselected pill          | green border, dark text                        |
| `focused`          | keyboard focus on pill              | green border + outer glow                      |
| `selected`         | pill value matches form control     | dark forest gradient bg, white text            |
| `custom — idle`    | custom pill, no value               | same as default                                |
| `custom — focused` | typing in custom pill               | green border + outer glow                      |
| `custom — filled`  | custom value set, not focused       | forest gradient bg (same as selected preset)   |

---

## Examples

### Coverage limit picker

```html
<ui-amount-picker
  [options]="[500000, 1000000, 2000000, 5000000]"
  [formControl]="coverageLimitControl"
/>
```

```typescript
readonly coverageLimitControl = new FormControl<number | null>(null, Validators.required);
```

### With custom amount option

```html
<ui-amount-picker
  [options]="[500, 1000, 2500, 5000]"
  [allowCustom]="true"
  [formControl]="deductibleControl"
/>
```

### Non-USD currency

```html
<ui-amount-picker
  currency="€"
  [options]="[250, 500, 1000, 2500]"
  [formControl]="premiumControl"
/>
```

---

## With Reactive Forms

### Single control with validation

```typescript
@Component({
  imports: [UiAmountPicker, ReactiveFormsModule],
  template: `
    <label class="form-label">
      General Liability limit *
    </label>

    <ui-amount-picker
      [options]="limits"
      [allowCustom]="true"
      [formControl]="limitControl"
    />

    @if (limitControl.invalid && limitControl.touched) {
      <p role="alert" style="color: #ef4444; font-size: 12px; margin-top: 6px;">
        Please select or enter a coverage limit
      </p>
    }
  `,
})
export class CoverageLimitComponent {
  readonly limits = [500000, 1000000, 2000000, 5000000];
  readonly limitControl = new FormControl<number | null>(null, Validators.required);
}
```

### Inside a FormGroup (insurance step)

```typescript
@Component({
  imports: [UiAmountPicker, UiInput, UiDropdown, ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()">
      <div class="form-section">
        <p class="form-section-label">Select your General Liability limit *</p>
        <ui-amount-picker
          [options]="glLimits"
          formControlName="glLimit"
        />
      </div>

      <div class="form-section">
        <p class="form-section-label">Select your deductible</p>
        <ui-amount-picker
          [options]="deductibles"
          [allowCustom]="true"
          formControlName="deductible"
        />
      </div>

      <button uiButton type="submit" [disabled]="form.invalid">Continue</button>
    </form>
  `,
})
export class GeneralLiabilityStepComponent {
  readonly glLimits = [500000, 1000000, 2000000, 5000000];
  readonly deductibles = [500, 1000, 2500, 5000];

  readonly form = new FormGroup({
    glLimit: new FormControl<number | null>(null, Validators.required),
    deductible: new FormControl<number | null>(1000),
  });

  submit() {
    if (this.form.valid) console.log(this.form.value);
  }
}
```

### Pre-selecting a value

```typescript
// Pre-select $1,000
readonly limitControl = new FormControl<number | null>(1000);
```

---

## Custom amount behavior

When `allowCustom="true"`:
- A free-text pill is prepended before the presets
- Typing a number makes it the active value; preset pills deselect
- Clicking a preset pill selects it and clears the custom input
- The CVA value is always a `number | null` regardless of whether a preset or custom value is active

## Accessibility

- Wrapper has `role="group"` with an implicit label
- Each preset pill is a `<button type="button">` with `aria-pressed` reflecting selected state
- The custom pill contains a native `<input type="text" inputmode="decimal">` with `aria-label`
- All interactive elements support keyboard navigation and show `:focus-visible` rings
