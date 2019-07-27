import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import * as fromContainers from './containers';

const routes: Routes = [{
  path: '',
  component: fromContainers.StagingComponent,
  children: [
    { path: "", redirectTo: "welcome" },
    { path: "welcome", component: fromContainers.WelcomeComponent },
    { path: "display-photo", component: fromContainers.DisplayPictureComponent },
    { path: "profession", component: fromContainers.ProfessionComponent },
    { path: "contact", component: fromContainers.ContactComponent },
    { path: "experiences", component: fromContainers.ExperiencesComponent },
    { path: "practice-areas", component: fromContainers.PracticeAreaComponent },
    { path: "recent-cases", component: fromContainers.RecentCasesComponent },
    { path: "pricing", component: fromContainers.PricingComponent },
    { path: "calendar", component: fromContainers.CalendarComponent },
    { path: "settings", component: fromContainers.SettingComponent },
    { path: "preview", component: fromContainers.PreviewComponent }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule {

}
