import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersettingsComponent } from './usersettings.component';

const usersettingsRoutes: Routes = [
    { path: '', component: UsersettingsComponent }
];

@NgModule({
    imports: [RouterModule.forChild(usersettingsRoutes)],
    exports: [RouterModule]
})
export class UsersettingsRoutingModule{}
