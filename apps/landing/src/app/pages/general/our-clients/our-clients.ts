import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NgOptimizedImage } from '@angular/common';
import { UiHeadingDirective } from '@gmi-integrations/ui-kit';
import { SwiperSlider } from '@gmi-integrations/shared';
import { ApiService } from '../../../services';

@Component({
    selector: 'gmi-our-clients',
    templateUrl: './our-clients.html',
    styleUrl: './our-clients.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [SwiperSlider, UiHeadingDirective, NgOptimizedImage]
})
export class OurClients {
    private readonly _api = inject(ApiService);

    readonly clients = toSignal(this._api.getClients(), { initialValue: [] });
}
