import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListingdbComponent } from './listing.component';

import { FormsModule, ReactiveFormsModule }    from '@angular/forms';
//import { HashLocationStrategy, LocationStrategy, CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { AppOverlayModule } from '../../overlay/overlay.module';
import { ProgressSpinnerModule } from '../../progress-spinner/progress-spinner.module';
import { ListingRoutingModule } from './listing-routes.module';
import { MatCardModule } from '@angular/material/card';
import { ListinglogComponent } from 'src/app/listinglog/listinglog.component';
import {DragDropModule} from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [ListingdbComponent,
  ListinglogComponent],
  imports: [
    CommonModule,
    ListingRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatToolbarModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatSelectModule,
    MatCheckboxModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatExpansionModule,
    MatSlideToggleModule,
    AppOverlayModule,
    ProgressSpinnerModule,
    MatTooltipModule,
    MatDialogModule,
    MatTabsModule,
    MatCardModule,
    DragDropModule
  ]
})
export class ListingdbModule { }
