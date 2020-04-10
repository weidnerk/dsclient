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

import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor() { }

}
