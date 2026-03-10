import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { UiButtonDirective } from '@gmi-integrations/ui-kit';

export type ConfirmDialogData = {
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
};

@Component({
    selector: 'gmi-confirm-dialog',
    templateUrl: './confirm-dialog.html',
    styleUrl: './confirm-dialog.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [UiButtonDirective]
})
export class ConfirmDialog {
    protected readonly data = inject<ConfirmDialogData>(DIALOG_DATA);

    private readonly _ref = inject<DialogRef<boolean>>(DialogRef);

    protected _confirm(): void {
        this._ref.close(true);
    }

    protected _cancel(): void {
        this._ref.close(false);
    }
}
