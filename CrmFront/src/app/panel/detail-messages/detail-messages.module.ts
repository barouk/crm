import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { DetailMessagesRoutingModule } from './detail-messages-routing.module';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { DetailMessagesComponent } from './detail-messages.component';




@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        DetailMessagesRoutingModule,
        NzMessageModule
    ],
  declarations: [DetailMessagesComponent],
  exports: [DetailMessagesComponent]
})
export class DetailMessagesModule { }
