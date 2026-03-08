import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { UiButtonDirective, UiHeadingDirective } from '@gmi-integrations/ui-kit';

@Component({
    selector: 'gmi-already-insured',
    template: `
        <!-- Image side -->
        <div class="order-2 md:order-1 relative w-full md:w-1/2 h-290 md:h-480 shrink-0">
            <img ngSrc="/img/already-insured-img.svg" alt="Woman with umbrella" fill priority disableOptimizedSrcset />
        </div>

        <!-- Content side -->
        <div class="flex flex-col items-center order-1 md:order-2 md:items-start gap-y-48 px-24 md:px-0 md:py-0">
            <div class="flex flex-col gap-y-16">
                <h2 uiHeading class="text-green-900 text-center md:text-left">
                    <span uiHeading variant="italic">Already</span>
                    insured?
                </h2>
                <h4 uiHeading class="text-green-500 text-center md:text-left">
                    We will help you switch!
                </h4>
            </div>
            <button uiButton="primary">Fill Out The Form</button>
        </div>
    `,
    styles: `
        :host {
            display: flex;
            flex-direction: column;
            align-items: center;
            row-gap: 24px;
            width: 100%;

            @media (width >= 48rem /* 768px */) {
                flex-direction: row;
                justify-content: center;
                column-gap: 100px;
            }
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgOptimizedImage, UiButtonDirective, UiHeadingDirective]
})
export class AlreadyInsured {}
