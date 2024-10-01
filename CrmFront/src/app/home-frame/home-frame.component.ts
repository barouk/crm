import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-home-frame',
  templateUrl: './home-frame.component.html',
  styleUrls: ['./home-frame.component.css']
})
export class HomeFrameComponent {
  isChatOpen = false;
  email_verify = false
  private socket: WebSocket;
  private apiUrl = environment.socketUrl;
  public messagess: any = []
  formm: FormGroup = new FormGroup({
    message: new FormControl(''),
  })
  defer() {
    localStorage.removeItem('room_name');
    this.messagess=[]
    this.email_verify = false
    this.socket.close();
    this.openChat()
  }

  constructor(private formBuilder: FormBuilder) { }
  openChat() {
    const token = localStorage.getItem('room_name');
    if (token != null) {
      this.email_verify = true
      this.socket = new WebSocket(`ws://${this.apiUrl}/ws/chat/?email=${token}`);
      new Observable(observer => {
        this.socket.onmessage = (event) => observer.next(event.data);
        this.socket.onerror = (event) => observer.error(event);
        this.socket.onclose = () => observer.complete();
      }).subscribe(
        (message: any) => {
          console.log(message)
          let x = JSON.parse(message)
          if (x.hasOwnProperty('message') && x['message'] === 'defer') {
            this.defer()
          }
          if (x.hasOwnProperty('messages')) {
            for (var i = 0; i < x.messages.length; i++) {
              let y = { "user": x.messages[i].user, "message": x.messages[i].message }
              this.messagess = [...this.messagess, y]
            }
          }
        },
        (error) => { }
      )
    }
    this.isChatOpen = true;
  }
  closeChat() {
    this.isChatOpen = false;
  }

  send_message() {
    if (!this.email_verify) {
      this.socket = new WebSocket(`ws://${this.apiUrl}/ws/chat/?email=${this.formm.value.message}`);
      localStorage.setItem('room_name', this.formm.value.message);
      new Observable(observer => {
        this.socket.onmessage = (event) => observer.next(event.data);
        this.socket.onerror = (event) => observer.error(event);
        this.socket.onclose = () => observer.complete();
      }).subscribe(
        (message: any) => {
          console.log(message)
          let x = JSON.parse(message)
          if (x.hasOwnProperty('message') && x['message'] === 'defer') {
            this.defer()
          }
          if (x.hasOwnProperty('messages')) {
            for (var i = 0; i < x.messages.length; i++) {
              let y = { "user": x.messages[i].user, "message": x.messages[i].message }
              this.messagess = [...this.messagess, y]
            }
          }
        },
        (error) => { }
      )
      this.formm.reset()
      this.email_verify = true
    }
    this.socket.send(JSON.stringify({ "message": this.formm.value.message, }));
    this.formm.reset()
  }
}
