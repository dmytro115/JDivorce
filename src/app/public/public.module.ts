import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { NgsRevealModule } from 'ng-scrollreveal';
import { SlickModule } from 'ngx-slick';
import { NgxSpinnerModule } from 'ngx-spinner';

import { PublicRoutingModule } from './public-routing.module';

import { CookieService } from 'ngx-cookie-service';
import { SharedModule } from '../shared/shared.module';
import { AboutUsComponent } from './aboutus/aboutus.component';
import { AffordComponent } from './afford/afford.component';
import { ContactFormComponent } from './contact-form/contact-form.component';
import { ContactPageComponent } from './contact-page/contact-page.component';
import { EvieLandingTempComponent } from './evie-landing-temp/evie-landing-temp.component';
import { EvieLandingComponent } from './evie-landing/evie-landing.component';
import { EvieLayoutTempComponent } from './evie-layout-temp/evie-layout-temp.component';
import { EvieLayoutComponent } from './evie-layout/evie-layout.component';
import { FaqsComponent } from './faqs/faqs.component';
import { LandingVariantComponent } from './landing-variant/landing-variant.component';
import { LandingComponent } from './landing/landing.component';
import { LawyersHomeComponent } from './lawyers-home/lawyers-home.component';
import { LawyersPageComponent } from './lawyers-page/lawyers-page.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { PublicLayoutVariantComponent } from './public-layout-variant/public-layout-variant.component';
import { PublicLayoutComponent } from './public-layout/public-layout.component';
import { ScrollToTop } from './scroll-to-top';
import { SecurityComponent } from './security/security.component';
import { TermsOfUseComponent } from './terms-of-use/terms-of-use.component';
import { WhiteLabelComponent } from './white-label/white-label.component';

import { AngularMaterialModule } from '../modules/angular-material/angular-material.module';
import { DomesticViolenceComponent } from './domestic-violence/domestic-violence.component';
import { StartComponent } from './start/start.component';

@NgModule({
  declarations: [
    LandingComponent,
    FaqsComponent,
    PrivacyComponent,
    AboutUsComponent,
    ContactPageComponent,
    ContactFormComponent,
    LawyersPageComponent,
    LawyersHomeComponent,
    LandingVariantComponent,
    PublicLayoutVariantComponent,
    PublicLayoutComponent,
    EvieLayoutComponent,
    EvieLandingComponent,
    TermsOfUseComponent,
    SecurityComponent,
    WhiteLabelComponent,
    AffordComponent,
    EvieLayoutTempComponent,
    EvieLandingTempComponent,
    StartComponent,
    DomesticViolenceComponent
  ],
  imports: [
    TranslateModule,
    NgsRevealModule.forRoot(),
    NgbModule,
    PublicRoutingModule,
    SharedModule,
    NgxSpinnerModule,
    AngularMaterialModule,
    SlickModule.forRoot()
  ],
  providers: [ScrollToTop, CookieService]
})
export class PublicModule {}
