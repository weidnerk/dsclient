/*
 * User can click into an item displayed by timessold and reach this detail page.
 * 
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { OrderHistoryService } from '../../_services/orderhistory.service';
import { Listing, DeriveProfit, TimesSold, ListingNoteView, SellerListing, SupplierItem, SalesOrder, PriceProfit, ListingLogView, eBayBusinessPolicies, ListingLog } from '../../_models/orderhistory';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { ParamService } from '../../_services/param.service';
import { ListingnoteComponent } from '../../listingnote/listingnote.component';
import { MatDialog } from '@angular/material/dialog';
import { ListCheckService } from '../../_services/listingcheck.service';
import { ShowmessagesComponent } from 'src/app/showmessages/showmessages.component';
import { UserProfile, UserSettingsView } from 'src/app/_models/userprofile';
import { UserService } from 'src/app/_services';
import { ConfirmComponent } from 'src/app/confirm/confirm.component';
import { EndlistingComponent } from 'src/app/endlisting/endlisting.component';
import { ErrordisplayComponent } from 'src/app/errordisplay/errordisplay.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.scss']
})
export class ListingdbComponent implements OnInit {

  [x: string]: any;

  sourceValues = [
    { value: '1', viewValue: 'Walmart' }
  ];
  yesNo = [
    { value: '0', viewValue: 'No' },
    { value: '1', viewValue: 'Yes' }
  ];
  yesNoIdk = [
    { value: '0', viewValue: 'No' },
    { value: '1', viewValue: 'Yes' },
    { value: '2', viewValue: 'Don\'t know' }
  ];
  competition = [
    { value: '1', viewValue: 'Low' },
    { value: '2', viewValue: 'Med' },
    { value: '3', viewValue: 'High' },
    { value: '4', viewValue: 'Don\'t know' }
  ];
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '0',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' }
    ],
    uploadUrl: 'v1/image',
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['italic', 'insertImage', 'insertVideo', 'strikeThrough', 'superscript', 'subscript'],
      ['fontSize', 'link',
        'unlink',]
    ]
  };
  constructor(private router: Router,
    private _userService: UserService,
    private route: ActivatedRoute,
    private _orderHistoryService: OrderHistoryService,
    private fb: FormBuilder,
    private _parmService: ParamService,
    public dialog: MatDialog) { }

  // private sub: any;
  listingID: number;  // Listing.ID
  listing: Listing | null;
  walItem: SupplierItem | null = null;
  userProfile: UserProfile;
  userSettingsView: UserSettingsView;
  salesOrder: SalesOrder[];

  // used for testing fetch of variations
  variationItem: SupplierItem;
  sellerVariationItem: SellerListing;

  errorMessage: string | null;
  statusMessage: string | null;
  validationMessage: string | null;
  storeButtonVal: boolean = false;
  listButtonVal: boolean = false;
  deleteButtonVal: boolean = false;
  orderButtonVal: boolean = false;

  rptNumber = 0;
  qtySold = 0;
  admin = false;
  orderItem: TimesSold[]; // Get item from scan.
  supplierPicsMsg: string | null;
  ebayURL: string;
  priceProfit: PriceProfit;
  profit: number;
  log: ListingLogView[];
  notesButtonText: string = "Notes";
  reviseLoadImages = false;
  listingButtonEnable = false;
  htmlContent = '';

  // status spinner variables
  color = 'primary';
  mode = 'indeterminate';
  value = 50;
  displayProgressSpinner = false;
  eBayBusinessPolicies: eBayBusinessPolicies;

  // form variables
  listingForm: FormGroup;
  // editorForm: FormGroup;
  formatedPictureUrl: string;
  formatedOutput: string;
  imgSourceArray: string[] | null;
  orderForm: FormGroup;

  get ctlSourceURL(): AbstractControl { return this.listingForm.controls['sourceURL']; }
  get ctlSourceId(): AbstractControl { return this.listingForm.controls['sourceId']; }
  get ctlListingPrice() { return this.listingForm.controls['listingPrice']; }
  get ctlListingTitle() { return this.listingForm.controls['listingTitle']; }
  get ctlListingQty() { return this.listingForm.controls['listingQty']; }
  get ctlPctProfit() { return this.listingForm.controls['pctProfit']; }
  get ctlNote() { return this.listingForm.controls['note']; }
  get ctlCheckDescription() { return this.listingForm.controls['checkDescription']; }

  get ctlDescription() { return this.listingForm.controls['description']; }
  // get ctlHtmlContent() { return this.listingForm.controls['htmlContent']; }


  // get ctlEbayOrderNum() { return this.orderForm.controls['ebayOrderNumber']; }
  get ctlFromDate() { return this.orderForm.controls['fromDate']; }
  get ctlToDate() { return this.orderForm.controls['toDate']; }
  get ctlIPaid() { return this.orderForm.controls['ipaid']; }
  get ctlSupplierOrderNum() { return this.orderForm.controls['supplierOrderNumber']; }

  get ctlSellerItemID(): AbstractControl { return this.listingForm.controls['sellerItemID']; }

  /**
   * 
   * not needed if just showing progress swirl
   */
  setLockUI(val: boolean) {
    this._parmService.changeLockUI(val);
  }
  ngOnInit() {

    this.admin = this._orderHistoryService.isAdmin();
    this.buildForm();
    this.buildOrderForm();
    this.buildEditorForm();
    this.getUserProfile();

    this.listingForm.controls['variation'].disable();
    this.listingForm.controls['variationDescription'].disable();
  }
  /**
     * Need storeID for new listing.
     */
  getUserProfile() {
    this._userService.UserProfileGet()
      .subscribe(profile => {
        this.userProfile = profile;
        this.selectedStore = profile.selectedStore;

        // 04.23.2020 hold off for now - overkill
        //this.getBusinessPolicies();

        this.getUserSettings();
      },
        error => {
          // if (error.errorStatus !== 404) {
          //   this.errorMessage = JSON.stringify(error);
          // }
          this.errorMessage = error.errMsg;
          this.displayProgressSpinner = false;
        });
  }
  getUserSettings() {
    // shouldn't this be 'get use settings for some store selection?'
    this._userService.UserSettingsViewGetByStore(this.userProfile.selectedStore)
      .subscribe(userSettings => {
        this.userSettingsView = userSettings;
        this.listingForm.patchValue({
          pctProfit: userSettings.pctProfit
        });

        // itemId is seller's listing id
        // passing rptNumber and qtySold to potentially record in Listing table.

        this.route.params.subscribe(params => {
          this.listingID = +params['listingID'];
          if (this.listingID > 0) {
            // console.log('listingID: ' + this.listingID);
            this.ctlSellerItemID.disable();
            this.ctlSourceURL.disable();
            if (this.userProfile.isVA) {
              this.ctlPctProfit.disable();
              this.ctlListingPrice.disable();
            }
            this.getData();
          }
          else {
            this.initForm();
          }
        });
      },
        error => {
          this.errorMessage = error.errMsg;
        });
  }
  initForm() {
    // get pct profit default setting
    this.imgSourceArray = null;
    this.listing = null;
    this.walItem = null;
    this.ctlSourceURL.setValue(null);
    this.ctlListingTitle.setValue(null);
    this.ctlDescription.setValue(null);
    this.ctlListingPrice.setValue(null);
    this.ctlSellerItemID.setValue(null);
    this.ctlSourceURL.enable();
    this.ctlSellerItemID.enable();
    this.ctlListingQty.setValue(1);
    if (this.userProfile.isVA) {
      this.ctlPctProfit.disable();
    }
  }

  getData() {
    this.displayProgressSpinner = true;

    // pull rest of values from Listing table
    this._orderHistoryService.listingGet(this.listingID)
      .subscribe(li => {
        if (li) {
          this.listing = li;
          this.listingForm.patchValue({
            listingTitle: li.ListingTitle,
            listingQty: li.Qty,
            listingPrice: li.ListingPrice,
            pictureUrl: this.formatedPictureUrl,
            variation: li.Variation,
            variationDescription: li.VariationDescription,
            description: li.Description,
            sourceURL: li.SupplierItem.ItemURL,
            sellerItemID: li.ItemID,
            pctProfit: li.PctProfit
          })

          if (this.listing) {
            this.imgSourceArray = this._orderHistoryService.convertStringListToArray(this.listing.PictureURL);
          }
        }
        this.displayProgressSpinner = false;
      },
        error => {
          this.displayProgressSpinner = false;

          // wait 1 sec before executing what's inside setTimeout
          setTimeout(() => {
            if (error.errObj.status === 404) {
              this.displayProgressSpinner = false;
              this.router.navigate(['/']);
            }
            else {
              this.errorMessage = error.errMsg;
            }
          }, 1000);
        });
  }

  /**
   * Testing fetch of varation, parse and display.
   */
  getVariationDisplay() {

    if (this.listing) {
      this.displayProgressSpinner = true;

      let supplierURL = this.listing.SupplierItem.ItemURL;
      this._orderHistoryService.getWmItem(supplierURL)
        .subscribe(wi => {
          this.variationItem = wi;
          this.displayProgressSpinner = false;
        },
          error => {
            this.displayProgressSpinner = false;
            this.errorMessage = error.errMsg;
          });

      let itemID = this.listing.ItemID;
      this._orderHistoryService.getSellerListing(itemID)
        .subscribe(si => {
          if (si.PictureURL === '') {
            this.statusMessage = 'WARNING: Could not fetch seller listing images.';
          }
          this.sellerVariationItem = si;
        },
          error => {
            this.displayProgressSpinner = false;
            this.errorMessage = error.errMsg;
          });
    }
  }

  onSubmit() {
    this.errorMessage = null;
    this.statusMessage = null;
    this.validationMessage = null;

    this.listingButtonEnable = false;

    if (this.walItem) {
      if (this.walItem.ItemURL != this.ctlSourceURL.value) {
        // Case where new listing and already clicked Load Supplier item once but then changed the URL and click Submit.
        this.walItem = null;

        this.ctlSellerItemID.setValue(null);
        this.ctlDescription.setValue(null);
        this.ctlListingPrice.setValue(null);
        this.ctlListingQty.setValue(null);
        this.ctlListingTitle.setValue(null);
        if (this.listing) {
          this.listing.PrimaryCategoryID = "";
          this.listing.PrimaryCategoryName = "";
          this.listing.SellerListing = null;
        }
        this.imgSourceArray = [];
        this.validationMessage = "Supplier URL changed";
      }
      else {
        if (this.storeButtonVal == true) {
          this.storeButtonVal = false;
          this.validationMessage = this.isValid();
          if (!this.validationMessage) {
            this.saveListing();
          }
          else {
            this.validationMessage = this.validationMessage + ' - record not saved';
            this.showMessage("<div class='error'>ERROR</div><br/>" + this.validationMessage);
          }
        }
        if (this.listButtonVal == true) {
          this.listButtonVal = false;
          this.validationMessage = this.isValid();
          if (!this.validationMessage && this.listing) {
            this.onCreateListing();
          }
          else {
            this.validationMessage = this.validationMessage + ' - record not listed';
            this.showMessage("<div class='error'>ERROR</div><br/>" + this.validationMessage);
          }
        }
      }
    }
    if (this.deleteButtonVal == true) {
      this.onDelete();
    }
  }
  /**
   * 06.01.2020
   * I'm thinking new defect rate, reprice logic makes this obsolete.
   */
  onInActive() {
    this.errorMessage = null;
    this.inActive();
  }
  onSetOrder() {
    this.errorMessage = null;
    let msg = this.orderFormIsValid();
    if (msg === null) {
      this.setOrder();
    }
    else {
      this.errorMessage = msg;
    }
  }
  onGetOrders() {
    this.errorMessage = null;
    this.getOrders("");
  }
  onGetCancelledOrders() {
    this.errorMessage = null;
    this.getOrders("Cancelled");
  }
  onGetReturns() {
    this.errorMessage = null;
    this.getOrders("RETURN");
  }
  onGetReturnRequestPending() {
    this.errorMessage = null;
    this.getOrders("ReturnRequestPending");
  }
  onSalesOrderAdd(listedItemID: string, buyer: string) {
    this.errorMessage = null;
    let msg = this.orderFormIsValid();
    if (msg === null) {
      let order = this.getSalesOrderInArray(listedItemID, buyer);
      if (order && this.listing) {

        order.supplierOrderNumber = this.ctlSupplierOrderNum.value;
        order.listingID = this.listing.ID;
        order.i_paid = this.ctlIPaid.value;
        this.salesOrderAdd(order);
      }
      else {
        this.errorMessage = "Could not find listed item id: " + listedItemID;
      }
    }
    else {
      this.errorMessage = msg;
    }
  }
  salesOrderAdd(order: SalesOrder) {
    this.displayProgressSpinner = true;

    this._orderHistoryService.salesOrderAdd(order)
      .subscribe(si => {
        let updated = si;
        this.displayProgressSpinner = false;
        console.log('sales order id: ' + updated.id);
        this.showMessage("Order saved.");
      },
        error => {
          this.displayProgressSpinner = false;
          this.errorMessage = error.errMsg;
        });
  }

  getSalesOrderInArray(listedItemID: string, buyer: string): SalesOrder | null {
    for (let m of this.salesOrder) {
      if (m.listedItemID === listedItemID && m.buyer === buyer) {
        return m;
      }
    }
    return null;
  }
  salesOrderStore() {
    if (this.listing) {
      let salesOrder = new SalesOrder();
      salesOrder.listedItemID = this.listing.ListedItemID;
      salesOrder.supplierOrderNumber = this.ctlSupplierOrderNum.value;
      salesOrder.eBayOrderNumber = this.ctlEbayOrderNum.value;
      salesOrder.i_paid = this.ctlIPaid.value;
      salesOrder.qty = 1;
      this._orderHistoryService.salesOrderStore(salesOrder, ["SupplierOrderNumber", "Qty", "ListedItemID", "eBayOrderNumber", "I_Paid"])
        .subscribe(si => {
        },
          error => {
            this.errorMessage = error.errMsg;
          });
    }
  }
  setOrder() {
    if (this.listing) {
      this.displayProgressSpinner = true;
      this._orderHistoryService.setOrder(this.listing, this.ctlFromDate.value, this.ctlToDate.value)
        .subscribe(so => {
          this.salesOrder = so;
          this.calcProfitOnOrder();
          this.displayProgressSpinner = false;
        },
          error => {
            this.errorMessage = error.errMsg;
            this.displayProgressSpinner = false;
          });
    }
  }
  /**
   * Recall that salesOrder is an array of orders between 2 days but UI just asks for single i_paid.
   * Used on Orders page, not the listing page.
   */
  calcProfitOnOrder() {
    this.salesOrder.forEach((element) => {
      let revenue = element.subTotal + element.shippingCost;
      let expenses = element.finalValueFee + element.payPalFee + +this.ctlIPaid.value;
      element.profit = revenue - expenses;
      element.profitMargin = (element.profit / element.total);
    });
  }
  getOrders(orderStatus: string) {
    this.displayProgressSpinner = true;
    this._orderHistoryService.getOrders(this.ctlFromDate.value, this.ctlToDate.value, orderStatus)
      .subscribe(so => {
        this.salesOrder = so;
        this.displayProgressSpinner = false;
      },
        error => {
          this.errorMessage = error.errMsg;
          this.displayProgressSpinner = false;
        });
  }

  /**
   * Must pass all validation checks.
   */
  isValid(): string | null {
    if (this.listing) {
      if (this.listing.SupplierItem.SupplierPrice === 0) {
        return 'Validation: Supplier price cannot be 0';
      }
      if (this.listing.ListingPrice < 1) {
        return 'Validation: price cannot be < 1.00';
      }
      // 04.20.2020 now user is asked to override warnings when listing.
      // if (this.ctlCheckDescription.value !== true) {
      //   return 'Validation: description';
      // }
      if (!this.ctlListingTitle.value) {
        return 'Validation: listing title';
      }
      let validTitle: string | null = this.isTitleValid();
      if (validTitle) {
        return validTitle;
      }
      if (!this.ctlDescription.value) {
        return 'Validation: description';
      }
      // if (!this.ctlListingQty.value) {
      //   return 'Validation: listing qty';
      // }
      if (!this.listing.PictureURL) {
        return 'Validation: could not fetch supplier pictures';
      }
      if (this.listing.ID > 0 && !this.ctlListingTitle) {
        return 'Please provide a title';
      }
    }
    return null;
  }
  isTitleValid(): string | null {
    try {
      if (this.ctlListingTitle) {
        let pos: number;
        pos = this.ctlListingTitle.value.indexOf(",");
        if (pos > -1) {
          return "Validation: listing title contains commas";
        }
        pos = this.ctlListingTitle.value.toUpperCase().indexOf("SHIPPING");
        if (pos > -1) {
          return "Validation: listing title contains SHIPPING";
        }
        pos = this.ctlListingTitle.value.toUpperCase().indexOf("MULTIPLE");
        if (pos > -1) {
          return "Validation: listing title contains MULTIPLE";
        }
      }
      return null;
    }
    catch (error) {
      this.showMessage(error);
      return null;
    }
  }
  inActive() {
    if (this.listing) {
      this.listing.InActive = true;

      this.displayProgressSpinner = true;

      this._orderHistoryService.listingStore(this.listing, false,
        ["InActive"]
      )
        .subscribe(updatedListing => {
          this.statusMessage = 'Record stored.';
          this.displayProgressSpinner = false;
        },
          error => {
            this.displayProgressSpinner = false;
            this.errorMessage = error.errMsg;
          });
    }
  }
  /**
   * Note there is no need to set the SellerListing property of Listing since
   * it's already been stored (when first created the Listing record).
   * @param listingForm 
   */
  saveListing() {

    let updateItemSpecifics = false;
    // if new listing
    if (!this.listing && this.walItem) {
      this.listing = new Listing();
      this.listing.ID = 0;
      updateItemSpecifics = true;
    }
    if (this.listing && this.walItem) {
      this.listing.StoreID = this.userProfile.selectedStore;

      this.listing.SupplierItem = this.walItem;
      if (this.listing.SupplierID > 0) {
        this.listing.SupplierItem.ID = this.listing.SupplierID;
      }
      this.listing.SupplierItem.Updated = new Date();
      this.listing.SupplierItem.SupplierPrice = this.walItem.SupplierPrice;
      this.listing.ItemID = this.ctlSellerItemID.value;
      this.listing.PictureURL = this.arrayToDelimited(this.imgSourceArray!);
      this.listing.ItemID = this.ctlSellerItemID.value;
      this.listing.ListingPrice = this.ctlListingPrice.value;
      this.listing.ListingTitle = this.ctlListingTitle.value;
      this.listing.Qty = this.ctlListingQty.value;
      this.listing.PctProfit = this.ctlPctProfit.value;
      this.listing.Description = this.ctlDescription.value;
      this.listing.Profit = 0;
      this.listing.ProfitMargin = 0;

      this.displayProgressSpinner = true;

      this._orderHistoryService.listingStore(this.listing, updateItemSpecifics,
        ["ListingTitle",
          "ListingPrice",
          "Qty",
          "Description",
          "PictureURL",
          "ItemID",
          "PctProfit",
          "SupplierItem.SupplierPrice",
          "SupplierItem.ItemURL"
        ])
        .subscribe(updatedListing => {
          this.listingID = updatedListing.ID;

          if (this.listing) {
            this.listing.ID = updatedListing.ID;
            this.listing.PrimaryCategoryID = updatedListing.PrimaryCategoryID;
            this.listing.PrimaryCategoryName = updatedListing.PrimaryCategoryName;
            this.listing.SellerListing = updatedListing.SellerListing;
            this.listing.Warning = updatedListing.Warning;
          }
          if (!this.ctlListingTitle.value) {

            // is title null here , why?
            this.listingForm.patchValue({
              listingTitle: updatedListing.SellerListing?.Title
            });
          }
          this.statusMessage = 'Record stored.';
          if (this.walItem?.CanList.length == 0) {
          }
          if (this.listing) {
            this.listing.Created = new Date();  // enable Add Note button
          }
          // Not ready yet for VA to list variations.
          if (this.walItem?.IsVariation && !this.admin) {

          }
          this.ctlListingQty.markAsPristine();
          this.ctlListingTitle.markAsPristine();
          this.ctlDescription.markAsPristine();
          this.ctlListingPrice.markAsPristine();

          // if validated on server and user clicked the 'Calculate Price' button
          if (this.walItem?.CanList.length === 0 && this.priceProfit) {
            this.listingButtonEnable = true;
          }

          // Could be new listing, so once we save, lock down the supplier URL
          this.ctlSourceURL.disable();
          this.ctlSellerItemID.disable();

          this.displayProgressSpinner = false;
          this.showMessage("Listing stored.");
        },
          error => {
            this.displayProgressSpinner = false;
            this.errorMessage = error.errMsg;
            this.showMessage("<div class='error'>ERROR</div><br/>" + this.errorMessage!);
          });
    }
  }
  onCreateListing() {
    if (this.listing) {
      // seller's image is only available when first saving record.
      let sellerImgURL = this.listing.SellerListing?.PictureURL;
      let tmsg = "<b>" + this.userSettingsView.storeName + "</b><br/><br/>Please confirm supplier item matches seller's item.<br/><br/>";
      tmsg += this.listing.PrimaryCategoryID + "<br/>";
      tmsg += this.listing.PrimaryCategoryName + "<br/><br/>";

      let dmsg: string = "";
      if (!sellerImgURL) {
        dmsg += "No seller image to display. ";
      }
      if (!this.listing.SellerListing) {
        dmsg += "SellerListing is null. ";
      }
      if (dmsg.length > 0) {
        this.showMessage(dmsg);
      }

      if (!this.listing.Listed && sellerImgURL) {     // new listing, show the user the seller's image
        const dialogRef = this.dialog.open(ConfirmComponent,
          {
            disableClose: true,
            height: '500px',
            width: '900px',
            data: {
              titleMessage: tmsg,
              imgURL: sellerImgURL
            }
          });

        dialogRef.afterClosed().subscribe(result => {
          if (result === 'Yes') {
            if (this.listing) {
              if (this.listing.Warning && this.listing.Warning.length > 0) {
                let tmsg = "<b>" + this.userSettingsView.storeName + "</b><br/><br/>Please confirm you are overriding warnings.<br/><br/>";
                const dialogRef = this.dialog.open(ConfirmComponent,
                  {
                    disableClose: true,
                    height: '200px',
                    width: '900px',
                    data: {
                      titleMessage: tmsg
                    }
                  });

                dialogRef.afterClosed().subscribe(result => {
                  if (result === 'Yes') {
                    this.createListing();
                  }
                  if (result === 'No') {
                    // console.log('No');
                  }
                });
              }
              else {
                this.createListing();
              }
            }
          }
          if (result === 'No') {
            // console.log('No');
          }
        });
      }
      else {
        if (this.listing.Warning && this.listing.Warning.length > 0) {
          let tmsg = "<b>" + this.userSettingsView.storeName + "</b><br/><br/>Please confirm you are overriding warnings.<br/><br/>";
          const dialogRef = this.dialog.open(ConfirmComponent,
            {
              disableClose: true,
              height: '300px',
              width: '900px',
              data: {
                titleMessage: tmsg
              }
            });

          dialogRef.afterClosed().subscribe(result => {
            if (result === 'Yes') {
              this.createListing();
            }
            if (result === 'No') {
              // console.log('No');
            }
          });
        }
        else {
          this.createListing();
        }
      }
    }
  }

  /**
   * Post to eBay
   */
  createListing() {

    this.displayProgressSpinner = true;
    this._orderHistoryService.listingCreate(this.listingID, this.reviseLoadImages)
      .subscribe(si => {
        this.displayProgressSpinner = false;
        this.listingButtonEnable = false;

        if (this.listing) {
          // Say new listing gets stored, ask for confirmation and listed.
          // User makes quick change and relists - don't need matching product confirm again.
          // Use 'listed' field to determine this but createlisting sends back a response, not the listing,
          // so just set to current date time.
          this.listing.Listed = new Date();
        }

        this.statusMessage = this.delimitedToHTML(si);
        this.statusMessage += "<br/><br/>";
        let newItemID = this._orderHistoryService.getFirstInList(si);
        if (newItemID) {
          let ref = "https://www.ebay.com/itm/" + newItemID;
          this.statusMessage += "<a target='_blank' href='" + ref + "'" + ">eBay</a>";
          if (this.listing) {
            this.listing.ListedItemID = newItemID;
          }
        }
        this.statusMessage += "<br/>Presume 1st record in response is just item ID<br/>";
        this.statusMessage += "Presume 2nd record in response is of the form 'Listed: YES'<br/>";
        this.statusMessage += "What happens if the item could not be listed?<br/>";
        this.showMessage(this.statusMessage);
      },
        error => {
          this.errorMessage = "<div class='error'>ERROR</div><br/>";
          this.errorMessage += this.delimitedToHTML(error.errMsg);
          this.displayProgressSpinner = false;
          this.listingButtonEnable = false;
          this.showMessage(this.errorMessage);
        });
  }
  onOverrideEndListing(status: string) {
    let pos: number = status.indexOf('NO');
    if (pos > -1) {
      return false;
    }
    else {
      return true;
    }
  }
  wasItemListed(): boolean {

    return false;
  }
  onEndListing() {
    const dialogRef = this.dialog.open(EndlistingComponent,
      {
        disableClose: true,
        height: '300px',
        width: '900px'
      });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.endListing(result);
      }
      if (!result) {
        console.log('No');
      }
    });
  }

  endListing(reason: string) {
    if (this.listing) {
      this.displayProgressSpinner = true;
      this._listCheckService.endListing(this.listing.ID, reason)
        .subscribe(si => {
          this.statusMessage = si;
          this.displayProgressSpinner = false;

          // Seems we have to give time for the progress overlay to finish
          // otherwise, redirect to listings and overlay never goes away.
          setTimeout(() => {
            this.router.navigate(['/gamma']);
          }, 1000);
        },
          error => {
            this.errorMessage = error.errMsg;
            this.displayProgressSpinner = false;
          })
    }
  }
  /**
  * Can't list if form is ditry - must Save first.
  */
  formIsDirty(): boolean {
    if (this.ctlListingQty.dirty) {
      return true;
    }
    if (this.ctlListingTitle.dirty) {
      return true;
    }
    if (this.ctlDescription.dirty) {
      return true;
    }
    if (this.ctlListingPrice.dirty) {
      return true;
    }
    return false;
  }

  createVariationListing() {
    this.displayProgressSpinner = true;
    this._orderHistoryService.variationListingCreate()
      .subscribe(si => {
        this.statusMessage = this.delimitedToHTML(si);
        this.displayProgressSpinner = false;
      },
        error => {
          this.errorMessage = this.delimitedToHTML(error.errMsg);
          this.displayProgressSpinner = false;
          this.storeButtonEnable = true;
        });
  }

  /**
   * If never listed, can simply delete from db.
   */
  deleteListingRecord() {
    this.displayProgressSpinner = true;

    this._orderHistoryService.deleteListingRecord(this.listingID)
      .subscribe(si => {
        this.displayProgressSpinner = false;

        // this.statusMessage = "Record deleted";
        // this.showMessage();

        // Seems we have to give time for the progress overlay to finish
        // otherwise, redirect to listings and overlay never goes away.
        setTimeout(() => {
          this.router.navigate(['/gamma']);
        }, 1000);

      },
        error => {
          this.displayProgressSpinner = false;

          this.errorMessage = error.errMsg;
          let errMsg = "<div class='error'>ERROR</div><br/>";
          errMsg += this.errorMessage;
          this.showMessage(errMsg);
        });
  }

  /**
   * Called when user clicks 'Load WM'
   */
  onGetWmItem() {
    this.validationMessage = "";
    this.errorMessage = "";
    this.displayProgressSpinner = true;
    this.supplierPicsMsg = null;

    // If new and already loaded a supplier URL, then clear exisitng fields
    if (this.walItem) {
      if (this.walItem.ItemURL != this.ctlSourceURL.value) {
        this.walItem = null;
        this.ctlSellerItemID.setValue(null);
        this.ctlDescription.setValue(null);
        this.imgSourceArray = null;
      }
    }

    if (!this.listing) {
      this._orderHistoryService.getListingBySupplierURL(this.userProfile.selectedStore, this.ctlSourceURL.value)
        .subscribe(si => {
          if (!si) {
            this.getWMItem();
          }
          else {
            this.displayProgressSpinner = false;
            this.displayError('Item exists');
          }
        });
    }
    else {
      this.getWMItem();
    }
  }
  getWMItem() {
    this._orderHistoryService.getWmItem(this.ctlSourceURL.value)
      .subscribe(wi => {

        // HACK
        // 04.09.2020 if i don't reassign walitem like this, then SupplierItem arrives as null on server (StoreListing)
        // why?  (but doesn't happen on new listing)
        let supp: SupplierItem = {
          ItemURL: wi.ItemURL,
          Arrives: wi.Arrives,
          BusinessDaysArrives: wi.BusinessDaysArrives,
          Warning: wi.Warning,
          CanList: wi.CanList,
          Description: wi.Description,
          ID: wi.ID,
          IsFreightShipping: wi.IsFreightShipping,
          IsVERO: wi.IsVERO,
          IsVariation: wi.IsVariation,
          ItemID: wi.ItemID,
          MPN: wi.MPN,
          MatchCount: wi.MatchCount,
          OutOfStock: wi.OutOfStock,
          ShippingNotAvailable: wi.ShippingNotAvailable,
          SoldAndShippedBySupplier: wi.SoldAndShippedBySupplier,
          SupplierBrand: wi.SupplierBrand,
          SupplierPicURL: wi.SupplierPicURL,
          SupplierPrice: wi.SupplierPrice,
          SupplierVariation: wi.SupplierVariation,
          UPC: wi.UPC,
          Updated: wi.Updated,
          VariationName: wi.VariationName,
          VariationPicURL: wi.VariationPicURL,
          usItemId: wi.usItemId,
          SourceID: wi.SourceID
        }

        this.walItem = supp;

        if (!this.listing) {
          if (!wi.SupplierPicURL) {
            // this.supplierPicsMsg = "Failed to retrieve item images from supplier."
            this.showMessage("Failed to retrieve item images from supplier.")
          }
          else {
            this.imgSourceArray = this._orderHistoryService.convertStringListToArray(wi.SupplierPicURL);
            if (!this.ctlDescription.value) {
              this.listingForm.patchValue({
                description: wi.Description
              });
            }
          }
        }
        this.onCalculateWMPrice();
      },
        error => {
          this.imgSourceArray = null;
          this.walItem = null;
          this.displayProgressSpinner = false;
          this.errorMessage = error.errMsg;
        });
  }
  onCalculateWMPrice() {
    if (this.walItem) {
      this.displayProgressSpinner = true;
      this._orderHistoryService.calculateWMPx(this.walItem.SupplierPrice, this.ctlPctProfit.value)
        .subscribe(wi => {
          this.priceProfit = wi;
          let px = (Math.round(wi.proposePrice * 100) / 100).toFixed(2);
          this.listingForm.patchValue({
            listingPrice: px.toString()
          });
          this.displayProgressSpinner = false;
        },
          error => {
            this.errorMessage = error.errMsg;
            this.displayProgressSpinner = false;
            this.showMessage("<div class='error'>ERROR</div><br/>" + this.errorMessage!);
          });
    }
  }
  onCalculateProfit() {
    if (this.walItem) {
      this.displayProgressSpinner = true;
      this._orderHistoryService.calculateProfit(this.ctlListingPrice.value, this.walItem.SupplierPrice)
        .subscribe(wi => {
          this.profit = wi;
          this.displayProgressSpinner = false;
        },
          error => {
            this.errorMessage = error.errMsg;
            this.displayProgressSpinner = false;
          });
    }
  }

  /**
   * 01.29.2020 Recall this won't work unless have selenium first logon to my walmart account.
   */
  getWMOrder() {
    console.log(this.ctlEbayOrderNum.value);
    this._orderHistoryService.getWMOrder(this.ctlEbayOrderNum.value)
      .subscribe(si => {
      },
        error => {
          this.errorMessage = error.errMsg;
        });
  }
  // Format semi colon delimited string of picture urls as one per line
  // 03.03.2019 not being used
  formatPictureUrl(url: string): string {
    var a = url.split(';');
    this.formatedPictureUrl = "";
    for (var i of a) {
      this.formatedPictureUrl += i + '<br/>';
    }
    return this.formatedPictureUrl;
  }

  delimitedToHTML(outputStr: string): string {
    var a = outputStr.split(';');
    this.formatedOutput = "";
    for (var i of a) {
      this.formatedOutput += i + '<br/>';
    }
    return this.formatedOutput;
  }

  getFirstImg(imgStr: string): string {
    var a = imgStr.split(';');
    return a[0];
  }

  goBack() {
    window.history.back();
  }

  /**
   * Look at isValid() for more validation.
   */
  buildForm(): void {
    this.listingForm = this.fb.group({
      listingTitle: [null, Validators.compose([Validators.maxLength(80)])],
      listingPrice: [null, Validators.compose([Validators.required, this._orderHistoryService.validateRequiredNumeric.bind(this)])],
      profit: [null],
      listingQty: [1, {
        validators: [Validators.required, this._orderHistoryService.validateRequiredNumeric.bind(this)]
      }],
      sourceURL: [null, Validators.compose([Validators.required, Validators.maxLength(500)])],
      sourceId: [null],
      variation: [null],
      variationDescription: [null],
      checkShipping: [null],
      checkSource: [null],
      checkCategory: [null],
      checkSupplierPrice: [null],
      checkSupplierItem: [null],
      checkSupplierPics: [null],
      checkSupplierVariationURL: [null],
      description: [null, Validators.compose([Validators.required])],
      checkDescription: [null],
      checkShipOnTime: [null],
      checkMyPriceCompetitive: [null],
      checkTitle: [null],
      checkSellerMultiPack: [null],
      checkItemSpecificsCorrect: [null],
      sellerItemID: [null, Validators.compose([Validators.required])],
      pctProfit: [null]
    })
  }

  buildOrderForm(): void {
    let fromDate = this.getFormattedDate(new Date());
    let toDate = this.getFormattedDate(this.addDays(new Date(), 1));
    this.orderForm = this.fb.group({
      ipaid: [null, {
        validators: [Validators.required, this._orderHistoryService.validateRequiredNumeric.bind(this)]
      }],
      fromDate: [fromDate, {
        validators: [Validators.required]
      }],
      toDate: [toDate, {
        validators: [Validators.required]
      }],
      supplierOrderNumber: [null, {
        validators: [Validators.required]
      }]
    })
  }

  onProfile() {
    const dialogRef = this.dialog.open(ListingnoteComponent, {
      height: '500px',
      width: '900px',
      data: { listing: this.listing }
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
    });
  }

  displayError(msg: string) {
    const dialogRef = this.dialog.open(ErrordisplayComponent,
      {
        disableClose: true,
        height: '200px',
        width: '900px',
        data: {
          msg: msg
        }
      });

    dialogRef.afterClosed().subscribe(result => {

    });
  }
  onDelete() {
    const dialogRef = this.dialog.open(ConfirmComponent,
      {
        disableClose: true,
        height: '200px',
        width: '900px',
        data: {
          titleMessage: "<b>Are you sure you want to delete?</b>"
        }
      });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'Yes') {
        this.deleteListingRecord();
      }
      if (result === 'No') {
        // console.log('No');
      }
    });
  }

  getNotes() {
    if (this.listing) {
      let listingNotes: ListingNoteView[];
      this._orderHistoryService.getListingNotes(this.listing.ItemID, this.listing.StoreID)
        .subscribe(p => {
          listingNotes = p;
          if (listingNotes.length > 0) {
            this.notesButtonText = "Notes (" + listingNotes.length.toString() + ")";
          }
        },
          error => {
            this.errorMessage = error.errMsg;
          });
    }
  }

  /**
   * Refresh my listing's item specifics from seller's listing.
   */
  refreshItemSpecifics() {
    if (this.listing) {
      this._orderHistoryService.refreshItemSpecifics(this.listing.ID)
        .subscribe(p => {
        },
          error => {
            this.errorMessage = error.errMsg;
          });
    }
  }
  checkDescription() {
    this.displayProgressSpinner = true;
    this._orderHistoryService.listingGet(this.listingID)
      .subscribe(li => {
        if (li) {
          if (this.listing) {
            this.listing.Warning = li.Warning;
          }
        }
        this.displayProgressSpinner = false;
      },
        error => {
          this.displayProgressSpinner = false;
          this.errorMessage = error.errMsg;
        });
  }

  showMessage(msg: string) {
    const dialogRef = this.dialog.open(ShowmessagesComponent, {
      height: '500px',
      width: '600px',
      data: { message: msg }
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }


  deleteButtonDisable(): boolean {
    if (!this.listing || (this.listing && this.listing.ID == 0) || (this.listing && this.listing.Listed))
      return true;
    else
      return false;
  }
  listButtonDisable(): boolean {
    let formIsDirty = this.formIsDirty();
    if (!this.listingForm.valid || !this.walItem || formIsDirty || !this.listingButtonEnable)
      return true;
    else
      return false;
  }
  endListingDisable(): boolean {

    // If we have a listed item has not been ended then disable = false, meaning, we can End Listing
    let disable = !(this.listing
      && this.listing?.ListedItemID
      && !this.listing?.Ended);

    if (!disable) {
      if (this.userProfile.isVA) {
        disable = true;
      }
    }
    return disable;
  }
  /**
   * no, make new component for log
   */
  onGetListingLog() {

    if (this.listing) {
      this._orderHistoryService.getListingLog(this.listing.ID)
        .subscribe(li => {
          if (li) {
            this.log = li;
          }
          this.displayProgressSpinner = false;
        },
          error => {
            this.displayProgressSpinner = false;
            this.errorMessage = error.errMsg;
          });
    }
  }
  getBusinessPolicies() {
    this._orderHistoryService.getBusinessPolicies(this.selectedStore)
      .subscribe(x => {
        this.eBayBusinessPolicies = x;
      },
        error => {
          this.errorMessage = error.errMsg;
        });
  }

  getFormattedDate(date: Date) {
    // let date = new Date();
    let newdate = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
    return newdate;
  }
  addDays(date: Date, days: number) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
  orderFormIsValid(): string | null {
    if (this.ctlFromDate.invalid) { return 'from date is invalid'; }
    if (this.ctlToDate.invalid) { return 'to date is invalid'; }
    if (this.ctlIPaid.invalid) { return 'i paid is invalid'; }
    if (this.ctlSupplierOrderNum.invalid) { return 'Supplier Order Num'; }
    if (this.ctlIPaid.value) {
      if (this.ctlIPaid.value <= 0) {
        return 'invalid i paid value';
      }
    }
    return null;
  }
  drop(event: CdkDragDrop<string[]>) {

    // non-null assertion operator
    // https://stackoverflow.com/questions/54496398/typescript-type-string-undefined-is-not-assignable-to-type-string
    moveItemInArray(this.imgSourceArray!, event.previousIndex, event.currentIndex);
    this.reviseLoadImages = true;
    /*
    if (this.imgSourceArray) {
      for (let m of this.imgSourceArray) {
        console.log(m);
      }
    }
*/
  }

  arrayToDelimited(arr: string[]) {
    let output: string = "";
    for (let m of arr) {
      output += m + ";";
    }
    output = output.substring(0, output.length - 1);
    return output;
  }
  getFirstInList(pictureURL: string) {
    return this._orderHistoryService.getFirstInList(pictureURL);
  }

  buildEditorForm(): void {
    this.editorForm = this.fb.group({
      htmlContent: [null]
    })
  }
}
