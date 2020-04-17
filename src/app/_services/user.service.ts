
import { throwError as observableThrowError, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { User } from '../_models/index';

import { map, catchError } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { ResetPasswordViewModel } from '../_models/ResetPasswordViewModel';
import { ForgotPasswordViewModel } from '../_models/ResetPasswordViewModel';
import { ChangePasswordBindingModel } from '../_models/ResetPasswordViewModel';
// import { UserProfileVM } from '../_models/userprofile';
import { UserProfile, TokenStatusTypeCustom, UserSettings, AppIDSelect, UserStoreView, UserSettingsView } from '../_models/userprofile';

@Injectable()
export class UserService {
    private getSetRandomPwdUrl: string = environment.API_ENDPOINT + 'api/Account/setrandompassword';
    private getChangePwdUrl: string = environment.API_ENDPOINT + 'api/Account/changepassword';
    private getEmailExistsUrl: string = environment.API_ENDPOINT + 'emailtaken';
    private getTradingAPIUsageUrl: string = environment.API_ENDPOINT + 'tradingapiusage';
    private getTokenStatusTypeUrl: string = environment.API_ENDPOINT + 'tokenstatustype';
    private getUsernameExistsUrl: string = environment.API_ENDPOINT + 'usernametaken';
    private getappidsUrl: string = environment.API_ENDPOINT + 'getappids';
    private cancelScanUrl: string = environment.API_ENDPOINT + 'cancelscan';
    private deleteAPIKeyUrl: string = environment.API_ENDPOINT + 'api/Account/deleteapikey';
    private getUserStoresUrl: string = environment.API_ENDPOINT + 'getuserstores';
    private saveUserSettingsUrl: string = environment.API_ENDPOINT + 'usersettingssave';
 
    constructor(private http: HttpClient) { }

    SendMsg() {
        let url = environment.API_ENDPOINT + "api/Account/sendmsg";
        return this.http.get(url).pipe(
            catchError(this.handleError)
        );
    }

    cancelScan(rptNumber: number) {
        const userJson = localStorage.getItem('currentUser');
        if (userJson) {
            let currentUser = JSON.parse(userJson);
            const httpOptions = {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + currentUser.access_token
                })
            };
            let url = `${this.cancelScanUrl}/${rptNumber}`;
            return this.http.get(url, httpOptions).pipe(
                catchError(this.handleError)
            );
        }
        else
            return observableThrowError(
                {
                    errMsg: "could not obtain current user record"
                }
            )
    }

    ChangePassword(reset: ChangePasswordBindingModel) {
        let url = environment.API_ENDPOINT + "api/Account/changepassword";
        let body = JSON.stringify(reset);
        const userJson = localStorage.getItem('currentUser');
        if (userJson) {
            let currentUser = JSON.parse(userJson);
            const httpOptions = {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + currentUser.access_token
                })
            };
            return this.http.post(url, body, httpOptions).pipe(
                //.do(data => console.log('All: ' + JSON.stringify(data)))
                catchError(this.handleError)
            );
        }
        else
            return observableThrowError(
                {

                    errMsg: "could not obtain current user record"
                }
            )
    }
    UserProfileSave(profile: UserProfile) {
        let url = environment.API_ENDPOINT + "api/Account/userprofilesave";
        const userJson = localStorage.getItem('currentUser');
        if (userJson) {
            let currentUser = JSON.parse(userJson);
            let body = JSON.stringify(profile);
            const httpOptions = {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + currentUser.access_token
                })
            };
            return this.http.post(url, body, httpOptions).pipe(
                //.do(data => console.log('All: ' + JSON.stringify(data)))
                catchError(this.handleError)
            );
        }
        return observableThrowError(
            {
                errMsg: "could not obtain current user record"
            }
        )
    }

    /**
     * 
     * @param appID if appID is null, we are loading user's setting
     */
    UserProfileGet(): Observable<UserProfile> {
        const userJson = localStorage.getItem('currentUser');
        if (userJson) {
            let currentUser = JSON.parse(userJson);
            let url = environment.API_ENDPOINT + "api/Account/userprofileget?userName=" + currentUser.userName;
            const httpOptions = {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + currentUser.access_token
                })
            };
            return this.http.get<UserProfile>(url, httpOptions).pipe(
                //.do(data => console.log('All: ' + JSON.stringify(data)))
                catchError(this.handleError)
            );
        }
        else
            return observableThrowError(
                {
                    errMsg: "Could not obtain current user record"
                }
            )
    }

    UserSettingsViewGet(): Observable<UserSettingsView> {

        const userJson = localStorage.getItem('currentUser');
        if (userJson) {
            let currentUser = JSON.parse(userJson);
            let url = environment.API_ENDPOINT + "api/Account/usersettingsviewget?userName=" + currentUser.userName;
            const httpOptions = {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + currentUser.access_token
                })
            };
            return this.http.get<UserSettingsView>(url, httpOptions).pipe(
                //.do(data => console.log('All: ' + JSON.stringify(data)))
                catchError(this.handleError)
            );
        }
        else
            return observableThrowError(
                {
                    errMsg: "Could not obtain current user record"
                }
            )
    }
    UserSettingsViewGetByStore(storeID: number): Observable<UserSettingsView> {

        const userJson = localStorage.getItem('currentUser');
        if (userJson) {
            let currentUser = JSON.parse(userJson);
            let url = environment.API_ENDPOINT + "api/Account/usersettingsviewgetbystore?userName=" + currentUser.userName
            + "&storeID=" + storeID;
            const httpOptions = {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + currentUser.access_token
                })
            };
            return this.http.get<UserSettingsView>(url, httpOptions).pipe(
                //.do(data => console.log('All: ' + JSON.stringify(data)))
                catchError(this.handleError)
            );
        }
        else
            return observableThrowError(
                {
                    errMsg: "Could not obtain current user record"
                }
            )
    }

    GetAppIds(): Observable<AppIDSelect[]> {
        const userJson = localStorage.getItem('currentUser');
        if (userJson) {
            let currentUser = JSON.parse(userJson);
            let url = this.getappidsUrl + "?username=" + currentUser.userName;
            const httpOptions = {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + currentUser.access_token
                })
            };
            //let _options = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }).set('Authorization', currentUser.access_token) };
            return this.http.get<AppIDSelect[]>(url, httpOptions).pipe(
                //.do(data => console.log('All: ' + JSON.stringify(data)))
                catchError(this.handleError)
            );
        }
        else
            return observableThrowError(
                {
                    errMsg: "could not obtain current user record"
                }
            )
    }
    getUserStores(): Observable<UserStoreView[]> {
        const userJson = localStorage.getItem('currentUser');
        if (userJson) {
            let currentUser = JSON.parse(userJson);
            let url = this.getUserStoresUrl + "?username=" + currentUser.userName;
            const httpOptions = {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + currentUser.access_token
                })
            };
            //let _options = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }).set('Authorization', currentUser.access_token) };
            return this.http.get<UserStoreView[]>(url, httpOptions).pipe(
                //.do(data => console.log('All: ' + JSON.stringify(data)))
                catchError(this.handleError)
            );
        }
        else
            return observableThrowError(
                {
                    errMsg: "could not obtain current user record"
                }
            )
    }

    TradingAPIUsage(): Observable<number> {
        const userJson = localStorage.getItem('currentUser');
        if (userJson) {
            let currentUser = JSON.parse(userJson);
            let url = this.getTradingAPIUsageUrl + "?userName=" + currentUser.userName;;
            const httpOptions = {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + currentUser.access_token
                })
            };
            //let _options = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }).set('Authorization', currentUser.access_token) };
            return this.http.get<number>(url, httpOptions).pipe(
                //.do(data => console.log('All: ' + JSON.stringify(data)))
                catchError(this.handleError)
            );
        }
        else
            return observableThrowError(
                {

                    errMsg: "could not obtain current user record"
                }
            )
    }

    TokenStatus(): Observable<TokenStatusTypeCustom> {
        const userJson = localStorage.getItem('currentUser');
        if (userJson) {
            let currentUser = JSON.parse(userJson);
            let url = this.getTokenStatusTypeUrl + "?userName=" + currentUser.userName;
            const httpOptions = {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + currentUser.access_token
                })
            };
            let _options = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }).set('Authorization', currentUser.access_token) };
            return this.http.get<TokenStatusTypeCustom>(url, httpOptions).pipe(
                //.do(data => console.log('All: ' + JSON.stringify(data)))
                catchError(this.handleError)
            );
        }
        else
            return observableThrowError(
                {

                    errMsg: "could not obtain current user record"
                }
            )
    }

    SetRandomPassword(emailAddress: string) {
        let url = this.getSetRandomPwdUrl;
        let forgotPwd = new ForgotPasswordViewModel();
        forgotPwd.EmailAddress = emailAddress;
        let body = JSON.stringify(forgotPwd);
        let _options = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
        return this.http.post(url, body, _options).pipe(
            //.do(data => console.log('All: ' + JSON.stringify(data)))
            catchError(this.handleError)
        );
    }

    register(user: User) {
        let url = environment.API_ENDPOINT + "api/Account/Register";
        let body = JSON.stringify(user);
        //let body = JSON.stringify({ "Email": user.userName, "Password": user.password, "ConfirmPassword": user.password });
        //let headers = new Headers({ 'Content-Type': 'application/json' });
        //let options = new RequestOptions({ headers: headers, method: "post" });
        let _options = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

        return this.http.post(url, body, _options).pipe(
            //.do(data => console.log('All: ' + JSON.stringify(data)))
            catchError(this.handleError)
        );
    }

    deleteAPIKey(appID: string) {
        const userJson = localStorage.getItem('currentUser');
        if (userJson) {
            let currentUser = JSON.parse(userJson);
            let url = `${this.deleteAPIKeyUrl}/${appID}`;
            const httpOptions = {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + currentUser.access_token
                })
            };
            return this.http.delete<string>(url, httpOptions).pipe(
                catchError(this.handleError)
            );
        }
        else
            return observableThrowError(
                {
                    errMsg: "Could not obtain current user record"
                }
            )
    }
    userSettingsSave(userSettings: UserSettings, fieldNames: string[]) {
        const userJson = localStorage.getItem('currentUser');
        if (userJson) {
            let currentUser = JSON.parse(userJson);
            let url = this.saveUserSettingsUrl;
            let dto = { "UserSettings": userSettings, "FieldNames": fieldNames };
            let body = JSON.stringify(dto);
            const httpOptions = {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + currentUser.access_token
                })
            };
            return this.http.post(url, body, httpOptions).pipe(
                catchError(this.handleError)
            );
        }
        return observableThrowError(
            {
                errMsg: "could not obtain current user record"
            }
        )
    }

    private handleError(error: HttpErrorResponse) {
        let errMsg: string | null = null;
        let errDetail: string | null = null;
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            errMsg = error.error.message;
        } else if (error.status === 404) {
            // error object is null
            errMsg = "Not found";
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            errDetail = `Backend returned code ${error.status}, ` +
                `body was: ${error.error.Message}`;
            errMsg = error.error.Message;
        }
        return observableThrowError(
            {
                "errMsg": errMsg,
                "errDetail": errDetail,
                "errObj": error,
                "errorStatus": error.status
            });
    };

    emailTaken(email: string): Observable<boolean> {
        let url = this.getEmailExistsUrl + "?email=" + email;
        return this.http.get<boolean>(url).pipe(
            //.map((response: Response) => <boolean>response)
            //.do(data => console.log('Email exists: ' + JSON.stringify(data)))
            catchError(this.handleError)
        );
    }

    usernameTaken(username: string): Observable<boolean> {
        let url = this.getUsernameExistsUrl + "?username=" + username;
        return this.http.get<boolean>(url).pipe(
            //.map((response: Response) => <boolean>response)
            //.do(data => console.log('Email exists: ' + JSON.stringify(data)))
            catchError(this.handleError)
        );
    }

}