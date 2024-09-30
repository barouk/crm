import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { environment } from 'src/environments/environment';

import * as Highcharts from "highcharts";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private apiUrl = environment.apiUrl;
  admin_count = 0
  pendding_count = 0 
  completed_count = 0 
  dates=[]


  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {
    title: {
      text: "وضعیت رسیدگی به تیکت ها "
    },
    xAxis: {
      categories: this.dates
    },
    yAxis: {
      title: {
        text: "Visitors"
      }
    },
    series: [
      {
        name:"",
        type: "spline",
        data: []
      }
     
    ]
  };
  


  constructor(private httpClient: HttpClient){}
  ngOnInit(): void {  
  
    this.httpClient.get(`${this.apiUrl}/api/v1/chat/info/`).subscribe((res: any) => {     
       this.admin_count = res.admin_count 
       this.pendding_count = res.pendding_count
       this.completed_count = res.completed_count
    
       this.chartOptions = {
        title: {
          text: "وضعیت رسیدگی به تیکت ها "
        },
        xAxis: {
          categories: res.dates
        },
        yAxis: {
          title: {
            text: "Visitors"
          }
        },
        series: [
          {
            name:"",
            type: "spline",
            data:res.nums
          }
         
        ]
      };

    }, (error:any) => { 
    });
}

}