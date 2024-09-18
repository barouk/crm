import { Component,OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {Router} from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from '../interceptors/login-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  form: FormGroup = new FormGroup({});
  constructor(private fb: FormBuilder, private http: HttpClient,private router: Router,private message: NzMessageService,private login: AuthService) {
   
  }
  
  ngOnInit(): void {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required]]
    });
  }



  onSubmit(): void {
    if (this.form.valid) {
       this.login.SignInApp1(this.form.value).subscribe(
      (res: any) => {
        console.log("dd")
        this.router.navigate(['/panel/']);
      }
    );
    } else {
      console.error('Form is invalid');
    }
  }

}
