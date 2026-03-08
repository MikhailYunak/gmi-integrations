import {
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    forwardRef,
    input,
    signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

let _nextRadioCardId = 0;

@Component({
    selector: 'ui-radio-card',
    templateUrl: './ui-radio-card.html',
    styleUrl: './ui-radio-card.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => UiRadioCard),
            multi: true,
        },
    ],
})
export class UiRadioCard implements ControlValueAccessor {
    readonly cardId = `ui-radio-card-${_nextRadioCardId++}`;

    /** The value this card represents in the radio group */
    readonly value = input<unknown>(null);

    /** Card title (bold, becomes green when active) */
    readonly title = input<string>('');

    /** Card description text */
    readonly description = input<string>('');

    /** Optional URL for the "Learn More" link */
    readonly learnMoreUrl = input<string>('');

    /** Label for the learn-more link */
    readonly learnMoreLabel = input<string>('Learn More');

    /** Native radio name attribute — shared across cards in the same group */
    readonly name = input<string>('');

    readonly required = input(false, { transform: booleanAttribute });

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
        if (this.isDisabled()) {return;}
        this.isChecked.set(true);
        this._onChange(this.value());
        this._onTouched();
    }
}
