import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ScanhistoryComponent } from './scanhistory/scanhistory.component';
import { ResearchComponent } from './research/cr.component';
import { TimesSoldComponent } from './timessold/timessold.component';
import { AuthGuard } from './_guards/index';
import { Dashboardv2Component } from './dashboard-v2/dashboard.component';
import { DefaultComponent } from './layouts/default/default.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';

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
            path: 'gamma/:listed',
            loadChildren: () => import('./_modules/gamma/gamma.module').then(m => m.GammaModule),
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
            loadChildren: () => import('./_modules/apikeys/apikeys.module').then(m => m.ApikeysModule),
            canActivate: [AuthGuard]
        },
        {
            path: 'usersettings',
            loadChildren: () => import('./_modules/usersettings/usersettings.module').then(m => m.UsersettingsModule),
            canActivate: [AuthGuard]
        },
        { path: 'scanseller', 
            component: TimesSoldComponent, 
            canActivate: [AuthGuard] 
        },
        { path: 'forgotpassword', 
            component: ForgotpasswordComponent
        }
    ]
    },
    { path: 'login', component: LoginComponent },
    {
        path: 'register',
        component: RegisterComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
