
import {throwError as observableThrowError, Observable ,  BehaviorSubject } from 'rxjs';
/*
Modeled after gititems.service.ts which came from

*/
import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEventType, HttpEvent, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import {catchError} from 'rxjs/internal/operators';

import { TimesSold, ModelViewTimesSold } from '../_models/orderhistory';
import { environment } from '../../environments/environment';

@Injectable()
export class RenderingService {

    //private getDisplayOrdersUrl: string = environment.API_ENDPOINT + 'orders';
    private getTimesSoldsUrl: string = environment.API_ENDPOINT + 'getreport';
    private getFillMatchUrl: string = environment.API_ENDPOINT + 'fillmatch';

    constructor(private http: HttpClient) { }

    renderTimesSold(
        rptNumber: number, 
        minSold: number, 
        daysBack: number, 
        minPrice: number | null, 
        maxPrice: number | null,
        activeStatusOnly: boolean,
        isSellerVariation: boolean | null,
        itemID: string | null,
        filter: number,
        storeID: number | null,
        isSupplierVariation: boolean | null,
        priceDelta: boolean | null,
        excludeListed: boolean | null,
        excludeFreight: boolean | null): Observable<ModelViewTimesSold> {
        let url = `${this.getTimesSoldsUrl}/${rptNumber}/${minSold}/${daysBack}/${minPrice}/${maxPrice}/${activeStatusOnly}/${isSellerVariation}/${itemID}/${filter}/${storeID}/${isSupplierVariation}/${priceDelta}/${excludeListed}/${excludeFreight}`;
        const userJson = localStorage.getItem('currentUser');
        if (userJson) {
            let currentUser = JSON.parse(userJson);
            const httpOptions = {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + currentUser.access_token
                })
            }; return this.http.get<ModelViewTimesSold>(url, httpOptions).pipe(
                //.map(this.extractData)
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
     * @param rptNumber 
     * @param minSold 
     * @param daysBack 
     * @param minPrice 
     * @param maxPrice 
     * @param activeStatusOnly 
     * @param nonVariation 
     * @param itemID 
     */
    fillMatch(rptNumber: number, 
        minSold: number, 
        daysBack: number, 
        minPrice: number | null, 
        maxPrice: number | null,
        activeStatusOnly: boolean,
        isSellerVariation: boolean,
        itemID: string | null,
        storeID: number): Observable<ModelViewTimesSold> {
        let url = `${this.getFillMatchUrl}/${rptNumber}/${minSold}/${daysBack}/${minPrice}/${maxPrice}/${activeStatusOnly}/${isSellerVariation}/${itemID}/${storeID}`;
        const userJson = localStorage.getItem('currentUser');
        if (userJson) {
            let currentUser = JSON.parse(userJson);
            const httpOptions = {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + currentUser.access_token
                })
            }; return this.http.get<ModelViewTimesSold>(url, httpOptions).pipe(
                //.map(this.extractData)
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
                errMsg = ' ' + error.message;
            }
            if (error.error) {
                errMsg = ' ' + error.error;
            }
            if (error.error && error.error.Message) {
                errMsg = ' ' + error.error.Message;
            }
            errMsg += ' ' + errDetail;
        }
        return observableThrowError(
            {
                "errMsg": errMsg,
                "errStatus": error.status
            });
    }
}
