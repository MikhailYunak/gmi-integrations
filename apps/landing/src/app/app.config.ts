import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { LANDING_ROUTES } from './app.routes';

export const LANDING_CONFIG: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideHttpClient(withFetch()),
        provideRouter(
            LANDING_ROUTES,
            withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'top' })
        )
    ]
};
