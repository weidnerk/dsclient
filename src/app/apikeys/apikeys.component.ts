import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TokenStatusTypeCustom, AppIDSelect, UserSettings, UserSettingsView, UserStoreView } from '../_models/userprofile';
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
  loading: boolean = false;
  tradingAPIUsage: number = 0;
  //tokenStatus: TokenStatusType = <TokenStatusType>{};
  tokenStatus = new TokenStatusTypeCustom();
  tradingAPIUsageLoading: boolean = false;
  tokenStatusLoading: boolean = true;
  apiHelp: boolean = false;
  apiKeys: AppIDSelect[];
  apiHelpText: string = environment.HELP_TEXT;
  userStores: UserStoreView[];
  selectedStore: number;

  constructor(private route: Router, private fb: FormBuilder, private _userService: UserService) { }

  get ctlAppID() { return this.apikeysForm.controls['appidkey']; }

  ngOnInit() {
    this.buildForm();
    this.getStores();
  }

  getTokenStatus() {
    this._userService.TokenStatus()
      .subscribe(s => {
        this.tokenStatus = s;

        // get null value if keys are invalid
        if (!this.tokenStatus) {
          this.tokenStatus = new TokenStatusTypeCustom();
          this.tokenStatus.StatusStr = "Please check that all keys are valid.";
        }
        this.tokenStatusLoading = false;
      },
        error => {
          this.errorMessage = <any>error;
          this.tokenStatusLoading = false;
        });
  }

  getTradingAPIUsage() {
    this._userService.TradingAPIUsage()
      .subscribe(x => {
        this.tradingAPIUsage = x;
        this.tradingAPIUsageLoading = false;
      },
        error => {
          this.errorMessage = <any>error;
          this.tradingAPIUsageLoading = false;
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
        this.loading = false;
      },
        error => {
          if (error.errorStatus !== 404) {
            this.errorMessage = JSON.stringify(error);
          }
          this.loading = false;
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
      this.getUserSettings();
    }

    /**
     * Just look at vwUserSettings to see how to save.
     */
    saveKeys() {

    }
}
