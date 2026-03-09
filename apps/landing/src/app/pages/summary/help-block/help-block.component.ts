import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UiButtonDirective, UiHeadingDirective } from '@gmi-integrations/ui-kit';
import { RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';

const HELP_ITEMS = [
    'Obtain Your Certificate Of Insurance',
    'Billing And Payments',
    'Assistance Filing A Claim',
    'Assistance Filing A Claim',
    'Explore FAQs'
] as const;

@Component({
    selector: 'gmi-help-block',
    template: `
        <section class="flex flex-col">
            <div class="flex flex-col gap-y-12 mb-32 text-center md:gap-y-28 md:text-left">
                <h2 uiHeading class="text-gray-900">
                    Get a
                    <span uiHeading variant="italic">Help?</span>
                </h2>
                <p class="text-gray-800 md:text-2xl md:capitalize">Customers Can Get Help Here.</p>
            </div>

            <ul class="flex flex-col gap-y-12 list-none mb-48" role="list">
                @for (item of _helpItems; track item) {
                    <li class="flex items-center gap-x-10">
                        <span class="text-gray-800 font-bold md:text-lg/[24px]">{{ item }}</span>
                    </li>
                }
            </ul>

            <button type="button" class="w-full md:w-fit" uiButton>Contact An Agent</button>
        </section>

        <section class="relative flex-1 min-h-260 max-w-605 md:min-h-460">
            <img
                ngSrc="/img/summary-image.png"
                fill
                alt="Safe.Insure customer support team"
                class="object-contain object-center md:object-top-left"
            />
        </section>
    `,
    styles: `
        :host {
            display: flex;
            flex-direction: column;
            row-gap: 16px;
            margin: 40px auto;

            @media (min-width: 768px) {
                flex-direction: row;
                justify-content: space-between;
                margin: 106px 146px;
            }
        }

        li::before {
            content: url('/img/figure/radial-green-small.svg');
            display: inline-block;
            width: 22px;
            height: 22px;
            flex-shrink: 0;
        }
    `,
    host: {
        class: 'sub-summary-sub-header'
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [UiHeadingDirective, RouterLink, NgOptimizedImage, UiButtonDirective]
})
export class HelpBlock {
    protected readonly _helpItems = HELP_ITEMS;
}
