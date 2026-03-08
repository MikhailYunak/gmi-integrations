import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UiLinkComponent } from '@gmi-integrations/ui-kit';

const SOCIAL_LINKS = [
    { label: 'Facebook', href: '#facebook' },
    { label: 'Twitter', href: '#twitter' },
    { label: 'Instagram', href: '#instagram' },
    { label: 'LinkedIn', href: '#linkedin' }
] as const;

const LEGAL_LINKS = [
    { label: 'Term of Use', href: '#term-of-use' },
    { label: 'Privacy policy', href: '#privacy-policy' },
    { label: 'Acceptable Use Policy', href: '#acceptable-use-policy' },
    { label: 'Cookie Policy', href: '#cookie-policy' },
    { label: 'Licenses', href: '#licenses' }
] as const;

@Component({
    selector: 'gmi-footer',
    templateUrl: './footer.html',
    styles: `
        :host {
            --ui-link-color: var(--primary-forest);

            display: block;
            background: var(--achromatics-grey-forms);
            padding: 24px 16px 54px;

            @media (min-width: 768px) {
                padding: 40px 48px;
            }
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterLink, UiLinkComponent, NgOptimizedImage]
})
export class Footer {
    protected readonly _currentYear = new Date().getFullYear();

    protected readonly _socialLinks = SOCIAL_LINKS;

    protected readonly _legalLinks = LEGAL_LINKS;
}
