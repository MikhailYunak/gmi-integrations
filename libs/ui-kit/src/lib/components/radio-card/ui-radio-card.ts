import {
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    forwardRef,
    inject,
    input,
    signal,
    ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { UI_RADIO_CARD_GROUP } from './ui-radio-card-group';

let _nextRadioCardId = 0;

@Component({
    selector: 'ui-radio-card',
    templateUrl: './ui-radio-card.html',
    styleUrl: './ui-radio-card.scss',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => UiRadioCard),
            multi: true,
        },
    ],
    host: {
        class: 'ui-radio-card',
        '[class.is-active]': 'isChecked()',
        '[class.is-disabled]': 'isDisabled()',
    },
})
export class UiRadioCard implements ControlValueAccessor {
    readonly cardId = `ui-radio-card-${_nextRadioCardId++}`;

    private readonly _group = inject(UI_RADIO_CARD_GROUP, { optional: true });

    readonly value = input<unknown>(null);

    readonly title = input<string>('');

    readonly description = input<string>('');

    readonly learnMoreUrl = input<string>('');

    readonly learnMoreLabel = input<string>('Learn More');

    readonly name = input<string>('');

    readonly required = input(false, { transform: booleanAttribute });

    private readonly _standaloneChecked = signal(false);

    private readonly _standaloneDisabled = signal(false);

    protected readonly isChecked = computed(() =>
        this._group ? this._group._value() === this.value() : this._standaloneChecked(),
    );

    protected readonly isDisabled = computed(() =>
        this._group ? this._group._disabled() : this._standaloneDisabled(),
    );

    protected readonly _name = computed(() => this._group?.name() ?? this.name());

    private _onChange: (value: unknown) => void = () => {};

    private _onTouched: () => void = () => {};

    writeValue(val: unknown): void {
        this._standaloneChecked.set(val === this.value());
    }

    registerOnChange(fn: (value: unknown) => void): void {
        this._onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this._onTouched = fn;
    }

    setDisabledState(disabled: boolean): void {
        this._standaloneDisabled.set(disabled);
    }

    protected select(): void {
        if (this.isDisabled()) {return;}
        if (this._group) {
            this._group.select(this.value());
        } else {
            this._standaloneChecked.set(true);
            this._onChange(this.value());
            this._onTouched();
        }
    }
}
