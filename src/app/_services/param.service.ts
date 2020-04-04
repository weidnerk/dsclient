// refer to: https://www.youtube.com/watch?v=I317BhehZKM

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { FilterSettings } from '../_models/filtersettings';

@Injectable()
export class ParamService {

  // BehaviorSubject ensures that components consuming the service receive the most recent, up to date data

  // 1. Hold current value of the Company (notice private)
  private filterSettingsSource = new BehaviorSubject(new FilterSettings());
  private lockUI = new BehaviorSubject(<boolean>(false));
  currentLockUI = this.lockUI.asObservable();

  // 2. Create observable to be used by the components - thus, the variable is public
  currentFilterSettings = this.filterSettingsSource.asObservable();

  constructor() { }

  // call 'next' on the BehaviorSubject to changes its current value
  changeFilterSettings(settings: FilterSettings) {
    this.filterSettingsSource.next(settings);
  }
  changeLockUI(val: boolean) {
    this.lockUI.next(val);
  }
}