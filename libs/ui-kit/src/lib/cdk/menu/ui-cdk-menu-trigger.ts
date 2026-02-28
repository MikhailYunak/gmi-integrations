import { Directive, inject } from '@angular/core';
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

    open(): void {
        this._cdkMenuTrigger.open();
    }
}
