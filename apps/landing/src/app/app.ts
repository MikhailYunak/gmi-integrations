import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
    UiAccordion,
    UiAccordionBody,
    UiAccordionHeader,
    UiAccordionItem,
    UiButtonDirective
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
                <button type="button" uiButton="primary">Get Covered</button>

                <button disabled type="button" uiButton="primary">Get Covered</button>

                <button type="button" uiButton="ghost" [rounded]="true">Get</button>

                <div class="ui-menu" [cdkMenuTriggerFor]="menu">
                    <div class="flex items-center justify-center max-w-50 w-full h-50 relative">
                        <div class="absolute background-image-gradient"></div>
                        <button class="ui-menu-button" type="button">En</button>
                    </div>

                    <span class="self-center triangle"></span>
                </div>

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

                <ng-template #menu>
                    <div cdkMenu class="example-menu">
                        <button
                            cdkMenuItemCheckbox
                            class="example-menu-item"
                            type="button"
                            [cdkMenuItemChecked]="bold"
                            (cdkMenuItemTriggered)="bold = !bold"
                        >
                            Bold
                        </button>
                        <button
                            cdkMenuItemCheckbox
                            class="example-menu-item"
                            type="button"
                            [cdkMenuItemChecked]="italic"
                            (cdkMenuItemTriggered)="italic = !italic"
                        >
                            Italic
                        </button>
                        <hr />
                        <div cdkMenuGroup>
                            @for (size of sizes; track size) {
                                <button
                                    cdkMenuItemRadio
                                    class="example-menu-item"
                                    type="button"
                                    [cdkMenuItemChecked]="size === selectedSize"
                                    (cdkMenuItemTriggered)="selectedSize = size"
                                >
                                    {{ size }}
                                </button>
                            }
                        </div>
                        <hr />
                        <button cdkMenuItem class="example-menu-item" type="button" (cdkMenuItemTriggered)="reset()">
                            Reset
                        </button>
                    </div>
                </ng-template>
            </div>
        </div>
        <router-outlet />
    `,
    imports: [
        RouterModule,
        UiButtonDirective,
        CdkMenuTrigger,
        CdkMenu,
        CdkMenuItemCheckbox,
        CdkMenuGroup,
        CdkMenuItemRadio,
        CdkMenuItem,
        UiAccordion,
        UiAccordionItem,
        UiAccordionHeader,
        UiAccordionBody
    ]
})
export class App {
    bold = false;

    italic = false;

    sizes = ['Small', 'Normal', 'Large'];

    selectedSize: string | undefined = 'Normal';

    readonly accordionItems = [
        'Do I need small business insurance?',
        'Key takeaways about business liability insurance?',
        'What does business insurance NOT cover?',
        'What happens if I experience a loss?',
        'Do you require a deposit for projects?'
    ];

    reset(): void {
        this.bold = false;
        this.italic = false;
        this.selectedSize = 'Normal';
    }
}
