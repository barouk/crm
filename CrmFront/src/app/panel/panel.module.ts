import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { PanelComponent } from './panel.component';
import { PanelRoutingModule } from './panel-routing.module';
import { TicketsComponent } from './tickets/tickets.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { JwtInterceptor } from '../interceptors/jwt.interceptor';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { DetailTicketComponent } from './detail-ticket/detail-ticket.component';




@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        PanelRoutingModule,
        HttpClientModule
    ],

    providers: [
      {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    ],
    bootstrap: [PanelComponent],
  declarations: [PanelComponent],
  exports: [PanelComponent]
})
export class PanelModule { }
