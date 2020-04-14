/*
  new listings page
*/

import { Component, OnInit, ViewChild, ChangeDetectorRef, ChangeDetectionStrategy, ElementRef } from '@angular/core';
import { TimesSold, OrderHistory, UpdateToListing, Listing, ListingView } from '../../_models/orderhistory';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatIconRegistry } from '@angular/material/icon';
import { MatSelectChange } from '@angular/material/select';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { DomSanitizer } from '@angular/platform-browser';
import { OrderHistoryService } from '../../_services/orderhistory.service';
import { Router } from '@angular/router';
import { UserService } from '../../_services';
import { UserStoreView, UserSettingsView, UserProfile } from '../../_models/userprofile';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatOption } from '@angular/material/core';

@Component({
  selector: 'app-gamma',
  templateUrl: './gamma.component.html',
  styleUrls: ['./gamma.component.scss']
})
export class GammaComponent {
  displayedColumns: string[] = [];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;

  toListingCount: number;
  // isProcessing: boolean;
  errorMessage: string | null;
  statusMessage: string | null; // show storeToListing result
  dataSource: MatTableDataSource<ListingView> = new MatTableDataSource();
  logErrorCount: number;
  logStatus: string;
  userStores: UserStoreView[];
  selectedStore: number;
  userSettingsView: UserSettingsView;
  userProfile: UserProfile;
  unlisted = true;
  listed = false;

  // status spinner variables
  color = 'primary';
  mode = 'indeterminate';
  value = 50;
  displayProgressSpinner = false;

  constructor(private route: Router,
    public _service: OrderHistoryService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private _orderHistoryService: OrderHistoryService,
    private _userService: UserService) {

    this.displayProgressSpinner = true;
    this.generateHeaders();
    this.matIconRegistry.addSvgIcon(
      'wmicon',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/wm.svg')
    );
  }

  ngOnInit() {
    fromEvent(this.filter.nativeElement, 'keyup').pipe(
      debounceTime(150),
      distinctUntilChanged())
      .subscribe(() => {
        if (!this.dataSource) {
          return;
        }
        this.dataSource.filter = this.filter.nativeElement.value;
      });
  }
  /**
   * I refactored using this:
   * https://stackoverflow.com/questions/50283659/angular-6-mattable-performance-in-1000-rows
   * 
   * but doesn't matter - it was using a stored proc instead of a view which gave me perf boost.
   */
  ngAfterViewInit() {
    this.displayProgressSpinner = true;
    this.getUserProfile();
  }
  getStores() {
    this._userService.getUserStores()
      .subscribe(x => {
        this.userStores = x;
      },
        error => {
          this.errorMessage = error;
        });
  }
  // getUserSettings() {
  //   this._userService.UserSettingsViewGet()
  //     .subscribe(userSettings => {
  //       this.userSettingsView = userSettings;
  //       this.selectedStore = userSettings.storeID;
  //       this.getStores();
  //       this.loadData();
  //     },
  //       error => {
  //         if (error.errorStatus !== 404) {
  //           this.errorMessage = JSON.stringify(error);
  //         }
  //         this.displayProgressSpinner = false;
  //       });
  // }
  getUserProfile() {
    this._userService.UserProfileGet()
      .subscribe(profile => {
        this.userProfile = profile;
        this.selectedStore = profile.selectedStore;
        this.getStores();
        this.loadData();
      },
        error => {
          if (error.errorStatus !== 404) {
            this.errorMessage = JSON.stringify(error);
          }
          this.displayProgressSpinner = false;
        });
  }
  loadData() {
    this._service.getListings(this.selectedStore, this.unlisted, this.listed)
      .subscribe(res => {
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.dataSource.data = res;

        this.displayProgressSpinner = false;
      },
        error => {
          this.displayProgressSpinner = false;
          this.errorMessage = error.errMsg;
        });;

  }

  generateHeaders() {
    this.displayedColumns.push("Source");
    this.displayedColumns.push("Store");
    this.displayedColumns.push("ListedItemID");
    this.displayedColumns.push("Seller");
    this.displayedColumns.push("SupplierPicURL");
    this.displayedColumns.push("Title");
    this.displayedColumns.push("Qty");
    this.displayedColumns.push("ListingPrice");
    this.displayedColumns.push("CreatedByName");
    this.displayedColumns.push("UpdatedByName");
    this.displayedColumns.push("ListedByName");
    this.displayedColumns.push("Listed");
  }
  getFirstImg(imgStr: string): string {
    var a = imgStr.split(';');
    return a[0];
  }
  onUnlisted(ob: MatSlideToggleChange) {
    this.unlisted = ob.checked;
    if (this.unlisted) {
      this.listed = false;
    }
    this.displayProgressSpinner = true;
    this.loadData();
  }
  onListed(ob: MatSlideToggleChange) {
    this.listed = ob.checked;
    if (this.listed) {
      this.unlisted = false;
    }
    this.displayProgressSpinner = true;
    this.loadData();
  }
  /**
   * How to put in common module to share?
   */
  isAdmin(): boolean {
    const userJson: string | null = localStorage.getItem('currentUser');
    if (userJson) {
      let currentUser = JSON.parse(userJson);
      if (currentUser) {
        if (currentUser.userName === 'ventures2018@gmail.com') {
          return true;
        }
        return false;
      }
    }
    return false;
  }
  addItem() {
    console.log('add item');
    this.route.navigate(['/listingdetaildb/0']);
  }
  // userSettingsSave() {
  //   let settings = new UserSettings();
  //   settings.storeID = this.selectedStore;
  //   this._userService.userSettingsSave(settings, ["StoreID"])
  //     .subscribe(si => {
  //     },
  //       error => {
  //         this.errorMessage = error.errMsg;
  //       });
  // }
  userProfileSave() {
    this.userProfile.selectedStore = this.selectedStore;
    this._userService.UserProfileSave(this.userProfile)
      .subscribe(si => {
      },
        error => {
          this.errorMessage = error.errMsg;
        });
  }
  storeSelected(event: MatSelectChange) {
    const selectedData = {
      text: (event.source.selected as MatOption).viewValue,
      value: event.source.value
    };
    this.selectedStore = selectedData.value;
    this.displayProgressSpinner = true;
    this.userProfileSave();
    this.loadData();
  }
}
