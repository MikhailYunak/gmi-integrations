import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SubHeader } from './sub-header/sub-header';
import { HowToGet } from './how-to-get/how-to-get';
import { AlreadyInsured } from './already-insured/already-insured';
import { FrequentlyAskedQuestions } from './frequently-asked-questions/frequently-asked-questions';
import { ReviewsSection } from './reviews-section/reviews-section';
import { OurClients } from './our-clients/our-clients';
import { Footer, MarqueeSection } from '@gmi-integrations/shared';

@Component({
    selector: 'gmi-general',
    templateUrl: './general.html',
    styles: `
        :host {
            display: flex;
            flex-direction: column;
            margin-top: -82px;
            width: 100%;
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        SubHeader,
        HowToGet,
        AlreadyInsured,
        FrequentlyAskedQuestions,
        ReviewsSection,
        OurClients,
        Footer,
        MarqueeSection
    ]
})
export class General {}
