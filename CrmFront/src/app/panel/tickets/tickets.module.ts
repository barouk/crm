import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { TicketsComponent } from './tickets.component';
import { TicketsRoutingModule } from './tickets-routing.module';





@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TicketsRoutingModule,
    ],
  declarations: [TicketsComponent],
  exports: [TicketsComponent]
})
export class TicketsModule { }
