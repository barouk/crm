import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { NzMessageModule } from 'ng-zorro-antd/message';
import { SavedRequestsComponent } from './saved-requests.component';
import { SavedRequestsRoutingModule } from './saved-requests-routing.module';




@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SavedRequestsRoutingModule,
        NzMessageModule
    ],
  declarations: [SavedRequestsComponent],
  exports: [SavedRequestsComponent]
})
export class SavedRequestsModule { }
