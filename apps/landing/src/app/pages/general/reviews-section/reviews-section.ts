import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UiButtonDirective, UiHeadingDirective } from '@gmi-integrations/ui-kit';
import { SwiperSlider } from '@gmi-integrations/shared';

export interface Review {
    name: string;
    avatarSrc: string;
    rating: number;
    text: string;
    date: string;
}

const REVIEWS: Review[] = [
    {
        name: 'Kelly Fox',
        avatarSrc: '/img/reviews/avatar-1.png',
        rating: 4,
        text: 'If interested in getting life insurance would HIGHLY recommend going with the "Insurance Company" Frictionless–fast–policy easily managed from your phone',
        date: '19 January, 2024',
    },
    {
        name: 'HotBurgers',
        avatarSrc: '/img/reviews/avatar-1.png',
        rating: 5,
        text: 'If interested in getting life insurance would HIGHLY recommend going with the "Insurance Company" Frictionless–fast–policy easily managed from your phone',
        date: '19 January, 2024',
    },
    {
        name: 'Kelly Fox',
        avatarSrc: '/img/reviews/avatar-1.png',
        rating: 4,
        text: 'If interested in getting life insurance would HIGHLY recommend going with the "Insurance Company" Frictionless–fast–policy easily managed from your phone',
        date: '19 January, 2024',
    },
    {
        name: 'Sarah Miller',
        avatarSrc: '/img/reviews/avatar-1.png',
        rating: 5,
        text: 'If interested in getting life insurance would HIGHLY recommend going with the "Insurance Company" Frictionless–fast–policy easily managed from your phone',
        date: '19 January, 2024',
    },
];

@Component({
    selector: 'gmi-reviews-section',
    templateUrl: './reviews-section.html',
    styleUrl: './reviews-section.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterLink, SwiperSlider, UiButtonDirective, UiHeadingDirective],
})
export class ReviewsSection {
    protected readonly _reviews: unknown[] = REVIEWS;

    protected _asReview(v: unknown): Review {
        return v as Review;
    }

    protected _filledStars(rating: number): number[] {
        return Array.from({ length: rating }, (_, i) => i);
    }

    protected _emptyStars(rating: number, max = 5): number[] {
        return Array.from({ length: max - rating }, (_, i) => i);
    }
}
