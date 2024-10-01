import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HomeFrameComponent } from './home-frame.component';
import { HomeFrameRoutingModule } from './home-frame-routing.module';
import { BrowserModule } from '@angular/platform-browser';



@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HomeFrameRoutingModule,
    ],
  declarations: [HomeFrameComponent],
  exports: [HomeFrameComponent]
})
export class HomeFrameModule { }
