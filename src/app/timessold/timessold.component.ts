/**
 * This is the home page
 * 
 * New query - user enters a seller and clicks submit,
 * rptNumber = 0, so it starts a timer on displayOrders and proceeds to subscribe to getNumItems (so we can show progress)
 * Once getNumItems has a result, it displays it and calls getOrderHistory()
 * 
 * After ngInit calls getProfile and buildform, it then subscribes to the current filter settings
 * do this because want to know if returning from detail page
 * 
 * We employ a service to keep track of our 'global' settings (like min price)
 * when enter timessold form, subscrbe to paramservice to get settings
 * 
 * When user clicks into detail of an item, that's when we call changeFilterSettings to store the settings
 * 
 */

import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { OrderHistoryService } from '../_services/orderhistory.service';
import { ModelView, TimesSold, OrderHistory } from '../_models/orderhistory';
import { HttpClient, HttpRequest, HttpEventType, HttpEvent } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { RenderingService } from '../_services/rendering.service';
import { UserService } from '../_services/user.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ResetPasswordViewModel } from '../_models/ResetPasswordViewModel';
import { UserProfile, UserSettings, UserSettingsView } from '../_models/userprofile';
import { ParamService } from '../_services/param.service';
import { FilterSettings } from '../_models/filtersettings';
import { getLocaleDateTimeFormat } from '@angular/common';
import { Subscription } from 'rxjs';
import { MatSlideToggleChange, MatSlideToggle } from '@angular/material/slide-toggle';
import { SellerprofileComponent } from '../sellerprofile/sellerprofile.component';
import { MatDialog } from '@angular/material/dialog';
import { MatCheckboxChange } from '@angular/material/checkbox';
// import { WalmartSearchProdIDResponse, WalItem } from '../_models/walitem';

@Component({
  selector: 'app-times-sold',
  templateUrl: './timessold.component.html',
  styleUrls: ['./timessold.component.scss']
})
export class TimesSoldComponent implements OnInit, OnDestroy {
  private getOrderHistoryUrl: string = environment.API_ENDPOINT + 'scraper';

  ERR_HDR: string = "An Error occurred - please try again.";
  orderItems: TimesSold[];
  modelView: ModelView;
  errorMessage: string | null;
  isProcessing: boolean;
  isDisplaying = false;  //processing might be done but not displaying; UI needs to work off displaying
  matchedListings: number = 0;
  totalOrders: number = 0;
  elapsedSeconds: number = 0;
  settingsForm: FormGroup;
  timer: number | null;
  rptNumber: number = 0;
  lastScan: Date | null;
  // private minSold: number;
  percentComplete: number;
  completedListings: number = 0;  // initial call to API for sold listings
  soldListings: number = 0;       // running count as results are accumulated
  private showNoOrders: string | null;
  listingsProcessed: number = 0;
  start: Date;
  initialMinSold: number = 0;
  statusMsg: string | null = null;
  apiStatusMsg: string | null = null;
  userSettingsView: UserSettingsView;
  filter: number;
  logErrorCount: number;

  // For now, don't display spinner when loading profile
  // Eventually, move username into subject settings.
  loadingUserProfile: boolean = false;

  apiHelpText: string = environment.HELP_TEXT;
  subscription: Subscription;
  showFilterDiv = false;
  showFilterMsg = false;
  invalidAPIKey = false;

  // status spinner variables
  color = 'primary';
  mode = 'indeterminate';
  value = 50;
  _displayProgressSpinner = false;

  constructor(private route: Router,
    private _orderHistoryService: OrderHistoryService,
    private _renderingService: RenderingService,
    private http: HttpClient,
    private _userService: UserService,
    private fb: FormBuilder,
    private params: ParamService,
    public dialog: MatDialog,
    private _parmService: ParamService) { }

  get ctlSeller(): AbstractControl { return this.settingsForm.controls['seller']; }
  get ctlShowFilter(): AbstractControl { return this.settingsForm.controls['showFilter']; }

  get ctlDaysBack(): AbstractControl { return this.settingsForm.controls['daysBack']; }
  get ctlMinPrice(): AbstractControl { return this.settingsForm.controls['minPrice']; }
  get ctlMaxPrice(): AbstractControl { return this.settingsForm.controls['maxPrice']; }
  get ctlMinSold(): AbstractControl { return this.settingsForm.controls['minSold']; }
  get ctlActiveStatusOnly(): AbstractControl { return this.settingsForm.controls['activeStatusOnly']; }
  get ctlNonVariation(): AbstractControl { return this.settingsForm.controls['nonVariation']; }

  setLockUI(val: boolean) {
    this._parmService.changeLockUI(val);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {

    this.getUserSettingView();  // get user's stored keys
    this.buildForm();

    this.getErrorCount();
    // this.getData();

  }
  getData() {
    // Recollect filter settings
    this.subscription = this.params.currentFilterSettings.subscribe(
      settings => {
        // console.log('got settings');
        // console.log('isDisplaying: ' + this.isDisplaying)
        if (!this.isDisplaying) {
          this.settingsForm.patchValue({
            seller: settings.seller
          });
          this.rptNumber = settings.rptNumber;
          this.lastScan = settings.lastScan;
          this.showNoOrders = null;

          if (!isNaN(settings.daysBack)) {
            this.settingsForm.patchValue({
              daysBack: settings.daysBack
            });
          }
          if (!isNaN(settings.minSold)) {
            this.settingsForm.patchValue({
              minSold: settings.minSold
            });
          }
          if (settings.minPrice) {
            if (!isNaN(settings.minPrice)) {
              this.settingsForm.patchValue({
                minPrice: settings.minPrice
              });
            }
          }
          if (settings.maxPrice) {
            if (!isNaN(settings.maxPrice)) {
              this.settingsForm.patchValue({
                maxPrice: settings.maxPrice
              });
            }
          }
          this.settingsForm.patchValue({
            showFilter: settings.showFilter
          });
          this.showFilterDiv = settings.showFilter;
          if (settings.activeStatusOnly) {
            this.settingsForm.patchValue({
              activeStatusOnly: settings.activeStatusOnly
            });
          }
          if (settings.nonVariation) {
            this.settingsForm.patchValue({
              nonVariation: settings.nonVariation
            });
          }

          if (this.rptNumber > 0) {   // Load prior scan
            this.displayFilterAlert();
            this.start = new Date();
            this.settingsForm.patchValue({
              seller: settings.seller
            });
            this.isDisplaying = true;
            // console.log('calling displayOrders');
            this.filter = 0;
            this.displayOrders();
          }
          else {
            this.filter = 0;
            this.isDisplaying = true;
            this.displayOrders();
          }
        }
      })
  }
  /**
   * Get user's profile to check for valid API keys
   */
  getUserSettingView() {
    this._userService.UserSettingsViewGet()
      .subscribe(userSettings => {
        this.loadingUserProfile = false;
        this.userSettingsView = userSettings;
        this.getData();
        if (this.userSettingsView.appID == null || this.userSettingsView.devID == null || this.userSettingsView.certID == null || this.userSettingsView.token == null) {
          this.apiStatusMsg = "Please provide valid API keys to begin search. (Select 'Set API Keys' from the Options menu.)";
          this.invalidAPIKey = true;
        }
      },
        error => {
          this.loadingUserProfile = false;
          if (error.errorStatus === 404) {
            this.apiStatusMsg = "Please provide valid API keys to begin search. (Select 'Set API Keys' from the Options menu.)";
            this.invalidAPIKey = true;
          }
          else {
            this.errorMessage = JSON.stringify(error);
          }
        });
  }

  onSubmit(settingsForm) {

    this.storeFilter();

    // reset variables
    this.toggleFilter();
    this.statusMsg = null;
    this.matchedListings = 0;
    this.totalOrders = 0;
    this.elapsedSeconds = 0;
    this.percentComplete = 0;
    this.errorMessage = null;
    this.showNoOrders = settingsForm.showNoOrders;
    this.start = new Date();
    this.isDisplaying = true;

    this.displayFilterAlert();
    this.filter = 0;
    this.displayOrders();
  }

  // onSubmit_back(settingsForm) {

  //   this.storeFilter();

  //   // reset variables
  //   this.toggleFilter();
  //   this.statusMsg = null;
  //   this.matchedListings = 0;
  //   this.totalOrders = 0;
  //   this.elapsedSeconds = 0;
  //   this.percentComplete = 0;
  //   this.errorMessage = null;
  //   this.showNoOrders = settingsForm.showNoOrders;
  //   this.start = new Date();
  //   this.isDisplaying = true;

  //   if (this.rptNumber == 0) {
  //     this.lastScan = new Date();
  //     this.completedListings = 0;
  //     this.isProcessing = true;
  //     this.setLockUI(true);

  //     // start timer to keep displaying as seller scan populates OrderHistory table
  //     if (this.timer) clearInterval(this.timer);
  //     let seconds = Number(environment.REFRESH_SECONDS);
  //     this.filter = 0;
  //     this.timer = window.setInterval(this.displayOrders.bind(this), seconds * 1000);
  //     // this.getNumItems(200);
  //   }
  //   else {
  //     this.displayFilterAlert();
  //     this.filter = 0;
  //     this.displayOrders();
  //   }
  // }
  /**
   * SELLER SCAN STARTS HERE!
   * 
   * Get count so we can monitor progress and then start the scan.
   * @param resultsPerPage
   */
  getNumItems(resultsPerPage: number) {
    if (this.ctlSeller) {
    this._orderHistoryService.getNumItems(
          this.ctlSeller.value, 
          this.ctlDaysBack.value, 
          resultsPerPage, 
          this.ctlMinSold.value)
      .subscribe(x => {
        this.modelView = x;
        this.rptNumber = x.ReportNumber;
        this.completedListings = x.ItemCount;
        if (this.completedListings > 0)
          this.getOrderHistory(200);  // start the scan
        else
          this.isProcessing = false;
      },
        error => {
          this.errorMessage = error.errMsg;
          this.isProcessing = false;
          this.setLockUI(false); // need this here since what if user is not allowed to scan this seller
        });
      }
  }

  /**
   * Do actual seller scan.
   * @param resultsPerPage 
   */
  getOrderHistory(resultsPerPage: number) {
    if (this.ctlSeller) {
    this._orderHistoryService.getOrderHistory(this.ctlSeller.value, this.ctlDaysBack.value, resultsPerPage, this.rptNumber, this.ctlMinSold.value)
      .subscribe(x => {

        this.isProcessing = false;
        this.setLockUI(false);
        // this.modelView = x;
        // this.rptNumber = x.ReportNumber;
        this.elapsedSeconds = x.ElapsedSeconds;
        this.percentComplete = 100;
        if (x.Listings.length == 0)
          this.statusMsg = "No results matching search criteria.";
      },
        error => {
          this.errorMessage = error.errMsg;
          this.isProcessing = false;
          this.isDisplaying = false;
          this.setLockUI(false);
          if (this.timer) clearInterval(this.timer);
        });
      }
  }

  /**
   * Want to return null if control value is empty string.
   * @param c 
   */
  nullIfEmpty(c: AbstractControl) {
    if (c.value) {
      if (c.value.length === 0)
        return null;
      else
        return c.value;
    } else {
      return null;
    }
  }

  /**
   * Want to be clear if filter is being applied.
   */
  displayFilterAlert(): boolean {
    this.showFilterMsg = false;
    // console.log('showFilterMsg false');
    // if (this.showFilterDiv) return false;
    let minprice = this.nullIfEmpty(this.ctlMinPrice);
    let maxprice = this.nullIfEmpty(this.ctlMaxPrice);
    let minsold = this.nullIfEmpty(this.ctlMinSold);
    if (minsold) {
      if (minsold > 1) {
        this.showFilterMsg = true;
        return true;
      }
    }
    if (minprice) {
      this.showFilterMsg = true;
      return true;
    }
    if (maxprice) {
      this.showFilterMsg = true;
      return true;
    }
    return false;
  }

  /**
   * Called on a timer
   * this.userSettingsView.storeID
   */
  displayOrders() {
    this._renderingService.renderTimesSold(
      this.rptNumber,
      this.ctlMinSold.value,
      this.ctlDaysBack.value,
      this.nullIfEmpty(this.ctlMinPrice),
      this.nullIfEmpty(this.ctlMaxPrice),
      this.ctlActiveStatusOnly.value,
      this.ctlNonVariation.value,
      null,
      this.filter,
      this.userSettingsView.storeID,
      null,
      null,
      null,
      null)
      .subscribe(x => {
        this.orderItems = x.TimesSoldRpt;
        this.soldListings = x.ItemCount;
        this.listingsProcessed = x.ListingsProcessed;
        let pc = this.soldListings / this.completedListings * 100;
        this.percentComplete = (pc > 100) ? 100 : pc;
        this.totalOrders = x.TotalOrders;
        var finish = new Date();
        if (this.start)
          this.elapsedSeconds = (finish.getTime() - this.start.getTime()) / 1000;
        if (!this.isProcessing) {
          this.toggleFilter(true);
          this.isDisplaying = false;
          this.percentComplete = 100; // we don't know up front how many completed listings will end up being sold listings,
          // so % complete can finish under 100%, let's finally set it to 100
          if (this.timer) clearInterval(this.timer);    // either this doesn't finally kill it or the timer is restarted, neither of which makes sense
          this.timer = null;
          if (this.orderItems.length == 0) this.statusMsg = "No results matching search criteria.";
        }
      },
        error => {
          this.errorMessage = error.errMsg;
          if (this.timer) clearInterval(this.timer);
        });
  }

  buildForm(): void {

    this.settingsForm = this.fb.group({
      seller: [null, Validators.compose([Validators.maxLength(50)])],
      //daysBack: [30, Validators.compose([Validators.required, Validators.maxLength(2), Validators.pattern(/^[1-9]\d*$/)])],
      daysBack: [30, Validators.compose([this.validateDaysBack.bind(this), Validators.required, Validators.maxLength(2), Validators.pattern(/^[1-9]\d*$/)])],
      minSold: [1, Validators.compose([Validators.required, Validators.maxLength(3), Validators.pattern(/^[1-9]\d*$/)])],
      //delay: [1, Validators.compose([Validators.required, Validators.pattern(/^[0-9]\d*$/)])],
      //resultsPerPage: [200, Validators.compose([Validators.required, Validators.pattern(/^[1-9]\d*$/)])],
      showNoOrders: [0, Validators.compose([Validators.required, Validators.pattern(/^[0-1]\d*$/)])],
      minPrice: [null, Validators.compose([Validators.maxLength(3), Validators.pattern(/^[1-9]\d*$/)])],
      maxPrice: [null, Validators.compose([Validators.maxLength(3), Validators.pattern(/^[1-9]\d*$/)])],
      activeStatusOnly: [],
      nonVariation: [],
      showFilter: []
    })
  }

  /**
   * 07-13-2019 not being used now.
   * @param eventObject
   * @param imgUrl 
   */
  onHovering(eventObject, imgUrl) {
    var regExp = new RegExp(".svg" + "$");

    //this.showImg = true;
    //var srcObj = eventObject.target.offsetParent.children["0"];
    var srcObj = eventObject.target.children["0"].children["0"];
    if (srcObj.tagName == "IMG" && imgUrl) {
      srcObj.setAttribute("src", imgUrl);
      srcObj.setAttribute("height", "150");
      srcObj.setAttribute("width", "150");
    }
  }

  /**
   * Not being used now.
   * @param eventObject 
   */
  onUnhovering(eventObject) {
    const regExp = new RegExp("_h.svg" + "$");

    const srcObj = eventObject.target.children["0"].children["0"];
    if (srcObj.tagName == "IMG") {
      srcObj.setAttribute("src", "");
      srcObj.setAttribute("height", "");
      srcObj.setAttribute("width", "");
    }
  }

  onSellerChange() {
    this.rptNumber = 0;
  }

  onDetail(itemId: number, qtySold: number) {
    let settings = new FilterSettings();
    let s: string = '';
    if (this.settingsForm) {
      let s = this.settingsForm.controls['seller'].value;
      if (s) {
        if (this.timer) clearInterval(this.timer);
        this.timer = null;

        settings.seller = s;
        // settings.daysBack = this.daysBack;
        settings.rptNumber = this.rptNumber;
        settings.minSold = this.settingsForm.controls['minSold'].value;

        if (this.settingsForm.value.minPrice) {
          if (this.settingsForm.controls['minPrice'].value.length == 0)
            settings.minPrice = null;
          else
            settings.minPrice = this.settingsForm.controls['minPrice'].value;
        }
        else
          settings.minPrice = null;

        if (this.settingsForm.value.maxPrice) {
          if (this.settingsForm.controls['maxPrice'].value.length == 0)
            settings.maxPrice = null;
          else
            settings.maxPrice = this.settingsForm.controls['maxPrice'].value;
        }
        else
          settings.maxPrice = null;

        settings.showNoOrders = null;
        this.params.changeFilterSettings(settings);
        this.route.navigate(['/listingdetail', itemId, this.rptNumber, qtySold]);  // this is the seller's listing id
      }
    }
  }

  /**
   * Must be a number and <= 30
   * @param c 
   */
  validateDaysBack(c: FormControl): { [key: string]: boolean | null } | null {

    if (c.value != undefined) {
      if (isNaN(c.value))
        return { error: true };
      else {
        if (c.value > 30)
          return { error: true };
        else
          return null;    // control is valid              
      }
    }
    return { error: true };
  }

  onSendEmail() {
    this._userService.SendMsg()
      .subscribe(x => {
      },
        error => {
          this.errorMessage = <any>error;
          this.isProcessing = false;
        });
  }

  onChangePassword() {
    this.route.navigate(['/changepassword']);
  }

  onSetAPIKeys() {
    this.route.navigate(['/apikeys']);
  }

  onShowFilterChange(ob: MatSlideToggleChange) {
    // console.log(ob.checked);
    this.showFilterDiv = ob.checked;
    let matSlideToggle: MatSlideToggle = ob.source;
    // console.log(matSlideToggle.color);
    // console.log(matSlideToggle.required);
  }

  onCancelScan() {
    this._userService.cancelScan(this.rptNumber)
      .subscribe(x => {
      },
        error => {
          this.errorMessage = <any>error;
          this.isProcessing = false;
        });
  }

  /**
  * Disable filter if running scan.
  * @param enable 
  */
  toggleFilter(enable?: boolean) {
    this.ctlSeller.enable();
    this.ctlShowFilter.enable();
    this.ctlDaysBack.enable();
    this.ctlMinSold.enable();
    this.ctlMinPrice.enable();
    this.ctlMaxPrice.enable();
    this.ctlActiveStatusOnly.enable();
    this.ctlNonVariation.enable();

    let doenable = false;

    if (enable !== undefined) {
      if (enable) {
        doenable = true;
      } else {
        doenable = false;
      }
    }
    else {
      if (this.ctlSeller.disabled) {
        doenable = true;

      } else {
        doenable = false;
      }
    }
    if (doenable) {
      this.ctlSeller.enable();
      this.ctlShowFilter.enable();
      this.ctlDaysBack.enable();
      this.ctlMinSold.enable();
      this.ctlMinPrice.enable();
      this.ctlMaxPrice.enable();
      this.ctlActiveStatusOnly.enable();
      this.ctlNonVariation.enable();
    } else {
      this.ctlSeller.disable();
      this.ctlShowFilter.disable();
      this.ctlDaysBack.disable();
      this.ctlMinSold.disable();
      this.ctlMinPrice.disable();
      this.ctlMaxPrice.disable();
      this.ctlActiveStatusOnly.disable();
      this.ctlNonVariation.disable();
    }
  }

  onClearFilter() {
    this.settingsForm.patchValue({
      daysBack: 30,
      minSold: 1,
      minPrice: null,
      maxPrice: null,
      activeStatusOnly: false,
      nonVariation: false
    });
    this.showFilterMsg = false;
  }
  onProfile() {

    const dialogRef = this.dialog.open(SellerprofileComponent, {
      height: '500px',
      width: '600px',
      data: { seller: this.ctlSeller.value }
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
    });
  }

  /**
   * Store settings before moving to scans.
   */
  onShowScans() {
    this.route.navigate(['/scanhistory']);
  }

  storeFilter() {
    let settings = new FilterSettings();
    settings.seller = this.ctlSeller.value;
    settings.minSold = this.ctlMinSold.value;
    settings.daysBack = this.ctlDaysBack.value;
    settings.minPrice = this.nullIfEmpty(this.ctlMinPrice);
    settings.maxPrice = this.nullIfEmpty(this.ctlMaxPrice);
    settings.showFilter = this.showFilterDiv;
    settings.activeStatusOnly = this.ctlActiveStatusOnly.value;
    settings.nonVariation = this.ctlNonVariation.value;
    settings.rptNumber = this.rptNumber;
    settings.lastScan = this.lastScan;
    this.params.changeFilterSettings(settings);
  }


  // getWmItem(url: string, elBrand) {
  //   // pull values from seller's listing
  //   let walItem: WalItem;
  //   this._orderHistoryService.getWmItem(url)
  //     .subscribe(wi => {
  //       walItem = wi;
  //       elBrand.innerHTML = walItem.brand;
  //     },
  //       error => {
  //         this.errorMessage = error.errMsg;
  //       });
  // }

  calculateMatch() {
    this._displayProgressSpinner = true;
    this._renderingService.fillMatch(this.rptNumber,
      this.ctlMinSold.value,
      this.ctlDaysBack.value,
      this.nullIfEmpty(this.ctlMinPrice),
      this.nullIfEmpty(this.ctlMaxPrice),
      this.ctlActiveStatusOnly.value,
      this.ctlNonVariation.value,
      null,
      0)
      .subscribe(x => {
        // this.orderItems = x.TimesSoldRpt;
        this._displayProgressSpinner = false;
      },
        error => {
          this.errorMessage = error.errMsg;
          this._displayProgressSpinner = false;
        });
  }

  filterMatch(filter: number) {
    this.isDisplaying = true;
    this.filter = filter;
    this.displayOrders();
  }

  // onToListChange(itemID: string, cb: MatCheckboxChange) {
  //   let oh = new OrderHistory();
  //   oh.ItemId = itemID;
  //   oh.ToListing = cb.checked;
  //   this._orderHistoryService.toListUpdate(oh)
  //     .subscribe(wi => {
  //     },
  //       error => {
  //         this.errorMessage = error.errMsg;
  //       });
  // }

  // storeToListing() {
  //   this.isDisplaying = true;
  //   this._orderHistoryService.storeToListing()
  //     .subscribe(result => {
  //       this.isDisplaying = false;
  //     },
  //       error => {
  //         this.isDisplaying = false;
  //         this.errorMessage = error.errMsg;
  //       });
  // }

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

  getErrorCount() {
    // pull values from seller's listing
    this._orderHistoryService.getFindError("log.txt")
      .subscribe(wi => {
        this.logErrorCount = wi;
      },
        error => {
          this.errorMessage = error.errMsg;
        });
  }


}
