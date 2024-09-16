import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import { TicketsComponent } from './tickets.component';


const routes: Routes = [
  {
    path: '',
    component: TicketsComponent,
    children: [
      { path: '', component: TicketsComponent }
    
    ]
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)],
  exports: [RouterModule]


})
export class TicketsRoutingModule {
}
