import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailMessagesComponent } from './detail-messages.component';

describe('DetailMessagesComponent', () => {
  let component: DetailMessagesComponent;
  let fixture: ComponentFixture<DetailMessagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailMessagesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
