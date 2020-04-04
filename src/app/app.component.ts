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

import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient, HttpRequest, HttpEventType, HttpEvent } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatSlideToggleChange, MatSlideToggle } from '@angular/material/slide-toggle';
import { MatDialog } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { TimesSold, ModelView } from './_models/orderhistory';
import { UserSettings, UserSettingsView } from './_models/userprofile';
import { OrderHistoryService } from './_services/orderhistory.service';
import { RenderingService } from './_services/rendering.service';
import { UserService } from './_services';
import { ParamService } from './_services/param.service';
import { FilterSettings } from './_models/filtersettings';
import { SellerprofileComponent } from './sellerprofile/sellerprofile.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  private getOrderHistoryUrl: string = environment.API_ENDPOINT + 'scraper';

  ERR_HDR: string = "An Error occurred - please try again.";
  orderItems: TimesSold[];
  modelView: ModelView;
  errorMessage: string | null;
  lockUI: boolean;
  isDisplaying = false;  //processing might be done but not displaying; UI needs to work off displaying
  matchedListings: number = 0;
  totalOrders: number = 0;
  elapsedSeconds: number = 0;
  settingsForm: FormGroup;
  timer: number | null;
  rptNumber: number = 0;
  lastScan: Date | null;
  percentComplete: number;
  completedListings: number = 0;  // initial call to API for sold listings
  soldListings: number = 0;       // running count as results are accumulated
  // private showNoOrders: string | null;
  // listingsProcessed: number = 0;
  start: Date;
  // initialMinSold: number = 0;
  statusMsg: string | null = null;
  apiStatusMsg: string | null = null;
  userSettingsView: UserSettingsView | null;
  loading = false;

  // For now, don't display spinner when loading profile
  // Eventually, move username into subject settings.
  loadingUserProfile: boolean = false;

  apiHelpText: string = environment.HELP_TEXT;
  subscription: Subscription;
  showFilterDiv = false;
  showFilterMsg = false;
  invalidAPIKey = false;

  get ctlSeller() { return this.settingsForm.controls['seller']; }
  get ctlShowFilter() { return this.settingsForm.controls['showFilter']; }

  get ctlDaysBack() { return this.settingsForm.controls['daysBack']; }
  get ctlMinPrice() { return this.settingsForm.controls['minPrice']; }
  get ctlMaxPrice() { return this.settingsForm.controls['maxPrice']; }
  get ctlMinSold() { return this.settingsForm.controls['minSold']; }
  get ctlActiveStatusOnly() { return this.settingsForm.controls['activeStatusOnly']; }
  get ctlNonVariation() { return this.settingsForm.controls['nonVariation']; }

  constructor(private route: Router,
    private _orderHistoryService: OrderHistoryService,
    private _renderingService: RenderingService,
    private http: HttpClient,
    private _userService: UserService,
    private fb: FormBuilder,
    private params: ParamService,
    public dialog: MatDialog) { }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    // What is current value of lockUI so we can lock menu if needed.
    this.params.currentLockUI.subscribe(
      lock => {
        this.lockUI = lock;
      }
    );
    this.getUserSettingsView();  // get user's stored keys
  }

  getUserSettingsView() {
    this._userService.UserSettingsViewGet()
      .subscribe(userSettings => {
        this.userSettingsView = userSettings;
        this.loading = false;
      },
        error => {
          if (error.errorStatus !== 404) {
            this.errorMessage = JSON.stringify(error);
          }
          this.loading = false;
        });
  }
  onLogout() {

    this.userSettingsView = null;

    // clear settings
    let settings = new FilterSettings();
    settings.seller = null;
    settings.minSold = 1;
    settings.daysBack = 30;
    settings.minPrice = null;
    settings.maxPrice = null;
    settings.showFilter = true;
    settings.rptNumber = 0;
    settings.lastScan = null;
    this.params.changeFilterSettings(settings);

    localStorage.removeItem('currentUser');
    this.route.navigate(['/login']);
  }

  onSendEmail() {
    this._userService.SendMsg()
      .subscribe(x => {
      },
        error => {
          this.errorMessage = <any>error;
          this.lockUI = false;
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
