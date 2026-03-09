import {
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    forwardRef,
    input,
    signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

let _nextAmountPickerId = 0;

@Component({
    selector: 'ui-amount-picker',
    templateUrl: './ui-amount-picker.html',
    styleUrl: './ui-amount-picker.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => UiAmountPicker),
            multi: true,
        },
    ],
})
export class UiAmountPicker implements ControlValueAccessor {
    readonly pickerId = `ui-amount-picker-${_nextAmountPickerId++}`;

    /** Preset amounts to show as pills — supports numbers or strings */
    readonly options = input<(number | string)[]>([500, 1000, 2500, 5000]);

    /** Currency symbol displayed inside numeric pills */
    readonly currency = input<string>('$');

    /** When true, shows an extra editable pill for a custom amount (only for numeric options) */
    readonly allowCustom = input(false, { transform: booleanAttribute });

    protected readonly selectedValue = signal<number | string | null>(null);

    protected readonly customRaw = signal<string>('');

    protected readonly isCustomFocused = signal(false);

    protected readonly isCustomSelected = computed(() => {
        const val = this.selectedValue();
        return val !== null && !this.options().includes(val);
    });

    protected readonly formattedOptions = computed(() =>
        this.options().map((opt) => ({
            value: opt,
            label: typeof opt === 'number' ? opt.toLocaleString('en-US') : opt,
            isNumeric: typeof opt === 'number',
        }))
    );

    private _onChange: (value: number | string | null) => void = () => {};

    private _onTouched: () => void = () => {};

    writeValue(val: number | string | null): void {
        this.selectedValue.set(val ?? null);
        if (typeof val === 'number' && !this.options().includes(val)) {
            this.customRaw.set(String(val));
        } else {
            this.customRaw.set('');
        }
    }

    registerOnChange(fn: (value: number | string | null) => void): void {
        this._onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this._onTouched = fn;
    }

    setDisabledState(_disabled: boolean): void {}

    protected selectPreset(value: number | string): void {
        this.selectedValue.set(value);
        this.customRaw.set('');
        this._onChange(value);
        this._onTouched();
    }

    protected handleCustomInput(event: Event): void {
        const raw = (event.target as HTMLInputElement).value;
        this.customRaw.set(raw);
        const num = parseFloat(raw.replace(/,/g, ''));
        const value = isNaN(num) ? null : num;
        this.selectedValue.set(value);
        this._onChange(value);
    }

    protected handleCustomFocus(): void {
        this.isCustomFocused.set(true);
        // Deselect preset when entering custom field
        if (!this.isCustomSelected()) {
            this.selectedValue.set(null);
            this._onChange(null);
        }
    }

    protected handleCustomBlur(): void {
        this.isCustomFocused.set(false);
        this._onTouched();
    }
}
