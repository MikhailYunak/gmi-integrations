import { bootstrapApplication } from '@angular/platform-browser';
import { LANDING_CONFIG } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, LANDING_CONFIG).catch((err) => console.error(err));
