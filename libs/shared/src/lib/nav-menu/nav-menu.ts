import { ChangeDetectionStrategy, Component } from '@angular/core';

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
                        <a [href]="'#' + item.fragment">{{ item.label }}</a>
                    </li>
                }
            </ul>
        </nav>
    `,
    styleUrl: 'nav-menu.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavMenu {
    readonly items = NAV_ITEMS;
}
