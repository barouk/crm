import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ChangeDetectorRef } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  isChatOpen = false;
  email_verify = false;
  private socket: WebSocket;
  private apiUrl = environment.socketUrl;
  public messagess: any[] = [];

  form: FormGroup = this.formBuilder.group({
    "message": ['', [Validators.required, Validators.email]]
  });

  constructor(
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private message: NzMessageService,
    private cookieService: CookieService // اضافه کردن CookieService
  ) {}

  private createWebSocket(email: string): Observable<any> {
    this.socket = new WebSocket(`ws://${this.apiUrl}/ws/chat/?email=${email}`);
    return new Observable(observer => {
      this.socket.onmessage = (event) => observer.next(event.data);
      this.socket.onerror = (event) => observer.error(event);
      this.socket.onclose = () => observer.complete();
    });
  }

  private handleMessage(message: any): void {
    const parsedMessage = JSON.parse(message);
    if (parsedMessage.message?.message === 'defer') {
      this.defer();
    }
    if (parsedMessage.messages) {
      parsedMessage.messages.forEach((msg: any) => {
        this.messagess.push({
          user: msg.user,
          message: msg.message,
          timestamp: msg.timestamp
        });
      });
    }
  }

  private resetForm(validators: any[]): void {
    this.form = this.formBuilder.group({
      "message": ['', validators]
    });
    this.form.reset();
  }

  private markFormControlsAsDirty(): void {
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.controls[key];
      control.markAsDirty();
      control.updateValueAndValidity();
    });
  }

  defer(): void {
    this.cookieService.delete('room_name'); 
    this.messagess = [];
    this.email_verify = false;
    this.socket?.close();
    this.openChat();
  }

  openChat(): void {
    if (this.isChatOpen) return;

    const token = this.cookieService.get('room_name'); 
    if (token) {
      this.resetForm([Validators.required]);
      this.email_verify = true;
      this.createWebSocket(token).subscribe(
        (message) => this.handleMessage(message),
        () => {},
      );
    }
    this.isChatOpen = true;
  }

  closeChat(): void {
    this.isChatOpen = false;
    this.messagess = [];
  }

  send_message(): void {
    if (!this.email_verify) {
      this.markFormControlsAsDirty();
      if (!this.form.valid) {
        this.message.create('error', `ایمیل درست نیست`);
        return;
      }
      const email = this.form.value.message;
      const expirationMinutes = 60; 
      const expirationDate = new Date(new Date().getTime() + expirationMinutes * 60 * 1000); 
      this.cookieService.set('room_name', email, expirationDate); 
      this.createWebSocket(email).subscribe(
        (message) => this.handleMessage(message),
        () => {}
      );
      this.resetForm([Validators.required]);
      this.email_verify = true;
    } else {
      this.markFormControlsAsDirty();
      if (!this.form.valid) {
        this.message.create('error', `لطفا پیامی وارد کنید`);
        return;
      }

      
      const expirationMinutes = 60; 
      const expirationDate = new Date(new Date().getTime() + expirationMinutes * 60 * 1000); 
      const email = this.cookieService.get('room_name'); 
      this.cookieService.set('room_name', email, expirationDate); 

      this.socket.send(JSON.stringify({ message: this.form.value.message }));
      this.form.reset();
    }
  }
}
