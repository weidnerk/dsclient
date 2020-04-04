import { Component, OnInit } from '@angular/core';
import { OrderHistoryService } from '../_services/orderhistory.service';
import { OrderHistory, ModelView } from '../_models/orderhistory';
import { HttpClient, HttpRequest, HttpEventType, HttpEvent } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { RenderingService } from '../_services/rendering.service';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  private getOrderHistoryUrl: string = environment.API_ENDPOINT + 'scraper';

  orderItems: OrderHistory[];
  modelView: ModelView;
  errorMessage: string;
  isProcessing: boolean;
  status: string;
  totalItems: number = 0;
  totalOrders: number = 0;
  elapsedSeconds: number = 0;
  settingsForm: FormGroup;
  private timer = null;
  private rptNumber: number;
  private minSold: number;

  constructor(private _orderHistoryService: OrderHistoryService,
    private _renderingService: RenderingService,
    private http: HttpClient,
    private fb: FormBuilder) { }

  get seller() { return this.settingsForm.get('seller'); }
  get daysBack() { return this.settingsForm.get('daysBack'); }
  get delay() { return this.settingsForm.get('delay'); }
  get resultsPerPage() { return this.settingsForm.get('resultsPerPage'); }

  ngOnInit(): void {
    //this.buildForm();
  }

  // private populateOrders(seller: string, daysBack: number, waitSeconds: number) {

  //   this._orderHistoryService.getData(seller, daysBack, waitSeconds).subscribe((event: HttpEvent<ModelView>) => {
  //     switch (event.type) {
  //       case HttpEventType.Sent:
  //         console.log('Request sent!');
  //         break;

  //       case HttpEventType.ResponseHeader:
  //         console.log('Response header received!');
  //         break;

  //       case HttpEventType.DownloadProgress:
  //         const kbLoaded = Math.round(event.loaded / 1024);
  //         console.log(`Download in progress! ${kbLoaded}Kb loaded`);
  //         break;

  //       case HttpEventType.Response:
  //         console.log('😺 Done!', event.body);
  //         this.modelView = event.body;
  //         this.orderItems = this.modelView.Orders;
  //         this.totalItems = this.modelView.TotalItems;
  //         this.totalOrders = this.modelView.TotalOrders;
  //         this.elapsedSeconds = this.modelView.ElapsedSeconds;
  //         this.isProcessing = false;
  //     }
  //   });
  // }

  // getOrderHistory(seller: string, daysBack: number, delay: number, resultsPerPage: number, minSold: number) {
  //   this.rptNumber = Math.floor(Math.random() * 100000);
  //   this._orderHistoryService.getOrderHistory(seller, daysBack, delay, resultsPerPage, this.rptNumber, minSold)
  //     .subscribe(x => {
  //       this.isProcessing = false;
  //       this.timer = null;
  //       this.modelView = x;
  //       this.totalItems = x.TotalItems;
  //       this.totalOrders = x.TotalOrders;
  //       console.log('getOrderHistory');
  //     },
  //       error => {
  //         this.errorMessage = <any>error;
  //         this.isProcessing = false;
  //       });
  // }


  // displayOrders() {
  //   console.log('displayOrders');
  //   this._renderingService.renderOrders(this.rptNumber)
  //     .subscribe(x => {
  //       this.orderItems = x;
  //     },
  //       error => {
  //         this.errorMessage = <any>error;
  //         this.isProcessing = false;
  //       });
  // }

  // getOrderHistory(seller: string, daysBack: number, delay: number, resultsPerPage: number) {
  //   this._orderHistoryService.getOrderHistory(seller, daysBack, delay, resultsPerPage)
  //     .subscribe(
  //       mv => {
  //         this.modelView = mv;
  //         this.orderItems = mv.Orders;
  //         this.isProcessing = false;
  //         this.totalItems = this.modelView.TotalItems;
  //         this.totalOrders = this.modelView.TotalOrders;
  //         this.elapsedSeconds = this.modelView.ElapsedSeconds;
  //       },
  //       error => {
  //         this.errorMessage = <any>error;
  //         this.isProcessing = false;
  //       });
  // }

  // onSubmit(settingsForm) {
  //   this.totalItems = 0;
  //   this.totalOrders = 0;
  //   this.elapsedSeconds = 0;
  //   this.orderItems = null;
  //   this.isProcessing = true;
  //   this.errorMessage = null;
  //   //this.getOrderHistory(this.seller, this.daysBack);
  //   this.getOrderHistory(settingsForm.seller, settingsForm.daysBack, settingsForm.delay, settingsForm.resultsPerPage, settingsForm.minSold);

  //   // start timer
  //   if (this.timer)
  //     clearInterval(this.timer);
  //   //this.timer = setInterval(() => this.displayOrders(), 5000);
  //   setInterval(this.displayOrders.bind(this), 4000);
  // }

  // buildForm(): void {

  //   this.settingsForm = this.fb.group({
  //     seller: ['shedsforlessdirect', Validators.required],
  //     daysBack: [2, Validators.compose([Validators.required, Validators.pattern(/^[1-9]\d*$/)])],
  //     delay: [0, Validators.compose([Validators.required, Validators.pattern(/^[0-9]\d*$/)])],
  //     resultsPerPage: [200, Validators.compose([Validators.required, Validators.pattern(/^[1-9]\d*$/)])],
  //   })

    // if (this.isEditing) 
    //   this.vehForm.get('vin').disable();
  //}
}
