import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

interface CharItem {
  char: string;
  index: number;
}

/**
 * Link Component — 3D flip animation on hover
 *
 * Usage:
 * <ui-link href="/path" label="Learn More" />
 * <ui-link href="/general" fragment="section-id" label="Learn More" />
 * <ui-link href="/path" label="Learn More" [disabled]="true" />
 */
@Component({
    selector: 'ui-link',
    template: `
        @let _disabled = disabled();
        @let _fragment = fragment();

        @if (_fragment !== undefined) {
            <a
                [routerLink]="_disabled ? null : href()"
                [fragment]="_fragment"
                [class.is-disabled]="_disabled"
                [attr.aria-disabled]="_disabled || null"
                [attr.tabindex]="_disabled ? -1 : null"
                [attr.aria-label]="label()"
            >
                <ng-container [ngTemplateOutlet]="linkContent" />
            </a>
        } @else {
            <a
                [href]="_disabled ? null : href()"
                [class.is-disabled]="_disabled"
                [attr.aria-disabled]="_disabled || null"
                [attr.tabindex]="_disabled ? -1 : null"
                [attr.aria-label]="label()"
            >
                <ng-container [ngTemplateOutlet]="linkContent" />
            </a>
        }

        <ng-template #linkContent>
            @for (layer of LAYERS; track layer) {
                <span class="link-text" aria-hidden="true">
                    @for (item of _chars(); track item.index) {
                        @if (item.char === ' ') {
                            <span class="space">&nbsp;</span>
                        } @else {
                            <span class="char" [style.--char-index]="item.index">{{ item.char }}</span>
                        }
                    }
                </span>
            }
        </ng-template>
    `,
    host: {
        class: 'ui-link'
    },
    styleUrl: './ui-link.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterLink, NgTemplateOutlet]
})
export class UiLinkComponent {
    readonly href = input<string>('#');

    readonly label = input.required<string>();

    readonly fragment = input<string | undefined>(undefined);

    readonly disabled = input(false, {
        transform: (v: boolean | string) => v === true || v === 'true'
    });

    protected readonly LAYERS = [0, 1] as const;

    protected readonly _chars = computed<CharItem[]>(() =>
        this.label()
            .split('')
            .map((char, index) => ({ char, index }))
    );
}
