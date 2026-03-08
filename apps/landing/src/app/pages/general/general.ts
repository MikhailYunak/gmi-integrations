import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SubHeader } from './sub-header/sub-header';
import { HowToGet } from './how-to-get/how-to-get';
import { AlreadyInsured } from './already-insured/already-insured';
import { FrequentlyAskedQuestions } from './frequently-asked-questions/frequently-asked-questions';
import { Footer, MarqueeSection, ReviewsSlider } from '@gmi-integrations/shared';

@Component({
    selector: 'gmi-general',
    templateUrl: './general.html',
    styleUrls: ['./general.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [SubHeader, HowToGet, AlreadyInsured, FrequentlyAskedQuestions, Footer, MarqueeSection, ReviewsSlider]
})
export class General {}
