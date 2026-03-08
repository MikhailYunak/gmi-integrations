import {
    ChangeDetectionStrategy,
    Component,
    booleanAttribute,
    forwardRef,
    input,
    signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

let _nextCheckboxId = 0;

@Component({
    selector: 'ui-checkbox',
    styleUrl: './ui-checkbox.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => UiCheckbox),
            multi: true,
        },
    ],
    template: `
        <label class="ui-checkbox-label" [class.is-disabled]="isDisabled()">
            <input
                type="checkbox"
                class="ui-checkbox__native"
                [id]="checkboxId"
                [checked]="isChecked()"
                [disabled]="isDisabled()"
                [attr.aria-required]="required() || null"
                (change)="toggle($event)"
            />
            <span class="ui-checkbox__control" aria-hidden="true"></span>
            <span class="ui-checkbox__label-text">
                {{ label() }}@if (required()) {<span class="ui-checkbox__required" aria-hidden="true"> *</span>}
            </span>
            @if (tooltip()) {
                <button
                    type="button"
                    class="ui-checkbox__tooltip-btn"
                    [title]="tooltip()"
                    [attr.aria-label]="tooltip()"
                >
                    <span class="material-symbols-outlined" aria-hidden="true">help</span>
                </button>
            }
        </label>
    `,
})
export class UiCheckbox implements ControlValueAccessor {
    readonly checkboxId = `ui-checkbox-${_nextCheckboxId++}`;

    readonly label = input<string>('');
    readonly required = input(false, { transform: booleanAttribute });
    readonly tooltip = input<string>('');

    protected readonly isChecked = signal(false);
    protected readonly isDisabled = signal(false);

    private _onChange: (value: boolean) => void = () => {};
    private _onTouched: () => void = () => {};

    writeValue(val: boolean): void {
        this.isChecked.set(!!val);
    }

    registerOnChange(fn: (value: boolean) => void): void {
        this._onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this._onTouched = fn;
    }

    setDisabledState(disabled: boolean): void {
        this.isDisabled.set(disabled);
    }

    protected toggle(event: Event): void {
        const checked = (event.target as HTMLInputElement).checked;
        this.isChecked.set(checked);
        this._onChange(checked);
        this._onTouched();
    }
}
