import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { PanelComponent } from './panel.component';
import { PanelRoutingModule } from './panel-routing.module';
import { TicketsComponent } from './tickets/tickets.component';




@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        PanelRoutingModule,
    ],
  declarations: [PanelComponent],
  exports: [PanelComponent]
})
export class PanelModule { }
