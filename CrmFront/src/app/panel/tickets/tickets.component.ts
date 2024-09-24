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
