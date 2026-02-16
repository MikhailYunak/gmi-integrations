# Angular Button UI Kit

Button component for Angular application, created based on Figma design.

## 📦 Installation

### 1. Import the directive in your component or module:

```typescript
import { UiButtonDirective } from '@gmi/ui-kit'; // Adjust import path as needed

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [UiButtonDirective],
  // ...
})
```

### 2. Ensure styles are loaded:
If using the library, styles might be pre-built or need to be imported.

```scss
@import 'ui-button';
```

## 🎨 Usage

### Basic usage

```html
<!-- Primary button (default) -->
<button uiButton>Get Covered</button>

<!-- Explicit variant specification -->
<button uiButton="primary">Get Covered</button>
```

### Button variants

```html
<!-- Outline -->
<button uiButton="outline">Learn More</button>

<!-- Ghost -->
<button uiButton="ghost">Cancel</button>

<!-- Text -->
<button uiButton="text">Read more</button>
```

### Sizes

```html
<!-- Small -->
<button uiButton size="sm">Small</button>

<!-- Medium (default) -->
<button uiButton size="md">Medium</button>

<!-- Large -->
<button uiButton size="lg">Large</button>
```

### States

```html
<!-- Disabled -->
<button uiButton [disabled]="true">Disabled</button>

<!-- Loading -->
<button uiButton [loading]="isLoading">
  {{ isLoading ? 'Loading...' : 'Submit' }}
</button>
```

### Modifiers

```html
<!-- Full width -->
<button uiButton block="true">Full Width</button>

<!-- Rounded -->
<button uiButton rounded="true">Rounded</button>

<!-- Icon button -->
<button uiButton icon="true">
  <svg>...</svg>
</button>
```

### Button group

```html
<div class="button-group">
  <button uiButton="outline">Left</button>
  <button uiButton="outline">Center</button>
  <button uiButton="outline">Right</button>
</div>
```

## 📋 API Reference

### `uiButton` Directive

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `uiButton` | `'primary' \| 'outline' \| 'ghost' \| 'text'` | `'primary'` | Button variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Button size |
| `loading` | `boolean` | `false` | Loading state |
| `block` | `boolean` | `false` | Full width button |
| `rounded` | `boolean` | `false` | Rounded corners |
| `icon` | `boolean` | `false` | Square button for icon |

## 🎯 Usage Examples

### Form with validation

```typescript
@Component({
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <input type="email" formControlName="email" placeholder="Email">
      
      <div class="button-group-horizontal">
        <button 
          uiButton 
          type="submit"
          [disabled]="form.invalid"
          [loading]="isSubmitting">
          {{ isSubmitting ? 'Submitting...' : 'Submit' }}
        </button>
        
        <button 
          uiButton="ghost" 
          type="button" 
          (click)="onCancel()">
          Cancel
        </button>
      </div>
    </form>
  `
})
export class FormComponent {
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });
  
  isSubmitting = false;

  onSubmit() {
    if (this.form.valid) {
      this.isSubmitting = true;
      
      this.apiService.submit(this.form.value).subscribe({
        next: () => {
          this.isSubmitting = false;
        },
        error: () => {
          this.isSubmitting = false;
        }
      });
    }
  }
}
```

### Dialog windows

```typescript
@Component({
  template: `
    <div class="dialog">
      <h2>Confirmation</h2>
      <p>Are you sure you want to delete this item?</p>
      
      <div class="dialog-actions">
        <button uiButton="ghost" (click)="onCancel()">
          Cancel
        </button>
        <button 
          uiButton
          [loading]="isDeleting"
          (click)="onConfirm()">
          {{ isDeleting ? 'Deleting...' : 'Delete' }}
        </button>
      </div>
    </div>
  `
})
export class ConfirmDialogComponent {
  isDeleting = false;

  onConfirm() {
    this.isDeleting = true;
    // API call...
  }

  onCancel() {
    // Close dialog
  }
}
```

### Responsive navigation

```html
<nav class="mobile-nav">
  <button uiButton block="true">Home</button>
  <button uiButton="outline" block="true">About</button>
  <button uiButton="ghost" block="true">Contact</button>
</nav>
```

## 🎨 Customization

### Change colors

Edit variables in `ui-button.scss`:

```scss
$color-primary-start: #7FE5B8;
$color-primary-end: #65D9A5;
$color-disabled-bg: #5A5E64;
// ...
```

### Change sizes

```scss
$btn-height: 54px;
$btn-font-size: 18px;
$btn-border-radius: 16px;
// ...
```

### Add new variant

```scss
[uiButton][data-variant="danger"] {
  background: linear-gradient(135deg, #FF6B6B 0%, #EE5A52 100%);
  color: white;
  
  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #FF8787 0%, #FF6B6B 100%);
  }
}
```

```typescript
// In directive
variant = input<'primary' | 'outline' | 'ghost' | 'text' | 'danger'>('primary', { alias: 'uiButton' });
```

## 📱 Responsiveness

Buttons automatically adapt to mobile devices:

- On screens < 768px: buttons take 100% width
- On screens < 480px: height and font size are reduced

## ♿ Accessibility

- Keyboard navigation support
- Focus states with visible outline
- Aria attributes for screen readers
- Disabled state blocks interaction

## 🔧 Troubleshooting

### Styles not applied

Check that `ui-button.scss` is imported in your global styles or component styles.

### Loading spinner not displayed

Make sure you use `[loading]` with square brackets for dynamic values, or `loading="true"` for static:

```html
✅ <button uiButton [loading]="isLoading">Text</button>
✅ <button uiButton loading="true">Text</button>
❌ <button uiButton loading="isLoading">Text</button>
```

## 📄 License

MIT
