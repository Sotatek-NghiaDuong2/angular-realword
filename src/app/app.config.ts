import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { httpInterceptorProviders } from '../shared/interceptor';
import {
  QueryClient,
  provideAngularQuery,
} from '@tanstack/angular-query-experimental';
import { HttpClientModule } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    importProvidersFrom(HttpClientModule),
    httpInterceptorProviders,
    provideAngularQuery(new QueryClient()),
  ],
};
