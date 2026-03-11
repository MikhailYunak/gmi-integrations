import {
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    ElementRef,
    inject,
    input,
    output,
    signal,
    viewChild
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { UiButtonDirective, UiCheckbox, UiHeadingDirective, UiInput, UiTextarea } from '@gmi-integrations/ui-kit';
import { ContactAgentDialogService, isValidationError } from './contact-agent-dialog.service';

@Component({
    selector: 'gmi-contact-agent-dialog',
    templateUrl: './contact-agent-dialog.html',
    styleUrl: './contact-agent-dialog.scss',
    imports: [ReactiveFormsModule, UiInput, UiCheckbox, UiButtonDirective, UiHeadingDirective, UiTextarea],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactAgentDialog {
    readonly isOpen = input(false);

    readonly closed = output<void>();

    private readonly _dialogRef = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

    private readonly _fb = inject(FormBuilder);

    private readonly _service = inject(ContactAgentDialogService);

    protected readonly _isSubmitting = signal(false);

    protected readonly _serverErrors = signal<Record<string, string>>({});

    protected readonly _form = this._fb.group({
        fullName: ['', Validators.required],
        phone: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        question: ['', Validators.required],
        termsAccepted: [false, Validators.requiredTrue]
    });

    protected readonly _isFormInvalid = toSignal(this._form.statusChanges.pipe(map((status) => status === 'INVALID')), {
        initialValue: this._form.invalid
    });

    protected readonly _fullNameError = computed(() => this._serverErrors()['fullName'] ?? '');

    protected readonly _phoneError = computed(() => this._serverErrors()['phone'] ?? '');

    protected readonly _emailError = computed(() => this._serverErrors()['email'] ?? '');

    protected readonly _questionError = computed(() => this._serverErrors()['question'] ?? '');

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

        this._form.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => {
            if (Object.keys(this._serverErrors()).length > 0) {
                this._serverErrors.set({});
            }
        });
    }

    protected _handleClose(): void {
        this._dialogRef().nativeElement.close();
        this.closed.emit();
    }

    protected _handleSubmit(): void {
        if (this._form.invalid) {
            this._form.markAllAsTouched();
            return;
        }

        const { termsAccepted: _terms, ...body } = this._form.getRawValue() as {
            fullName: string;
            phone: string;
            email: string;
            question: string;
            termsAccepted: boolean;
        };

        this._isSubmitting.set(true);
        this._serverErrors.set({});
        this._service.createContactRequest(body).subscribe({
            next: () => {
                this._isSubmitting.set(false);
                this._handleClose();
            },
            error: (error: unknown) => {
                this._isSubmitting.set(false);
                if (isValidationError(error)) {
                    this._serverErrors.set(error.error.errors);
                }
            }
        });
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
