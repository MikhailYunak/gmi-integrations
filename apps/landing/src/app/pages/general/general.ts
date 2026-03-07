import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SubHeader } from './sub-header/sub-header';

@Component({
    selector: 'gmi-general',
    templateUrl: './general.html',
    styleUrls: ['./general.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [SubHeader]
})
export class General {}
