import { ChangeDetectionStrategy, Component, computed, input, TemplateRef } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

@Component({
    selector: 'gmi-marquee-section',
    template: `
        <div class="marquee-wrapper">
            <div class="marquee-track">
                @for (item of _data(); track $index) {
                    <ng-template [ngTemplateOutlet]="templateRef() ?? defaultTpl"></ng-template>
                }
            </div>
            <div class="marquee-track" aria-hidden="true">
                @for (item of _data(); track $index) {
                    <ng-template [ngTemplateOutlet]="templateRef() ?? defaultTpl"></ng-template>
                }
            </div>
        </div>
        <ng-template #defaultTpl>
            <span>example</span>
        </ng-template>
    `,
    imports: [NgTemplateOutlet],
    styleUrl: './marquee-section.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarqueeSection {
    readonly templateRef = input<TemplateRef<unknown> | undefined>(undefined);

    readonly numberOfElements = input<number>(10);

    protected readonly _data = computed(() => Array.from({ length: this.numberOfElements() }));
}
