import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ChangePasswordBindingModel } from '../_models/ResetPasswordViewModel';
import { UserService } from '../_services/index';
import { MatDialog } from '@angular/material/dialog';
import { ShowmessagesComponent } from '../showmessages/showmessages.component';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.scss']
})
export class ChangepasswordComponent implements OnInit {

  errorMessage: string;

  constructor(private route: Router,
    private router: Router, 
    private fb: FormBuilder, 
    private _userService: UserService,
    public dialog: MatDialog) { }

  form: FormGroup;
  get oldPassword() { return this.form.controls['oldpassword']; }
  get newPassword() { return this.form.controls['newpassword']; }
  get confirmPassword() { return this.form.controls['confirmpassword']; }
  
   // status spinner variables
   color = 'primary';
   mode = 'indeterminate';
   value = 50;
   displayProgressSpinner = false;

  ngOnInit() {
    this.buildForm();
  }

  buildForm(): void {
    this.form = this.fb.group({
      oldpassword: [null, Validators.required],
      newpassword: [null, Validators.required],
      confirmpassword: [null, Validators.required]
    })
  }

  onSubmit() {
    this.displayProgressSpinner = true;
    this.errorMessage = "";
    let c = new ChangePasswordBindingModel();
    c.OldPassword = this.oldPassword.value;
    c.NewPassword = this.newPassword.value;
    c.ConfirmPassword = this.confirmPassword.value;

    if (c.NewPassword == c.ConfirmPassword) {
      this._userService.ChangePassword(c)
        .subscribe(x => {
          this.displayProgressSpinner = false;
          this.showMessage("Password changed.")
          // setTimeout(() => {
          //   this.router.navigate(['/']);
          // }, 500);
        },
        error => {
          this.displayProgressSpinner = false;
          this.errorMessage = error.errMsg;
        });
    }
    else {
      this.displayProgressSpinner = false;
      this.errorMessage = "New passwords do not match.";
    }
  }

  showMessage(msg: string) {
    const dialogRef = this.dialog.open(ShowmessagesComponent, {
      height: '500px',
      width: '600px',
      data: { message: msg }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.router.navigate(['/']);
    });
  }
}
