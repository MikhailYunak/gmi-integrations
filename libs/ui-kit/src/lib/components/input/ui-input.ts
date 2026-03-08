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
import { UiTooltipDirective } from '../tooltip';

export type UiInputHintState = 'default' | 'success' | 'warning' | 'error';
export type UiInputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'stepper';

let _nextId = 0;

@Component({
    selector: 'ui-input',
    templateUrl: './ui-input.html',
    styleUrl: './ui-input.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => UiInput),
            multi: true
        }
    ],
    imports: [UiTooltipDirective]
})
export class UiInput implements ControlValueAccessor {
    readonly inputId = `ui-input-${_nextId++}`;

    readonly label = input<string>('');

    readonly required = input(false, { transform: booleanAttribute });

    readonly tooltip = input<string>('');

    readonly placeholder = input<string>('');

    readonly hint = input<string>('');

    readonly hintState = input<UiInputHintState>('default');

    readonly type = input<UiInputType>('text');

    readonly min = input<number | null>(null);

    readonly max = input<number | null>(null);

    readonly step = input<number>(1);

    protected readonly value = signal('');

    protected readonly isFocused = signal(false);

    protected readonly isDisabled = signal(false);

    protected readonly isFilled = computed(() => this.value() !== '');

    protected readonly numericValue = computed(() => Number(this.value()) || 0);

    protected readonly hintIcon = computed(() => {
        switch (this.hintState()) {
            case 'success':
                return 'check_circle';
            case 'warning':
                return 'warning';
            case 'error':
                return 'warning';
            default:
                return 'info';
        }
    });

    private _onChange: (value: string) => void = () => {};

    private _onTouched: () => void = () => {};

    writeValue(value: string): void {
        this.value.set(value ?? '');
    }

    registerOnChange(fn: (value: string) => void): void {
        this._onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this._onTouched = fn;
    }

    setDisabledState(disabled: boolean): void {
        this.isDisabled.set(disabled);
    }

    protected handleInput(event: Event): void {
        const val = (event.target as HTMLInputElement).value;
        this.value.set(val);
        this._onChange(val);
    }

    protected handleFocus(): void {
        this.isFocused.set(true);
    }

    protected handleBlur(): void {
        this.isFocused.set(false);
        this._onTouched();
    }

    protected decrement(): void {
        const current = this.numericValue();
        const minVal = this.min();
        const newVal = minVal !== null ? Math.max(current - this.step(), minVal) : current - this.step();
        this.value.set(String(newVal));
        this._onChange(String(newVal));
    }

    protected increment(): void {
        const current = this.numericValue();
        const maxVal = this.max();
        const newVal = maxVal !== null ? Math.min(current + this.step(), maxVal) : current + this.step();
        this.value.set(String(newVal));
        this._onChange(String(newVal));
    }
}
