import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApikeysComponent } from './apikeys.component';

const apikeysRoutes: Routes = [
    { path: '', component: ApikeysComponent }
];

@NgModule({
    imports: [RouterModule.forChild(apikeysRoutes)],
    exports: [RouterModule]
})
export class APIKeysRoutingModule{}
