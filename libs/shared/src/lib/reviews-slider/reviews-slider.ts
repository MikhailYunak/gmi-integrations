import {
    ChangeDetectionStrategy,
    Component,
    CUSTOM_ELEMENTS_SCHEMA,
    effect,
    ElementRef,
    viewChild
} from '@angular/core';
import { register } from 'swiper/element/bundle';
import { UiButtonDirective, UiHeadingDirective } from '@gmi-integrations/ui-kit';

register();

export interface Review {
    name: string;
    avatarSrc: string;
    rating: number;
    text: string;
    date: string;
}

interface SwiperElement extends HTMLElement {
    swiper: {
        slidePrev: () => void;
        slideNext: () => void
    };
    initialize: () => void;
}

const REVIEWS: Review[] = [
    {
        name: 'Kelly Fox',
        avatarSrc: '/img/reviews/avatar-1.png',
        rating: 4,
        text: 'If interested in getting life insurance would HIGHLY recommend going with the "Insurance Company" Frictionless–fast–policy easily managed from your phone',
        date: '19 January, 2024'
    },
    {
        name: 'HotBurgers',
        avatarSrc: '/img/reviews/avatar-1.png',
        rating: 5,
        text: 'If interested in getting life insurance would HIGHLY recommend going with the "Insurance Company" Frictionless–fast–policy easily managed from your phone',
        date: '19 January, 2024'
    },
    {
        name: 'Kelly Fox',
        avatarSrc: '/img/reviews/avatar-1.png',
        rating: 4,
        text: 'If interested in getting life insurance would HIGHLY recommend going with the "Insurance Company" Frictionless–fast–policy easily managed from your phone',
        date: '19 January, 2024'
    },
    {
        name: 'Sarah Miller',
        avatarSrc: '/img/reviews/avatar-1.png',
        rating: 5,
        text: 'If interested in getting life insurance would HIGHLY recommend going with the "Insurance Company" Frictionless–fast–policy easily managed from your phone',
        date: '19 January, 2024'
    }
];

@Component({
    selector: 'gmi-reviews-slider',
    templateUrl: './reviews-slider.html',
    styleUrl: './reviews-slider.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    imports: [UiButtonDirective, UiHeadingDirective],
})
export class ReviewsSlider {
    private readonly _swiperEl = viewChild.required<ElementRef<SwiperElement>>('swiperEl');

    protected readonly _reviews = REVIEWS;

    constructor() {
        effect(() => {
            const el = this._swiperEl().nativeElement;
            if (el) {
                Object.assign(el, {
                    slidesPerView: 1.2,
                    spaceBetween: 16,
                    centeredSlides: false,
                    slidesOffsetBefore: 16,
                    slidesOffsetAfter: 16,
                    breakpoints: {
                        768: {
                            slidesPerView: 3.2,
                            spaceBetween: 56,
                            centeredSlides: true,
                            slidesOffsetBefore: 0,
                            slidesOffsetAfter: 0
                        }
                    }
                });
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

    protected _filledStars(rating: number): number[] {
        return Array.from({ length: rating }, (_, i) => i);
    }

    protected _emptyStars(rating: number, max = 5): number[] {
        return Array.from({ length: max - rating }, (_, i) => i);
    }
}
