import { Component, effect, inject, input } from '@angular/core';
import { ButtonLoader } from './button-loader';

@Component({
    template: ''
})
export abstract class AbstractButton {
    private readonly _buttonLoader = inject(ButtonLoader, { optional: true });

    readonly loader = input<boolean>(false);

    protected constructor() {
        effect(() => {
            if (this._buttonLoader) {
                this._buttonLoader.loadingStatus.set(this.loader());
            }
        });
    }
}
