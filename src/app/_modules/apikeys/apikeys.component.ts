import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TokenStatusTypeCustom, AppIDSelect, UserSettings, UserSettingsView, UserStoreView, UserProfileKeys, UserProfileKeysView } from '../../_models/userprofile';
import { UserService } from '../../_services/index';
import { environment } from '../../../environments/environment';
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
  userSettingsView: UserSettingsView;
  userProfileKeysView: UserProfileKeysView;

  // status spinner variables
  color = 'primary';
  mode = 'indeterminate';
  value = 50;
  displayProgressSpinner: boolean = false;

  constructor(private route: Router, private fb: FormBuilder, private _userService: UserService) { }

  get ctlAppID() { return this.apikeysForm.controls['appidkey']; }
  get ctlDevID() { return this.apikeysForm.controls['devidkey']; }
  get ctlCertID() { return this.apikeysForm.controls['certidkey']; }
  get ctlAPIToken() { return this.apikeysForm.controls['apitoken']; }
  get ctlAPIEmail() { return this.apikeysForm.controls['APIEmail']; }

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
          this.errorMessage = error.errMsg;
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
          this.errorMessage = error.errMsg;
          this.displayProgressSpinner = false;
        });
  }

  getAPIKeys() {
    this._userService.getAPIKeys(this.selectedStore)
      .subscribe(keys => {
        this.userProfileKeysView = keys;
        this.apikeysForm.patchValue({
          appidkey: keys.appID,
          certidkey: keys.certID,
          devidkey: keys.devID,
          apitoken: keys.token,
          APIEmail: keys.APIEmail
        });
        this.displayProgressSpinner = false;
      },
        error => {
          this.errorMessage = error.errMsg;
          this.displayProgressSpinner = false;
        });
  }
  buildForm(): void {
    this.apikeysForm = this.fb.group({
      appidkey: [null, Validators.required],
      devidkey: [null, Validators.required],
      certidkey: [null, Validators.required],
      apitoken: [null, Validators.required],
      selectedStore: [null],
      APIEmail: [null]
    })
  }
  formIsValid(): boolean {
    if (this.ctlAppID.invalid) { return false; }
    if (this.ctlDevID.invalid) { return false; }
    if (this.ctlCertID.invalid) { return false; }
    if (this.ctlAPIToken.invalid) { return false; }
    if (this.ctlAPIEmail.invalid) { return false; }

    // user may be new and not have any stores set up yet
    // if (!this.selectedStore) { return false;}

    return true;
}
  onCancel() {
    window.history.back();
  }

  onSubmit() {
  
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
          this.errorMessage = error.errMsg;
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
          this.getAPIKeys();
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
    this.tokenStatus.ExpirationTime = "";
    this.tokenStatus.Status = "";
    this.tokenStatus.StatusStr = "";
    this.displayProgressSpinner = true;
    this.getAPIKeys();
  }

  /**
   * Just look at vwUserSettings to see how to save.
   */
  saveKeys() {
    this.displayProgressSpinner = true;
    let keys = new UserProfileKeys();
    if (this.userSettingsView) {
      keys.id = this.userSettingsView.ebayKeyID;
    }
    else {
      // first time saving
      keys.id = 0;
      this.selectedStore = 0;
    }
    keys.appID = this.ctlAppID.value;
    keys.certID = this.ctlCertID.value;
    keys.devID = this.ctlDevID.value;
    keys.APIEmail = this.ctlAPIEmail.value;
    
    this._userService.eBayKeysSave(keys, ["AppID","CertID","DevID","EmailAddress"], this.ctlAPIToken.value, this.selectedStore)
    .subscribe(s => {
      if (this.selectedStore == 0) {
        this.getStores()
      }
      this.displayProgressSpinner = false;
    },
      error => {
        this.errorMessage = error.errMsg;
        this.displayProgressSpinner = false;
      });
  }
}
