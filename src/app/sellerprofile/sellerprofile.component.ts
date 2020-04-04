import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder } from '@angular/forms';
import { OrderHistoryService } from '../_services/orderhistory.service';
import { SellerProfile } from '../_models/orderhistory';

@Component({
  selector: 'app-sellerprofile',
  templateUrl: './sellerprofile.component.html',
  styleUrls: ['./sellerprofile.component.css']
})
export class SellerprofileComponent implements OnInit {

  form: FormGroup;
  seller: string;
  sellerProfile: SellerProfile;
  errorMessage: string;
  storing = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private _orderHistoryService: OrderHistoryService,
    private dialogRef: MatDialogRef<SellerprofileComponent>) {
    this.seller = data.seller;
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
    this._orderHistoryService.getSellerProfile(this.seller)
      .subscribe(sp => {
        this.sellerProfile = sp;
        this.form.patchValue({
          note: sp.note
        });
      },
        error => {
          this.errorMessage = error.errMsg;
        });
  }

  onSubmit() {
    if (this.ctlNote.value) {
      let sellerProfile = new SellerProfile();
      sellerProfile.seller = this.seller;
      sellerProfile.note = this.ctlNote.value;

      this.storing = true;
      this._orderHistoryService.sellerProfileStore(sellerProfile)
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
