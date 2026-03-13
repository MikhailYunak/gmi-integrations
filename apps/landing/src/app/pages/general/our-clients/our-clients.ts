import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { UiHeadingDirective } from '@gmi-integrations/ui-kit';
import { SwiperSlider } from '@gmi-integrations/shared';
import { ApiService } from '../../../services';

@Component({
    selector: 'gmi-our-clients',
    templateUrl: './our-clients.html',
    styleUrl: './our-clients.scss',
    host: {
        class: 'our-clients',
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [SwiperSlider, UiHeadingDirective]
})
export class OurClients {
    private readonly _api = inject(ApiService);

    readonly clients = toSignal(this._api.getClients(), { initialValue: [] });
}
