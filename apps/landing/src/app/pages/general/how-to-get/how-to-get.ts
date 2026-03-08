import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UiButtonDirective, UiHeadingDirective } from '@gmi-integrations/ui-kit';
import { QuarterCircleElement } from './quarter-circle-element/quarter-circle-element';

type Step = {
    number: string;
    title: string;
    description: string;
    badgeColor: string;
}

@Component({
    selector: 'gmi-how-to-get',
    template: `
        <h2 uiHeading class="text-green-700 text-center">
            <span uiHeading variant="italic">How to quickly get</span>
            insurance?
        </h2>

        <div class="flex flex-col md:flex-row md:items-center gap-x-40 gap-y-28">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-y-48 gap-x-20  flex-1 md:mt-48">
                @for (step of steps; track step.number) {
                    <div class="flex flex-col gap-12">
                        <div class="flex items-start gap-16">
                            <gmi-quarter-circle-element class="self-start" [color]="step.badgeColor">
                                {{ step.number }}
                            </gmi-quarter-circle-element>
                            <div class="flex flex-col pt-28 pr-40 gap-y-12 md:gap-y-16">
                                <h5 uiHeading class="uppercase">{{ step.title }}</h5>
                                <p class="text-body text-gray-600 step-description">{{ step.description }}</p>
                            </div>
                        </div>
                    </div>
                }
            </div>

            <div class="relative w-full md:w-570 h-380 md:h-555 shrink-0">
                <img ngSrc="/img/how-to-get-container.svg" alt="" fill priority disableOptimizedSrcset />
            </div>
        </div>

        <div class="flex justify-center">
            <button type="button" uiButton="primary" [routerLink]="['/insurance']">Get Insurance</button>
        </div>
    `,
    styles: `
        :host {
            display: flex;
            flex-direction: column;
            row-gap: 24px;
            padding-top: 48px;
            padding-bottom: 48px;

            @media (min-width: 768px) {
                row-gap: 0;
                padding-top: 80px;
                padding-bottom: 116px;
            }
        }
    `,
    host: {
        class: 'how-to-get'
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgOptimizedImage, RouterLink, UiButtonDirective, UiHeadingDirective, QuarterCircleElement]
})
export class HowToGet {
    readonly steps: Step[] = [
        {
            number: '01',
            title: 'A Streamlined Application Process',
            description: 'One questionnaire gives you quotes from every major carrier.',
            badgeColor: 'hsla(160, 64%, 62%, 1)'
        },
        {
            number: '02',
            title: 'Select an Offer',
            description: 'Compare programs from different insurance companies and choose the best option for you.',
            badgeColor: 'hsla(119, 75%, 76%, 1)'
        },
        {
            number: '03',
            title: 'Pay Online by Card',
            description: 'Pay by card of any bank without additional fees.',
            badgeColor: 'hsla(61, 90%, 55%, 1)'
        },
        {
            number: '04',
            title: 'Get Your Policy Online',
            description:
                'Immediately after successful payment, a letter with a link to the policy is sent to email and WhatsApp.',
            badgeColor: 'hsla(263, 100%, 89%, 1)'
        }
    ];
}
