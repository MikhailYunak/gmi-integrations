import { Directive, inject } from '@angular/core';
import { CdkMenu } from '@angular/cdk/menu';

@Directive({
    selector: '[uiCdkMenu]',
    exportAs: 'uiCdkMenu',
    host: {
        role: 'menu',
        class: 'ui-cdk-menu',
        '[class.ui-cdk-menu-inline]': 'this._cdkMenu.isInline'
    },
    hostDirectives: [
        {
            directive: CdkMenu
        }
    ]
})
export class UiCdkMenu {
    protected readonly _cdkMenu = inject(CdkMenu);
}
