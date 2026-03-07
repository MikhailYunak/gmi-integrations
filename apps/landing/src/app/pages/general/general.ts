import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SubHeader } from './sub-header/sub-header';
import { HowToGet } from './how-to-get/how-to-get';
import { Footer } from '@gmi-integrations/shared';

@Component({
    selector: 'gmi-general',
    templateUrl: './general.html',
    styleUrls: ['./general.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [SubHeader, HowToGet, Footer]
})
export class General {}
