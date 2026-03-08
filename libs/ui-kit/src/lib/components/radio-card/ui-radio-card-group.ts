import { ChangeDetectionStrategy, Component, forwardRef, InjectionToken, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

let _nextGroupId = 0;

export const UI_RADIO_CARD_GROUP = new InjectionToken<UiRadioCardGroup>('UI_RADIO_CARD_GROUP');

@Component({
    selector: 'ui-radio-card-group',
    template: '<ng-content />',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => UiRadioCardGroup),
            multi: true
        },
        {
            provide: UI_RADIO_CARD_GROUP,
            useExisting: forwardRef(() => UiRadioCardGroup)
        }
    ],
    host: {
        role: 'radiogroup'
    }
})
export class UiRadioCardGroup implements ControlValueAccessor {
    readonly name = input<string>(`ui-radio-group-${_nextGroupId++}`);

    readonly _value = signal<unknown>(null);
    readonly _disabled = signal(false);

    private _onChange: (value: unknown) => void = () => {};
    private _onTouched: () => void = () => {};

    writeValue(value: unknown): void {
        this._value.set(value);
    }

    registerOnChange(fn: (value: unknown) => void): void {
        this._onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this._onTouched = fn;
    }

    setDisabledState(disabled: boolean): void {
        this._disabled.set(disabled);
    }

    select(value: unknown): void {
        this._value.set(value);
        this._onChange(value);
        this._onTouched();
    }
}
