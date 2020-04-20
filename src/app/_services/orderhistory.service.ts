
import { throwError as observableThrowError, Observable, BehaviorSubject } from 'rxjs';
/*
Modeled after gititems.service.ts which came from

*/
import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEventType, HttpEvent, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { catchError } from 'rxjs/internal/operators';

import { ModelView, Listing, SearchReport, SourceCategory, SellerProfile, Dashboard, ListingNote, ListingNoteView, ListingView, OrderHistory, SellerListing, SupplierItem, UpdateToListing, SalesOrder, PriceProfit, ListingLog } from '../_models/orderhistory';
import { WalmartSearchProdIDResponse } from '../_models/walitem';
import { environment } from '../../environments/environment';
import { AbstractControl } from '@angular/forms';

@Injectable()
export class OrderHistoryService {

    private getOrderHistoryUrl: string = environment.API_ENDPOINT + 'getsellersold';
    private getNumItemssUrl: string = environment.API_ENDPOINT + 'numitemssold';
    private getProdByIdUrl: string = environment.API_ENDPOINT + 'prodbyid';
    private getSellerListingUrl: string = environment.API_ENDPOINT + 'getsellerlisting';
    private storeListingUrl: string = environment.API_ENDPOINT + 'listingsave';
    private storeNoteUrl: string = environment.API_ENDPOINT + 'storenote';
    private setOrderUrl: string = environment.API_ENDPOINT + 'setorder';
    private getWMOrderUrl: string = environment.API_ENDPOINT + 'getwmorder';
    private storeSellerProfileUrl: string = environment.API_ENDPOINT + 'storesellerprofile';
    private getListingUrl: string = environment.API_ENDPOINT + 'getlisting';    // get item from db
    private createListingUrl: string = environment.API_ENDPOINT + 'createlisting';
    private createVariationListingUrl: string = environment.API_ENDPOINT + 'createvariationlisting';
    private getWmDerivedUrl: string = environment.API_ENDPOINT + 'getwmderived';
    private getWmItemUrl: string = environment.API_ENDPOINT + 'getwmitem';
    private getListingsUrl: string = environment.API_ENDPOINT + 'getlistings';
    private getSellerProfileUrl: string = environment.API_ENDPOINT + 'getsellerprofile';
    private deleteListingRecordUrl: string = environment.API_ENDPOINT + 'deletelistingrecord';
    private getDashboardUrl: string = environment.API_ENDPOINT + 'dashboard';
    private getListingNoteUrl: string = environment.API_ENDPOINT + 'itemnotes';
    private getWalmarSearchProdIDtUrl: string = environment.API_ENDPOINT + 'walmartsearchprodid';
    private updateToListingUrl: string = environment.API_ENDPOINT + 'updatetolisting';
    private storeToListingUrl: string = environment.API_ENDPOINT + 'storetolisting';
    private getFindErrorUrl: string = environment.API_ENDPOINT + 'logerrorcount';
    private getLastErrorUrl: string = environment.API_ENDPOINT + 'lasterror';
    private calculateWMPxUrl: string = environment.API_ENDPOINT + 'calculatewmpx';
    private storeSalesOrderUrl: string = environment.API_ENDPOINT + 'salesorderupdate';
    private refreshItemSpecificsUrl: string = environment.API_ENDPOINT + 'refreshitemspecifics';
    private getSupplierItemUrl: string = environment.API_ENDPOINT + 'getsupplieritem';
    private getBusinessPoliciesUrl: string = environment.API_ENDPOINT + 'getbusinesspolicies';
    private getListingLogUrl: string = environment.API_ENDPOINT + 'getlistinglog';

    constructor(private http: HttpClient) { }

    getProdById(): any {
        const userJson = localStorage.getItem('currentUser');
        if (userJson) {
            let currentUser = JSON.parse(userJson);
            const httpOptions = {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + currentUser.access_token
                })
            };
            let url = this.getProdByIdUrl + "?userName=" + currentUser.userName;
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

    getNumItems(seller: string, daysBack: number, resultsPerPg: number, minSold: number): Observable<ModelView> {
        const userJson = localStorage.getItem('currentUser');
        if (userJson) {
            let currentUser = JSON.parse(userJson);
            const httpOptions = {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + currentUser.access_token
                })
            };
            let url = this.getNumItemssUrl
                + "?seller=" + seller
                + "&daysBack=" + daysBack
                + "&resultsPerPg=" + resultsPerPg
                + "&minSold=" + minSold
                + "&userName=" + currentUser.userName;
            return this.http.get<ModelView>(url, httpOptions).pipe(
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

    //
    // Reach back to earliest item whose last sale date is within 'days back'. But that item could, in turn, have 50 orders behind it extending much earlier than 'days back'.
    //
    // If, for example, you ask eBay for last 7 days of sold listings, it includes Ended listings in last 7 days even if nothing sold in last 7 days.
    getOrderHistory(seller: string, daysBack: number, resultsPerPg: number, rptNumber: number, minSold: number): Observable<ModelView> {
        const userJson = localStorage.getItem('currentUser');
        if (userJson) {
            let currentUser = JSON.parse(userJson);
            const httpOptions = {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + currentUser.access_token
                })
            };
            let url = this.getOrderHistoryUrl
                + "?seller=" + seller
                + "&daysBack=" + daysBack
                + "&resultsPerPg=" + resultsPerPg
                + "&minSold=" + minSold
                + "&userName=" + currentUser.userName
                + "&reportNumber=" + rptNumber
            return this.http.get<ModelView>(url, httpOptions).pipe(
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

    /**
     * Calls GetSingleItem()
     * @param itemId
     */
    getSellerListing(itemId: string): Observable<SellerListing> {
        const userJson = localStorage.getItem('currentUser');
        if (userJson) {
            let currentUser = JSON.parse(userJson);
            let url = this.getSellerListingUrl + "?userName=" + currentUser.userName
                + "&itemID=" + itemId;
            const httpOptions = {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + currentUser.access_token
                })
            };
            return this.http.get<SellerListing>(url, httpOptions).pipe(
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

    getSellerProfile(seller: string): Observable<SellerProfile> {
        const userJson = localStorage.getItem('currentUser');
        if (userJson) {
            let currentUser = JSON.parse(userJson);
            let url = this.getSellerProfileUrl + "?userName=" + currentUser.userName
                + "&seller=" + seller;
            const httpOptions = {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + currentUser.access_token
                })
            };
            return this.http.get<SellerProfile>(url, httpOptions).pipe(
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

    getListingNotes(itemID: string, storeID: number): Observable<ListingNoteView[]> {
        const userJson = localStorage.getItem('currentUser');
        if (userJson) {
            let currentUser = JSON.parse(userJson);
            let url = this.getListingNoteUrl + "?userName=" + currentUser.userName
                + "&itemID=" + itemID
                + "&storeID=" + storeID;
            const httpOptions = {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + currentUser.access_token
                })
            };
            return this.http.get<ListingNoteView[]>(url, httpOptions).pipe(
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

    getDashboard(storeID: number): Observable<Dashboard> {
        const userJson = localStorage.getItem('currentUser');
        if (userJson) {
            let currentUser = JSON.parse(userJson);
            let url = this.getDashboardUrl + "?storeID=" + storeID;
            const httpOptions = {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + currentUser.access_token
                })
            };
            return this.http.get<Dashboard>(url, httpOptions).pipe(
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
    getWmDerived(sourceUrl: string): Observable<number> {
        const userJson = localStorage.getItem('currentUser');
        if (userJson) {
            let currentUser = JSON.parse(userJson);
            let url = this.getWmDerivedUrl + "?userName=" + currentUser.userName
                + "&url=" + sourceUrl;
            const httpOptions = {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + currentUser.access_token
                })
            };
            return this.http.get<number>(url, httpOptions).pipe(
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
    getFindError(filename: string): Observable<number> {
        const userJson = localStorage.getItem('currentUser');
        if (userJson) {
            let currentUser = JSON.parse(userJson);
            let url = this.getFindErrorUrl + "?userName=" + currentUser.userName
                + "&filename=" + filename;
            const httpOptions = {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + currentUser.access_token
                })
            };
            return this.http.get<number>(url, httpOptions).pipe(
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
    getLastError(filename: string): Observable<string> {
        const userJson = localStorage.getItem('currentUser');
        if (userJson) {
            let currentUser = JSON.parse(userJson);
            let url = this.getLastErrorUrl + "?userName=" + currentUser.userName
                + "&filename=" + filename;
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
                    errMsg: "could not obtain current user record"
                }
            )
    }
    getWmItem(sourceUrl: string): Observable<SupplierItem> {
        const userJson = localStorage.getItem('currentUser');
        if (userJson) {
            let currentUser = JSON.parse(userJson);
            let url = this.getWmItemUrl + "?userName=" + currentUser.userName
                + "&url=" + sourceUrl;
            const httpOptions = {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + currentUser.access_token
                })
            };
            return this.http.get<SupplierItem>(url, httpOptions).pipe(
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
    calculateWMPx(supplierPrice: number): Observable<PriceProfit> {
        const userJson = localStorage.getItem('currentUser');
        if (userJson) {
            let url = this.calculateWMPxUrl + "?supplierPrice=" + supplierPrice.toString();
            let currentUser = JSON.parse(userJson);
            const httpOptions = {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + currentUser.access_token
                })
            };
            return this.http.get<PriceProfit>(url, httpOptions).pipe(
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
    listingCreate(listingID: number): Observable<string> {
        const userJson = localStorage.getItem('currentUser');
        if (userJson) {
            let currentUser = JSON.parse(userJson);
            let url = this.createListingUrl + "?userName=" + currentUser.userName
                + "&listingID=" + listingID
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
                    errMsg: "could not obtain current user record"
                }
            )
    }
    variationListingCreate(): Observable<string> {
        const userJson = localStorage.getItem('currentUser');
        if (userJson) {
            let currentUser = JSON.parse(userJson);
            let url = this.createVariationListingUrl;
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
                    errMsg: "could not obtain current user record"
                }
            )
    }
    deleteListingRecord(listingID: number) {
        const userJson = localStorage.getItem('currentUser');
        if (userJson) {
            let currentUser = JSON.parse(userJson);
            let url = `${this.deleteListingRecordUrl}/${listingID}`;
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
    listingStore(listing: Listing, fieldNames: string[]): Observable<Listing> {
        const userJson = localStorage.getItem('currentUser');
        if (userJson) {
            let currentUser = JSON.parse(userJson);
            let url = this.storeListingUrl;
            let dto = { "Listing": listing, "FieldNames": fieldNames };
            let body = JSON.stringify(dto);
            const httpOptions = {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + currentUser.access_token
                })
            };
            return this.http.post<Listing>(url, body, httpOptions).pipe(
                catchError(this.handleError)
            );
        }
        return observableThrowError(
            {
                errMsg: "could not obtain current user record"
            }
        )
    }
    salesOrderStore(salesOrder: SalesOrder, fieldNames: string[]) {
        const userJson = localStorage.getItem('currentUser');
        if (userJson) {
            let currentUser = JSON.parse(userJson);
            let url = this.storeSalesOrderUrl;
            let dto = { "SalesOrder": salesOrder, "FieldNames": fieldNames };
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
    noteStore(listingNote: ListingNote) {
        const userJson = localStorage.getItem('currentUser');
        if (userJson) {
            let currentUser = JSON.parse(userJson);
            let url = this.storeNoteUrl;
            let body = JSON.stringify(listingNote);
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

    /**
     * Set ToList flag in OrderHistory meaning prepare to create a record in the Listing table.
     * @param oh 
     */
    toListUpdate(obj: UpdateToListing, fieldNames: string[]) {
        const userJson = localStorage.getItem('currentUser');
        if (userJson) {
            let currentUser = JSON.parse(userJson);
            let url = this.updateToListingUrl;
            let dto = { "UpdateToListing": obj, "FieldNames": fieldNames };
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

    /**
     * Working on getting order details instead of manually updating 'Orders' spreadsheet.
     * @param listing 
     */
    setOrder(listing: Listing) {
        const userJson = localStorage.getItem('currentUser');
        if (userJson) {
            let currentUser = JSON.parse(userJson);
            let url = this.setOrderUrl;
            let body = JSON.stringify(listing);
            const httpOptions = {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + currentUser.access_token
                })
            };
            return this.http.get(url, httpOptions).pipe(
                catchError(this.handleError)
            );
        }
        return observableThrowError(
            {
                errMsg: "could not obtain current user record"
            }
        )
    }
    getWMOrder(orderURL: string) {
        const userJson = localStorage.getItem('currentUser');
        if (userJson) {
            let currentUser = JSON.parse(userJson);
            let url = this.getWMOrderUrl
                + "?orderURL=" + orderURL
            const httpOptions = {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + currentUser.access_token
                })
            };
            return this.http.get(url, httpOptions).pipe(
                catchError(this.handleError)
            );
        }
        return observableThrowError(
            {
                errMsg: "could not obtain current user record"
            }
        )
    }

    sellerProfileStore(sellerProfile: SellerProfile) {
        const userJson = localStorage.getItem('currentUser');
        if (userJson) {
            let currentUser = JSON.parse(userJson);
            let url = this.storeSellerProfileUrl;
            let body = JSON.stringify(sellerProfile);
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

    listingGet(listingID: number): Observable<Listing> {
        const userJson = localStorage.getItem('currentUser');
        if (userJson) {
            let currentUser = JSON.parse(userJson);
            let url = this.getListingUrl + "?listingID=" + listingID
            const httpOptions = {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + currentUser.access_token
                })
            };
            return this.http.get<Listing>(url, httpOptions).pipe(
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
    supplierItemGet(ID: number): Observable<SupplierItem> {
        const userJson = localStorage.getItem('currentUser');
        if (userJson) {
            let currentUser = JSON.parse(userJson);
            let url = this.getSupplierItemUrl + "?ID=" + ID
            const httpOptions = {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + currentUser.access_token
                })
            };
            return this.http.get<SupplierItem>(url, httpOptions).pipe(
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

    /**
     * 
     * @param storeID 
     * @param unlisted only care about True value 
     * @param listed  only care about True value
     */
    getListings(storeID: number, unlisted: boolean, listed: boolean): Observable<ListingView[]> {
        const userJson = localStorage.getItem('currentUser');
        if (userJson) {
            let currentUser = JSON.parse(userJson);
            let url = `${this.getListingsUrl}/${storeID}/${unlisted}/${listed}`;
            const httpOptions = {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + currentUser.access_token
                })
            };
            return this.http.get<ListingView[]>(url, httpOptions).pipe(
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
    walmartSearchProdID(search: string): Observable<WalmartSearchProdIDResponse> {
        const userJson = localStorage.getItem('currentUser');
        if (userJson) {
            let currentUser = JSON.parse(userJson);
            const httpOptions = {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + currentUser.access_token
                })
            };
            let url = this.getWalmarSearchProdIDtUrl + "?userName=" + currentUser.userName
                + "&search=" + search;
            return this.http.get<WalmartSearchProdIDResponse>(url, httpOptions).pipe(
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
    /**
     * Send records in OrderHistory where ToListing=1 to Listing table.
     */
    storeToListing(storeID: number): Observable<string> {
        const userJson = localStorage.getItem('currentUser');
        if (userJson) {
            let currentUser = JSON.parse(userJson);
            let url = this.storeToListingUrl + "?userName=" + currentUser.userName + "&storeID=" + storeID;

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
                    errMsg: "could not obtain current user record"
                }
            )
    }
    refreshItemSpecifics(ID: number): Observable<string> {
        const userJson = localStorage.getItem('currentUser');
        if (userJson) {
            let currentUser = JSON.parse(userJson);
            let url = this.refreshItemSpecificsUrl + "?ID=" + ID;

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
                    errMsg: "could not obtain current user record"
                }
            )
    }
    getBusinessPolicies(storeID: number): Observable<string[]> {
        const userJson = localStorage.getItem('currentUser');
        if (userJson) {
            let currentUser = JSON.parse(userJson);
            let url = this.getBusinessPoliciesUrl + "?storeID=" + storeID;
            const httpOptions = {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + currentUser.access_token
                })
            };
            return this.http.get<string[]>(url, httpOptions).pipe(
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
    getListingLog(listingID: number): Observable<ListingLog[]> {
        const userJson = localStorage.getItem('currentUser');
        if (userJson) {
            let currentUser = JSON.parse(userJson);
            let url = this.getListingLogUrl + "?listingID=" + listingID;
            const httpOptions = {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + currentUser.access_token
                })
            };
            //let _options = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }).set('Authorization', currentUser.access_token) };
            return this.http.get<ListingLog[]>(url, httpOptions).pipe(
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

    /**
     * Use this as model.
     * @param error 
     */
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
        return observableThrowError(
            {
                "errMsg": errMsg,
                "errStatus": error.status
            });
    };
    isAdmin(): boolean {
        const userJson = localStorage.getItem('currentUser');
        if (userJson) {
            let currentUser = JSON.parse(userJson);
            if (currentUser) {
                if (currentUser.userName === 'ventures2018@gmail.com') {
                    return true;
                }
                return false;
            }
        }
        return false;
    }
    validateRequiredNumeric(c: AbstractControl) {
        if (c.value === null) {
            return { error: true };
        }
        if (c.value !== undefined) {
            const strLength: number = (<string>c.value).length;

            if (isNaN(c.value)) {
                return { error: true };
            } else {
                return null;    // control is valid
            }
        }
    }

}