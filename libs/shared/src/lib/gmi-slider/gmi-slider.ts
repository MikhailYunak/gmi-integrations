import {
    ChangeDetectionStrategy,
    Component,
    CUSTOM_ELEMENTS_SCHEMA,
    effect,
    ElementRef,
    input,
    TemplateRef,
    viewChild,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { register } from 'swiper/element';
import { Navigation } from 'swiper/modules';

register();

interface SwiperElement extends HTMLElement {
    swiper: { slidePrev: () => void; slideNext: () => void };
    initialize: () => void;
}

export interface SliderOptions {
    slidesPerView?: number | 'auto';
    spaceBetween?: number;
    centeredSlides?: boolean;
    slidesOffsetBefore?: number;
    slidesOffsetAfter?: number;
    loop?: boolean;
    breakpoints?: Record<number, Omit<SliderOptions, 'breakpoints'>>;
}

const DEFAULT_OPTIONS: SliderOptions = {
    slidesPerView: 1.2,
    spaceBetween: 16,
    centeredSlides: false,
    slidesOffsetBefore: 16,
    slidesOffsetAfter: 16,
    breakpoints: {
        768: {
            slidesPerView: 3.2,
            spaceBetween: 24,
            centeredSlides: false,
            slidesOffsetBefore: 0,
            slidesOffsetAfter: 0,
        },
    },
};

@Component({
    selector: 'gmi-swiper-slider',
    templateUrl: './gmi-slider.html',
    styleUrl: './gmi-slider.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    imports: [NgTemplateOutlet],
})
export class SwiperSlider<T> {
    private readonly _swiperEl = viewChild.required<ElementRef<SwiperElement>>('swiperEl');

    readonly slides = input.required<T[]>();

    readonly slideTemplate = input.required<TemplateRef<{ $implicit: T }>>();

    readonly swiperOptions = input<SliderOptions>({});

    readonly navPrevLabel = input('Previous slide');

    readonly navNextLabel = input('Next slide');

    constructor() {
        effect(() => {
            const el = this._swiperEl().nativeElement;
            if (el) {
                Object.assign(el, { modules: [Navigation], ...DEFAULT_OPTIONS, ...this.swiperOptions() });
                el.initialize();
            }
        });
    }

    protected _slidePrev(): void {
        this._swiperEl().nativeElement.swiper.slidePrev();
    }

    protected _slideNext(): void {
        this._swiperEl().nativeElement.swiper.slideNext();
    }
}
