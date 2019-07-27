import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { NgxMaskModule } from 'ngx-mask';
import { OrderModule } from 'ngx-order-pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { SlickModule } from 'ngx-slick';

import { TimelineComponent } from './timeline/timeline.component';

import { CustomHtmlModalComponent } from './custom-html-modal/custom-html-modal.component';
import { LawyerPlansComponent } from './lawyer-profile/lawyer-plans/lawyer-plans.component';
import { LawyerProfileContactComponent } from './lawyer-profile/lawyer-profile-contact/lawyer-profile-contact.component';
import { LawyerProfileComponent } from './lawyer-profile/lawyer-profile.component';
import { LawyersBlockComponent } from './lawyers-block/lawyers-block.component';

import * as fromComponents from './components';
import * as fromDirectives from './directives';
import * as fromPipes from './pipes';

import { AngularMaterialModule } from '../modules/angular-material/angular-material.module';
import { PricingOptionDescriptionBottomSheetComponent } from './components/pricing-block/pricing-option-description-bottom-sheet.component';
import { ShowErrorsComponent } from './show-errors/show-errors.component';

const components = [
  fromComponents.LawyerCalendarSelectionComponent,
  fromComponents.GoogleAddressInputComponent,
  fromComponents.MiniDiagnosticComponent,
  fromComponents.NotificationCardComponent,
  fromComponents.PricingBlockComponent,
  fromComponents.ProgressSpinnerComponent
];
const directives = [fromDirectives.ClickOutsideDirective, fromDirectives.ShowAuthedDirective];
const pipes = [fromPipes.LengthPipe, fromPipes.ProfileImgPipe, fromPipes.PlansFilterPipe];

@NgModule({
  declarations: [
    TimelineComponent,
    LawyersBlockComponent,
    LawyerProfileComponent,
    LawyerProfileContactComponent,
    LawyerPlansComponent,
    CustomHtmlModalComponent,
    PricingOptionDescriptionBottomSheetComponent,
    ShowErrorsComponent,
    ...components,
    ...directives,
    ...pipes
  ],
  imports: [
    TranslateModule,
    CommonModule,
    RouterModule,
    NgbModule,

    // @angular/forms
    FormsModule,
    ReactiveFormsModule,

    OrderModule,
    NgSelectModule,
    SweetAlert2Module.forRoot(),
    SlickModule.forRoot(),
    NgxMaskModule.forRoot(),
    NgxPaginationModule,
    AngularMaterialModule
  ],
  exports: [
    TranslateModule,
    CommonModule,
    NgbModule,

    // @angular/forms
    FormsModule,
    ReactiveFormsModule,

    ...components,
    ...directives,
    ...pipes,

    TimelineComponent,
    SweetAlert2Module,
    NgxMaskModule,
    LawyersBlockComponent,
    LawyerProfileComponent,
    OrderModule,
    CustomHtmlModalComponent,
    ShowErrorsComponent
  ],
  entryComponents: [PricingOptionDescriptionBottomSheetComponent]
})
export class SharedModule {}
