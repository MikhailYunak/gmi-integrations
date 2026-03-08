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

export type UiTextareaHintState = 'default' | 'success' | 'warning' | 'error';

let _nextTextareaId = 0;

@Component({
    selector: 'ui-textarea',
    templateUrl: './ui-textarea.html',
    styleUrl: './ui-textarea.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => UiTextarea),
            multi: true,
        },
    ],
})
export class UiTextarea implements ControlValueAccessor {
    readonly textareaId = `ui-textarea-${_nextTextareaId++}`;

    readonly label = input<string>('');

    readonly required = input(false, { transform: booleanAttribute });

    readonly tooltip = input<string>('');

    readonly placeholder = input<string>('');

    readonly hint = input<string>('');

    readonly hintState = input<UiTextareaHintState>('default');

    readonly maxLength = input<number | null>(null);

    readonly rows = input<number>(4);

    protected readonly value = signal('');

    protected readonly isFocused = signal(false);

    protected readonly isDisabled = signal(false);

    protected readonly charCount = computed(() => this.value().length);

    protected readonly isOverLimit = computed(() => {
        const max = this.maxLength();
        return max !== null && this.charCount() > max;
    });

    protected readonly effectiveHintState = computed<UiTextareaHintState>(() =>
        this.isOverLimit() ? 'error' : this.hintState()
    );

    protected readonly effectiveHint = computed(() =>
        this.isOverLimit()
            ? `Text exceeds ${this.maxLength()} characters. Trim it and try again.`
            : this.hint()
    );

    protected readonly hintIcon = computed(() => {
        switch (this.effectiveHintState()) {
            case 'success': return 'check_circle';
            case 'warning': return 'warning';
            case 'error': return 'warning';
            default: return 'info';
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
        const val = (event.target as HTMLTextAreaElement).value;
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
}
