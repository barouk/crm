import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})
export class TicketsComponent implements OnInit{
  private socket: WebSocket;
  private apiUrl = environment.socketUrl;
  public ticket_list = []

  constructor(){}
  

  delete_ticket(email:string){
    return this.http.post(`${this.apiUrl}${this.endpoint}`, value).pipe(
      tap((res: any) => {
        this.loggedIn.next(true);
        localStorage.setItem('refreshTokenDrs', res.refresh);
        localStorage.setItem('accessTokenDrs', res.access);
      })
    );
   
  }

  ngOnInit(): void {
    
    this.socket = new WebSocket(`ws://${this.apiUrl}/ws/admin/list/`);
    new Observable(observer => {
      this.socket.onmessage = (event) => observer.next(event.data);
      this.socket.onerror = (event) => observer.error(event);
      this.socket.onclose = () => observer.complete();
      }).subscribe( 
        (message :any) => {
          let x= JSON.parse(message)    
            this.ticket_list = x
        },
        (error) => {}
       )

  }

}
