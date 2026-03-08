import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'gmi-about-your-restaurant',
    template: `<p>About Your Restaurant</p>`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutYourRestaurant {}
