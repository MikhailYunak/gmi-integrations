import {
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    forwardRef,
    input,
    signal,
    ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

let _nextCheckboxCardId = 0;

@Component({
    selector: 'ui-checkbox-card',
    template: `
        <label class="ui-checkbox-card__header" [for]="cardId">
            <input
                type="checkbox"
                class="ui-checkbox-card__native"
                [id]="cardId"
                [checked]="isChecked()"
                [disabled]="isDisabled()"
                [attr.aria-required]="required() || null"
                (change)="toggle($event)"
            />
            <span class="ui-checkbox-card__control" aria-hidden="true"></span>
            <span class="ui-checkbox-card__label">{{ label() }}</span>
        </label>
        <div class="ui-checkbox-card__content">
            <ng-content />
        </div>
    `,
    styleUrl: './ui-checkbox-card.scss',
    host: {
        class: 'ui-checkbox-card',
        '[class.is-checked]': 'isChecked()',
        '[class.is-disabled]': 'isDisabled()'
    },
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => UiCheckboxCard),
            multi: true
        }
    ]
})
export class UiCheckboxCard implements ControlValueAccessor {
    readonly cardId = `ui-checkbox-card-${_nextCheckboxCardId++}`;

    readonly required = input(false, { transform: booleanAttribute });

    readonly label = input.required<string>();

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
