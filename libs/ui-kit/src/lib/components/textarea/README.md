# UiTextarea

Multi-line text area with label, hint, and character counter. Implements `ControlValueAccessor`.

## Import

```typescript
import { UiTextarea } from '@gmi-integrations/ui-kit';

@Component({
  imports: [UiTextarea, ReactiveFormsModule],
})
```

---

## Basic usage

```html
<ui-textarea
  label="Description"
  placeholder="Write something…"
  [maxLength]="180"
  hint="Hint"
/>
```

---

## Inputs

| Input         | Type                                              | Default     | Description                                         |
|---------------|---------------------------------------------------|-------------|-----------------------------------------------------|
| `label`       | `string`                                          | `''`        | Label text above the textarea                       |
| `required`    | `boolean`                                         | `false`     | Shows `*` after the label                           |
| `tooltip`     | `string`                                          | `''`        | Shows `?` icon; value is the title                  |
| `placeholder` | `string`                                          | `''`        | Placeholder text                                    |
| `rows`        | `number`                                          | `4`         | Initial visible row count                           |
| `maxLength`   | `number \| null`                                  | `null`      | Max characters; shows counter and auto-errors when exceeded |
| `hint`        | `string`                                          | `''`        | Helper text below the textarea                      |
| `hintState`   | `'default' \| 'success' \| 'warning' \| 'error'` | `'default'` | Controls hint icon and color                        |

---

## Visual states

| State            | Trigger                               | Visual                                              |
|------------------|---------------------------------------|-----------------------------------------------------|
| `default`        | initial                               | gray border                                         |
| `hover`          | mouse over                            | green border                                        |
| `focused`        | click / keyboard inside               | green border + outer glow                           |
| `typing`         | user is typing (same as focused)      | green border + glow + counter increments            |
| `filled`         | value is not empty                    | dark border                                         |
| `error`          | `hintState="error"` or over max       | red border + red hint with `warning` icon           |
| `over max-length`| `charCount > maxLength`               | auto-sets error, counter turns red, error hint text |
| `disabled`       | `[disabled]="true"` or form control   | gray background, no interaction                     |

When `maxLength` is exceeded the component automatically overrides `hintState` to `'error'` and displays `"Text exceeds N characters. Trim it and try again."` — no external wiring needed.

---

## Examples

### With character counter

```html
<ui-textarea
  label="Bio"
  placeholder="Tell us about your business…"
  [maxLength]="180"
  [rows]="5"
/>
```

### With tooltip and hint

```html
<ui-textarea
  label="Additional notes"
  tooltip="Any extra details that may help us assess your application"
  placeholder="Optional notes"
  hint="Keep it brief and relevant"
  [maxLength]="300"
/>
```

### Disabled

```html
<ui-textarea
  label="Internal comments"
  [disabled]="true"
  hint="Read-only for your account level"
/>
```

---

## With Reactive Forms

### Single control

```typescript
@Component({
  imports: [UiTextarea, ReactiveFormsModule],
  template: `
    <ui-textarea
      label="Business description"
      placeholder="Describe your business…"
      [required]="true"
      [maxLength]="180"
      [hint]="descHint()"
      [hintState]="descState()"
      [formControl]="descControl"
    />
  `,
})
export class DescriptionFormComponent {
  readonly descControl = new FormControl('', [
    Validators.required,
    Validators.maxLength(180),
  ]);

  readonly descHint = computed(() => {
    const ctrl = this.descControl;
    if (ctrl.invalid && ctrl.touched && ctrl.hasError('required')) {
      return 'Description is required';
    }
    return 'Describe what your business does';
  });

  readonly descState = computed((): UiTextareaHintState =>
    this.descControl.invalid && this.descControl.touched ? 'error' : 'default'
  );
}
```

### Inside a FormGroup

```typescript
@Component({
  imports: [UiTextarea, ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()">
      <ui-textarea
        label="Describe your business"
        placeholder="We are a restaurant located in…"
        [required]="true"
        [maxLength]="180"
        [rows]="4"
        [hint]="hint('description')"
        [hintState]="state('description')"
        formControlName="description"
      />

      <ui-textarea
        label="Special notes"
        placeholder="Anything else we should know?"
        [maxLength]="300"
        [rows]="3"
        formControlName="notes"
      />

      <button uiButton type="submit" [disabled]="form.invalid">Submit</button>
    </form>
  `,
})
export class AboutRestaurantStepComponent {
  readonly form = new FormGroup({
    description: new FormControl('', [Validators.required, Validators.maxLength(180)]),
    notes: new FormControl(''),
  });

  hint(name: 'description' | 'notes'): string {
    const ctrl = this.form.controls[name];
    if (ctrl.invalid && ctrl.touched) return 'This field is required';
    return '';
  }

  state(name: 'description' | 'notes'): UiTextareaHintState {
    const ctrl = this.form.controls[name];
    return ctrl.invalid && ctrl.touched ? 'error' : 'default';
  }

  submit() {
    if (this.form.valid) console.log(this.form.value);
  }
}
```

---

## Accessibility

- `<label>` is linked to `<textarea>` via `for`/`id`
- `aria-required` is set when `required="true"`
- `aria-invalid` is set when the effective state is `'error'`
- `aria-describedby` links the textarea to hint text
- Error hint has `role="alert"` for screen reader announcements
- Character counter is visually distinct; screen readers read the hint text
