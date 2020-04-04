import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder } from '@angular/forms';
import { OrderHistoryService } from '../_services/orderhistory.service';
import { SellerProfile, Listing, ListingNote, ListingNoteView } from '../_models/orderhistory';

@Component({
  selector: 'app-listingnote',
  templateUrl: './listingnote.component.html',
  styleUrls: ['./listingnote.component.scss']
})
export class ListingnoteComponent implements OnInit {

  form: FormGroup;
  listing: Listing;
  errorMessage: string;
  storing = false;
  listingNotes: ListingNoteView[];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private _orderHistoryService: OrderHistoryService,
    private dialogRef: MatDialogRef<ListingnoteComponent>) {
    this.listing = data.listing;
  }

  get ctlNote() { return this.form.controls['note']; }

  ngOnInit() {
    this.buildForm();
    this.getData();
  }

  buildForm(): void {
    this.form = this.fb.group({
      note: [null]
    })
  }

  getData() {
    this._orderHistoryService.getListingNotes(this.listing.ItemID, this.listing.StoreID)
      .subscribe(p => {
        this.listingNotes = p;
      },
        error => {
          this.errorMessage = error.errMsg;
        });
  }

  onSubmit() {
    if (this.ctlNote.value) {
      let listingNote = new ListingNote();
      listingNote.note = this.ctlNote.value;
      listingNote.itemID = this.listing.ItemID;
      listingNote.storeID = this.listing.StoreID;

      this.storing = true;
      this._orderHistoryService.noteStore(listingNote)
        .subscribe(si => {
          this.storing = false;
          this.dialogRef.close();
        },
          error => {
            this.storing = false;
            this.errorMessage = error.errMsg;
          });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
