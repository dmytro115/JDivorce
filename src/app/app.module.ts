import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { ErrorHandler, Inject, Injectable, InjectionToken, isDevMode, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { environment } from '../environments/environment';
import { PlansModule } from './public/plans/plans.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Eagerly Load
import { CoreModule } from './core/core.module';
import { MainModule } from './main/main.module';
import { PublicModule } from './public/public.module';
import { PageNotFoundComponent } from './shared/errors/page-not-found/page-not-found.component';
import { SharedModule } from './shared/shared.module';

// Angulartics
import { Angulartics2Module } from 'angulartics2';
import { Angulartics2GoogleTagManager } from 'angulartics2/gtm';

import * as Rollbar from 'rollbar';
import { rollbarConfig, RollbarErrorHandler, RollbarService } from './core/rollbar/rollbar.service';

// Other modules
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { NgsRevealModule } from 'ng-scrollreveal';
import { ModalDialogModule } from 'ngx-modal-dialog';
import { AuthModule } from './core/auth/auth.module';
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

export function rollbarFactory() {
  return new Rollbar(rollbarConfig);
}

@NgModule({
  declarations: [AppComponent, PageNotFoundComponent],
  imports: [
    PlansModule,
    AppRoutingModule,
    BrowserModule,
    ModalDialogModule.forRoot(),
    BrowserAnimationsModule,
    HttpClientModule,
    NgbModule.forRoot(),
    PublicModule,
    CoreModule,
    SharedModule,
    MainModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    NgsRevealModule,
    LoadingBarHttpClientModule,
    Angulartics2Module.forRoot([Angulartics2GoogleTagManager]),
    AuthModule
  ],
  bootstrap: [AppComponent],
  providers: [{ provide: ErrorHandler, useClass: RollbarErrorHandler }, { provide: RollbarService, useFactory: rollbarFactory }]
})
export class AppModule {}
