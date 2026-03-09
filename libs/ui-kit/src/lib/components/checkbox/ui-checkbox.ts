import {
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    forwardRef,
    input,
    signal,
    ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { UiTooltipDirective } from '../tooltip';

let _nextCheckboxId = 0;

@Component({
    selector: 'ui-checkbox',
    styleUrl: './ui-checkbox.scss',
    template: `
        @let _required = required();
        <label class="ui-checkbox__label">
            <input
                type="checkbox"
                class="ui-checkbox__native"
                [id]="checkboxId"
                [checked]="isChecked()"
                [disabled]="isDisabled()"
                [attr.aria-required]="_required || null"
                (change)="toggle($event)"
            />
            <span class="ui-checkbox__control" aria-hidden="true"></span>
            <span class="ui-checkbox__label-text">
                {{ label() }}
                @if (_required) {
                    <span class="ui-checkbox__required" aria-hidden="true">*</span>
                }
            </span>
            @if (tooltip()) {
                <span
                    [uiTooltip]="tooltip()"
                    class="material-symbols-outlined ui-checkbox__tooltip"
                    aria-hidden="true"
                >help</span>
            }
        </label>
    `,
    host: {
        class: 'ui-checkbox',
        '[class.is-checked]': 'isChecked()',
        '[class.is-disabled]': 'isDisabled()'
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    imports: [UiTooltipDirective],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => UiCheckbox),
            multi: true
        }
    ]
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
