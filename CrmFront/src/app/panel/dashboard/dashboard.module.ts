import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { HighchartsChartModule } from "highcharts-angular";
import {  CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';




@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        DashboardRoutingModule,
        HighchartsChartModule
    ],
  declarations: [DashboardComponent],
  exports: [DashboardComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DashboardModule { }
