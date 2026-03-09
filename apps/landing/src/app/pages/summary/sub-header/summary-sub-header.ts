import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UiHeadingDirective } from '@gmi-integrations/ui-kit';
import {RouterLink} from "@angular/router";

@Component({
    selector: 'gmi-summary-sub-header',
    template: `
        <section class="flex flex-col gap-y-28">
            <h1 uiHeading class="text-white pr-40 md:pr-0 capitalize">
                <span uiHeading variant="italic">Business Insurance</span>
                Quote
            </h1>
            <p class="text-lime-400 md:text-2xl md:max-w-2/4">
                Based On Your Request, We Have Found The Most Popular Insurance Policies For You.
            </p>
        </section>

        <section class="mx-auto">
            <div class="flex flex-col items-center gap-y-34 max-w-654">
                <div class="w-318 h-500 bg-white">price</div>
                <p class="text-white text-sm md:text-lg">
                    This quotes are customized using the information you provided, public, and third-party data. You can
                    <a [routerLink]="['/insurance']" class="underline hover:italic hover:font-(--font-primary)">
                        review your application
                    </a>
                    and make edits if needed.
                </p>
            </div>
        </section>
    `,
    styles: `
        :host {
            display: flex;
            flex-direction: column;
            row-gap: 48px;
            margin-top: 120px;
            padding-bottom: 102px;

            @media (min-width: 768px) {
                margin-top: 164px;
                padding-bottom: 116px;
                row-gap: 80px;
            }
        }
    `,
    host: {
        class: 'sub-summary-sub-header'
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [UiHeadingDirective, RouterLink]
})
export class SummarySubHeader {}
