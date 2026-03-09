import {
    ChangeDetectionStrategy,
    Component,
    effect,
    ElementRef,
    inject,
    input,
    output,
    viewChild,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UiButtonDirective, UiCheckbox, UiHeadingDirective, UiInput } from '@gmi-integrations/ui-kit';

@Component({
    selector: 'gmi-contact-agent-dialog',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ReactiveFormsModule, UiInput, UiCheckbox, UiButtonDirective, UiHeadingDirective],
    templateUrl: './contact-agent-dialog.html',
    styleUrl: './contact-agent-dialog.scss',
})
export class ContactAgentDialog {
    readonly isOpen = input(false);

    readonly closed = output<void>();

    private readonly _dialogRef = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

    private readonly _fb = inject(FormBuilder);

    protected readonly _form = this._fb.group({
        fullName: ['', Validators.required],
        phone: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        question: ['', Validators.required],
        termsAccepted: [false, Validators.requiredTrue],
    });

    constructor() {
        effect(() => {
            const dialog = this._dialogRef().nativeElement;
            if (this.isOpen()) {
                dialog.showModal();
            } else {
                if (dialog.open) {
                    dialog.close();
                }
            }
        });
    }

    protected _handleClose(): void {
        this._dialogRef().nativeElement.close();
        this.closed.emit();
    }

    protected _handleSubmit(): void {
        if (this._form.valid) {
            this._handleClose();
        } else {
            this._form.markAllAsTouched();
        }
    }

    protected _handleBackdropClick(event: MouseEvent): void {
        const dialog = this._dialogRef().nativeElement;
        const rect = dialog.getBoundingClientRect();
        const clickedOutside =
            event.clientX < rect.left ||
            event.clientX > rect.right ||
            event.clientY < rect.top ||
            event.clientY > rect.bottom;
        if (clickedOutside) {
            this._handleClose();
        }
    }
}
