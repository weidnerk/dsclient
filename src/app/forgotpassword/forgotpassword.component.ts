import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { UserService } from '../_services/index';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss']
})
export class ForgotpasswordComponent implements OnInit {

  forgotPasswordForm: FormGroup;
  errorMessage: string | null;

  constructor(private route: Router, private fb: FormBuilder, private _userService: UserService) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm(): void {

    this.forgotPasswordForm = this.fb.group({
      emailAddress: [null, [Validators.required, Validators.email]]
    })
  }

  onSubmit(pwdForm) {
    this.errorMessage = null;
    console.log(pwdForm.emailAddress);
    this.ResetPassword(pwdForm.emailAddress);
  }

  ResetPassword(email:string) {

    this._userService.SetRandomPassword(email)
      .subscribe(x => {
        this.route.navigate(['/passwordreset']);
      },
        error => {
          this.errorMessage = JSON.stringify(error);
        });
  }
}
