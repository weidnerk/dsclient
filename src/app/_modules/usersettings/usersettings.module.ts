import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersettingsComponent } from './usersettings.component';

import { FormsModule, ReactiveFormsModule }    from '@angular/forms';
//import { HashLocationStrategy, LocationStrategy, CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { AppOverlayModule } from '../../overlay/overlay.module';
import { ProgressSpinnerModule } from '../../progress-spinner/progress-spinner.module';
import { UsersettingsRoutingModule } from './usersettings-routes.module';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [UsersettingsComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    AppOverlayModule,
    ProgressSpinnerModule,
    UsersettingsRoutingModule,
    MatCardModule
  ]
})
export class UsersettingsModule { }
