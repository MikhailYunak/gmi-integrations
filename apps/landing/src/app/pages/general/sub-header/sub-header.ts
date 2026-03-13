import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UiButtonDirective, UiHeadingDirective } from '@gmi-integrations/ui-kit';

@Component({
    selector: 'gmi-sub-header',
    template: `
        <div class="flex flex-col gap-y-28 flex-1">
            <h1 uiHeading class="text-white pr-40 lg:pr-0 capitalize">
                Get Your
                <span uiHeading variant="italic">
                    restaurant
                    <br class="lg:hidden" />
                    insurance
                </span>
                quote
            </h1>
            <div class="flex flex-col gap-y-8 max-w-774 text-lime-400 lg:capitalize">
                <p class="text-large">It takes ~5 minutes.</p>
                <p class="text-large">
                    Answer a few questions to see your best coverage options and monthly price — fast and secure. No
                    spam. No hidden fees.
                </p>
            </div>
            <button type="button" uiButton="primary" [routerLink]="['/steps']">Get Insurance</button>
        </div>

        <div class="relative self-center shrink-0 w-full lg:w-573 h-299 lg:h-500">
            <img ngSrc="/img/united-radial.svg" alt="" fill priority disableOptimizedSrcset />
        </div>
    `,
    styles: `
        :host {
            display: flex;
            flex-direction: column;
            row-gap: 24px;
            padding-inline: calc(var(--spacing) * 16) /* 16px */;
            margin-top: calc(var(--spacing) * 128) /* 128px */;
            margin-bottom: calc(var(--spacing) * 73) /* 73px */;
            max-width: calc(var(--spacing) * 1440);
            width: 100%;

            @media (width >= 64rem) {
                padding-inline: calc(var(--spacing) * 48) /* 48px */;
                margin-top: calc(var(--spacing) * 164) /* 164px */;
                flex-direction: row;
                align-items: center;
            }
        }
    `,
    host: {
        class: 'sub-header'
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgOptimizedImage, RouterLink, UiButtonDirective, UiHeadingDirective]
})
export class SubHeader {}
