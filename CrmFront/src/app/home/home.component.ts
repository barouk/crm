import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  isChatOpen = false;
  email_verify = false
  private socket: WebSocket;
  private apiUrl = environment.socketUrl;
  public messagess :any = []


  form: FormGroup = new FormGroup({
    message: new FormControl(''),
  })
  

  constructor(private formBuilder: FormBuilder,private cdr: ChangeDetectorRef){}

  openChat() {
   
    const token = localStorage.getItem('room_name');
    if (token != null){
      this.email_verify = true
      this.socket = new WebSocket(`ws://${this.apiUrl}/ws/chat/?email=${token}`);
      new Observable(observer => {
        this.socket.onmessage = (event) => observer.next(event.data);
        this.socket.onerror = (event) => observer.error(event);
        this.socket.onclose = () => observer.complete();
        }).subscribe( 
          (message :any) => {

            let x= JSON.parse(message)    
            for (var i = 0; i < x.messages.length; i++) {
              
              let y = {"user":x.messages[i].user , "message":x.messages[i].message }
              console.log("99999")
              this.messagess =[...this.messagess , y]
          }    

          },
          (error) => {}
         )
    }
    this.isChatOpen = true;
  }
  closeChat() {
    this.isChatOpen = false;
  }

  send_message() {
    if (! this.email_verify){
      this.socket = new WebSocket(`ws://${this.apiUrl}/ws/chat/?email=${this.form.value.message}`);
      localStorage.setItem('room_name', this.form.value.message);
      new Observable(observer => {
        this.socket.onmessage = (event) => observer.next(event.data);
        this.socket.onerror = (event) => observer.error(event);
        this.socket.onclose = () => observer.complete();
        }).subscribe( 
          (message :any) => {
            let x= JSON.parse(message)
            for (var i = 0; i < x.messages.length; i++) { 
              let y = {"user":x.messages[i].user , "message":x.messages[i].message }
              this.messagess =[...this.messagess , y]
          }    
          },
          (error) => {}
         )
         this.form.reset()
      console.log(this.form.value.message)
    }
  }
}
