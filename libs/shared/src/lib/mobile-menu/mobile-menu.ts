import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { UiButtonDirective } from '@gmi-integrations/ui-kit';

const NAV_ITEMS = [
    { label: 'Why Us', fragment: 'why-us' },
    { label: 'Our Clients', fragment: 'our-clients' },
    { label: 'Customers Reviews', fragment: 'customers-reviews' },
    { label: 'FAQ', fragment: 'faq' },
] as const;

@Component({
    selector: 'gmi-mobile-menu',
    template: `
        <nav class="mobile-menu-nav" aria-label="Mobile navigation">
            <ul role="list">
                @for (item of items; track item.fragment) {
                    <li>
                        <a [href]="'#' + item.fragment" (click)="close.emit()">{{ item.label }}</a>
                    </li>
                }
            </ul>
        </nav>

        <div class="mobile-menu-footer">
            <button type="button" uiButton="primary">Get Insurance</button>
        </div>
    `,
    styleUrl: 'mobile-menu.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [UiButtonDirective],
    host: {
        role: 'dialog',
        'aria-modal': 'true',
        'aria-label': 'Navigation menu'
    }
})
export class MobileMenu {
    readonly close = output<void>();

    readonly items = NAV_ITEMS;
}
