import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
//import { HashLocationStrategy, LocationStrategy, CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';

import { OrderHistoryService } from './_services/orderhistory.service';
import { RenderingService } from './_services/rendering.service';
import { ListCheckService } from './_services/listingcheck.service';
import { AuthGuard } from './_guards/index';
import { AuthenticationService, UserService } from './_services/index';
import { ParamService } from './_services/param.service';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { SellerprofileComponent } from './sellerprofile/sellerprofile.component';
import { ListingnoteComponent } from './listingnote/listingnote.component';
import { AppRoutingModule } from './app-routing.module';
import { DefaultModule } from './layouts/default/default.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatToolbarModule,
    MatMenuModule,
    BrowserAnimationsModule,
    DefaultModule
  ],
  entryComponents: [SellerprofileComponent, ListingnoteComponent],
  providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}, UserService, AuthGuard, AuthenticationService, OrderHistoryService, RenderingService, ParamService, ListCheckService],
  bootstrap: [AppComponent]
})
export class AppModule { }
