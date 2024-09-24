import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { DetailTicketComponent } from './detail-ticket.component';
import { TicketsDetailRoutingModule } from './ticketsdetail-routing.module';





@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TicketsDetailRoutingModule,
    ],
  declarations: [DetailTicketComponent],
  exports: [DetailTicketComponent]
})
export class TicketsDetailModule { }
