import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../_guards/index';
import { GammaComponent } from './gamma.component';

const gammaRoutes: Routes = [
    { path: '', component: GammaComponent, canActivate: [AuthGuard] }
    // ,
    // { path: 'xxx', loadChildren: () => import('../listing/listing.module').then(m => m.ListingdbModule), canActivate: [AuthGuard] }
];

@NgModule({
    imports: [RouterModule.forChild(gammaRoutes)],
    exports: [RouterModule]
})
export class GammaRoutingModule{}
