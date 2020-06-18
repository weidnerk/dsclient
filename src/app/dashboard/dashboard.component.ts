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

import { Component, OnInit } from '@angular/core';
import { OrderHistoryService } from '../_services/orderhistory.service';
import { Dashboard, StoreAnalysis } from '../_models/orderhistory';
import { Router } from '@angular/router';
import { UserService } from '../_services';
import { UserStoreView, UserProfile } from '../_models/userprofile';
import { MatSelectChange } from '@angular/material/select';
import { MatOption } from '@angular/material/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  dashboard = new Dashboard();
  storeAnalysis: StoreAnalysis;
  errorMessage: string | null;
  loading = false;
  logErrorCount: number;
  logStatus: string | null;
  lastErr = "";
  isConfigured = false;
  userStores: UserStoreView[];
  selectedStore: number;
  userProfile: UserProfile;
  admin = false;

  // status spinner variables
  color = 'primary';
  mode = 'indeterminate';
  value = 50;
  displayProgressSpinner = false;

  constructor(private _orderHistoryService: OrderHistoryService,
    private _userService: UserService,
    private router: Router) { }

  ngOnInit(): void {
    this.loading = true;
    this.admin = this._orderHistoryService.isAdmin();
    this.getStores();

    this.getErrorCount();
    if (this.admin) {
      this.getLastError();
    }
  }

  getDashboard() {
    // pull values from seller's listing
    this._orderHistoryService.getDashboard(this.selectedStore)
      .subscribe(si => {
        this.dashboard = si;
        this.loading = false;
        this.isConfigured = true;
        this.displayProgressSpinner = false;
      },
        error => {
          this.errorMessage = error.errMsg;
          this.loading = false;
          this.displayProgressSpinner = false;
        });
  }
  getStoreAnalysis() {
    // pull values from seller's listing
    this._orderHistoryService.getStoreAnalysis(this.selectedStore)
      .subscribe(sa => {
        this.storeAnalysis = sa;
        console.log('db is missing how many items: ' + this.storeAnalysis.dbIsMissingItems.length);
        this.displayProgressSpinner = false;
      },
        error => {
          this.errorMessage = error.errMsg;
          this.loading = false;
          this.displayProgressSpinner = false;

        });
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
  getLastError() {
    // pull values from seller's listing
    this._orderHistoryService.getLastError("log.txt")
      .subscribe(wi => {
        this.lastErr = wi;
      },
        error => {
          this.errorMessage = error.errMsg;
        });
  }
  getStores() {
    this._userService.getUserStores()
      .subscribe(x => {
        if (!x || x.length == 0) {
          this.errorMessage = 'No stores configured - enter API keys.';
        }
        else {
          this.userStores = x;
         
          this.getUserProfile();  // to get selected store
        }
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
    this.getDashboard();
  }
  getUserProfile() {
    this._userService.UserProfileGet()
      .subscribe(profile => {
        if (!profile.selectedStore) {
          this.errorMessage = "No settings configured.";
        }
        else {
          this.userProfile = profile;
          if (profile.selectedStore) {
            this.selectedStore = profile.selectedStore;
            this.getDashboard();
          }
          else {
            // should not need to get here since profile.selectedStore should always have value
            if (this.userStores.length === 1) {
              this.selectedStore = this.userStores[0].storeID;
              this.getDashboard();
            }
          }
        }
      },
        error => {
          this.errorMessage = error.errMsg;
          this.loading = false;
        });
  }
  userProfileSave() {
    this.userProfile.selectedStore = this.selectedStore;
    this._userService.UserProfileSave(this.userProfile)
      .subscribe(si => {
      },
        error => {
          this.errorMessage = error.errMsg;
        });
  }
  onStoreScan() {
    console.log('store scan');
    this.displayProgressSpinner = true;
    this.getStoreAnalysis();
  }
}
