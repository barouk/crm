import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailTicketComponent } from './detail-ticket.component';

describe('DetailTicketComponent', () => {
  let component: DetailTicketComponent;
  let fixture: ComponentFixture<DetailTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailTicketComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
