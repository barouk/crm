import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { environment } from 'src/environments/environment';




@Component({
  selector: 'app-detail-messages',
  templateUrl: './detail-messages.component.html',
  styleUrls: ['./detail-messages.component.css']
})
export class DetailMessagesComponent implements OnInit{
  id = ''
  private apiUrl = environment.apiUrl;
  messages = []

  constructor(private route: ActivatedRoute,private httpClient: HttpClient){}
  ngOnInit(): void {

    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
    });
    console.log(this.id)


    this.httpClient.get(`${this.apiUrl}/api/v1/chat/completed/ticket/${this.id}/`).subscribe((res: any) => {     

      this.messages= res.messages
   }, (error:any) => { 
   });



  }


}
