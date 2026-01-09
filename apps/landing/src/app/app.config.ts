import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { LANDING_ROUTES } from './app.routes';

export const LANDING_CONFIG: ApplicationConfig = {
  providers: [provideBrowserGlobalErrorListeners(), provideRouter(LANDING_ROUTES)],
};
