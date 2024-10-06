import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup ,Validators } from '@angular/forms';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';

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
  public messagess: any = []

  form: FormGroup = this.formBuilder.group({
    "message":['', [Validators.required,Validators.email]]
  })


  defer() {
    localStorage.removeItem('room_name');
    this.messagess=[]
    this.email_verify = false
    this.socket.close();
    this.openChat()
  }

  constructor(private formBuilder: FormBuilder, private cdr: ChangeDetectorRef,private message: NzMessageService) { }

  openChat() {
    if (this.isChatOpen) {
      return
    }

    const token = localStorage.getItem('room_name');
    if (token != null ) {
      this.form = this.formBuilder.group({
        "message":['', Validators.required]
      })
      this.email_verify = true
      this.socket = new WebSocket(`ws://${this.apiUrl}/ws/chat/?email=${token}`);
      new Observable(observer => {
        this.socket.onmessage = (event) => observer.next(event.data);
        this.socket.onerror = (event) => observer.error(event);
        this.socket.onclose = () => observer.complete();
      }).subscribe(
        (message: any) => {         
          let x = JSON.parse(message)
          if (x.hasOwnProperty('message') && x['message']['message'] === 'defer') {
            this.defer()
          }
          if (x.hasOwnProperty('messages')) {
            for (var i = 0; i < x.messages.length; i++) {
              let y = { "user": x.messages[i].user, "message": x.messages[i].message , "timestamp": x.messages[i].timestamp }
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
    this.messagess = []
  }

  send_message() {
    if (!this.email_verify) {
      for (const i in this.form.controls) {
        if (this.form.controls.hasOwnProperty(i)) {
          this.form.controls[i].markAsDirty();
          this.form.controls[i].updateValueAndValidity();
        }
      }
      if (!this.form?.valid) {
        this.message.create('error', `ایمیل درست نیست`);
        return
      }

   
      this.socket = new WebSocket(`ws://${this.apiUrl}/ws/chat/?email=${this.form.value.message}`);
      localStorage.setItem('room_name', this.form.value.message);
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
              let y = { "user": x.messages[i].user, "message": x.messages[i].message,"timestamp": x.messages[i].timestamp }
              this.messagess = [...this.messagess, y]
            }
          }
        },
        (error) => { }
      )
      this.form = this.formBuilder.group({
        "message":['', Validators.required]
      })
      this.form.reset()
      this.email_verify = true


    }
    else{
    
      for (const i in this.form.controls) {
        if (this.form.controls.hasOwnProperty(i)) {
          this.form.controls[i].markAsDirty();
          this.form.controls[i].updateValueAndValidity();
        }
      }
      if (!this.form?.valid) {
        this.message.create('error', `لطفا پیامی وارد کنید`);
        return
      }
    this.socket.send(JSON.stringify({ "message": this.form.value.message, }));
    this.form.reset()


  }}
}
