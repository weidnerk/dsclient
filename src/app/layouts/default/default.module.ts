/*
* Taken from https://www.youtube.com/watch?v=FP7Hs8lTy1k&t=293s
*
*/

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSortModule } from '@angular/material/sort';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DashboardService } from 'src/app/_services/dashboard.service';
import { DefaultComponent } from './default.component';
import { Dashboardv2Component } from 'src/app/dashboard-v2/dashboard.component';
import { MatTabsModule } from '@angular/material/tabs';
import { AppOverlayModule } from 'src/app/overlay/overlay.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { TimesSoldComponent } from 'src/app/timessold/timessold.component';
import { FormsModule, ReactiveFormsModule }    from '@angular/forms'; // not everything in its own module (like login)
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ProgressSpinnerModule } from 'src/app/progress-spinner/progress-spinner.module';
import { OrdersComponent } from 'src/app/orders/orders.component';
import { LoginComponent } from 'src/app/login/login.component';
import { MatPassToggleVisibilityComponent } from 'src/app/mat-pass-toggle-visibility/mat-pass-toggle-visibility.component';
import { RegisterComponent } from 'src/app/register/register.component';
import { ChangepasswordComponent } from 'src/app/changepassword/changepassword.component';
import { ForgotpasswordComponent } from 'src/app/forgotpassword/forgotpassword.component';
import { PasswordresetComponent } from 'src/app/passwordreset/passwordreset.component';
import { ScanhistoryComponent } from 'src/app/scanhistory/scanhistory.component';
import { SellerprofileComponent } from 'src/app/sellerprofile/sellerprofile.component';
import { ListingnoteComponent } from 'src/app/listingnote/listingnote.component';
import { ResearchComponent } from 'src/app/research/cr.component';
import { DashboardComponent } from 'src/app/dashboard/dashboard.component';
import { ShowmessagesComponent } from 'src/app/showmessages/showmessages.component';
import { ConfirmComponent } from 'src/app/confirm/confirm.component';
import { EndlistingComponent } from 'src/app/endlisting/endlisting.component';
import { ErrordisplayComponent } from 'src/app/errordisplay/errordisplay.component';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [ 
    DefaultComponent,
    DashboardComponent,
    Dashboardv2Component,
    TimesSoldComponent,
    OrdersComponent,
    LoginComponent,
    MatPassToggleVisibilityComponent,
    RegisterComponent,
    ChangepasswordComponent,
    ForgotpasswordComponent,
    PasswordresetComponent,
    ScanhistoryComponent,
    SellerprofileComponent,
    ListingnoteComponent,
    ResearchComponent,
    ShowmessagesComponent,
    ConfirmComponent,
    EndlistingComponent,
    ErrordisplayComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    MatSidenavModule,
    MatDividerModule,
    FlexLayoutModule,
    MatCardModule,
    MatPaginatorModule,
    MatTableModule,
    MatTabsModule,
    AppOverlayModule,
    MatIconModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatProgressBarModule,
    ProgressSpinnerModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatInputModule,
    MatButtonModule,
    MatPaginatorModule,
    MatSortModule,
    FlexLayoutModule,
    SharedModule,
    MatDividerModule,
    MatSidenavModule,
    MatDialogModule
  ],
  providers: [
    DashboardService
  ]
})
export class DefaultModule { }
