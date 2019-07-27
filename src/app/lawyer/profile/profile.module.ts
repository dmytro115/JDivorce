import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { JDQuestionnaireModule } from '../../modules/jd-questionnaire/jd-questionnaire.module';
import { OrdersModule } from '../../modules/orders/orders.module';
import { RouterTabModule } from '../../modules/router-tab/router-tab.module';
import { SharedModule } from '../../shared/shared.module';
import { GoogleSigninComponent } from '../google-signin/google-signin.component';
import { AngularMaterialModule } from './../../modules/angular-material/angular-material.module';
import { ConversationsModule } from './../../modules/conversations/conversations.module';
import { AddExperienceDialogComponent } from './containers/experiences/add-experience-dialog.component';
import { AddPracticeAreaDialogComponent } from './containers/practice-area/add-practice-area-dialog.component';
import { AddRecentCasesDialogComponent } from './containers/recent-cases/add-recent-cases-dialog.component';
import { ProfileRoutingModule } from './profile.routing';

import * as fromContainers from './containers';

const containers = [
  fromContainers.WelcomeComponent,
  fromContainers.StagingComponent,
  fromContainers.DisplayPictureComponent,
  fromContainers.ProfessionComponent,
  fromContainers.ContactComponent,
  fromContainers.ExperiencesComponent,
  fromContainers.PracticeAreaComponent,
  fromContainers.RecentCasesComponent,
  fromContainers.PricingComponent,
  fromContainers.CalendarComponent,
  fromContainers.SettingComponent,
  fromContainers.PreviewComponent,
  fromContainers.TableDialogComponent,
  AddExperienceDialogComponent,
  AddPracticeAreaDialogComponent,
  AddRecentCasesDialogComponent
];

@NgModule({
  declarations: [...containers, GoogleSigninComponent],
  imports: [
    CommonModule,
    SharedModule,
    ProfileRoutingModule,
    AngularMaterialModule,
    RouterTabModule,
    NgSelectModule,
    ConversationsModule,
    OrdersModule,
    JDQuestionnaireModule
  ],
  entryComponents: [AddExperienceDialogComponent, AddPracticeAreaDialogComponent, AddRecentCasesDialogComponent]
})
export class ProfileModule {}
