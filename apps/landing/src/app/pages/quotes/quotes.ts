import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Footer } from '@gmi-integrations/shared';
import { QuotesSubHeader } from './sub-header/quotes-sub-header';
import { HelpBlock } from "./help-block/help-block.component";

@Component({
    selector: 'gmi-quotes',
    templateUrl: './quotes.html',
    styleUrl: './quotes.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        Footer,
        QuotesSubHeader,
        HelpBlock
    ]
})
export class Quotes {}
