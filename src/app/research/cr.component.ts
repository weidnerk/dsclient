import { Component, OnInit, ViewChild } from '@angular/core';
import { TimesSold, OrderHistory, UpdateToListing } from '../_models/orderhistory';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatIconRegistry } from '@angular/material/icon';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatSelectChange } from '@angular/material/select';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { RenderingService } from '../_services/rendering.service';
import { DomSanitizer } from '@angular/platform-browser';
import { OrderHistoryService } from '../_services/orderhistory.service';
import { Router } from '@angular/router';
import { UserService } from '../_services';
import { UserStoreView, UserSettings, UserSettingsView } from '../_models/userprofile';
import { MatOption } from '@angular/material/core';

@Component({
  selector: 'app-cr',
  templateUrl: './cr.component.html',
  styleUrls: ['./cr.component.scss']
})
export class ResearchComponent {
  displayedColumns = [
    'Src',
    'Pic',
    'Seller',
    'EbaySellerPrice',
    'SupplierPrice',
    'PriceDelta',
    'SoldQty',
    'LastSold',
    'SellerUPC',
    'SellerMPN',
    'SoldAndShippedBySupplier',
    'IsSellerVariation',
    'IsSupplierVariation',
    'Listed',
    'ToListing',
    'MatchType'
  ];
  dataSource: MatTableDataSource<TimesSold>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  toListingCount: number;
  isProcessing: boolean;
  errorMessage: string | null;
  statusMessage: string | null; // show storeToListing result
  data: TimesSold[];
  logErrorCount: number;
  logStatus: string | null;
  userStores: UserStoreView[];
  selectedStore: number;
  userSettingsView: UserSettingsView;

  // data table filters
  suppressSupplierVar: boolean | null;
  suppressSellerVar: boolean | null;
  isSellerVariation: boolean | null;
  isSupplierVariation: boolean | null;

  priceDelta: boolean | null = true;
  excludeListed: boolean | null = true;
  excludeFreight: boolean | null = true;

  // status spinner variables
  color = 'primary';
  mode = 'indeterminate';
  value = 50;

  constructor(private route: Router,
    public _service: RenderingService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private _orderHistoryService: OrderHistoryService,
    private _userService: UserService) {

    // these are the UI variables...
    this.suppressSupplierVar = true;
    this.suppressSellerVar = true;
    // ..but these are the coresponding API values
    this.isSellerVariation = false;
    this.isSupplierVariation = false;

    this.getStores();
    this.getUserSettings();
    this.getErrorCount();
    this.matIconRegistry.addSvgIcon(
      'wmicon',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/wm.svg')
    );
  }

  loadData() {
    this.isProcessing = true;
    this._service.renderTimesSold(
      0,
      1,
      30,
      null,
      null,
      false,
      this.isSellerVariation,
      null,
      0,
      this.selectedStore,
      this.isSupplierVariation,
      this.priceDelta,
      this.excludeListed,
      this.excludeFreight)
      .subscribe(res => {
        this.dataSource = new MatTableDataSource(res.TimesSoldRpt);
        this.data = res.TimesSoldRpt;
        this.getToLising();
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isProcessing = false;
      });
  }

  /**
   * Count number of clicked "stage"
   */
  getToLising() {
    this.toListingCount = 0;
    for (let m of this.data) {
      if (m.ToListing === true) {
        ++this.toListingCount;
        // console.log(this.toListingCount);
      }
    }

  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  getThumbnail(urlList: string): string | null {
    if (urlList) {
      var a = urlList.split(';');
      return a[0];
    }
    else {
      // some earlier listings don't have walmart images yet
      return null;
    }
  }
  onToListChange(itemID: string, cb: MatCheckboxChange) {
    // console.log(itemID);
    let obj = new UpdateToListing();
    obj.ItemID = itemID;
    obj.ToListing = cb.checked;
    obj.StoreID = this.selectedStore;
    this._orderHistoryService.toListUpdate(obj, ["StoreID", "ItemID", "ToListing"])
      .subscribe(wi => {
        if (cb.checked) {
          ++this.toListingCount;
        }
        else {
          --this.toListingCount;
        }
      },
        error => {
          this.errorMessage = error.errMsg;
        });
  }
  storeToListing() {
    this.isProcessing = true;
    this._orderHistoryService.storeToListing(this.selectedStore)
      .subscribe(result => {
        this.isProcessing = false;
        this.loadData();
        this.statusMessage = result;
        this.getErrorCount();
      },
        error => {
          this.isProcessing = false;
          this.errorMessage = error.errMsg;
        });
  }
  onDetail(itemID: string) {
    this.route.navigate(['/listingdetail', itemID]);  // this is the seller's listing id
  }
  getErrorCount() {
    // pull values from seller's listing
    this._orderHistoryService.getFindError("log.txt")
      .subscribe(wi => {
        this.logErrorCount = wi;
        if (this.logErrorCount > 0) {
          this.logStatus = this.logErrorCount + " errors";
        }
        else {
          this.logStatus = null;
        }
      },
        error => {
          this.errorMessage = error.errMsg;
        });
  }
  getStores() {
    // this.isProcessing = true;
    this._userService.getUserStores()
      .subscribe(x => {
        this.userStores = x;
        // this.isProcessing = false;
      },
        error => {
          // this.isProcessing = false;
          this.errorMessage = error;
        });
  }
  storeSelected(event: MatSelectChange) {
    const selectedData = {
      text: (event.source.selected as MatOption).viewValue,
      value: event.source.value
    };
    // console.log(selectedData.value);
    this.selectedStore = selectedData.value;
    this.userSettingsSave();
    this.loadData();
  }

  getUserSettings() {
    this._userService.UserSettingsViewGet()
      .subscribe(userSettings => {
        this.userSettingsView = userSettings;
        this.selectedStore = userSettings.storeID;
        this.loadData();
        // this.isProcessing = false;
      },
        error => {
          if (error.errorStatus !== 404) {
            this.errorMessage = JSON.stringify(error);
          }
          this.isProcessing = false;
        });
  }
  userSettingsSave() {
    let settings = new UserSettings();
    settings.storeID = this.selectedStore;
    this._userService.userSettingsSave(settings, ["StoreID"])
      .subscribe(si => {
        // this.isProcessing = false;
      },
        error => {
          this.isProcessing = false;
          this.errorMessage = error.errMsg;
        });
  }
  onSellerSuppressVarChange(ob: MatSlideToggleChange) {
    if (ob.checked) {
      this.suppressSellerVar = true;
      this.isSellerVariation = false; // if checked, exclude seller variations (suppress)
    }
    else {
      // if not suppressing, do nothing
      this.suppressSellerVar = null;
      this.isSellerVariation = null;
    }
    this.loadData();
  }
  onSupplierSuppressVarChange(ob: MatSlideToggleChange) {
    if (ob.checked) {
      this.suppressSupplierVar = true;
      this.isSupplierVariation = false;  // if checked, exclude supplier variations (suppress)
    }
    else {
      // if not suppressing, do nothing
      this.suppressSupplierVar = null;
      this.isSupplierVariation = null;
    }
    // console.log('suppressSupplierVar: ' + this.suppressSupplierVar);
    this.loadData();
  }
  onPriceDeltaChange(ob: MatSlideToggleChange) {
    if (ob.checked) {
      this.priceDelta = true;
    }
    else {
      this.priceDelta = null;
    }
    this.loadData();
  }
  onListedChange(ob: MatSlideToggleChange) {
    if (ob.checked) {
      this.excludeListed = true;
    }
    else {
      this.excludeListed = null;
    }
    this.loadData();
  }
  onFreightChange(ob: MatSlideToggleChange) {
    if (ob.checked) {
      this.excludeFreight = true;
    }
    else {
      this.excludeFreight = null;
    }
    this.loadData();
  }
  passTheSalt(eBayURL: string, supplierURL: string) {
    window.open(supplierURL, "_blank");
    window.open(eBayURL, "_blank");
  }
  /**
   * How to put in common module to share?
   */
  isAdmin(): boolean {
    const userJson = localStorage.getItem('currentUser');
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
}
