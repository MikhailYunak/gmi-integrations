import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'gmi-general-information',
    template: `<p>General Information</p>`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GeneralInformation {}
