import { afterRenderEffect, Component, effect, inject, signal, TemplateRef, viewChild } from '@angular/core';
import { UiCdkMenu, UiCdkMenuItemRadio, UiCdkMenuTrigger } from '@gmi-integrations/ui-kit';

@Component({
    selector: 'gmi-language-switcher',
    hostDirectives: [UiCdkMenuTrigger],
    template: `
        <div class="flex items-center justify-center max-w-50 w-full h-50 relative">
            <div class="absolute language-switcher-gradient"></div>
            <button class="language-switcher-button" type="button">En</button>
        </div>

        <span class="self-center triangle"></span>

        <ng-template #uiMenuRef>
            <div uiCdkMenu>
                @for (language of _languages; track language) {
                    <button
                        type="button"
                        uiCdkMenuItemRadio
                        [uiCdkMenuItemChecked]="language === _selectedLanguage()"
                        (uiCdkMenuItemTriggered)="_selectedLanguage.set(language)"
                    >
                        {{ language }}
                    </button>
                }
            </div>
        </ng-template>
    `,
    host: {
        class: 'language-switcher'
    },
    styleUrl: `./language-switcher.scss`,
    imports: [UiCdkMenu, UiCdkMenuItemRadio]
})
export class LanguageSwitcher {
    protected readonly _uiCdkMenuTriggerFor = inject(UiCdkMenuTrigger);

    protected readonly _uiMenuRef = viewChild.required<TemplateRef<unknown> | null>('uiMenuRef');

    protected readonly _languages = ['English', 'Español'];

    protected readonly _selectedLanguage = signal<string | undefined>('English');

    constructor() {
        effect(() => {
            if (this._uiMenuRef()) {
                this._uiCdkMenuTriggerFor.menuTemplateRef.set(this._uiMenuRef());
            }
        });
    }
}
