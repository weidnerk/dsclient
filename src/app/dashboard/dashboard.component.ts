/**
 * This is the home page
 * 
 * New query - user enters a seller and clicks submit,
 * rptNumber = 0, so it starts a timer on displayOrders and proceeds to subscribe to getNumItems (so we can show progress)
 * Once getNumItems has a result, it displays it and calls getOrderHistory()
 * 
 * After ngInit calls getProfile and buildform, it then subscribes to the current filter settings
 * do this because want to know if returning from detail page
 * 
 * We employ a service to keep track of our 'global' settings (like min price)
 * when enter timessold form, subscrbe to paramservice to get settings
 * 
 * When user clicks into detail of an item, that's when we call changeFilterSettings to store the settings
 * 
 */

import { Component, OnInit } from '@angular/core';
import { OrderHistoryService } from '../_services/orderhistory.service';
import { Dashboard } from '../_models/orderhistory';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  dashboard = new Dashboard();
  errorMessage: string;
  loading = false;
  logErrorCount: number;
  logStatus: string | null;
  lastErr = "";

  constructor(private _orderHistoryService: OrderHistoryService,
    private router: Router) { }

  ngOnInit(): void {
    this.loading = true;
    this.getDashboard();
    this.getErrorCount();
    if (this._orderHistoryService.isAdmin()) {
      this.getLastError();
    }
  }

  getDashboard() {
    // pull values from seller's listing
    this._orderHistoryService.getDashboard()
      .subscribe(si => {
        this.dashboard = si;
        this.loading = false;
      },
        error => {
          this.errorMessage = error.errMsg;
          this.loading = false;
          if (error.errorStatus !== 404) {
            this.errorMessage = JSON.stringify(error);
            this.router.navigate(['/login']);
          }
        });
  }
  getErrorCount() {
    // pull values from seller's listing
    this._orderHistoryService.getFindError("log.txt")
      .subscribe(wi => {
        this.logErrorCount = wi;
        if (this.logErrorCount > 0) {
          this.logStatus = this.logErrorCount + " errors";
        }
        else {
          this.logStatus = null;
        }
      },
        error => {
          this.errorMessage = error.errMsg;
        });
  }
  getLastError() {
    // pull values from seller's listing
    this._orderHistoryService.getLastError("log.txt")
      .subscribe(wi => {
        this.lastErr = wi;
      },
        error => {
          this.errorMessage = error.errMsg;
        });
  }
}
