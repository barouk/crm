import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import {HttpClient} from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})
export class TicketsComponent implements OnInit{
  private socket: WebSocket;
  private wsUrl = environment.socketUrl;
  private apiUrl = environment.apiUrl;
  public ticket_list = []

  constructor(private httpClient: HttpClient,private message: NzMessageService,){}
  

  delete_ticket(email:string){
    return this.httpClient.post(`${this.apiUrl}/api/v1/chat/delete/ticket/`, {"email":email}).subscribe((res: any) => {
      
      this.socket.send(JSON.stringify({ "message": ""}));
      
      this.message.create('success', `با موفقیت بسته شد`);
    }, (error:any) => {
      this.message.create('error', `خطا در حذف`);
    });
    
   
  }

  ngOnInit(): void {
    
    this.socket = new WebSocket(`ws://${this.wsUrl}/ws/admin/list/`);
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
