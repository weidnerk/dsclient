
import { throwError as observableThrowError, Observable, BehaviorSubject, pipe } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';


@Injectable()
export class AuthenticationService {
    constructor(private http: HttpClient) { }

    login(username: string, password: string) {

        let url = environment.API_ENDPOINT + "token";
        let body = "username=" + username + "&password=" + password + "&grant_type=password";
        // form-urlencoded or json?
        //let headers = new Headers({ 'Content-Type': 'application/form-urlencoded' });
        //let options = new RequestOptions({ headers: headers });
        let _options = { headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }) };

        return this.http.post<any>(url, body, _options).pipe(
            map(user => {
                // login successful if there's a jwt token in the response

                // token is undefined
                if (user && user.access_token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    // localStorage.setItem('access_token', response.json().access_token);
                    // localStorage.setItem('expires_in', response.json().expires_in);
                    // localStorage.setItem('token_type', response.json().token_type);
                    // localStorage.setItem('userName', response.json().userName);

                    // localStorage.setItem('currentUser', JSON.stringify({ username: username, token: response.json().access_token }));

                    localStorage.setItem('currentUser', JSON.stringify(user));
                }
            }),
            catchError(this.handleError)
        );
    }

    // public handleError(error: HttpErrorResponse) {
    //     return observableThrowError(error);
    // }
    private handleError(error: HttpErrorResponse) {
        let errMsg: string | null = null;
        let errDetail: string | null = null;
        if (error.error) {
            if (error.error instanceof ErrorEvent) {
                // A client-side or network error occurred. Handle it accordingly.
                errMsg = error.error.message;
            }
        }
        if (errMsg == null) {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            errDetail = `Backend returned code ${error.status}`;

            // specifically added for case when can't connect to API
            if (error.message) {
                // might have both error.message and error.error.Message populated
                if (error.error) {
                    if (error.error.Message) {
                        errMsg = error.message + ";" + error.error.Message;
                    }
                    else {
                        errMsg = error.message;
                    }
                }
                else {
                    errMsg = error.message;
                }
            }
            else {
                if (error.error) {
                    if (error.error.Message) {
                        errMsg = error.error.Message;
                    }
                    else {
                        errMsg = error.error;
                    }
                }
                else {
                    errMsg = error.statusText;
                }
            }
        }
        return observableThrowError(
            {
                "errMsg": errMsg,
                "errStatus": error.status
            });
    }
    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
    }
}