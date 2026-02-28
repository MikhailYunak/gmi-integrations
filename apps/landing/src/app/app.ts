import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
    UiAccordion,
    UiAccordionBody,
    UiAccordionHeader,
    UiAccordionItem,
    UiButtonDirective, UiCdkMenu, UiCdkMenuItem, UiCdkMenuItemRadio, UiCdkMenuTrigger
} from '@gmi-integrations/ui-kit';
import {
    CdkMenu,
    CdkMenuGroup,
    CdkMenuItem,
    CdkMenuItemCheckbox,
    CdkMenuItemRadio,
    CdkMenuTrigger
} from '@angular/cdk/menu';

@Component({
    selector: 'gmi-root',
    template: `
        <div class="flex justify-center">
            <div
                class="flex flex-col justify-center items-center min-h-screen gap-y-20 bg-linear-(--gradient-bg) max-w-[1440px] w-full px-16 xl:px-48"
            >
                <!-- Primary Button (default) -->
                <button type="button" uiButton="primary" (click)="uiCdkMenuTriggerForRef.open()">Get Covered</button>

                <button disabled type="button" uiButton="primary">Get Covered</button>

                <button type="button" uiButton="ghost" [rounded]="true" (click)="reset()">Get</button>

                <div #uiCdkMenuTriggerForRef="uiCdkMenuTriggerFor" class="ui-menu" [uiCdkMenuTriggerFor]="uiMenuRef">
                    <div class="flex items-center justify-center max-w-50 w-full h-50 relative">
                        <div class="absolute background-image-gradient"></div>
                        <button class="ui-menu-button" type="button">En</button>
                    </div>

                    <span class="self-center triangle"></span>
                </div>

                <ng-template #uiMenuRef>
                    <div uiCdkMenu>
                        @for (language of languages; track language) {
                            <button
                                type="button"
                                uiCdkMenuItemRadio
                                [uiCdkMenuItemChecked]="language === selectedLanguage()"
                                (uiCdkMenuItemTriggered)="selectedLanguage.set(language)"
                            >
                                {{ language }}
                            </button>
                        }
                    </div>
                </ng-template>

                <div class="flex flex-col gap-y-24 items-center xl:items-start xl:flex-row xl:justify-between w-full">
                    <div>Frequently Asked Questions</div>

                    <ui-accordion [multi]="true">
                        @for (item of accordionItems; track item; let index = $index) {
                            <ui-accordion-item #accordionItem="uiAccordionItem">
                                <ui-accordion-header
                                    [expanded]="accordionItem.expanded"
                                    [index]="index"
                                    (click)="accordionItem.toggle()"
                                >
                                    @let icon = accordionItem.expanded ? 'remove' : 'add';
                                    <div class="flex justify-between items-center gap-x-2">
                                        <span class="uppercase">{{ item }}</span>
                                        <span class="material-symbols-outlined text-(--primary-forest)">
                                            {{ icon }}
                                        </span>
                                    </div>
                                </ui-accordion-header>
                                <ui-accordion-body [index]="index">
                                    Lorem ipsum dolor, sit amet, consectetur adipisicing elit. Perferendis excepturi
                                    incidunt ipsum deleniti labore, tempore non nam doloribus blanditiis veritatis illo
                                    autem iure aliquid ullam rem tenetur deserunt velit culpa?
                                </ui-accordion-body>
                            </ui-accordion-item>
                        }
                    </ui-accordion>
                </div>
            </div>
        </div>
        <router-outlet />
    `,
    imports: [
        RouterModule,
        UiButtonDirective,
        UiAccordion,
        UiAccordionItem,
        UiAccordionHeader,
        UiAccordionBody,
        UiCdkMenu,
        UiCdkMenuTrigger,
        UiCdkMenuItemRadio
    ]
})
export class App {
    languages = ['English', 'Español'];

    readonly selectedLanguage = signal<string | undefined>('English');

    readonly accordionItems = [
        'Do I need small business insurance?',
        'Key takeaways about business liability insurance?',
        'What does business insurance NOT cover?',
        'What happens if I experience a loss?',
        'Do you require a deposit for projects?'
    ];

    reset(): void {
        this.selectedLanguage.set(undefined);
    }
}
