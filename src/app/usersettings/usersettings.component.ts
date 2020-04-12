import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrderHistoryService } from '../_services/orderhistory.service';

@Component({
  selector: 'app-usersettings',
  templateUrl: './usersettings.component.html',
  styleUrls: ['./usersettings.component.scss']
})
export class UsersettingsComponent implements OnInit {

  form: FormGroup;
  get ctlPctProfit() { return this.form.controls['pctProfit']; }
  
  constructor(private fb: FormBuilder,
    private _orderHistoryService: OrderHistoryService) { }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(): void {
    this.form = this.fb.group({
      pctProfit: [null, {
        validators: [Validators.required, this._orderHistoryService.validateRequiredNumeric.bind(this)]
      }]
    })
  }
  onSubmit() {
    console.log(this.ctlPctProfit.value);
  }
}
