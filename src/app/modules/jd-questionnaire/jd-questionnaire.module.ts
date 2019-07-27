import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ngfModule } from 'angular-file';
import { ActionCableService } from 'angular2-actioncable';
import { SignaturePadModule } from 'angular2-signaturepad';
import { ClickOutsideModule } from 'ng-click-outside';
import { SidebarModule } from 'ng-sidebar';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { SharedModule } from '../../shared/shared.module';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { EvaluatorsService } from './evaluators/evaluators.service';
import { HelpSidebarComponent } from './help-sidebar/help-sidebar.component';
import { JDQuestionnaireAddressComponent } from './jd-questionnaire-address/jd-questionnaire-address.component';
import { JdQuestionnaireBlogPostsComponent } from './jd-questionnaire-blog-posts/jd-questionnaire-blog-posts.component';
import { JDQuestionnaireCheckboxComponent } from './jd-questionnaire-checkbox/jd-questionnaire-checkbox.component';
import { JdQuestionnaireCompactComponent } from './jd-questionnaire-compact/jd-questionnaire-compact.component';
import { DynamicFormQuestionComponent } from './jd-questionnaire-compact/question/question.component';
import { JDQuestionnaireDateComponent } from './jd-questionnaire-date/jd-questionnaire-date.component';
import { JDQuestionnaireDropdownComponent } from './jd-questionnaire-dropdown/jd-questionnaire-dropdown.component';
import { JDQuestionnaireHeightInputComponent } from './jd-questionnaire-height/jd-questionnaire.height-input.component';
import { JDQuestionnaireIframeComponent } from './jd-questionnaire-iframe/jd-questionnaire-iframe.component';
import { JDQuestionnaireInputComponent } from './jd-questionnaire-input/jd-questionnaire-input.component';
import { JdQuestionnaireLongTextComponent } from './jd-questionnaire-long-text/jd-questionnaire-long-text.component';
import { JDQuestionnaireMatrixComponent } from './jd-questionnaire-matrix/jd-questionnaire-matrix.component';
import { JDQuestionnaireRadioComponent } from './jd-questionnaire-radio/jd-questionnaire-radio.component';
import { JDQuestionnaireSignaturePadComponent } from './jd-questionnaire-signature-pad/jd-questionnaire-signature-pad.component';
import { JDQuestionnaireStatementComponent } from './jd-questionnaire-statement/jd-questionnaire-statement.component';
import { JdQuestionnaireTelephoneComponent } from './jd-questionnaire-telephone/jd-questionnaire-telephone.component';
import { JDQuestionnaireUploadComponent } from './jd-questionnaire-upload/jd-questionnaire-upload.component';
import { JdQuestionnaireVerboseComponent } from './jd-questionnaire-verbose/jd-questionnaire-verbose.component';
import { JDQuestionnaireWeightComponent } from './jd-questionnaire-weight/jd-questionnaire-weight.component';
import { JDQuestionnaireComponent } from './jd-questionnaire.component';
import { FillPipe } from './pipes/fill.pipe';
import { IsRequiredPipe } from './pipes/is-required.pipe';

@NgModule({
  declarations: [
    JDQuestionnaireComponent,
    JDQuestionnaireInputComponent,
    JDQuestionnaireRadioComponent,
    JDQuestionnaireCheckboxComponent,
    JDQuestionnaireDropdownComponent,
    JDQuestionnaireIframeComponent,
    JdQuestionnaireLongTextComponent,
    JDQuestionnaireDateComponent,
    JDQuestionnaireStatementComponent,
    JDQuestionnaireAddressComponent,
    JDQuestionnaireMatrixComponent,
    JDQuestionnaireUploadComponent,
    FillPipe,
    IsRequiredPipe,
    JdQuestionnaireBlogPostsComponent,
    JdQuestionnaireCompactComponent,
    JdQuestionnaireVerboseComponent,
    DynamicFormQuestionComponent,
    JdQuestionnaireTelephoneComponent,
    JDQuestionnaireHeightInputComponent,
    JDQuestionnaireWeightComponent,
    JDQuestionnaireSignaturePadComponent,
    HelpSidebarComponent
  ],
  imports: [
    SignaturePadModule,
    CommonModule,
    RouterModule,
    FormsModule,
    SidebarModule,
    ClickOutsideModule,
    GooglePlaceModule,
    ReactiveFormsModule,
    SharedModule,
    AngularMaterialModule,
    ngfModule
  ],
  providers: [EvaluatorsService, ActionCableService],
  exports: [
    JDQuestionnaireComponent,
    JDQuestionnaireInputComponent,
    JDQuestionnaireRadioComponent,
    JDQuestionnaireCheckboxComponent,
    JDQuestionnaireDropdownComponent,
    JDQuestionnaireIframeComponent,
    JDQuestionnaireUploadComponent
  ]
})
export class JDQuestionnaireModule {}
