import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SubHeader } from './sub-header/sub-header';
import { HowToGet } from './how-to-get/how-to-get';
import { AlreadyInsured } from './already-insured/already-insured';
import { FrequentlyAskedQuestions } from './frequently-asked-questions/frequently-asked-questions';
import { ReviewsSection } from './reviews-section/reviews-section';
import { RestaurantsSlider } from './restaurants-slider/restaurants-slider';
import { Footer, MarqueeSection } from '@gmi-integrations/shared';

@Component({
    selector: 'gmi-general',
    templateUrl: './general.html',
    styleUrls: ['./general.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        SubHeader,
        HowToGet,
        AlreadyInsured,
        FrequentlyAskedQuestions,
        ReviewsSection,
        RestaurantsSlider,
        Footer,
        MarqueeSection
    ]
})
export class General {}
