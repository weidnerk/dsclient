import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrderHistoryService } from '../_services/orderhistory.service';
import { UserService } from '../_services';
import { UserSettingsView, UserSettings, UserStoreView } from '../_models/userprofile';
import { MatSelectChange } from '@angular/material/select';
import { MatOption } from '@angular/material/core';

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

  // status spinner variables
  color = 'primary';
  mode = 'indeterminate';
  value = 50;
  displayProgressSpinner = false;

  get ctlPctProfit() { return this.form.controls['pctProfit']; }
  
  constructor(private fb: FormBuilder,
    private _orderHistoryService: OrderHistoryService,
    private _userService: UserService) { }

  ngOnInit(): void {
    this.buildForm();
    // this.getUserSettings();
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
          pctProfit: userSettings.pctProfit
        });
      },
        error => {
          if (error.errorStatus !== 404) {
            this.errorMessage = JSON.stringify(error);
          }
        });
  }
  userSettingsSave() {
    this.displayProgressSpinner = true;
    let settings = new UserSettings();
    settings.pctProfit = this.ctlPctProfit.value;
    settings.storeID = this.selectedStore;
    this._userService.userSettingsSave(settings, ["PctProfit"])
      .subscribe(si => {
        this.displayProgressSpinner = false;
      },
        error => {
          this.errorMessage = error.errMsg;
          this.displayProgressSpinner = false;
        });
  }
  storeSelected(event: MatSelectChange) {
    const selectedData = {
      text: (event.source.selected as MatOption).viewValue,
      value: event.source.value
    };
    this.selectedStore = selectedData.value;
    this.getUserSettings();
    this.getBusinessPolicies();
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
  getBusinessPolicies() {
    this._orderHistoryService.getBusinessPolicies()
      .subscribe(x => {
      },
        error => {
          this.errorMessage = error;
        });
  }
  buildForm(): void {
    this.form = this.fb.group({
      pctProfit: [null, {
        validators: [Validators.required, this._orderHistoryService.validateRequiredNumeric.bind(this)]
      }]
    })
  }
}
