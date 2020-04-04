import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  [x: string]: any;

  @Output() toggleSideBarForMe: EventEmitter<any> = new EventEmitter();

  constructor(private route: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() { }

  toggleSideBar() {
    this.toggleSideBarForMe.emit();
    setTimeout(() => {
      window.dispatchEvent(
        new Event('resize')
      );
    }, 300);
  }
  onLogout() {

    /*
    this.userSettingsView = null;

    // clear settings
    let settings = new FilterSettings();
    settings.seller = null;
    settings.minSold = 1;
    settings.daysBack = 30;
    settings.minPrice = null;
    settings.maxPrice = null;
    settings.showFilter = true;
    settings.rptNumber = 0;
    settings.lastScan = null;
    this.params.changeFilterSettings(settings);
*/
    localStorage.removeItem('currentUser');
    // this.route.navigate(['/login'], {relativeTo: this.activatedRoute});
    this.route.navigate(['/login'], {relativeTo: this.activatedRoute});
  }
}
