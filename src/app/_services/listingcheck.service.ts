/*
* This service will be replacing orderhistory.service.
*
*/

import { throwError as observableThrowError, Observable, BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEventType, HttpEvent, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { SourceCategory } from '../_models/orderhistory';

import { catchError } from 'rxjs/internal/operators';

import { SearchReport, SearchHistoryView } from '../_models/orderhistory';
import { environment } from '../../environments/environment';

@Injectable()
export class ListCheckService {

    private getCompareImageUrl: string = environment.API_ENDPOINT + 'compareimages';
    private getPostedListingUrl: string = environment.API_ENDPOINT + 'getpostedlisting';
    private storePostedListingUrl: string = environment.API_ENDPOINT + 'storepostedlisting';
    // private getItemUrl: string = environment.API_ENDPOINT + 'getitem';
    private createListingUrl: string = environment.API_ENDPOINT + 'createpostedlisting';
    private endListingUrl: string = environment.API_ENDPOINT + 'endlisting';
    private getCategoriesUrl: string = environment.API_ENDPOINT + 'getcategories';
    private getSearchHistoryUrl: string = environment.API_ENDPOINT + 'getsearchhistory';
    private deleteScanUrl: string = environment.API_ENDPOINT + 'deletescan';

    constructor(private http: HttpClient) { }

    getSearchHistory(): Observable<SearchHistoryView[]> {
        const userJson = localStorage.getItem('currentUser');
        if (userJson) {
            let currentUser = JSON.parse(userJson);
            let url = this.getSearchHistoryUrl + "?userName=" + currentUser.userName;
            const httpOptions = {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + currentUser.access_token
                })
            };
            return this.http.get<SearchHistoryView[]>(url, httpOptions).pipe(
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

    deleteScan(rptNumber: number) {
        const userJson = localStorage.getItem('currentUser');
        if (userJson) {
            let currentUser = JSON.parse(userJson);
            let url = `${this.deleteScanUrl}/${rptNumber}`;
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

    endListing(listedItemID: string): Observable<string> {
        const userJson = localStorage.getItem('currentUser');
        if (userJson) {
            let currentUser = JSON.parse(userJson);
            let url = this.endListingUrl
                + "?listedItemID=" + listedItemID;
            const httpOptions = {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + currentUser.access_token
                })
            };
            return this.http.get<string>(url, httpOptions).pipe(
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

    // get item from vwPriceCompare
    // getItem(ebayItemId: string, eBayPrice: number, categoryId: number, shippingAmt: number): Observable<SearchReport> {
    //     const userJson = localStorage.getItem('currentUser');
    //     if (userJson) {
    //         let currentUser = JSON.parse(userJson);
    //         let url = this.getItemUrl
    //             + "?ebayItemId=" + ebayItemId
    //             + "&ebayPrice=" + eBayPrice
    //             + "&categoryId=" + categoryId
    //             + "&shippingAmt=" + shippingAmt;
    //         const httpOptions = {
    //             headers: new HttpHeaders({
    //                 'Content-Type': 'application/json',
    //                 'Authorization': 'Bearer ' + currentUser.access_token
    //             })
    //         };
    //         return this.http.get<SearchReport>(url, httpOptions).pipe(
    //             catchError(this.handleError)
    //         );
    //     }
    //     else
    //         return observableThrowError(
    //             {
    //                 errMsg: "Could not obtain current user record"
    //             }
    //         )
    // }

    // postedListingStore(listing: PostedListing) {

    //     const userJson = localStorage.getItem('currentUser');
    //     if (userJson) {
    //         let currentUser = JSON.parse(userJson);
    //         let url = this.storePostedListingUrl;
    //         let body = JSON.stringify(listing);
    //         const httpOptions = {
    //             headers: new HttpHeaders({
    //                 'Content-Type': 'application/json',
    //                 'Authorization': 'Bearer ' + currentUser.access_token
    //             })
    //         };

    //         return this.http.post(url, body, httpOptions).pipe(
    //             catchError(this.handleError)
    //         );
    //     }
    //     return observableThrowError(
    //         {
    //             errMsg: "Could not obtain current user record"
    //         }
    //     )
    // }

    // listingCreate(itemId: string, storeID: number): Observable<PostedListing> {
    //     const userJson = localStorage.getItem('currentUser');
    //     if (userJson) {
    //         let currentUser = JSON.parse(userJson);
    //         let url = this.createListingUrl + "?userName=" + currentUser.userName
    //             + "&itemId=" + itemId
    //             + "&storeID" + storeID.toString();
    //         const httpOptions = {
    //             headers: new HttpHeaders({
    //                 'Content-Type': 'application/json',
    //                 'Authorization': 'Bearer ' + currentUser.access_token
    //             })
    //         };
    //         return this.http.get<PostedListing>(url, httpOptions).pipe(
    //             catchError(this.handleError)
    //         );
    //     }
    //     else
    //         return observableThrowError(
    //             {
    //                 errMsg: "Could not obtain current user record"
    //             }
    //         )
    // }

    getCategories(source: number): Observable<SourceCategory[]> {
        const userJson = localStorage.getItem('currentUser');
        if (userJson) {
            let currentUser = JSON.parse(userJson);
            let url = this.getCategoriesUrl + "?userName=" + currentUser.userName
            + "&sourceId=" + source;
            const httpOptions = {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + currentUser.access_token
                })
            };
            return this.http.get<SourceCategory[]>(url, httpOptions).pipe(
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

    private handleError(error: HttpErrorResponse) {
        let errMsg: string | null = null;
        let errDetail: string | null = null;
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            errMsg = error.error.message;
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            if (error.error) {
                errDetail = `Backend returned code ${error.status}, ` +
                    `body was: ${error.error.Message}`;
                errMsg = error.error.Message;
            }
            else {
                errDetail = `Backend returned code ${error.status}, ` +
                    `body was: ${error.statusText}`;
                errMsg = error.statusText;
            }
        }
        return observableThrowError(
            {
                "errMsg": errMsg,
                "errDetail": errDetail,
                "errObj": error
            });
    };
}
