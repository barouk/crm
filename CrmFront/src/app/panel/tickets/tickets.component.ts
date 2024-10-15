import { Component, OnInit, OnDestroy } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})
export class TicketsComponent implements OnInit, OnDestroy {
  private socket: WebSocket;
  private apiUrl = environment.apiUrl;
  public ticket_list = [];
  private socketSubscription: Subscription;

  constructor(private httpClient: HttpClient, private message: NzMessageService, private router: Router) {
    this.initializeWebSocketConnection();
  }

  initializeWebSocketConnection() {
    // بررسی پروتکل و هاست به درستی و اضافه کردن پروتکل صحیح
    const wsProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const wsUrl = `${wsProtocol}://${environment.socketUrl}/ws/admin/list/`;  // ساخت آدرس بدون تکرار پروتکل

    this.socket = new WebSocket(wsUrl);

    this.socketSubscription = new Observable(observer => {
      this.socket.onmessage = (event) => observer.next(event.data);
      this.socket.onerror = (event) => observer.error(event);
      this.socket.onclose = () => observer.complete();
    }).subscribe(
      (message: any) => {
        let x = JSON.parse(message);
        this.ticket_list = x;
      },
      (error) => {},
    );
  }

  delete_ticket(email: string) {
    return this.httpClient.post(`${this.apiUrl}/api/v1/chat/delete/ticket/`, { "email": email }).subscribe(
      (res: any) => {
        this.socket.send(JSON.stringify({ "message": "" }));
        this.message.create('success', `با موفقیت بسته شد`);
      },
      (error: any) => {
        this.message.create('error', `خطا در حذف`);
      }
    );
  }

  ngOnInit(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnDestroy() {
    if (this.socket) {
      this.socket.close();
    }

    if (this.socketSubscription) {
      this.socketSubscription.unsubscribe();
    }
  }
}
