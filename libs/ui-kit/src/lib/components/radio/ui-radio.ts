import {
    ChangeDetectionStrategy,
    Component,
    booleanAttribute,
    forwardRef,
    input,
    signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

let _nextRadioId = 0;

@Component({
    selector: 'ui-radio',
    styleUrl: './ui-radio.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => UiRadio),
            multi: true,
        },
    ],
    template: `
        <label class="ui-radio-label" [class.is-disabled]="isDisabled()">
            <input
                type="radio"
                class="ui-radio__native"
                [id]="radioId"
                [name]="name()"
                [checked]="isChecked()"
                [disabled]="isDisabled()"
                [attr.aria-required]="required() || null"
                (change)="select()"
            />
            <span class="ui-radio__control" aria-hidden="true"></span>
            <span class="ui-radio__label-text">
                {{ label() }}@if (required()) {<span class="ui-radio__required" aria-hidden="true"> *</span>}
            </span>
            @if (tooltip()) {
                <button
                    type="button"
                    class="ui-radio__tooltip-btn"
                    [title]="tooltip()"
                    [attr.aria-label]="tooltip()"
                >
                    <span class="material-symbols-outlined" aria-hidden="true">help</span>
                </button>
            }
        </label>
    `,
})
export class UiRadio implements ControlValueAccessor {
    readonly radioId = `ui-radio-${_nextRadioId++}`;

    readonly label = input<string>('');
    readonly required = input(false, { transform: booleanAttribute });
    readonly tooltip = input<string>('');
    readonly name = input<string>('');
    /** The value this radio option represents */
    readonly value = input<unknown>(null);

    protected readonly isChecked = signal(false);
    protected readonly isDisabled = signal(false);

    private _onChange: (value: unknown) => void = () => {};
    private _onTouched: () => void = () => {};

    writeValue(val: unknown): void {
        this.isChecked.set(val === this.value());
    }

    registerOnChange(fn: (value: unknown) => void): void {
        this._onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this._onTouched = fn;
    }

    setDisabledState(disabled: boolean): void {
        this.isDisabled.set(disabled);
    }

    protected select(): void {
        if (this.isDisabled()) return;
        this.isChecked.set(true);
        this._onChange(this.value());
        this._onTouched();
    }
}
