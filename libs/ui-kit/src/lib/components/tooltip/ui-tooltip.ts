import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    Directive,
    ElementRef,
    ViewEncapsulation,
    inject,
    input
} from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { ConnectedPosition, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';

export type UiTooltipPosition = 'top' | 'bottom' | 'left' | 'right';

let _nextTooltipId = 0;

const TOOLTIP_POSITIONS: Record<UiTooltipPosition, ConnectedPosition[]> = {
    top: [
        { originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom', offsetY: -8 },
        { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top', offsetY: 8 }
    ],
    bottom: [
        { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top', offsetY: 8 },
        { originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom', offsetY: -8 }
    ],
    left: [
        { originX: 'start', originY: 'center', overlayX: 'end', overlayY: 'center', offsetX: -8 },
        { originX: 'end', originY: 'center', overlayX: 'start', overlayY: 'center', offsetX: 8 }
    ],
    right: [
        { originX: 'end', originY: 'center', overlayX: 'start', overlayY: 'center', offsetX: 8 },
        { originX: 'start', originY: 'center', overlayX: 'end', overlayY: 'center', offsetX: -8 }
    ]
};

function _resolveArrowSide(pos: ConnectedPosition): UiTooltipPosition {
    if (pos.overlayY === 'bottom') return 'top';
    if (pos.overlayY === 'top') return 'bottom';
    if (pos.overlayX === 'end') return 'left';
    return 'right';
}

@Component({
    selector: 'ui-tooltip-content',
    imports: [NgOptimizedImage],
    template: `
        {{ text() }}
        <img class="ui-tooltip-arrow" ngSrc="/icon/tooltip-arrow.svg" width="20" height="8" alt="" aria-hidden="true">
    `,
    styleUrl: './ui-tooltip.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        class: 'ui-tooltip',
        '[attr.id]': 'id()',
        '[attr.data-arrow]': 'arrowSide()',
        role: 'tooltip'
    }
})
export class UiTooltipContent {
    readonly text = input('');
    readonly id = input('');
    readonly arrowSide = input<UiTooltipPosition>('top');
}

@Directive({
    selector: '[uiTooltip]',
    host: {
        '(mouseenter)': '_show()',
        '(mouseleave)': '_hide()',
        '(focus)': '_show()',
        '(blur)': '_hide()',
        '[attr.aria-describedby]': '_tooltipId'
    }
})
export class UiTooltipDirective {
    private readonly _overlay = inject(Overlay);

    private readonly _elementRef = inject(ElementRef);

    private readonly _destroyRef = inject(DestroyRef);

    private _overlayRef: OverlayRef | null = null;

    protected readonly _tooltipId = `ui-tooltip-${_nextTooltipId++}`;

    readonly uiTooltip = input('');

    readonly tooltipPosition = input<UiTooltipPosition>('top');

    readonly tooltipDisabled = input(false, {
        transform: (v: boolean | string) => v === true || v === 'true'
    });

    constructor() {
        this._destroyRef.onDestroy(() => this._overlayRef?.dispose());
    }

    protected _show(): void {
        if (this.tooltipDisabled() || !this.uiTooltip()) return;

        const positionStrategy = this._overlay
            .position()
            .flexibleConnectedTo(this._elementRef)
            .withPositions(TOOLTIP_POSITIONS[this.tooltipPosition()])
            .withFlexibleDimensions(false)
            .withPush(false);

        this._overlayRef = this._overlay.create({
            positionStrategy,
            scrollStrategy: this._overlay.scrollStrategies.reposition()
        });

        const ref = this._overlayRef.attach(new ComponentPortal(UiTooltipContent));
        ref.setInput('text', this.uiTooltip());
        ref.setInput('id', this._tooltipId);
        ref.setInput('arrowSide', this.tooltipPosition());

        positionStrategy.positionChanges.subscribe(change => {
            ref.setInput('arrowSide', _resolveArrowSide(change.connectionPair));
        });
    }

    protected _hide(): void {
        if (this._overlayRef) {
            this._overlayRef.dispose();
            this._overlayRef = null;
        }
    }
}
