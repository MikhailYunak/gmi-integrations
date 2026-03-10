import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UiButtonDirective, UiHeadingDirective } from '@gmi-integrations/ui-kit';
import { SwiperSlider } from '@gmi-integrations/shared';
import { ApiService } from '../../../services';
import { FloorRatingPipe } from './floor-rating.pipe';
import { FilledStarsPipe } from './filled-stars.pipe';
import { EmptyStarsPipe } from './empty-stars.pipe';
import { AverageRatingPipe } from './average-rating.pipe';

@Component({
    selector: 'gmi-reviews-section',
    templateUrl: './reviews-section.html',
    styleUrl: './reviews-section.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        RouterLink,
        DatePipe,
        SwiperSlider,
        UiButtonDirective,
        UiHeadingDirective,
        FloorRatingPipe,
        FilledStarsPipe,
        EmptyStarsPipe,
        AverageRatingPipe
    ]
})
export class ReviewsSection {
    private readonly _api = inject(ApiService);

    readonly ratings = toSignal(this._api.getRatings(), { initialValue: [] });
}
