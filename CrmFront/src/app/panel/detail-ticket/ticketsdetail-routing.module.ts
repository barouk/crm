import {NgModule, OnInit} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import { DetailTicketComponent } from './detail-ticket.component';


const routes: Routes = [
  
  {
    path: ':room/:chat_id',
    component: DetailTicketComponent,
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)],
  exports: [RouterModule]


})
export class TicketsDetailRoutingModule{
  

  
 
}
