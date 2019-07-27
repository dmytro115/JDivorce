import { CdkTreeModule } from '@angular/cdk/tree';
import { NgModule } from '@angular/core';
import { MatMenuModule, MatToolbarModule, MatTreeModule } from '@angular/material';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { SidebarModule } from 'ng-sidebar';
import { AppRoutingModule } from '../app-routing.module';
import { AngularMaterialModule } from '../modules/angular-material/angular-material.module';
import { PublicModule } from '../public/public.module';
import { SharedModule } from '../shared/shared.module';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { LayoutComponent } from './layout/layout.component';
import { NotificationComponent } from './notification/notification.component';
import { PageTitleComponent } from './page-title/page-title.component';
import { SidenavService } from './services/sidenav.service';
import { ShareAppDialogComponent } from './sidenav/share-app-dialog.component';
import { SideNavComponent } from './sidenav/sidenav.component';
import { TranslationComponent } from './translation/translation.component';

@NgModule({
  declarations: [
    HeaderComponent,
    LayoutComponent,
    NotificationComponent,
    PageTitleComponent,
    SideNavComponent,
    ShareAppDialogComponent,
    TranslationComponent,
    FooterComponent,
    HeaderComponent,
    LayoutComponent,
    NotificationComponent,
    PageTitleComponent,
    SideNavComponent,
    TranslationComponent,
    FooterComponent
  ],
  imports: [
    NgSelectModule,
    TranslateModule,
    AppRoutingModule,
    SharedModule,
    PublicModule,
    CdkTreeModule,
    MatToolbarModule,
    MatMenuModule,
    MatTreeModule,
    NgSelectModule,
    TranslateModule,
    AppRoutingModule,
    SharedModule,
    PublicModule,
    SidebarModule.forRoot(),
    AngularMaterialModule
  ],
  entryComponents: [ShareAppDialogComponent],
  providers: [SidenavService],
  exports: []
})
export class MainModule {}
