import { Component, OnInit } from '@angular/core';
import { UserSettingsView, UserProfileView } from 'src/app/_models/userprofile';
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
  profile: UserProfileView;
  errorMessage: string | null;
  isConfigured = false;
  loading = true;
  errMessage: string;

  constructor(private _userService: UserService,
    private _orderHistory: OrderHistoryService,
    private router: Router) { }

  ngOnInit() {
    this.getUserSettings();
    
    this.isAdmin = this._orderHistory.isAdmin();
    this.isAdmin = true;  // for now, enbale this for testing
  }

  getUserSettings() {
    this._userService.UserProfileGet()
      .subscribe(profile => {
        this.profile = profile;
        this.isConfigured = true;
        this.loading = false;
      },
        error => {
          this.errorMessage = error.errMsg;
          this.loading = false;
        });
  }
}
