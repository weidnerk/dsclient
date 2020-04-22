/*
 * User can click into an item displayed by timessold and reach this detail page.
 * 
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderHistoryService } from '../../_services/orderhistory.service';
import { Listing, DeriveProfit, TimesSold, ListingNoteView, SellerListing, SupplierItem, SalesOrder, PriceProfit, ListingLogView, eBayBusinessPolicies, ListingLog } from '../../_models/orderhistory';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { ParamService } from '../../_services/param.service';
import { ListingnoteComponent } from '../../listingnote/listingnote.component';
import { MatDialog } from '@angular/material/dialog';
import { ListCheckService } from '../../_services/listingcheck.service';
import { ShowmessagesComponent } from 'src/app/showmessages/showmessages.component';
import { UserProfile } from 'src/app/_models/userprofile';
import { UserService } from 'src/app/_services';
import { ConfirmComponent } from 'src/app/confirm/confirm.component';

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

  constructor(private router: Router,
    private _userService: UserService,
    private route: ActivatedRoute,
    private _orderHistoryService: OrderHistoryService,
    private fb: FormBuilder,
    private _parmService: ParamService,
    public dialog: MatDialog,
    private _listCheckService: ListCheckService) { }

  private sub: any;
  listingID: number;  // Listing.ID
  listing: Listing;
  walItem: SupplierItem | null = null;
  userProfile: UserProfile;

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
  log: ListingLogView[];
  notesButtonText: string = "Notes";

  listingButtonEnable = false;

  // status spinner variables
  color = 'primary';
  mode = 'indeterminate';
  value = 50;
  displayProgressSpinner = false;
  eBayBusinessPolicies: eBayBusinessPolicies;

  // form variables
  listingForm: FormGroup;
  formatedPictureUrl: string;
  formatedOutput: string;
  imgSourceArray: string[];
  orderForm: FormGroup;

  get ctlSourceURL(): AbstractControl { return this.listingForm.controls['sourceURL']; }
  get ctlSourceId(): AbstractControl { return this.listingForm.controls['sourceId']; }
  get ctlListingPrice() { return this.listingForm.controls['listingPrice']; }
  get ctlListingTitle() { return this.listingForm.controls['listingTitle']; }
  get ctlListingQty() { return this.listingForm.controls['listingQty']; }
  get ctlNote() { return this.listingForm.controls['note']; }
  get ctlDescription() { return this.listingForm.controls['description']; }
  get ctlCheckDescription() { return this.listingForm.controls['checkDescription']; }


  get ctlEbayOrderNum() { return this.orderForm.controls['ebayOrderNumber']; }
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
    this.getUserProfile();

    this.listingForm.controls['variation'].disable();
    this.listingForm.controls['variationDescription'].disable();

    // itemId is seller's listing id
    // passing rptNumber and qtySold to potentially record in Listing table.
    this.sub = this.route.params.subscribe(params => {
      this.listingID = params['listingID'];
      if (this.listingID > 0) {
        this.ctlSellerItemID.disable();

        this.getData();
      }
      else {
        this.initForm();
      }
    });
  }

  initForm() {

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
            sellerItemID: li.ItemID
          })

          // this.imgSource = this.getFirstInList(this.imgSource);
          if (this.listing) {
            this.imgSourceArray = this.convertStringListToArray(this.listing.SupplierItem.SupplierPicURL);
          }

          if (li.CheckShipping !== null) {
            this.listingForm.patchValue({
              checkShipping: (li.CheckShipping) ? '1' : '0'
            });
          }
          if (li.CheckSource !== null) {
            this.listingForm.patchValue({
              checkSource: (li.CheckSource) ? '1' : '0'
            });
          }
          if (li.CheckCategory !== null) {
            this.listingForm.patchValue({
              checkCategory: (li.CheckCategory) ? '1' : '0'
            });
          }

          if (li.CheckSellerShipping !== null) {
            this.listingForm.patchValue({
              checkSellerShipping: (li.CheckSellerShipping) ? '1' : '0'
            });
          }
          if (li.CheckSupplierPrice !== null) {
            this.listingForm.patchValue({
              checkSupplierPrice: (li.CheckSupplierPrice) ? '1' : '0'
            });
          }
          if (li.CheckSupplierItem !== null) {
            this.listingForm.patchValue({
              checkSupplierItem: (li.CheckSupplierItem) ? '1' : '0'
            });
          }

          if (li.CheckSupplierPics !== null) {
            this.listingForm.patchValue({
              checkSupplierPics: (li.CheckSupplierPics) ? '1' : '0'
            });
          }

          if (li.CheckVariationURL !== null) {
            this.listingForm.patchValue({
              checkSupplierVariationURL: (li.CheckVariationURL) ? '1' : '0'
            });
          }
          if (li.CheckSupplierPics !== null) {
            this.listingForm.patchValue({
              checkSupplierPics: (li.CheckSupplierPics) ? '1' : '0'
            });
          }
          this.ctlSourceURL.disable();
          if (li.Listed) {

            if (!this.admin) {
              this.ctlListingTitle.disable();
              this.ctlSourceURL.disable();
              this.ctlListingPrice.disable();
            }
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
        this.walItem = null;

        this.ctlSellerItemID.setValue(null);
        this.ctlDescription.setValue(null);
        this.ctlListingPrice.setValue(null);
        this.ctlListingQty.setValue(null);
        this.ctlListingTitle.setValue(null);
        this.listing.PrimaryCategoryID = "";
        this.listing.PrimaryCategoryName = "";
        this.imgSourceArray = [];
        this.listing.SellerListing = null;
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
          }
        }
        if (this.listButtonVal == true) {
          this.listButtonVal = false;
          this.validationMessage = this.isValid();
          if (!this.validationMessage) {
            this.onCreateListing();
          }
          else {
            this.validationMessage = this.validationMessage + ' - record not listed';
          }
        }
      }
    }
    if (this.deleteButtonVal == true) {
      this.onDelete();
    }
    if (this.orderButtonVal == true) {
      this.setOrder();
    }
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

  /**
   * Note there is no need to set the SellerListing property of Listing since
   * it's already been stored (when first created the Listing record).
   * @param listingForm 
   */
  saveListing() {

    // if new listing
    if (!this.listing && this.walItem) {
      this.listing = new Listing();
      this.listing.ID = 0;
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
      this.listing.PictureURL = this.walItem.SupplierPicURL;
      this.listing.ItemID = this.ctlSellerItemID.value;
      this.listing.ListingPrice = this.ctlListingPrice.value;
      this.listing.ListingTitle = this.ctlListingTitle.value;
      this.listing.Qty = this.ctlListingQty.value;
      this.listing.Description = this.ctlDescription.value;
      this.listing.Profit = 0;
      this.listing.ProfitMargin = 0;

      this.displayProgressSpinner = true;

      this._orderHistoryService.listingStore(this.listing,
        ["ListingTitle",
          "ListingPrice",
          "Qty",
          "Description",
          "PictureURL",
          "ItemID",
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

          this.displayProgressSpinner = false;
        },
          error => {
            this.displayProgressSpinner = false;
            this.errorMessage = error.errMsg;
          });
    }
  }
  onCreateListing() {
    // seller's image is only available when first saving record.
    let sellerImgURL = this.listing.SellerListing?.PictureURL;
    if (!this.listing.Listed && sellerImgURL) {     // new listing
      const dialogRef = this.dialog.open(ConfirmComponent,
        {
          disableClose: true,
          height: '500px',
          width: '900px',
          data: {
            titleMessage: "Please confirm supplier item matches seller's item.",
            imgURL: sellerImgURL
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
      if (this.listing.Warning.length > 0) {
        const dialogRef = this.dialog.open(ConfirmComponent,
          {
            disableClose: true,
            height: '200px',
            width: '900px',
            data: {
              titleMessage: "Please confirm you are overriding warnings."
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

  /**
   * Post to eBay
   */
  createListing() {
    this.displayProgressSpinner = true;

    this._orderHistoryService.listingCreate(this.listingID)
      .subscribe(si => {
        this.displayProgressSpinner = false;
        this.listingButtonEnable = false;

        // Say new listing gets stored, ask for confirmation and listed.
        // User makes quick change and relists - don't need matching product confirm again.
        // Use 'listed' field to determine this but createlisting sends back a response, not the listing,
        // so just set to current date time.
        this.listing.Listed = new Date();

        this.statusMessage = this.delimitedToHTML(si);
        this.showMessage();
      },
        error => {
          this.errorMessage = this.delimitedToHTML(error.errMsg);
          this.displayProgressSpinner = false;
          this.listingButtonEnable = false;
        });
  }
  onEndListing() {
    const dialogRef = this.dialog.open(ConfirmComponent,
      {
        disableClose: true,
        height: '200px',
        width: '900px',
        data: {
          titleMessage: "Are you sure you want to end the listing?"
        }
      });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'Yes') {
        this.endListing();
        if (!this.errorMessage || this.errorMessage?.length === 0) {
          this.router.navigate(['/gamma']);
        }
      }
      if (result === 'No') {
        // console.log('No');
      }
    });
  }
  endListing() {
    if (this.listing) {
      this.displayProgressSpinner = true;
      this._listCheckService.endListing(this.listing.ID)
        .subscribe(si => {
          this.statusMessage = si;
          this.displayProgressSpinner = false;
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
  salesOrderStore() {
    if (this.listing) {
      let salesOrder = new SalesOrder();
      salesOrder.ListedItemID = this.listing.ListedItemID;
      salesOrder.SupplierOrderNumber = this.ctlSupplierOrderNum.value;
      salesOrder.eBayOrderNumber = this.ctlEbayOrderNum.value;
      salesOrder.I_Paid = this.ctlIPaid.value;
      salesOrder.Qty = 1;
      this._orderHistoryService.salesOrderStore(salesOrder, ["SupplierOrderNumber", "Qty", "ListedItemID", "eBayOrderNumber", "I_Paid"])
        .subscribe(si => {
        },
          error => {
            this.errorMessage = error.errMsg;
          });
    }
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

          // this.errorMessage = this.formatOutput(error.errMsg);
          this.errorMessage = error.errMsg;
        });
  }

  /**
   * Called when user clicks 'Load WM'
   */
  getWmItem() {
    this.validationMessage = "";
    this.errorMessage = "";
    this.displayProgressSpinner = true;
    this.supplierPicsMsg = null;
    this._orderHistoryService.getWmItem(this.ctlSourceURL.value)
      .subscribe(wi => {

        // HACK
        // 04.09.2020 if i don't reassign walitem like this, then SupplierItem arrives as null on server (StoreListing)
        // why?  (but doesn't happen on new listing)
        let supp: SupplierItem = {
          ItemURL: wi.ItemURL,
          Arrives: wi.Arrives,
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

        // this.imgSource = wi.SupplierPicURL;
        this.imgSourceArray = this.convertStringListToArray(wi.SupplierPicURL);
        if (!this.ctlDescription.value) {
          this.listingForm.patchValue({
            description: wi.Description
          });
        }
        if (!wi.SupplierPicURL) {
          this.supplierPicsMsg = "Failed to retrieve item images from supplier."
        }
        if (!this.ctlListingPrice.value) {
          this.calculateWMPrice();
        }
        else {
          this.displayProgressSpinner = false;
        }
      },
        error => {
          this.displayProgressSpinner = false;
          this.errorMessage = error.errMsg;
        });
  }
  calculateWMPrice() {
    if (this.walItem) {
      this.displayProgressSpinner = true;
      this._orderHistoryService.calculateWMPx(this.walItem.SupplierPrice)
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
          });
    }
  }

  setOrder() {
    if (this.listing) {
      let list = new Listing();
      list.ItemID = this.listing.ItemID;

      this._orderHistoryService.setOrder(list)
        .subscribe(si => {
          this.statusMessage = 'Record stored.';
        },
          error => {
            this.errorMessage = error.errMsg;
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
  /**
   * Get first item in semi-colon delimited string.
   */
  getFirstInList(item: string | null): string | null {
    if (item) {
      var a = item.split(';');
      return a[0];
    }
    else {
      return null;
    }
  }
  convertStringListToArray(strList: string): string[] {
    var a = strList.split(';');
    return a;
  }

  getFirstImg(imgStr: string): string {
    var a = imgStr.split(';');
    return a[0];
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  goBack() {
    window.history.back();
  }

  buildForm(): void {
    this.listingForm = this.fb.group({
      listingTitle: [null, Validators.compose([Validators.maxLength(80)])],
      listingPrice: [null, {
        validators: [Validators.required, this._orderHistoryService.validateRequiredNumeric.bind(this)]
      }],
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
    this.orderForm = this.fb.group({
      ebayOrderNumber: ["24-04242-80495"],
      supplierOrderNumber: ["xyz"],
      ipaid: [0]
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

  showMessage() {
    const dialogRef = this.dialog.open(ShowmessagesComponent, {
      height: '500px',
      width: '600px',
      data: { message: this.statusMessage }
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  /**
   * Need storeID for new listing.
   */
  getUserProfile() {
    this._userService.UserProfileGet()
      .subscribe(profile => {
        this.userProfile = profile;
        this.selectedStore = profile.selectedStore;
        this.getBusinessPolicies();
      },
        error => {
          if (error.errorStatus !== 404) {
            this.errorMessage = JSON.stringify(error);
          }
          this.displayProgressSpinner = false;
        });
  }
  deleteButtonDisable(): boolean {
    if (!this.listing || (this.listing && this.listing.ID == 0) || (this.listing && this.listing.Listed))
      return true;
    else
      return false;
  }

  /**
   * no, make new component for log
   */
  onGetListingLog() {

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
  getBusinessPolicies() {
    this._orderHistoryService.getBusinessPolicies(this.selectedStore)
      .subscribe(x => {
        this.eBayBusinessPolicies = x;
      },
        error => {
          this.errorMessage = error.errMsg;
        });
  }
}
