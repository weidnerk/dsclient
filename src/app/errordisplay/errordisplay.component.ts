import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-errordisplay',
  templateUrl: './errordisplay.component.html',
  styleUrls: ['./errordisplay.component.scss']
})
export class ErrordisplayComponent implements OnInit {

  msg: string;
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ErrordisplayComponent>) {
      this.msg = data.msg;
  }

  ngOnInit(): void {
  }
  
  onClose() {
    this.dialogRef.close();
  }
}
