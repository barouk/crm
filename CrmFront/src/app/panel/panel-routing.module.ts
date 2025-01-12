import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import { PanelComponent } from './panel.component';

const routes: Routes = [
  {
    path: '',
    component: PanelComponent,
    children: [
      //{ path: '', component: PanelComponent },
      { path: 'tickets', loadChildren: () => import('./tickets/tickets.module').then(m => m.TicketsModule) },
      { path: 'ticket/detail', loadChildren: () => import('./detail-ticket/ticketsdetail.module').then(m => m.TicketsDetailModule) },
      { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) },
      { path: 'saved/tickets', loadChildren: () => import('./saved-requests/saved-requests.module').then(m => m.SavedRequestsModule) },
      { path: 'detail/message', loadChildren: () => import('./detail-messages/detail-messages.module').then(m =>m.DetailMessagesModule) },
      {path: '', pathMatch: 'full', redirectTo: 'dashboard'}
    ]
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)],
  exports: [RouterModule]


})
export class PanelRoutingModule {
}
