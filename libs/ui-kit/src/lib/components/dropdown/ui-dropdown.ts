import {
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    DestroyRef,
    ElementRef,
    forwardRef,
    inject,
    input,
    signal,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { UiTooltipDirective } from '../tooltip';

export type UiDropdownOption = {
    label: string;
    value: string | number;
}

export type UiDropdownHintState = 'default' | 'success' | 'warning' | 'error';

let _nextDropdownId = 0;

@Component({
    selector: 'ui-dropdown',
    templateUrl: './ui-dropdown.html',
    styleUrl: './ui-dropdown.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [UiTooltipDirective],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => UiDropdown),
            multi: true
        }
    ]
})
export class UiDropdown implements ControlValueAccessor {
    private readonly _elementRef = inject(ElementRef);

    private readonly _document = inject(DOCUMENT);

    private readonly _destroyRef = inject(DestroyRef);

    readonly dropdownId = `ui-dropdown-${_nextDropdownId++}`;

    readonly label = input<string>('');

    readonly required = input(false, { transform: booleanAttribute });

    readonly tooltip = input<string>('');

    readonly placeholder = input<string>('Виберіть...');

    readonly hint = input<string>('');

    readonly hintState = input<UiDropdownHintState>('default');

    readonly options = input<UiDropdownOption[]>([]);

    protected readonly selectedValue = signal<string | number | null>(null);

    protected readonly isOpen = signal(false);

    protected readonly isDisabled = signal(false);

    protected readonly isFocused = signal(false);

    protected readonly selectedLabel = computed(() => {
        const val = this.selectedValue();
        if (val === null) {
            return '';
        }

        return this.options().find((o) => o.value === val)?.label ?? '';
    });

    protected readonly isFilled = computed(() => this.selectedValue() !== null);

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

    private _onChange: (value: string | number | null) => void = () => {};

    private _onTouched: () => void = () => {};

    constructor() {
        const handler = (e: MouseEvent) => {
            if (!this._elementRef.nativeElement.contains(e.target as Node)) {
                this.isOpen.set(false);
            }
        };
        this._document.addEventListener('click', handler);
        this._destroyRef.onDestroy(() => this._document.removeEventListener('click', handler));
    }

    writeValue(value: string | number | null): void {
        this.selectedValue.set(value ?? null);
    }

    registerOnChange(fn: (value: string | number | null) => void): void {
        this._onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this._onTouched = fn;
    }

    setDisabledState(disabled: boolean): void {
        this.isDisabled.set(disabled);
    }

    protected toggleDropdown(): void {
        if (this.isDisabled()) {
            return;
        }

        this.isOpen.update((v) => !v);
    }

    protected selectOption(option: UiDropdownOption): void {
        this.selectedValue.set(option.value);
        this._onChange(option.value);
        this.isOpen.set(false);
        this._onTouched();
    }

    protected handleTriggerFocus(): void {
        this.isFocused.set(true);
    }

    protected handleTriggerBlur(): void {
        this.isFocused.set(false);
        this._onTouched();
    }
}
