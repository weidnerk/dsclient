import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ChangePasswordBindingModel } from '../_models/ResetPasswordViewModel';
import { UserService } from '../_services/index';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.scss']
})
export class ChangepasswordComponent implements OnInit {

  errorMessage: string;

  constructor(private route: Router, private fb: FormBuilder, private _userService: UserService) { }

  form: FormGroup;
  get oldPassword() { return this.form.controls['oldpassword']; }
  get newPassword() { return this.form.controls['newpassword']; }
  get confirmPassword() { return this.form.controls['confirmpassword']; }
  
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
    let c = new ChangePasswordBindingModel();
    c.OldPassword = this.oldPassword.value;
    c.NewPassword = this.newPassword.value;
    c.ConfirmPassword = this.confirmPassword.value;

    if (c.NewPassword == c.ConfirmPassword) {
      this._userService.ChangePassword(c)
        .subscribe(x => {
          this.route.navigate(['/']);
        },
          error => {
            //this.alertService.error(error);
            if (error.errObj.status === 400) {

              //handle validation error

              // return object from GetErrorResult has 2 properties: "$id" and ""
              // here, we are grabbing last error in ModelState - probably not best way to do it
              if (error.errObj.error.ModelState) {
                for (var key in error.errObj.error.ModelState) {
                  if (error.errObj.error.ModelState.hasOwnProperty(key)) {
                    this.errorMessage = error.errObj.error.ModelState[key];
                  }
                }
              }
              else
                this.errorMessage = error.errMsg;
            }
            else
              this.errorMessage = error.errMsg;
          });
    }
    else {
      this.errorMessage = "New passwords do not match.";
    }
  }
}
