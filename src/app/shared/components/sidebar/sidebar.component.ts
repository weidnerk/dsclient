import { Component, OnInit } from '@angular/core';
import { UserSettingsView } from 'src/app/_models/userprofile';
import { UserService } from 'src/app/_services';
import { OrderHistoryService } from 'src/app/_services/orderhistory.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  isAdmin = false;
  userSettingsView: UserSettingsView;
  errorMessage: string | null;
  isConfigured = false;
  loading = true;

  constructor(private _userService: UserService,
    private _orderHistory: OrderHistoryService,
    private router: Router) { }

  ngOnInit() {
    this.getUserSettings();
    
    this.isAdmin = this._orderHistory.isAdmin();
  }

  getUserSettings() {
    this._userService.UserSettingsViewGet()
      .subscribe(userSettings => {
        this.userSettingsView = userSettings;
        this.isConfigured = true;
        this.loading = false;
      },
        error => {
          if (error.errorStatus !== 404) {
            this.errorMessage = JSON.stringify(error);
            this.router.navigate(['/login']);
          }
          this.loading = false;
        });
  }
}
