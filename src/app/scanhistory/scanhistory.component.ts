/*
* Show all the scans.
*/

import { Component, OnInit } from '@angular/core';
import { SearchHistoryView } from '../_models/orderhistory';
import { ListCheckService } from '../_services/listingcheck.service';
import { FilterSettings } from '../_models/filtersettings';
import { Router } from '@angular/router';
import { ParamService } from '../_services/param.service';
import { Subscription } from 'rxjs';
import { SellerprofileComponent } from '../sellerprofile/sellerprofile.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-scanhistory',
  templateUrl: './scanhistory.component.html',
  styleUrls: ['./scanhistory.component.css']
})
export class ScanhistoryComponent implements OnInit {
  [x: string]: any;

  errorMessage: string;
  searchHistory: SearchHistoryView[];
  dataLoading = true;
  subscription: Subscription;
  settings: FilterSettings;

  // status spinner variables
  color = 'primary';
  mode = 'indeterminate';
  value = 50;
  displayProgressSpinner = false;
  // Display progress spinner for 3 secs on click of button
  // showProgressSpinner = () => {
  //   this.displayProgressSpinner = true;
  //   setTimeout(() => {
  //     this.displayProgressSpinner = false;
  //   }, 3000);
  // };

  constructor(private _listCheckService: ListCheckService,
    private route: Router,
    private params: ParamService,
    public dialog: MatDialog) { }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngOnInit() {
    this.getSearchHistory();

    this.subscription = this.params.currentFilterSettings.subscribe(
      settings => {
        this.settings = settings;
      }
    );
  }

  /**
   * Initial load
   */
  getSearchHistory() {
    this._listCheckService.getSearchHistory()
      .subscribe(x => {
        this.searchHistory = x;
        this.dataLoading = false;
      },
        error => {
          this.errorMessage = <any>error;
          this.dataLoading = false;
        });
  }

  /**
   * Click a particular report
   * @param reportNumber 
   * @param seller 
   * @param lastScan 
   */
  onReport(reportNumber: number, seller: string, lastScan: Date) {
    this.settings.rptNumber = reportNumber;
    this.settings.lastScan = lastScan;
    this.settings.seller = seller;

    this.params.changeFilterSettings(this.settings);
    this.route.navigate(['scanseller']);
  }
  onReportAll() {
    this.settings.rptNumber = 0;
    this.settings.seller = null;

    this.params.changeFilterSettings(this.settings);
    this.route.navigate(['scanseller']);
  }

  onProfile(seller: string) {

    const dialogRef = this.dialog.open(SellerprofileComponent, {
      height: '500px',
      width: '600px',
      data: { seller: seller }
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
    });
  }

  onDelete(rptNumber: number) {
    this.displayProgressSpinner = true;

    // if deleting currently selected scan, then remove it from settings
    if (this.settings.rptNumber == rptNumber) {
      this.settings.rptNumber = 0;
      this.settings.lastScan = null;
      this.settings.seller = null;
      this.params.changeFilterSettings(this.settings);
    }
    this._listCheckService.deleteScan(rptNumber)
      .subscribe(x => {
        this.displayProgressSpinner = false;
        this.getSearchHistory();
      },
        error => {
          this.displayProgressSpinner = false;
          this.errorMessage = JSON.stringify(error);
        });
  }
}
