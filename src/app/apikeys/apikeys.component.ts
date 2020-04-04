import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TokenStatusTypeCustom, AppIDSelect, UserSettings, UserSettingsView } from '../_models/userprofile';
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
  loading: boolean = true;
  tradingAPIUsage: number = 0;
  //tokenStatus: TokenStatusType = <TokenStatusType>{};
  tokenStatus = new TokenStatusTypeCustom();
  tradingAPIUsageLoading: boolean = true;
  tokenStatusLoading: boolean = true;
  apiHelp: boolean = false;
  apiKeys: AppIDSelect[];
  apiHelpText: string = environment.HELP_TEXT;

  constructor(private route: Router, private fb: FormBuilder, private _userService: UserService) { }

  get ctlAppID() { return this.apikeysForm.controls['appidkey']; }

  ngOnInit() {
    this.buildForm();
    this.getUserSettings();
    this.getAppIds(); // to fill selection drop down
    this.getTradingAPIUsage();
    this.getTokenStatus();
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
    this._userService.UserSettingsViewGet()
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

  /**
   * Fill selection drop down
   */
  getAppIds() {
    this._userService.GetAppIds()
      .subscribe(profile => {
        this.apiKeys = profile;
        this.loading = false;
      },
        error => {
          this.errorMessage = JSON.stringify(error);
          this.loading = false;
        });
  }

  buildForm(): void {

    this.apikeysForm = this.fb.group({
      appidkey: [null, Validators.required],
      devidkey: [null, Validators.required],
      certidkey: [null, Validators.required],
      apitoken: [null, Validators.required],
      apikeyselect: [null]
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

    // let appID=frm.apikeyselect;
    // p.AppID = appID;
    // console.log(appID);

    this._userService.UserProfileSave(p)
      .subscribe(x => {
        this.route.navigate(['/']);
      },
        error => {
          this.errorMessage = JSON.stringify(error);
        });

  }
  onApiHelp() {
    this.apiHelp = true;
  }

  keySelected(event: MatSelectChange) {
    const selectedData = {
      text: (event.source.selected as MatOption).viewValue,
      value: event.source.value
    };
    console.log(selectedData.value);
    this.getUserSettings();
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
}
