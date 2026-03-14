import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'gmi-logo',
    template: `
        <a [routerLink]="['/']" aria-label="Go to home page">
            <img src="img/logo.png" alt="Safe Insure" width="100%" height="100%" />
        </a>
    `,
    styleUrl: 'logo.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterLink]
})
export class Logo {}
