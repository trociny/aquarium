import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { CoreModule } from '~/app/core/core.module';
import { DashboardPageComponent } from '~/app/pages/dashboard-page/dashboard-page.component';
import { HostsPageComponent } from '~/app/pages/hosts-page/hosts-page.component';
import { InstallModePageComponent } from '~/app/pages/install-mode-page/install-mode-page.component';
import { InstallWelcomePageComponent } from '~/app/pages/install-welcome-page/install-welcome-page.component';
import { InstallWizardModule } from '~/app/pages/install-wizard/install-wizard.module';
import { LoginPageComponent } from '~/app/pages/login-page/login-page.component';
import { NetworkFormComponent } from '~/app/pages/network-page/network-form/network-form.component';
import { NetworkPageComponent } from '~/app/pages/network-page/network-page.component';
import { NotFoundPageComponent } from '~/app/pages/not-found-page/not-found-page.component';
import { ShutdownPageComponent } from '~/app/pages/shutdown-page/shutdown-page.component';
import { StorageDevicesPageComponent } from '~/app/pages/storage-devices-page/storage-devices-page.component';
import { StorageSmartFormComponent } from '~/app/pages/storage-devices-page/storage-smart-form/storage-smart-form.component';
import { UsersFormComponent } from '~/app/pages/users-page/users-form/users-form.component';
import { UsersPageComponent } from '~/app/pages/users-page/users-page.component';
import { SharedModule } from '~/app/shared/shared.module';

@NgModule({
  declarations: [
    DashboardPageComponent,
    InstallModePageComponent,
    NotFoundPageComponent,
    HostsPageComponent,
    LoginPageComponent,
    InstallWelcomePageComponent,
    NetworkPageComponent,
    UsersPageComponent,
    UsersFormComponent,
    NetworkFormComponent,
    StorageDevicesPageComponent,
    ShutdownPageComponent,
    StorageSmartFormComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    FlexLayoutModule,
    NgbModule,
    RouterModule,
    SharedModule,
    TranslateModule.forChild(),
    InstallWizardModule
  ]
})
export class PagesModule {}
