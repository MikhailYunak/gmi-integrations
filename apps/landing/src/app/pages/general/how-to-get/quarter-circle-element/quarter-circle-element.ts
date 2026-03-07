import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
    selector: 'gmi-quarter-circle-element',
    template: `
        <ng-content></ng-content>
    `,
    styles: `
        :host.quarter-circle-element {
            position: relative;
            flex-shrink: 0;
            display: inline-block;
            width: 90px;
            height: 90px;

            font-family: 'Playfair Display', serif;
            font-size: 80px;
            font-weight: 400;
            font-style: italic;
            line-height: 1;
            color: var(--primary-forest);
            z-index: 2;

            &::before {
                content: '';
                position: absolute;
                padding: 14px 10px 10px 14px;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 65px;
                height: 65px;
                background-color: var(--quarter-circle-element-bg-color, hsla(160, 64%, 62%, 1));
                border-radius: 0 100% 0 0;
                z-index: -1;
            }
        }
    `,
    host: {
        class: 'quarter-circle-element',
        '[style.--quarter-circle-element-bg-color]': 'color()'
    },
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuarterCircleElement {
    readonly color = input<string>();
}
