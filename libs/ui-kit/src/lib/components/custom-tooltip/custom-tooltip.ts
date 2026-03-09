import { ChangeDetectionStrategy, Component, input, Input } from '@angular/core';

@Component({
    selector: 'gmi-custom-tooltip',
    template: `
        <div class="tooltip-container">
            <div class="tooltip-content">
                <div class="icon-wrapper">
                    <ng-content select="[icon]"></ng-content>
                </div>
                <div class="text-content">
                    {{ text() }}
                </div>
            </div>
            <div class="tooltip-arrow"></div>
        </div>
    `,
    styleUrl: './custom-tooltip.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomTooltipComponent {
    text = input<string>();
}
