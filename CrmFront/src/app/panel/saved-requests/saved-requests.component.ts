import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-saved-requests',
  templateUrl: './saved-requests.component.html',
  styleUrls: ['./saved-requests.component.css']
})
export class SavedRequestsComponent implements OnInit{
  private apiUrl = environment.apiUrl;
   ticket_list = []

  constructor(private httpClient: HttpClient){}

  ngOnInit(): void {


    this.httpClient.get(`${this.apiUrl}/api/v1/chat/completed/ticket/`).subscribe((res: any) => {     
      this.ticket_list = res
   }, (error:any) => { 
   });
}


  

}
