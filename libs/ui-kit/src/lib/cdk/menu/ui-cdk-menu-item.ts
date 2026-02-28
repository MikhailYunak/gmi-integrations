import { Directive, inject } from '@angular/core';
import { CdkMenuItem } from '@angular/cdk/menu';

@Directive({
    selector: '[uiCdkMenuItem]',
    exportAs: 'cdkMenuItem',
    hostDirectives: [
        {
            directive: CdkMenuItem,
            inputs: ['cdkMenuItemDisabled: uiCdkMenuItemDisabled'],
            outputs: ['cdkMenuItemTriggered: uiCdkMenuItemTriggered']
        }
    ],
    host: {
        role: 'menuitem',
        class: 'ui-cdk-menu-item',
        '[class.ui-cdk-menu-item-disabled]': 'this._cdkMenuItem.disabled'
    }
})
export class UiCdkMenuItem {
    protected readonly _cdkMenuItem = inject(CdkMenuItem);
}
