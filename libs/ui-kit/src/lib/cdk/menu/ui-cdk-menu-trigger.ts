import { Directive, effect, inject, model, TemplateRef } from '@angular/core';
import { CdkMenuTrigger } from '@angular/cdk/menu';

@Directive({
    selector: '[uiCdkMenuTriggerFor]',
    exportAs: 'uiCdkMenuTriggerFor',
    hostDirectives: [
        {
            directive: CdkMenuTrigger,
            inputs: ['cdkMenuTriggerFor: uiCdkMenuTriggerFor'],
            outputs: ['cdkMenuOpened: uiCdkMenuOpened', 'cdkMenuClosed: uiCdkMenuClosed']
        }
    ],
    host: {
        class: 'ui-cdk-menu-trigger'
    }
})
export class UiCdkMenuTrigger {
    protected readonly _cdkMenuTrigger = inject(CdkMenuTrigger);

    readonly menuTemplateRef = model<TemplateRef<unknown> | null>(null);

    constructor() {
        effect(() => {
            if (this.menuTemplateRef()) {
                this._cdkMenuTrigger.menuTemplateRef = this.menuTemplateRef();
            }
        });
    }

    open(): void {
        this._cdkMenuTrigger.open();
    }
}
