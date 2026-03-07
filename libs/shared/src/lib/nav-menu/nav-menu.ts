import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UiLinkComponent } from '@gmi-integrations/ui-kit';

const NAV_ITEMS = [
    { label: 'Why Us', fragment: 'why-us' },
    { label: 'Our Clients', fragment: 'our-clients' },
    { label: 'Customers Reviews', fragment: 'customers-reviews' },
    { label: 'FAQ', fragment: 'faq' },
] as const;

@Component({
    selector: 'gmi-nav-menu',
    template: `
        <nav aria-label="Main navigation">
            <ul role="list">
                @for (item of items; track item.fragment) {
                    <li>
                        <ui-link [href]="'#' + item.fragment" [label]="item.label" />
                    </li>
                }
            </ul>
        </nav>
    `,
    styleUrl: 'nav-menu.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [UiLinkComponent]
})
export class NavMenu {
    readonly items = NAV_ITEMS;
}
