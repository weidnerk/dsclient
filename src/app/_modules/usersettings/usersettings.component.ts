import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { UserSettingsView, UserStoreView, UserSettings } from 'src/app/_models/userprofile';
import { eBayBusinessPolicies, StoreProfile } from 'src/app/_models/orderhistory';
import { OrderHistoryService } from 'src/app/_services/orderhistory.service';
import { UserService } from 'src/app/_services';

// https://stackoverflow.com/questions/16334765/regular-expression-for-not-allowing-spaces-in-the-input-field
const STORENAME_REGEX = /^\S*$/; // a string consisting only of non-whitespaces

@Component({
  selector: 'app-usersettings',
  templateUrl: './usersettings.component.html',
  styleUrls: ['./usersettings.component.scss']
})
export class UsersettingsComponent implements OnInit {

  form: FormGroup;
  userSettingsView: UserSettingsView;
  errorMessage: string | null;
  userStores: UserStoreView[];
  selectedStore: number;
  eBayBusinessPolicies: eBayBusinessPolicies;
  storeChanged = 0;
  policyHandlingTime: number;
  subscription: string;

  // status spinner variables
  color = 'primary';
  mode = 'indeterminate';
  value = 50;
  displayProgressSpinner = false;

  get ctlPctProfit() { return this.form.controls['pctProfit']; }
  get ctlListingLimit() { return this.form.controls['listingLimit']; }
  get ctlShippingPolicy() { return this.form.controls['shippingPolicy']; }
  get ctlSelectedStore() { return this.form.controls['selectedStore']; }
  get ctlShippingProfile() { return this.form.controls['shippingProfile']; }  // like 'mw'
  get ctlPayPalEmail() { return this.form.controls['payPalEmail']; }
  get ctlStoreName() { return this.form.controls['storeName']; }

  constructor(private fb: FormBuilder,
    private _orderHistoryService: OrderHistoryService,
    private _userService: UserService) { }

  ngOnInit(): void {
    this.buildForm();
    this.getStores();
  }

  onSubmit() {
    console.log(this.ctlPctProfit.value);
  }
  getUserSettings() {
    // shouldn't this be 'get use settings for some store selection?'
    this._userService.UserSettingsViewGetByStore(this.selectedStore)
      .subscribe(userSettings => {
        this.userSettingsView = userSettings;
        console.log('storeID: ' + userSettings.storeID);
        console.log('pctProfit: ' + userSettings.pctProfit);
        this.form.patchValue({
          pctProfit: userSettings.pctProfit,
          handlingTime: userSettings.handlingTime,
          shippingProfile: userSettings.shippingProfile,
          payPalEmail: userSettings.payPalEmail
        });
        this.getBusinessPolicies();
        this.getStore();
        if (--this.storeChanged === 0) {
          this.displayProgressSpinner = false;
        }
      },
        error => {
          // if (error.errorStatus !== 404) {
          //   this.errorMessage = JSON.stringify(error);
          // }
          this.errorMessage = error.errMsg;
          if (--this.storeChanged === 0) {
            this.displayProgressSpinner = false;
          }
        });
  }
  userSettingsSave() {
    this.displayProgressSpinner = true;
    let settings = new UserSettings();
    settings.pctProfit = this.ctlPctProfit.value;
    settings.storeID = this.selectedStore;
    settings.payPalEmail = this.ctlPayPalEmail.value
    this._userService.userSettingsSave(settings, ["PctProfit","PayPalEmail"])
      .subscribe(si => {
        this.displayProgressSpinner = false;
      },
        error => {
          this.errorMessage = error.errMsg;
          this.displayProgressSpinner = false;
        });
  }
  storeSelected(event: MatSelectChange) {
    this.errorMessage = null;
    const selectedData = {
      text: (event.source.selected as MatOption).viewValue,
      value: event.source.value
    };
    this.selectedStore = selectedData.value;
    this.displayProgressSpinner = true;
    this.storeChanged = 2;
    this.getUserSettings();

  }
  getStore() {
    this._userService.getStore(this.selectedStore)
      .subscribe(x => {
        this.subscription = x;
      },
        error => {
          this.errorMessage = error.errMsg;
        });
  }
  getStores() {
    this._userService.getUserStores()
      .subscribe(x => {
        this.userStores = x;
        if (this.userStores.length === 1) {
          this.selectedStore = this.userStores[0].storeID;
          this.ctlSelectedStore.setValue(this.userStores[0].storeID);
          this.getBusinessPolicies();
          this.getStore();
        }
      },
        error => {
          this.errorMessage = error.errMsg;
        });
  }
  /**
   * look up handling time 
   */
  getBusinessPolicies() {
    this._orderHistoryService.getBusinessPolicies(this.selectedStore)
      .subscribe(x => {
        this.eBayBusinessPolicies = x;
        this.getHandlingTime();
        if (--this.storeChanged === 0) {
          this.displayProgressSpinner = false;
        }
      },
        error => {
          this.errorMessage = error.errMsg;
          if (--this.storeChanged === 0) {
            this.displayProgressSpinner = false;
          }
        });
  }
  getHandlingTime() {
    for (let m of this.eBayBusinessPolicies.shippingPolicies) {
      if (m.name == this.ctlShippingProfile.value) {
        this.policyHandlingTime = m.handlingTime;
      }
    }
  }
  buildForm(): void {
    this.form = this.fb.group({
      isStoreSubscription: [null],
      pctProfit: [null, {
        validators: [Validators.required, this._orderHistoryService.validateRequiredNumeric.bind(this)]
      }],
      handlingTime: [null, {
        validators: [Validators.required, this._orderHistoryService.validateRequiredNumeric.bind(this)]
      }],
      shippingTime: [null, {
        validators: [Validators.required, this._orderHistoryService.validateRequiredNumeric.bind(this)]
      }],
      listingLimit: [null, {
        validators: [Validators.required, this._orderHistoryService.validateRequiredNumeric.bind(this)]
      }],
      payPalEmail: [null],
      shippingPolicy: [null],
      selectedStore: [null],
      shippingProfile: [null], // like 'mw'
      storeName: [null]
    })
  }
  onSaveStore() {
    this.displayProgressSpinner = true;
    let storeProfile = new StoreProfile();
    storeProfile.storeName = this.ctlStoreName.value;
    this._orderHistoryService.storeProfileAdd(storeProfile)
      .subscribe(x => {
        this.displayProgressSpinner = false;
      },
        error => {
          this.displayProgressSpinner = false;
          this.errorMessage = error.errMsg;
        });
  }
}
