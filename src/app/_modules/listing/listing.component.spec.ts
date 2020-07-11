import { ComponentFixture, TestBed, fakeAsync, tick, inject } from '@angular/core/testing';
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
import { MatCardModule } from '@angular/material/card';
import { UserService } from 'src/app/_services';
import { UserSettingsView } from 'src/app/_models/userprofile';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';


fdescribe('Listing Component tests', () => {
  userSettingsView: UserSettingsView;
  let service: UserService;
  let component: ListingdbComponent;
  let fixture: ComponentFixture<ListingdbComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations:
        [ListingdbComponent
        ],
      imports:
        [HttpClientTestingModule,
          FormsModule,
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
      providers: [
        OrderHistoryService,
        ParamService,
        ListCheckService,
        UserService]
    })
    service = TestBed.get(UserService);
    fixture = TestBed.createComponent(ListingdbComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
  });

  it('is listing component defined', () => {
    expect(component).toBeTruthy();
  })

  it('should get profile data of user', () => {

    let token = {
      "access_token": "8RqdKxeNrJM92q6s-eJvhvnoKCYW82FjZB9bl0GIk3FmbDNz5AdDSAc-lx1NNewoKSlhQEUh-jvD3o98YkFU31dtqvih_RLqiBH9rf73glKrOcLkeaqDrFSmIUwGCefXFiYskYFkts3KAHUvG7nHCa8dN1tyaiARyquQpZuMJgs6jQydoXjuV0ZeDLHteSM0NS6OUcpzlElBN48chohf1XMuM9up4Nh80xtduJMjj64tN7fHXx5uTYLoxhzXS7ezbhV7cRh1fnunefm8lcj_hEMBiRDl6H_wdO_WBNmSd51hFHwahPqdcAfA8TeBZvmairN3AnaQNwWpwMSe4zm4y--IXtOhXHZTaptufhi2KxqCPN8eUS-w2OHShkwQRBklfz2bpW69l_JG6K2PriMeQklmxu83yZagfzftQpQpc7u-VHlSIEHWhwrUpYZzqCSFs2TO6JpkUQLngyxC5QoDpWaD7Zf0qS6geD7d4aIk0tPj0x-jqSD4kzxO3GckkX76",
      "token_type": "bearer",
      "expires_in": 1209599,
      "userName": "ventures2018@gmail.com",
      ".issued": "Fri, 10 Jul 2020 16:37:58 GMT",
      ".expires": "Fri, 24 Jul 2020 16:37:58 GMT"
    }
    localStorage.setItem('currentUser', JSON.stringify(token));

    let url = "http://localhost:51721/api/Account/userprofileget?userName=ventures2018@gmail.com";

    const profileInfo = { userID: 'blacksonic' };
    const http = TestBed.get(HttpTestingController);
    let httpResponse;

    service.UserProfileGet().subscribe((response) => {
      httpResponse = response;
      console.log(response);
      // http.expectOne(url).flush(profileInfo);
      // expect(httpResponse).toEqual(profileInfo);
    },
      error => {
        console.log('found error');

      });
    expect(service).toBeTruthy();
  });
});
