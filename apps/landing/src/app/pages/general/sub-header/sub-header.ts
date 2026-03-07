import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { UiButtonDirective, UiHeadingDirective } from '@gmi-integrations/ui-kit';

@Component({
    selector: 'gmi-sub-header',
    template: `
        <div class="flex flex-col gap-y-28 flex-1">
            <h1 uiHeading class="text-white pr-40 md:pr-0 capitalize">
                Get Your
                <span uiHeading variant="italic">
                    restaurant
                    <br class="md:hidden" />
                    insurance
                </span>
                quote
            </h1>
            <div class="flex flex-col gap-y-8 max-w-774 text-lime-400 md:capitalize">
                <p class="text-large">It takes ~5 minutes.</p>
                <p class="text-large">
                    Answer a few questions to see your best coverage options and monthly price — fast and secure. No
                    spam. No hidden fees.
                </p>
            </div>
            <button uiButton="primary">Get Insurance</button>
        </div>

        <div class="relative self-center shrink-0 w-full md:w-573 h-299 md:h-500">
            <img ngSrc="/img/united-radial.svg" alt="" fill priority disableOptimizedSrcset />
        </div>
    `,
    styles: `
        :host {
            display: flex;
            flex-direction: column;
            row-gap: 24px;

            @media (min-width: 768px) {
                flex-direction: row;
                align-items: center;
            }
        }
    `,
    host: {
        class: 'sub-header'
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgOptimizedImage, UiButtonDirective, UiHeadingDirective]
})
export class SubHeader {}
