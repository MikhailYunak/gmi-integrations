import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UiButtonDirective } from '@gmi-integrations/ui-kit';
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
        <div class="flex flex-col justify-center items-center min-h-screen gap-y-20">
            <!-- Primary Button (default) -->
            <button type="button" uiButton="primary">Get Covered</button>

            <button disabled type="button" uiButton="primary">Get Covered</button>

            <button type="button" uiButton="ghost" [cdkMenuTriggerFor]="menu" [rounded]="true">Get</button>

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
        CdkMenuItem
    ]
})
export class App {
    bold = false;

    italic = false;

    sizes = ['Small', 'Normal', 'Large'];

    selectedSize: string | undefined = 'Normal';

    reset(): void {
        this.bold = false;
        this.italic = false;
        this.selectedSize = 'Normal';
    }
}
