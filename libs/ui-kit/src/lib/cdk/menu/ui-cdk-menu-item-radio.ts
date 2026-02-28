import { Directive } from '@angular/core';
import { CdkMenuItemRadio } from '@angular/cdk/menu';

@Directive({
    selector: '[uiCdkMenuItemRadio]',
    exportAs: 'uiCdkMenuItemRadio',
    host: {
        role: 'menuitemradio',
        '[class.ui-cdk-menu-item-radio]': 'true'
    },
    hostDirectives: [
        {
            directive: CdkMenuItemRadio,
            inputs: ['cdkMenuItemChecked: uiCdkMenuItemChecked'],
            outputs: ['cdkMenuItemTriggered: uiCdkMenuItemTriggered']
        }
    ]
})
export class UiCdkMenuItemRadio {}
