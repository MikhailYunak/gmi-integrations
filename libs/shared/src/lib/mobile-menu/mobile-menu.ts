import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
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
                        <a [routerLink]="['/general']" [fragment]="item.fragment" (click)="handleClose()">{{ item.label }}</a>
                    </li>
                }
            </ul>
        </nav>

        <div class="mobile-menu-footer">
            <button type="button" uiButton="primary" [routerLink]="['/steps']" (click)="handleClose()">Get Insurance</button>
        </div>
    `,
    styleUrl: 'mobile-menu.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterLink, UiButtonDirective],
    host: {
        role: 'dialog',
        'aria-modal': 'true',
        'aria-label': 'Navigation menu',
        '[class.closing]': 'isClosing()',
    }
})
export class MobileMenu {
    readonly close = output<void>();

    readonly items = NAV_ITEMS;

    readonly isClosing = signal(false);

    handleClose(): void {
        this.isClosing.set(true);
        setTimeout(() => this.close.emit(), 500);
    }
}
