import { Component, OnInit } from '@angular/core';
import { UserSettingsView } from 'src/app/_models/userprofile';
import { UserService } from 'src/app/_services';
import { OrderHistoryService } from 'src/app/_services/orderhistory.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  isAdmin = false;
  userSettingsView: UserSettingsView;
  errorMessage: string | null;

  constructor(private _userService: UserService,
    private _orderHistory: OrderHistoryService) { }

  ngOnInit() {
    this.getUserSettings();
    
    this.isAdmin = this._orderHistory.isAdmin();

  }

  getUserSettings() {
    this._userService.UserSettingsViewGet()
      .subscribe(userSettings => {
        this.userSettingsView = userSettings;
        // this.showProgress = false;
      },
        error => {
          if (error.errorStatus !== 404) {
            this.errorMessage = JSON.stringify(error);
          }
          // this.showProgress = false;
        });
  }
}
