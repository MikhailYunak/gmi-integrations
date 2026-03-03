import { Component, signal } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import {
    UiAccordion,
    UiAccordionBody,
    UiAccordionHeader,
    UiAccordionItem,
    UiButtonDirective, UiCdkMenu, UiCdkMenuItem, UiCdkMenuItemRadio, UiCdkMenuTrigger, UiSelect
} from '@gmi-integrations/ui-kit';
import {
    CdkMenu,
    CdkMenuGroup,
    CdkMenuItem,
    CdkMenuItemCheckbox,
    CdkMenuItemRadio,
    CdkMenuTrigger
} from '@angular/cdk/menu';
import { LanguageSwitcher } from '@gmi-integrations/shared';

@Component({
    selector: 'gmi-root',
    template: `
        <router-outlet />
    `,
    imports: [
        RouterOutlet
    ]
})
export class App {}

//readonly accordionItems = [
//         'Do I need small business insurance?',
//         'Key takeaways about business liability insurance?',
//         'What does business insurance NOT cover?',
//         'What happens if I experience a loss?',
//         'Do you require a deposit for projects?'
//     ];
//<!--        <div class="flex justify-center">-->
//         <!--            <div-->
//         <!--                class="flex flex-col justify-center items-center min-h-screen gap-y-20 bg-linear-(&#45;&#45;gradient-bg) max-w-[1440px] w-full px-16 py-20 xl:px-48"-->
//         <!--            >-->
//         <!--                <ui-select />-->
//
//         <!--                &lt;!&ndash; Primary Button (default) &ndash;&gt;-->
//         <!--                <button type="button" uiButton="primary">Get Covered</button>-->
//
//         <!--                <button disabled type="button" uiButton="primary">Get Covered</button>-->
//
//         <!--                <button type="button" uiButton="ghost" [rounded]="true" (click)="reset()">Get</button>-->
//
//         <!--                <gmi-language-switcher />-->
//
//         <!--                <div class="flex flex-col gap-y-24 items-center xl:items-start xl:flex-row xl:justify-between w-full">-->
//         <!--                    <div>Frequently Asked Questions</div>-->
//
//         <!--                    <ui-accordion [multi]="true">-->
//         <!--                        @for (item of accordionItems; track item; let index = $index) {-->
//         <!--                            <ui-accordion-item #accordionItem="uiAccordionItem">-->
//         <!--                                <ui-accordion-header-->
//         <!--                                    [expanded]="accordionItem.expanded"-->
//         <!--                                    [index]="index"-->
//         <!--                                    (click)="accordionItem.toggle()"-->
//         <!--                                >-->
//         <!--                                    @let icon = accordionItem.expanded ? 'remove' : 'add';-->
//         <!--                                    <div class="flex justify-between items-center gap-x-2">-->
//         <!--                                        <span class="uppercase">{{ item }}</span>-->
//         <!--                                        <span class="material-symbols-outlined text-(&#45;&#45;primary-forest)">-->
//         <!--                                            {{ icon }}-->
//         <!--                                        </span>-->
//         <!--                                    </div>-->
//         <!--                                </ui-accordion-header>-->
//         <!--                                <ui-accordion-body [index]="index">-->
//         <!--                                    Lorem ipsum dolor, sit amet, consectetur adipisicing elit. Perferendis excepturi-->
//         <!--                                    incidunt ipsum deleniti labore, tempore non nam doloribus blanditiis veritatis illo-->
//         <!--                                    autem iure aliquid ullam rem tenetur deserunt velit culpa?-->
//         <!--                                </ui-accordion-body>-->
//         <!--                            </ui-accordion-item>-->
//         <!--                        }-->
//         <!--                    </ui-accordion>-->
//         <!--                </div>-->
//         <!--            </div>-->
//         <!--        </div>-->
