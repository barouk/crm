import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';

import { SavedRequestsComponent } from './saved-requests.component';


const routes: Routes = [
  {
    path: '',
    component: SavedRequestsComponent,
    children: [
      { path: '', component: SavedRequestsComponent }
    
    ]
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)],
  exports: [RouterModule]


})
export class SavedRequestsRoutingModule {
}
