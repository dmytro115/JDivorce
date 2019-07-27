import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { ActionCableService } from 'angular2-actioncable';
import { AuthGuard } from './auth/auth-guard.service';
import { AuthService } from './auth/auth.service';
import { LawyerCalendarService, SlotSelectionService } from './calendar';
import { ClientDashboardDataService, ClientService } from './client';
import { ContactUsService } from './contact-us';
import { TokenInterceptor } from './interceptor/token.interceptor';
import { UrlInterceptor } from './interceptor/url.interceptor';
import { MixpanelService } from './mixpanel';
import { PNotifyService } from './pnotify';
import { RouteChangeService } from './route-change';
import { ActionCableWrapperService } from './services/action-cable-wrapper.service';
import { DocumentsService } from './services/court-documents/documents.service';
import { ShareAppService } from './share';
import { StripeService } from './stripe';
import { UploadDocumentService } from './upload-document';

@NgModule({
  declarations: [],
  imports: [HttpClientModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: UrlInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    AuthGuard,
    AuthService,
    ClientDashboardDataService,
    ClientService,
    ContactUsService,
    LawyerCalendarService,
    SlotSelectionService,
    MixpanelService,
    RouteChangeService,
    ShareAppService,
    StripeService,
    UploadDocumentService,
    PNotifyService,
    DocumentsService,
    ActionCableService,
    ActionCableWrapperService
  ],
  exports: []
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import it in the AppModule only');
    }
  }
}
