import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AffordComponent } from './public/afford/afford.component';
import { EvieLandingTempComponent } from './public/evie-landing-temp/evie-landing-temp.component';
import { EvieLandingComponent } from './public/evie-landing/evie-landing.component';
import { EvieLayoutTempComponent } from './public/evie-layout-temp/evie-layout-temp.component';
import { EvieLayoutComponent } from './public/evie-layout/evie-layout.component';
import { LandingVariantComponent } from './public/landing-variant/landing-variant.component';
import { PublicLayoutVariantComponent } from './public/public-layout-variant/public-layout-variant.component';
import { SecurityComponent } from './public/security/security.component';
import { WhiteLabelComponent } from './public/white-label/white-label.component';

import { LayoutComponent } from './main/layout/layout.component';
import { AboutUsComponent } from './public/aboutus/aboutus.component';
import { ContactPageComponent } from './public/contact-page/contact-page.component';
import { FaqsComponent } from './public/faqs/faqs.component';
import { LandingComponent } from './public/landing/landing.component';
import { LawyersHomeComponent } from './public/lawyers-home/lawyers-home.component';
import { LawyersPageComponent } from './public/lawyers-page/lawyers-page.component';
import { PrivacyComponent } from './public/privacy/privacy.component';
import { PublicLayoutComponent } from './public/public-layout/public-layout.component';

import { PageNotFoundComponent } from './shared/errors/page-not-found/page-not-found.component';
import { LawyerProfileContactComponent } from './shared/lawyer-profile/lawyer-profile-contact/lawyer-profile-contact.component';
import { LawyerProfileComponent } from './shared/lawyer-profile/lawyer-profile.component';

const clientModule = './client/client.module#ClientModule';
const lawyerModule = './lawyer/lawyer.module#LawyerModule';
const plansModule = './public/plans/plans.module#PlansModule';

import { AuthGuard } from './core/auth/auth-guard.service';
import { DomesticViolenceComponent } from './public/domestic-violence/domestic-violence.component';
import { StartComponent } from './public/start/start.component';
import { TermsOfUseComponent } from './public/terms-of-use/terms-of-use.component';

const routes: Routes = [
  { path: 'auth', loadChildren: './core/auth/auth.module#AuthModule' },
  { path: 'test', loadChildren: './test/test.module#TestModule' },
  { path: 'start', component: StartComponent },
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: '', component: LandingComponent },
      // { path: '', component: EvieLandingComponent },
      { path: 'a', component: LandingComponent }
    ]
  },
  { path: 'h', component: PublicLayoutVariantComponent, children: [{ path: '', component: LandingVariantComponent }] },
  { path: 'c', component: EvieLayoutComponent, children: [{ path: '', component: EvieLandingComponent }] },
  { path: 'd', component: EvieLayoutComponent, children: [{ path: '', component: EvieLandingComponent }] },
  { path: 'af', component: EvieLayoutTempComponent, children: [{ path: '', component: EvieLandingTempComponent }] },
  { path: 'domestic-violence', component: EvieLayoutComponent, children: [{ path: '', component: DomesticViolenceComponent }] },
  { path: 'white-label', component: WhiteLabelComponent },
  { path: 'affordable', component: AffordComponent },
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: 'faqs', component: FaqsComponent },
      { path: 'privacy', component: PrivacyComponent },
      { path: 'terms-of-use', component: TermsOfUseComponent },
      { path: 'security', component: SecurityComponent },
      { path: 'about', component: AboutUsComponent },
      { path: 'contact', component: ContactPageComponent },
      { path: 'lawyers', component: LawyersPageComponent },
      { path: 'lawyers-home', component: LawyersHomeComponent }
    ]
  },
  { path: '', component: EvieLayoutComponent, children: [{ path: 'plans', loadChildren: plansModule }] },
  {
    path: 'a',
    component: LayoutComponent,
    children: [{ path: 'c', loadChildren: clientModule, canActivate: [AuthGuard] }, { path: 'l', loadChildren: lawyerModule, canActivate: [AuthGuard] }]
  },
  { path: 'lawyer/:id', component: LawyerProfileComponent },
  { path: 'lawyer/:id/contact', component: LawyerProfileContactComponent },

  { path: 'start/:application', component: StartComponent },

  { path: '404', component: PageNotFoundComponent },
  { path: '**', redirectTo: '404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule {}
