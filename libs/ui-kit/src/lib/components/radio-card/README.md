# UiRadioCard

Card-style radio button for selecting an option from a visual list. Contains a radio indicator, bold title, description text, and an optional "Learn More" link. Implements `ControlValueAccessor`.

## Import

```typescript
import { UiRadioCard } from '@gmi-integrations/ui-kit';

@Component({
  imports: [UiRadioCard, ReactiveFormsModule],
})
```

---

## Basic usage

```html
<ui-radio-card
  title="Business Owner's Policy"
  description="Typically used for service-based professions, and may cover you if a client sues due to a business mistake."
  learnMoreUrl="/coverage/bop"
  [value]="'bop'"
  name="coverageType"
  [formControl]="coverageControl"
/>
```

---

## Inputs

| Input            | Type      | Default        | Description                                               |
|------------------|-----------|----------------|-----------------------------------------------------------|
| `value`          | `unknown` | `null`         | The value this card represents in the radio group         |
| `title`          | `string`  | `''`           | Bold heading text                                         |
| `description`    | `string`  | `''`           | Body text below the title                                 |
| `learnMoreUrl`   | `string`  | `''`           | If provided, renders a "Learn More" link at the bottom    |
| `learnMoreLabel` | `string`  | `'Learn More'` | Link text (override for localisation)                     |
| `name`           | `string`  | `''`           | Native `name` attribute — should be the same for all cards in a group |
| `required`       | `boolean` | `false`        | Sets `aria-required` on the native input                  |

---

## Visual states

| State      | Condition                  | Visual                                                      |
|------------|----------------------------|-------------------------------------------------------------|
| `default`  | not selected               | white card, gray border, dark title, gray description       |
| `hover`    | mouse over (not selected)  | green border                                                |
| `focused`  | keyboard focus             | green border + outer glow (via `:has(:focus-visible)`)      |
| `active`   | selected                   | green border, green title, filled radio indicator           |
| `disabled` | `[disabled]="true"`        | 50% opacity, no interaction                                 |

---

## With Reactive Forms

### Group of coverage cards

```typescript
@Component({
  imports: [UiRadioCard, ReactiveFormsModule],
  template: `
    <fieldset class="coverage-grid">
      <legend class="sr-only">Select a coverage type *</legend>

      @for (option of coverageOptions; track option.value) {
        <ui-radio-card
          [title]="option.title"
          [description]="option.description"
          [learnMoreUrl]="option.url"
          [value]="option.value"
          name="coverageType"
          [formControl]="coverageControl"
        />
      }
    </fieldset>

    @if (coverageControl.invalid && coverageControl.touched) {
      <p role="alert" style="color: #ef4444; font-size: 12px; margin-top: 8px;">
        Please select a coverage type
      </p>
    }
  `,
  styles: `
    .coverage-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 16px;
      border: none;
      padding: 0;
      margin: 0;
    }
  `,
})
export class CoverageSelectionComponent {
  readonly coverageOptions = [
    {
      value: 'bop',
      title: "Business Owner's Policy",
      description: "Typically used for service-based professions, and may cover you if a client sues due to a business mistake.",
      url: '/coverage/bop',
    },
    {
      value: 'gl',
      title: 'General Liability',
      description: 'Covers bodily injury, property damage, and personal injury claims made by third parties.',
      url: '/coverage/gl',
    },
    {
      value: 'workers',
      title: "Workers' Compensation",
      description: 'Provides benefits to employees who suffer work-related injuries or illnesses.',
      url: '/coverage/workers',
    },
  ];

  readonly coverageControl = new FormControl<string | null>(null, Validators.required);
}
```

### Inside a FormGroup (insurance form step)

```typescript
@Component({
  imports: [UiRadioCard, UiInput, ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()">
      <fieldset class="coverage-grid">
        <legend>Primary coverage type *</legend>

        @for (opt of options; track opt.value) {
          <ui-radio-card
            [title]="opt.title"
            [description]="opt.description"
            [learnMoreUrl]="opt.url"
            [value]="opt.value"
            name="primaryCoverage"
            formControlName="primaryCoverage"
          />
        }
      </fieldset>

      <button uiButton type="submit" [disabled]="form.invalid">Next step</button>
    </form>
  `,
})
export class GeneralLiabilityStepComponent {
  readonly options = [
    {
      value: 'bop',
      title: "Business Owner's Policy",
      description: "Typically used for service-based professions.",
      url: '/learn/bop',
    },
    {
      value: 'gl',
      title: 'General Liability',
      description: 'Covers bodily injury and property damage claims.',
      url: '/learn/gl',
    },
  ];

  readonly form = new FormGroup({
    primaryCoverage: new FormControl<string | null>(null, Validators.required),
  });

  submit() {
    if (this.form.valid) console.log(this.form.value);
  }
}
```

### Without "Learn More" link

```html
<ui-radio-card
  title="Monthly billing"
  description="Billed every 30 days. Cancel anytime."
  [value]="'monthly'"
  name="billing"
  [formControl]="billingControl"
/>

<ui-radio-card
  title="Annual billing"
  description="Pay once a year and save 20% compared to monthly."
  [value]="'annual'"
  name="billing"
  [formControl]="billingControl"
/>
```

---

## Note on "Learn More" link

Clicking the "Learn More" link **does not** select the card — it only navigates. This is native HTML behaviour: interactive elements inside a `<label>` do not activate the label's control. For Angular Router navigation, pass the path as `learnMoreUrl` and handle it via a regular `<a>` tag, or replace the link with a `(click)` output if programmatic navigation is needed.

---

## Accessibility

- Uses a visually-hidden native `<input type="radio">` for full browser/AT support
- Custom visual elements are `aria-hidden="true"` — semantics come from the native input
- The entire card area (excluding the link) is the click target via `<label>`
- Focus ring shown via `:has(:focus-visible)` — keyboard-only, no mouse ring
- `aria-required` set when `required="true"`
- Wrap cards in `<fieldset>` + `<legend>` to give the group a proper accessible name
- The "Learn More" link has its own `:focus-visible` outline
