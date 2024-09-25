import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-detail-ticket',
  templateUrl: './detail-ticket.component.html',
  styleUrls: ['./detail-ticket.component.css']
})
export class DetailTicketComponent implements OnInit {
  room = ""
  chat_id = ""
  private socket: WebSocket;
  private apiUrl = environment.socketUrl;
  public messagess :any = []
  form: FormGroup = new FormGroup({
    message: new FormControl(''),
  })
  
  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute,){}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.room = params['chat_id'];
    });
    this.route.params.subscribe((params: Params) => {
      this.room = params['room'];
    });

    

    this.socket = new WebSocket(`ws://${this.apiUrl}/ws/admin/chat/?email=${this.room}`);
    new Observable(observer => {
      this.socket.onmessage = (event) => observer.next(event.data);
      this.socket.onerror = (event) => observer.error(event);
      this.socket.onclose = () => observer.complete();
      }).subscribe( 
        (message :any) => {
          let x= JSON.parse(message)    
          console.log(x)
          for (var i = 0; i < x.messages.length; i++) {
            
            let y = {"user":x.messages[i].user , "message":x.messages[i].message }
            this.messagess =[...this.messagess , y]
        }    

        },
        (error) => {}
       )
  }


  send_message() {
    console.log(this.form.value)
    this.socket.send(JSON.stringify({ "message": this.form.value.message, }));
    this.form.reset()
  }
}
