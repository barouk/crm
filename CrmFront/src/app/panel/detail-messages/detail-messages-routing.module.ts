import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import { DetailMessagesComponent } from './detail-messages.component';


const routes: Routes = [
  {
    path: ':id',
    component: DetailMessagesComponent,
    children: [
      { path: '', component: DetailMessagesComponent }
    
    ]
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)],
  exports: [RouterModule]


})
export class DetailMessagesRoutingModule {
}
