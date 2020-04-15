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

  get ctlPctProfit() { return this.form.controls['pctProfit']; }
  
  constructor(private fb: FormBuilder,
    private _orderHistoryService: OrderHistoryService,
    private _userService: UserService) { }

  ngOnInit(): void {
    this.buildForm();
    this.getUserSettings();
    this.getStores();
  }

  buildForm(): void {
    this.form = this.fb.group({
      pctProfit: [null, {
        validators: [Validators.required, this._orderHistoryService.validateRequiredNumeric.bind(this)]
      }]
    })
  }
  onSubmit() {
    console.log(this.ctlPctProfit.value);
  }
  getUserSettings() {
    this._userService.UserSettingsViewGet()
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
    let settings = new UserSettings();
    settings.pctProfit = this.ctlPctProfit.value;
    settings.storeID = this.selectedStore;
    this._userService.userSettingsSave(settings, ["pctProfit"])
      .subscribe(si => {
        // this.isProcessing = false;
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
}
