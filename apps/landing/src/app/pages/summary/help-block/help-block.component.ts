import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { UiButtonDirective, UiHeadingDirective } from '@gmi-integrations/ui-kit';
import { RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { ContactAgentDialog } from '@gmi-integrations/shared';

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
            <div class="flex flex-col gap-y-12 mb-32 text-center lg:gap-y-28 lg:text-left">
                <h2 uiHeading class="text-gray-900">
                    Get a
                    <span uiHeading variant="italic">Help?</span>
                </h2>
                <p class="text-gray-800 lg:text-2xl lg:capitalize">Customers Can Get Help Here.</p>
            </div>

            <ul class="flex flex-col gap-y-12 list-none mb-48" role="list">
                @for (item of _helpItems; track item) {
                    <li class="flex items-center gap-x-10">
                        <span class="text-gray-800 font-bold lg:text-lg/[24px]">{{ item }}</span>
                    </li>
                }
            </ul>

            <button type="button" class="w-full lg:w-fit" uiButton (click)="_isDialogOpen.set(true)">Contact An Agent</button>
        </section>

        <section class="relative flex-1 min-h-260 max-w-605 lg:min-h-460">
            <img
                ngSrc="/img/summary-image.png"
                fill
                alt="Safe.Insure customer support team"
                class="object-contain object-center lg:object-top-left"
            />
        </section>

        <gmi-contact-agent-dialog
            [isOpen]="_isDialogOpen()"
            (closed)="_isDialogOpen.set(false)"
        />
    `,
    styles: `
        :host {
            display: flex;
            flex-direction: column;
            row-gap: 16px;
            margin: 40px auto;

            @media (width >= 64rem) {
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
    imports: [UiHeadingDirective, NgOptimizedImage, UiButtonDirective, ContactAgentDialog]
})
export class HelpBlock {
    protected readonly _helpItems = HELP_ITEMS;
    protected readonly _isDialogOpen = signal(false);
}
