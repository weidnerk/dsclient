import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { UserService } from '../_services/index';
import { User } from '../_models/index';

const USERNAME_REGEX = /^[a-zA-Z.]+$/;
const FIRSTNAME_REGEX = /^[a-zA-Z]+$/;
const LASTNAME_REGEX = /^[a-zA-Z ']+$/;

function passwordMatcher(c: AbstractControl): { [key: string]: boolean } | null {
    // return { nomatch: true };
    const formGroup = c.parent;
    if (formGroup) {
        const passwordControl = formGroup.get('password');
        const confirmControl = formGroup.get('confirm');

        if (passwordControl && confirmControl) {
            if (passwordControl.pristine || confirmControl.pristine) {
                return null;
            }

            if (passwordControl.value === confirmControl.value) {
                return null;
            }
        }
    }
    return { nomatch: true };
}

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

    // was using Angular's [Validators.email] to validate dealer's email address
    // but this allows atypical email addresses (although technically correct)
    //  see for reference
    // https://stackoverflow.com/questions/23671934/form-validation-email-validation-not-working-as-expected-in-angularjs
    //
    // so came up with pattern instead
    emailPattern = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$';

    model: User = <User>{};
    //model: any = {};
    loading = false;
    errorMessage: string | null;   // needed for message like 'passwords must be at least 6 chars'
    registerForm: FormGroup;

    get userName() { return this.registerForm.controls['userName']; }
    get firstName() { return this.registerForm.controls['firstName']; }
    get lastName() { return this.registerForm.controls['lastName']; }
    get emailAddress() { return this.registerForm.controls['emailAddress']; }
    get password() { return this.registerForm.controls['password']; }
    get confirm() { return this.registerForm.controls['confirm']; }
    // get pwd() { return this.registerForm.get('pwd'); }

    constructor(
        private router: Router,
        private userService: UserService,
        private fb: FormBuilder) {
        this.buildForm();
    }

    ngOnInit() {

    }

    register() {
        this.errorMessage = null;
        if (this.registerForm.invalid) {
            return;
        }
        this.loading = true;
        this.model.Username = this.userName.value;
        this.model.Email = this.emailAddress.value;
        this.model.firstName = this.firstName.value;
        this.model.lastName = this.lastName.value;
        this.model.Password = this.password.value;
        this.model.ConfirmPassword = this.confirm.value;

        this.userService.register(this.model)
            .subscribe(
                data => {
                    //this.alertService.success('Registration successful', true);
                    this.router.navigate(['/login']);
                },
                error => {
                    //this.alertService.error(error);
                    if (error.errObj.status === 400) {
                        //handle validation error
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

                    this.loading = false;
                });
    }

    // would eventually like to put this in a separate file under a _validators folder
    validateEmail(c: AbstractControl): Observable<ValidationErrors | null> {

        if (c.value != undefined) {
            return this.userService.emailTaken(c.value).pipe(
                map(res => {
                    if (!res)
                        return null;
                    else
                        return { emailTaken: <boolean>res };
                }));
        }
        return of(null);
    };

    validateUsername(c: AbstractControl): Observable<ValidationErrors | null> {

        if (c.value != undefined) {
            return this.userService.usernameTaken(c.value).pipe(
                map(res => {
                    if (!res)
                        return null;
                    else
                        return { usernameTaken: <boolean>res };
                }));
        }
        return of(null);
    };

    onRemoveUser() {
        console.log('remove user');
    }
    buildForm(): void {
        this.registerForm = this.fb.group({
            userName: [null, {
                validators: [Validators.required, Validators.minLength(8),
                Validators.maxLength(30),
                Validators.pattern(USERNAME_REGEX)],
                asyncValidators: [this.validateUsername.bind(this)],
                updateOn: 'submit'
            }],
            password: [null, {
                validators: [Validators.required],
                updateOn: 'submit'
            }],
            confirm: [null, {
                validators: [passwordMatcher],
                updateOn: 'submit'
            }],
            firstName: [null, {
                validators: [Validators.required, Validators.minLength(2), Validators.maxLength(30), Validators.pattern(FIRSTNAME_REGEX)],
                updateOn: 'submit'
            }],
            lastName: [null, {
                validators: [Validators.required, Validators.minLength(2),
                Validators.maxLength(30),
                Validators.pattern(LASTNAME_REGEX)],
                updateOn: 'submit'
            }],
            emailAddress: [null, {
                validators: [Validators.required,
                Validators.maxLength(40),
                Validators.pattern(this.emailPattern)],
                asyncValidators: [this.validateEmail.bind(this)],
                updateOn: 'submit'
            }]
        })
    }
}
