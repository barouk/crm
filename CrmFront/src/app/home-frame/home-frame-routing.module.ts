import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import { HomeFrameComponent } from './home-frame.component';

const routes: Routes = [
  {
    path: '',
    component: HomeFrameComponent,
    children: [
      { path: '', component: HomeFrameComponent }
 
    ]
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)],
  exports: [RouterModule]


})
export class HomeFrameRoutingModule {
}
