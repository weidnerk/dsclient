import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../_guards/index';
import { ListingdbComponent } from './listing.component';

const listingRoutes: Routes = [
    { path: '', component: ListingdbComponent }
];

@NgModule({
    imports: [RouterModule.forChild(listingRoutes)],
    exports: [RouterModule]
})
export class ListingRoutingModule{}
