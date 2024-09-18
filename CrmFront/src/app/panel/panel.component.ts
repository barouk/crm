import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {Router} from '@angular/router';


@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})
export class PanelComponent implements OnInit {
  private apiUrl = environment.apiUrl;
  form: FormGroup = new FormGroup({});
  public username :any;
  constructor(private fb: FormBuilder, private http: HttpClient,private router: Router){}

  ngOnInit(): void {
      this.http.get(`${this.apiUrl}/api/v1/aaa/profile/`).subscribe( (response:any) => {
         

          this.username =  response.username
          console.log("dddddddddddddddddddddddddddddddd")
        }, error => {
          console.log(error)
          //this.message.create(error, `نام کاربری یا رمز عبور اشتباه است`);
        });
    



  }
}
