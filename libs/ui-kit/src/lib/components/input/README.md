# UiInput

Form input component with label, hint, and all visual states. Implements `ControlValueAccessor` — works with Reactive Forms out of the box.

## Import

```typescript
import { UiInput } from '@gmi-integrations/ui-kit';

@Component({
  imports: [UiInput, ReactiveFormsModule],
})
```

---

## Basic usage

```html
<!-- Standalone (no form) -->
<ui-input label="Email" placeholder="you@example.com" hint="Hint" />

<!-- Reactive Forms -->
<ui-input label="Email" placeholder="you@example.com" [formControl]="emailControl" />
```

---

## Inputs

| Input        | Type                                              | Default     | Description                         |
|--------------|---------------------------------------------------|-------------|-------------------------------------|
| `label`      | `string`                                          | `''`        | Label text above the input          |
| `required`   | `boolean`                                         | `false`     | Shows `*` after the label           |
| `tooltip`    | `string`                                          | `''`        | Shows `?` icon; value is the title  |
| `placeholder`| `string`                                          | `''`        | Input placeholder text              |
| `type`       | `'text' \| 'email' \| 'password' \| 'number' \| 'tel' \| 'stepper'` | `'text'` | Input type |
| `hint`       | `string`                                          | `''`        | Helper text below the input         |
| `hintState`  | `'default' \| 'success' \| 'warning' \| 'error'` | `'default'` | Controls hint icon and color        |
| `min`        | `number \| null`                                  | `null`      | Min value (stepper only)            |
| `max`        | `number \| null`                                  | `null`      | Max value (stepper only)            |
| `step`       | `number`                                          | `1`         | Step size (stepper only)            |

---

## Visual states

States are driven automatically by user interaction (hover, focus, filled) and by the `hintState` input.

| State      | Trigger                         | Visual                                     |
|------------|---------------------------------|--------------------------------------------|
| `default`  | initial                         | gray border                                |
| `hover`    | mouse over                      | green border                               |
| `focused`  | keyboard / click inside         | green border + outer glow                  |
| `filled`   | value is not empty              | dark border                                |
| `success`  | `hintState="success"`           | green hint text + `check_circle` icon      |
| `warning`  | `hintState="warning"`           | orange hint text + `warning` icon          |
| `error`    | `hintState="error"`             | red border + red hint text + `warning` icon|
| `disabled` | `[disabled]="true"` or form control disabled | gray background, no interaction |

---

## Variants

### Simple text / email / password

```html
<ui-input
  label="Email address"
  placeholder="you@example.com"
  type="email"
  [required]="true"
  hint="We'll never share your email."
/>
```

### With prefix slot (e.g. currency)

```html
<ui-input label="Amount" placeholder="0.00" type="number">
  <span uiInputPrefix>$</span>
</ui-input>
```

### With prefix + suffix slots (e.g. currency with unit label)

```html
<ui-input label="Annual Revenue" placeholder="1" type="number">
  <span uiInputPrefix>$</span>
  <span uiInputSuffix>M</span>
</ui-input>
```

### Phone number (flag + code as prefix)

```html
<ui-input label="Phone" placeholder="000 000 00 00" type="tel">
  <span uiInputPrefix>🇺🇸 +1</span>
</ui-input>
```

### Stepper (−  value  +)

```html
<ui-input
  type="stepper"
  label="Number of locations"
  [min]="1"
  [max]="100"
  [step]="1"
/>
```

---

## With Reactive Forms

### Single control

```typescript
@Component({
  imports: [UiInput, ReactiveFormsModule],
  template: `
    <ui-input
      label="First Name"
      placeholder="John"
      [required]="true"
      [hint]="firstNameHint()"
      [hintState]="firstNameState()"
      [formControl]="firstNameControl"
    />
  `,
})
export class MyFormComponent {
  readonly firstNameControl = new FormControl('', Validators.required);

  readonly firstNameHint = computed(() =>
    this.firstNameControl.invalid && this.firstNameControl.touched
      ? 'This field is required'
      : 'Hint'
  );

  readonly firstNameState = computed((): UiInputHintState =>
    this.firstNameControl.invalid && this.firstNameControl.touched ? 'error' : 'default'
  );
}
```

### Inside a FormGroup

```typescript
@Component({
  imports: [UiInput, ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()">
      <ui-input
        label="Email"
        placeholder="you@example.com"
        type="email"
        [required]="true"
        [hint]="emailError() ?? 'Enter your work email'"
        [hintState]="emailError() ? 'error' : 'default'"
        formControlName="email"
      />

      <ui-input
        label="Password"
        placeholder="••••••••"
        type="password"
        [required]="true"
        [hint]="passwordError() ?? 'At least 8 characters'"
        [hintState]="passwordError() ? 'error' : 'default'"
        formControlName="password"
      />

      <button uiButton type="submit" [disabled]="form.invalid">Sign in</button>
    </form>
  `,
})
export class SignInFormComponent {
  readonly form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });

  readonly emailError = computed(() => {
    const ctrl = this.form.controls.email;
    if (!ctrl.invalid || !ctrl.touched) return null;
    if (ctrl.hasError('required')) return 'Email is required';
    if (ctrl.hasError('email')) return 'Enter a valid email address';
    return null;
  });

  readonly passwordError = computed(() => {
    const ctrl = this.form.controls.password;
    if (!ctrl.invalid || !ctrl.touched) return null;
    if (ctrl.hasError('required')) return 'Password is required';
    if (ctrl.hasError('minlength')) return 'At least 8 characters required';
    return null;
  });

  submit() {
    if (this.form.valid) {
      console.log(this.form.value);
    }
  }
}
```

### With success state after async validation

```typescript
@Component({
  imports: [UiInput, ReactiveFormsModule],
  template: `
    <ui-input
      label="Username"
      placeholder="johndoe"
      [hint]="usernameHint()"
      [hintState]="usernameState()"
      [formControl]="usernameControl"
    />
  `,
})
export class UsernameCheckComponent {
  readonly usernameControl = new FormControl('');

  readonly usernameHint = computed((): string => {
    const ctrl = this.usernameControl;
    if (ctrl.pending) return 'Checking availability…';
    if (ctrl.invalid && ctrl.touched) return 'Username is already taken';
    if (ctrl.valid && ctrl.touched && ctrl.value) return 'Username is available!';
    return 'Choose a unique username';
  });

  readonly usernameState = computed((): UiInputHintState => {
    const ctrl = this.usernameControl;
    if (ctrl.invalid && ctrl.touched) return 'error';
    if (ctrl.valid && ctrl.touched && ctrl.value) return 'success';
    return 'default';
  });
}
```

---

## Prefix / Suffix slot reference

Both slots use attribute selectors — add the attribute to any element:

```html
<ui-input label="Amount">
  <!-- any element with uiInputPrefix is placed on the left -->
  <img uiInputPrefix src="flag.svg" alt="US" />

  <!-- any element with uiInputSuffix is placed on the right -->
  <span uiInputSuffix>USD</span>
</ui-input>
```

Common patterns:

| Use case       | Prefix                       | Suffix              |
|----------------|------------------------------|---------------------|
| Currency       | `<span uiInputPrefix>$</span>` | `<span uiInputSuffix>USD</span>` |
| Phone          | `<span uiInputPrefix>🇺🇸 +1</span>` | —             |
| Search         | icon component               | clear button        |

---

## Accessibility

- `<label>` is linked to `<input>` via `for`/`id`
- `aria-required` is set when `required="true"`
- `aria-invalid` is set when `hintState="error"`
- `aria-describedby` links the input to hint text
- Error hint has `role="alert"` for screen reader announcements
- All interactive elements have visible `:focus-visible` styles
