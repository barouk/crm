import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import { LoginComponent } from './login.component';


const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    children: [
      { path: '', component: LoginComponent }
    
    ]
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)],
  exports: [RouterModule]


})
export class LoginRoutingModule {
}
