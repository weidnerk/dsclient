import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListingdbComponent } from './listing.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { RouterModule } from '@angular/router';
import { OrderHistoryService } from '../../_services/orderhistory.service';
import { HttpClientModule } from '@angular/common/http';
import { ParamService } from '../../_services/param.service';
import { ListCheckService } from '../../_services/listingcheck.service';
import { MatCardModule } from '@angular/material';

fdescribe('Listing Component tests', () => {
  let component: ListingdbComponent;
  let fixture: ComponentFixture<ListingdbComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: 
      [ListingdbComponent
        ],
      imports: 
      [FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatCheckboxModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatSelectModule,
        MatSlideToggleModule,
        MatSortModule,
        MatTableModule,
        MatToolbarModule,
        MatTooltipModule,
        MatDialogModule,
        MatTabsModule,
        AppOverlayModule,
        ProgressSpinnerModule,
        HttpClientModule,
        MatCardModule,
        RouterModule.forRoot([])
      ],
      providers: [OrderHistoryService,
        ParamService,
      ListCheckService]
    })
    fixture = TestBed.createComponent(ListingdbComponent);
    component = fixture.componentInstance;
  });

  it('is listing component defined', () => {
    expect(component).toBeTruthy();
  })
});
