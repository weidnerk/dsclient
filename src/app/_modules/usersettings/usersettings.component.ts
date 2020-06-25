import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { UserSettingsView, UserStoreView, UserSettings, eBayUser } from 'src/app/_models/userprofile';
import { eBayBusinessPolicies, StoreProfile, eBayStore, ShippingPolicy, PaymentPolicy, ReturnPolicy } from 'src/app/_models/orderhistory';
import { OrderHistoryService } from 'src/app/_services/orderhistory.service';
import { UserService } from 'src/app/_services';
import { MatDialog } from '@angular/material/dialog';
import { ShowmessagesComponent } from 'src/app/showmessages/showmessages.component';

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
  get ctlMaxShippingDays() { return this.form.controls['maxShippingDays']; }
  get ctlListingLimit() { return this.form.controls['listingLimit']; }
  get ctlSelectedStore() { return this.form.controls['selectedStore']; }

  get ctlShippingPolicy() { return this.form.controls['shippingPolicy']; }  // like 'mw'
  get ctlPaymentPolicy() { return this.form.controls['paymentPolicy']; }
  get ctlReturnPolicy() { return this.form.controls['returnPolicy']; }

  get ctlPayPalEmail() { return this.form.controls['payPalEmail']; }
  get ctlStoreName() { return this.form.controls['storeName']; }

  constructor(private fb: FormBuilder,
    private _orderHistoryService: OrderHistoryService,
    private _userService: UserService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.buildForm();
    this.getStores();
  }

  onSubmit() {
    this.errorMessage = null;
    if (this.formIsValid()) {
      this.userSettingsSave();
    }
  }
  getUserSettings() {
    this.displayProgressSpinner = true;

    // shouldn't this be 'get use settings for some store selection?'
    this._userService.UserSettingsViewGetByStore(this.selectedStore)
      .subscribe(userSettings => {
        this.userSettingsView = userSettings;
        // console.log('storeID: ' + userSettings.storeID);
        // console.log('max: ' + userSettings.maxShippingDays);

        this.form.patchValue({
          pctProfit: userSettings.pctProfit,
          payPalEmail: userSettings.payPalEmail,
          maxShippingDays: userSettings.maxShippingDays
        });
        this.getBusinessPolicies();
        this.getStore();  // note: not setting storeChanged since getStore tends to take more long

        if (this.userSettingsView.isVA) {
          this.ctlPctProfit.disable();
          this.ctlMaxShippingDays.disable();
        }
      },
        error => {
          // if (error.errorStatus !== 404) {
          //   this.errorMessage = JSON.stringify(error);
          // }
          this.errorMessage = error.errMsg;
          this.displayProgressSpinner = false;
        });
  }
  userSettingsSave() {
    this.displayProgressSpinner = true;
    let settings = new UserSettings();
    settings.pctProfit = this.ctlPctProfit.value;
    settings.storeID = this.selectedStore;
    settings.payPalEmail = this.ctlPayPalEmail.value
    settings.maxShippingDays = this.ctlMaxShippingDays.value;

    if (this.eBayBusinessPolicies) {
      settings.shippingProfile = this.ctlShippingPolicy.value.name;
      settings.returnProfile = this.ctlReturnPolicy.value.name;
      settings.paymentProfile = this.ctlPaymentPolicy.value.name;
      this._userService.userSettingsSave(settings, ["PctProfit", "MaxShippingDays", "ShippingProfile", "ReturnProfile", "PaymentProfile"])
        .subscribe(si => {
          this.displayProgressSpinner = false;
          this.showMessage("Settings saved.");
        },
          error => {
            this.errorMessage = error.errMsg;
            this.displayProgressSpinner = false;
            this.showMessage("<div class='error'>ERROR</div><br/>" + this.errorMessage!);
          });
    }
    else {
      this._userService.userSettingsSave(settings, ["PctProfit", "MaxShippingDays"])
        .subscribe(si => {
          this.userSettingsView = si;
          this.displayProgressSpinner = false;
          this.showMessage("Settings saved.");
        },
          error => {
            this.errorMessage = error.errMsg;
            this.displayProgressSpinner = false;
            this.showMessage("<div class='error'>ERROR</div><br/>" + this.errorMessage!);
          });
    }
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
  onShippingPolicySelected(event: MatSelectChange) {
    this.errorMessage = null;
    const selectedData = {
      text: (event.source.selected as MatOption).viewValue,
      value: event.source.value
    };
    this.shippingSelected = selectedData.value;
    this.getSelectedShippingPolicy();
  }
  onPaymentPolicySelected(event: MatSelectChange) {
    this.errorMessage = null;
    const selectedData = {
      text: (event.source.selected as MatOption).viewValue,
      value: event.source.value
    };
    this.paymentSelected = selectedData.value;
    this.getSelectedPaymentPolicy();
  }
  onReturnPolicySelected(event: MatSelectChange) {
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
      },
        error => {
          this.errorMessage = error.errMsg;
        });
  }
  getStores() {
    this.displayProgressSpinner = true;
    this._userService.getUserStores()
      .subscribe(x => {
        this.userStores = x;
        this.displayProgressSpinner = false;
      },
        error => {
          this.errorMessage = error.errMsg;
          this.displayProgressSpinner = false;
        });
  }
  getBusinessPolicies() {
    this._orderHistoryService.getBusinessPolicies(this.selectedStore)
      .subscribe(x => {
        this.eBayBusinessPolicies = x;
        // console.log('shipping: ' + this.userSettingsView.shippingProfile);
        if (!this.eBayBusinessPolicies.shippingPolicies) {
          this.errorMessage = "No shipping policies defined - did you opt-in to business policies?";
        }
        else {
          this.loadSelectedShippingPolicy();
          if (!this.eBayBusinessPolicies.returnPolicies) {
            this.errorMessage = "No return policies defined - did you opt-in to business policies?";
          }
          else {
            this.loadSelectedReturnPolicy();
            if (!this.eBayBusinessPolicies.paymentPolicies) {
              this.errorMessage = "No payment policies defined - did you opt-in to business policies?";
            }
            else {
              this.loadSelectedPaymentPolicy();
            }
          }
        }
        this.displayProgressSpinner = false;
      },
        error => {
          this.errorMessage = error.errMsg;
          this.displayProgressSpinner = false;
        });
  }
  geteBayUser() {
    this._userService.geteBayUser(this.selectedStore)
      .subscribe(x => {
        this.eBayUser = x;
        this.displayProgressSpinner = false;
      },
        error => {
          this.errorMessage = error.errMsg;
          this.displayProgressSpinner = false;
        });
  }
  // getHandlingTime() {
  //   for (let m of this.eBayBusinessPolicies.shippingPolicies) {
  //     if (m.name == this.ctlShippingProfile.value) {
  //       this.policyHandlingTime = m.handlingTime;
  //     }
  //   }
  // }
  /**
   * Select drop down value based on stored user setting
   */
  loadSelectedShippingPolicy() {
    if (this.userSettingsView.shippingProfile) {
      for (let m of this.eBayBusinessPolicies.shippingPolicies) {
        if (m.name == this.userSettingsView.shippingProfile) {
          this.shippingSelected = m;
          this.form.patchValue({
            shippingPolicy: this.shippingSelected
          });
        }
      }
    }
  }
  /**
   * Select drop down value based on stored user setting
   */
  loadSelectedReturnPolicy() {
    if (this.userSettingsView.returnProfile) {
      for (let m of this.eBayBusinessPolicies.returnPolicies) {
        if (m.name == this.userSettingsView.returnProfile) {
          this.returnSelected = m;
          this.form.patchValue({
            returnPolicy: this.returnSelected
          });
        }
      }
    }
  }
  loadSelectedPaymentPolicy() {
    if (this.userSettingsView.paymentProfile) {
      for (let m of this.eBayBusinessPolicies.paymentPolicies) {
        if (m.name == this.userSettingsView.paymentProfile) {
          this.paymentSelected = m;
          this.form.patchValue({
            paymentPolicy: this.paymentSelected
          });
        }
      }
    }
  }
  /**
   * show details of selected shipping policy (in card)
   */
  getSelectedShippingPolicy() {
    for (let m of this.eBayBusinessPolicies.shippingPolicies) {
      if (m.name == this.ctlShippingPolicy.value.name) {
        this.shippingSelected = m;
      }
    }
  }
  /**
   * show details of selected payment policy (in card)
   */
  getSelectedPaymentPolicy() {
    for (let m of this.eBayBusinessPolicies.paymentPolicies) {
      if (m.name == this.ctlPaymentPolicy.value.name) {
        this.paymentSelected = m;
      }
    }
  }
  /**
   * show details of selected return policy (in card)
   */
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
      maxShippingDays: [null, {
        validators: [Validators.required, this._orderHistoryService.validateRequiredNumeric.bind(this)],
        updateOn: 'submit'
      }],
      listingLimit: [null, {
        validators: [Validators.required, this._orderHistoryService.validateRequiredNumeric.bind(this)],
        updateOn: 'submit'
      }],
      payPalEmail: [null, {
        updateOn: 'submit'
      }],
      shippingPolicy: [null, {
        validators: [Validators.required],
        updateOn: 'submit'
      }], selectedStore: [null],
      paymentPolicy: [null, {
        validators: [Validators.required],
        updateOn: 'submit'
      }],
      returnPolicy: [null, {
        validators: [Validators.required],
        updateOn: 'submit'
      }],
      returnsPayee: [null],
      shippingType: [null]
    })
  }
  formIsValid(): boolean {
    if (this.ctlPctProfit.invalid) { return false; }
    if (this.ctlMaxShippingDays.invalid) { return false; }

    if (this.userSettingsView) {
      if (!this.eBayBusinessPolicies) {
        this.errorMessage = "Missing business policies - did you opt-in to business policies?";
        return false;
      }
      else {
        if (!this.eBayBusinessPolicies.paymentPolicies || !this.eBayBusinessPolicies.returnPolicies || !this.eBayBusinessPolicies.shippingPolicies) {
          this.errorMessage = "Missing business policies - did you opt-in to business policies?";
          return false;
        }
      }
    }
    return true;
  }
  showMessage(msg: string) {
    const dialogRef = this.dialog.open(ShowmessagesComponent, {
      height: '500px',
      width: '600px',
      data: { message: msg }
    });

    dialogRef.afterClosed().subscribe(result => {
      // this.router.navigate(['/']);
    });
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
