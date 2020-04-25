import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TokenStatusTypeCustom, AppIDSelect, UserSettings, UserSettingsView, UserStoreView, UserProfileKeys } from '../_models/userprofile';
import { UserService } from '../_services/index';
import { Token } from '@angular/compiler';
import { environment } from '../../environments/environment';
import { MatOption } from '@angular/material/core';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-apikeys',
  templateUrl: './apikeys.component.html',
  styleUrls: ['./apikeys.component.scss']
})
export class ApikeysComponent implements OnInit {
  apikeysForm: FormGroup;
  errorMessage: string;
  
  tradingAPIUsage: number = 0;
  tokenStatus = new TokenStatusTypeCustom();
  apiHelp: boolean = false;
  apiKeys: AppIDSelect[];
  apiHelpText: string = environment.HELP_TEXT;
  userStores: UserStoreView[];
  selectedStore: number;

  // status spinner variables
  color = 'primary';
  mode = 'indeterminate';
  value = 50;
  displayProgressSpinner: boolean = false;

  constructor(private route: Router, private fb: FormBuilder, private _userService: UserService) { }

  get ctlAppID() { return this.apikeysForm.controls['appidkey']; }
  get ctlDevID() { return this.apikeysForm.controls['devidkey']; }
  get ctlCertID() { return this.apikeysForm.controls['certidkey']; }

  ngOnInit() {
    this.buildForm();
    this.getStores();
  }
  onGetTokenStatus() {
    console.log('onGetTokenStatus');
    this.getTokenStatus();
  }
  getTokenStatus() {
    this.displayProgressSpinner = true;
    this._userService.TokenStatus(this.selectedStore)
      .subscribe(s => {
        this.tokenStatus = s;

        // get null value if keys are invalid
        if (!this.tokenStatus) {
          this.tokenStatus = new TokenStatusTypeCustom();
          this.tokenStatus.StatusStr = "Please check that all keys are valid.";
        }
        this.displayProgressSpinner = false;
      },
        error => {
          this.errorMessage = <any>error;
          this.displayProgressSpinner = false;
        });
  }

  getTradingAPIUsage() {
    this._userService.TradingAPIUsage()
      .subscribe(x => {
        this.tradingAPIUsage = x;
        this.displayProgressSpinner = false;
      },
        error => {
          this.errorMessage = <any>error;
          this.displayProgressSpinner = false;
        });
  }

  /**
   * fill API keys
   */
  getUserSettings() {
    this._userService.UserSettingsViewGetByStore(this.selectedStore)
      .subscribe(userSettings => {
        this.apikeysForm.patchValue({
          appidkey: userSettings.appID,
          certidkey: userSettings.certID,
          devidkey: userSettings.devID,
          apitoken: userSettings.token,
          apikeyselect: userSettings.appID
        });
        this.displayProgressSpinner = false;
      },
        error => {
          if (error.errorStatus !== 404) {
            this.errorMessage = JSON.stringify(error);
          }
          this.displayProgressSpinner = false;
        });
  }

  buildForm(): void {
    this.apikeysForm = this.fb.group({
      appidkey: [null, Validators.required],
      devidkey: [null, Validators.required],
      certidkey: [null, Validators.required],
      apitoken: [null, Validators.required],
      apikeyselect: [null],
      selectedStore: [null]
    })
  }

  onCancel() {
    window.history.back();
  }

  onSubmit(frm) {
    let p = new UserSettingsView();
    p.appID = frm.appidkey;
    p.devID = frm.devidkey;
    p.certID = frm.certidkey;
    p.token = frm.apitoken;

    this.saveKeys();
  }
  onApiHelp() {
    this.apiHelp = true;
  }

  onDelete() {

    // if deleting currently selected scan, then remove it from settings
    // if (this.settings.rptNumber == rptNumber) {
    //   this.settings.rptNumber = 0;
    //   this.settings.lastScan = null;
    //   this.settings.seller = null;
    //   this.params.changeFilterSettings(this.settings);
    // }
    this._userService.deleteAPIKey(this.ctlAppID.value)
      .subscribe(x => {
        this.route.navigate(['/']);
      },
        error => {
          this.errorMessage = <any>error;
        });
  }
  getStores() {
    this._userService.getUserStores()
      .subscribe(x => {
        this.userStores = x;
        if (x.length === 1) {
          this.selectedStore = x[0].storeID;
          this.apikeysForm.patchValue({
            selectedStore: this.selectedStore
          });
          this.getUserSettings();
        }
      },
        error => {
          this.errorMessage = error;
        });
  }
  storeSelected(event: MatSelectChange) {
    const selectedData = {
      text: (event.source.selected as MatOption).viewValue,
      value: event.source.value
    };
    this.selectedStore = selectedData.value;
    this.tokenStatus.ExpirationTime = "";
    this.tokenStatus.Status = "";
    this.tokenStatus.StatusStr = "";
    this.displayProgressSpinner = true;
    this.getUserSettings();
  }

  /**
   * Just look at vwUserSettings to see how to save.
   */
  saveKeys() {
    let keys = new UserProfileKeys();
    keys.appID = this.ctlAppID.value;
    keys.certID = this.ctlCertID.value;
    keys.devID = this.ctlDevID.value;
    this._userService.eBayKeysSave(keys, ["AppID","CertID","DevID"])
    .subscribe(s => {
      this.displayProgressSpinner = false;
    },
      error => {
        this.errorMessage = <any>error;
        this.displayProgressSpinner = false;
      });
  }
}
