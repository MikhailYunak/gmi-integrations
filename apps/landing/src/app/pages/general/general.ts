import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SubHeader } from './sub-header/sub-header';
import { HowToGet } from './how-to-get/how-to-get';

@Component({
    selector: 'gmi-general',
    templateUrl: './general.html',
    styleUrls: ['./general.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [SubHeader, HowToGet]
})
export class General {}
