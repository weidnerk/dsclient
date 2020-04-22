import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from '../_services/index';
import { User } from '../_models/index';

@Component({
    // moduleId: module.id,
    templateUrl: 'login.component.html',
    styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
    //model: any = {};
    model: User = <User>{};
    loading = false;
    errorMessage: string;

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService) { }

    ngOnInit() {
        // reset login status
        this.authenticationService.logout();
    }

    login() {
        this.loading = true;
        this.authenticationService.login(this.model.Username, this.model.Password)
            .subscribe(
            response => {
                this.router.navigate(['/']);
            },
            error => {
                this.loading = false;
                //this.alertService.error(error);
                if (error.status === 400) {
                  //handle validation error
                  if (error.error.error_description) {
                    this.errorMessage = error.error.error_description;
                  }
                  else {
                    this.errorMessage = error.errMsg;
                  }
                }
                else {
                  this.errorMessage = error.errMsg;
                }
              });
        }
}
