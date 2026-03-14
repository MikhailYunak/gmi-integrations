import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { UiSnackbarService, SnackbarType } from './ui-snackbar.service';

export type SnackbarPosition =
  | 'top-right'
  | 'top-left'
  | 'top-center'
  | 'bottom-right'
  | 'bottom-left'
  | 'bottom-center';

const SNACKBAR_ICONS: Record<SnackbarType, string> = {
  success: 'check_circle',
  error: 'error',
  warning: 'warning',
};

@Component({
  selector: 'ui-snackbar',
  template: `
    <div
      class="snackbar-container"
      [attr.data-position]="position()"
      role="region"
      aria-label="Notifications"
      aria-live="polite"
      aria-atomic="false"
    >
      @for (snack of _snackbarService.snacks(); track snack.id) {
        <div
          class="snackbar-item"
          [attr.data-type]="snack.type"
          [attr.data-leaving]="_snackbarService.leavingIds().has(snack.id)"
          role="alert"
        >
          <span class="material-symbols-outlined snackbar-icon" aria-hidden="true">
            {{ _icons[snack.type] }}
          </span>
          <span class="snackbar-message">{{ snack.message }}</span>
          <button
            class="snackbar-close"
            type="button"
            aria-label="Dismiss notification"
            (click)="_snackbarService.dismiss(snack.id)"
          >
            <span class="material-symbols-outlined" aria-hidden="true">close</span>
          </button>
        </div>
      }
    </div>
  `,
  styleUrl: './ui-snackbar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiSnackbarComponent {
  readonly position = input<SnackbarPosition>('top-right');

  protected readonly _snackbarService = inject(UiSnackbarService);

  protected readonly _icons = SNACKBAR_ICONS;
}
