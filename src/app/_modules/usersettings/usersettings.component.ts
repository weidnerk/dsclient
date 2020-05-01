import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { UserSettingsView, UserStoreView, UserSettings, eBayUser } from 'src/app/_models/userprofile';
import { eBayBusinessPolicies, StoreProfile, eBayStore, ShippingPolicy, PaymentPolicy, ReturnPolicy } from 'src/app/_models/orderhistory';
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

  returnsPayee = [
    { value: 'Buyer', viewValue: 'Buyer' },
    { value: 'Seller', viewValue: 'Seller' }
  ];
  shippingType = [
    { value: 'Standard', viewValue: 'Standard' },
    { value: 'Economy', viewValue: 'Economy' }
  ];

  form: FormGroup;
  userSettingsView: UserSettingsView;
  errorMessage: string | null;
  userStores: UserStoreView[];
  selectedStore: number;
  eBayBusinessPolicies: eBayBusinessPolicies;
  eBayUser: eBayUser;
  storeChanged = 0;
  ebayStore: eBayStore;
  shippingSelected: ShippingPolicy | null;
  paymentSelected: PaymentPolicy | null;
  returnSelected: ReturnPolicy | null;

  // status spinner variables
  color = 'primary';
  mode = 'indeterminate';
  value = 50;
  displayProgressSpinner = false;

  get ctlPctProfit() { return this.form.controls['pctProfit']; }
  get ctlListingLimit() { return this.form.controls['listingLimit']; }
  get ctlSelectedStore() { return this.form.controls['selectedStore']; }

  get ctlShippingPolicy() { return this.form.controls['shippingPolicy']; }  // like 'mw'
  get ctlPaymentPolicy() { return this.form.controls['paymentPolicy']; }
  get ctlReturnPolicy() { return this.form.controls['returnPolicy']; }

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
    this.displayProgressSpinner = true;

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
        this.storeChanged = 2;
        this.getBusinessPolicies();
        this.getStore();
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
    this._userService.userSettingsSave(settings, ["PctProfit", "PayPalEmail"])
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
    this.shippingSelected = null;
    this.returnSelected = null;
    this.paymentSelected = null;
    this.getUserSettings();
    this.geteBayUser();
  }
  shippingPolicySelected(event: MatSelectChange) {
    this.errorMessage = null;
    const selectedData = {
      text: (event.source.selected as MatOption).viewValue,
      value: event.source.value
    };
    this.shippingSelected = selectedData.value;
    this.getSelectedShippingPolicy();
  }
  paymentPolicySelected(event: MatSelectChange) {
    this.errorMessage = null;
    const selectedData = {
      text: (event.source.selected as MatOption).viewValue,
      value: event.source.value
    };
    this.paymentSelected = selectedData.value;
    this.getSelectedPaymentPolicy();
  }
  returnPolicySelected(event: MatSelectChange) {
    this.errorMessage = null;
    const selectedData = {
      text: (event.source.selected as MatOption).viewValue,
      value: event.source.value
    };
    this.returnSelected = selectedData.value;
    this.getSelectedReturnPolicy();
  }
  getStore() {
    this._userService.getStore(this.selectedStore)
      .subscribe(x => {
        this.ebayStore = x;
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
  getStores() {
    ++this.storeChanged;
    this.displayProgressSpinner = true;
    this._userService.getUserStores()
      .subscribe(x => {
        this.userStores = x;

        // user has just 1 store, so select it
        if (this.userStores.length === 1) {
          this.selectedStore = this.userStores[0].storeID;
          this.ctlSelectedStore.setValue(this.userStores[0].storeID);
          this.storeChanged = 3;
          this.getBusinessPolicies();
          this.getStore();
          this.geteBayUser();
        }
        else {
          this.displayProgressSpinner = false;
        }
      },
        error => {
          this.errorMessage = error.errMsg;
          this.displayProgressSpinner = false;
        });
  }
  /**
   * look up handling time 
   */
  getBusinessPolicies() {
    this._orderHistoryService.getBusinessPolicies(this.selectedStore)
      .subscribe(x => {
        this.eBayBusinessPolicies = x;
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
  geteBayUser() {
    this._userService.geteBayUser(this.selectedStore)
      .subscribe(x => {
        this.eBayUser = x;
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
  // getHandlingTime() {
  //   for (let m of this.eBayBusinessPolicies.shippingPolicies) {
  //     if (m.name == this.ctlShippingProfile.value) {
  //       this.policyHandlingTime = m.handlingTime;
  //     }
  //   }
  // }
  getSelectedShippingPolicy() {
    for (let m of this.eBayBusinessPolicies.shippingPolicies) {
      if (m.name == this.ctlShippingPolicy.value.name) {
        this.shippingSelected = m;
      }
    }
  }
  getSelectedPaymentPolicy() {
    for (let m of this.eBayBusinessPolicies.paymentPolicies) {
      if (m.name == this.ctlPaymentPolicy.value.name) {
        this.paymentSelected = m;
      }
    }
  }
  getSelectedReturnPolicy() {
    for (let m of this.eBayBusinessPolicies.returnPolicies) {
      if (m.name == this.ctlReturnPolicy.value.name) {
        this.returnSelected = m;
      }
    }
  }
  buildForm(): void {
    this.form = this.fb.group({
      pctProfit: [null, {
        validators: [Validators.required, this._orderHistoryService.validateRequiredNumeric.bind(this)],
        updateOn: 'submit'
      }],
      handlingTime: [null, {
        validators: [Validators.required, this._orderHistoryService.validateRequiredNumeric.bind(this)],
        updateOn: 'submit'
      }],
      shippingTime: [null, {
        validators: [Validators.required, this._orderHistoryService.validateRequiredNumeric.bind(this)],
        updateOn: 'submit'
      }],
      listingLimit: [null, {
        validators: [Validators.required, this._orderHistoryService.validateRequiredNumeric.bind(this)],
        updateOn: 'submit'
      }],
      payPalEmail: [null, {
        validators: [Validators.required],
        updateOn: 'submit'
      }],
      shippingPolicy: [null],
      selectedStore: [null],
      // shippingProfile: [null], // like 'mw'
      returnsPayee: [null],
      shippingType: [null],
      paymentPolicy: [null],
      returnPolicy: [null]
    })
  }
  formIsValid(): boolean {
    if (this.ctlPctProfit.invalid) { return false; }
    return true;
  }
  /*
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
  */
}
