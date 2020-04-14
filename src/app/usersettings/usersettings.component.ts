import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrderHistoryService } from '../_services/orderhistory.service';
import { UserService } from '../_services';
import { UserSettingsView } from '../_models/userprofile';

@Component({
  selector: 'app-usersettings',
  templateUrl: './usersettings.component.html',
  styleUrls: ['./usersettings.component.scss']
})
export class UsersettingsComponent implements OnInit {

  form: FormGroup;
  userSettingsView: UserSettingsView;
  errorMessage: string | null;

  get ctlPctProfit() { return this.form.controls['pctProfit']; }
  
  constructor(private fb: FormBuilder,
    private _orderHistoryService: OrderHistoryService,
    private _userService: UserService) { }

  ngOnInit(): void {
    this.buildForm();
    this.getUserSettings();
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
      },
        error => {
          if (error.errorStatus !== 404) {
            this.errorMessage = JSON.stringify(error);
          }
        });
  }
}
