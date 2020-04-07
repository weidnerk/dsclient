import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { ChangepasswordComponent } from './changepassword/changepassword.component';
import { PasswordresetComponent } from './passwordreset/passwordreset.component';
import { ApikeysComponent } from './apikeys/apikeys.component';
import { ScanhistoryComponent } from './scanhistory/scanhistory.component';
import { ResearchComponent } from './research/cr.component';
import { TimesSoldComponent } from './timessold/timessold.component';
import { AuthGuard } from './_guards/index';
import { Dashboardv2Component } from './dashboard-v2/dashboard.component';
import { DefaultComponent } from './layouts/default/default.component';

const routes: Routes = [
    {
        path: '',
        component: DefaultComponent,
        children: [{
            path: '',
            component: DashboardComponent,
            canActivate: [AuthGuard]
        },
        {
            path: 'dashboardv2',
            component: Dashboardv2Component,
            canActivate: [AuthGuard]
        },
        {
            path: 'scanhistory',
            component: ScanhistoryComponent,
            canActivate: [AuthGuard]
        },
        {
            path: 'gamma',
            loadChildren: () => import('./_modules/gamma/gamma.module').then(m => m.GammaModule),
            canActivate: [AuthGuard]
        },
        {
            path: 'research',
            component: ResearchComponent,
            canActivate: [AuthGuard]
        },
        {
            path: 'listingdetaildb/:listingID',
            loadChildren: () => import('./_modules/listing/listing.module').then(m => m.ListingdbModule),
            canActivate: [AuthGuard]
        },
        {
            path: 'apikeys',
            component: ApikeysComponent,
            canActivate: [AuthGuard]
        },
        { path: 'scanseller', component: TimesSoldComponent, canActivate: [AuthGuard] }
    ]
    },
    { path: 'login', component: LoginComponent },
    {
        path: 'register',
        component: RegisterComponent
    }
];
/*
const appRoutes: Routes = [
  { path: '', component: DefaultComponent, canActivate: [AuthGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'dashboardv2', component: Dashboardv2Component, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgotpassword', component: ForgotpasswordComponent },
  { path: 'changepassword', component: ChangepasswordComponent, canActivate: [AuthGuard] },
  { path: 'passwordreset', component: PasswordresetComponent },
  { path: 'apikeys', component: ApikeysComponent, canActivate: [AuthGuard] },
  { path: 'scanhistory', component: ScanhistoryComponent, canActivate: [AuthGuard] },
  // { path: 'listingdetaildb/:itemId/:rptNumber/:qtySold', loadChildren: () => import('./listing/listing.module').then(m => m.ListingdbModule), canActivate: [AuthGuard] },
  { path: 'listingdetaildb/:listingID', loadChildren: () => import('./_modules/listing/listing.module').then(m => m.ListingdbModule), canActivate: [AuthGuard] },
  { path: 'listings', component: ListingsComponent, canActivate: [AuthGuard] },
  { path: 'research', component: ResearchComponent, canActivate: [AuthGuard] },
  { path: 'gamma', loadChildren: () => import('./_modules/gamma/gamma.module').then(m => m.GammaModule), canActivate: [AuthGuard] },
  { path: 'scanseller', component: TimesSoldComponent, canActivate: [AuthGuard] }
  
  // Need to understand why this is needed before using it - review codevolution video
  // otherwise redirect to home
  // { path: '**', redirectTo: '' }
  // { path: '', redirectTo: '/', pathMatch: 'full' }
];
*/
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
