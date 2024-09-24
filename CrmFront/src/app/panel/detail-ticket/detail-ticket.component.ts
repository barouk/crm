import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';


@Component({
  selector: 'app-detail-ticket',
  templateUrl: './detail-ticket.component.html',
  styleUrls: ['./detail-ticket.component.css']
})
export class DetailTicketComponent implements OnInit {
  constructor(private fb: FormBuilder, private route: ActivatedRoute,){}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.sysId = params.id;
    });
  }





}
