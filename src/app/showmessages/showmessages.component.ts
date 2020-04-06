import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-showmessages',
  templateUrl: './showmessages.component.html',
  styleUrls: ['./showmessages.component.scss']
})
export class ShowmessagesComponent implements OnInit {

  message: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ShowmessagesComponent>) {
    this.message = data.message;
  }

  ngOnInit(): void {
    
  }
  onCancel() {
    this.dialogRef.close();
  }
}
