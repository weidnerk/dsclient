import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-endlisting',
  templateUrl: './endlisting.component.html',
  styleUrls: ['./endlisting.component.scss']
})
export class EndlistingComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EndlistingComponent>) {
  }

  ngOnInit(): void {
  }
  
}
