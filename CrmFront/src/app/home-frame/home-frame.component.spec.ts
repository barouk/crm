import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeFrameComponent } from './home-frame.component';

describe('HomeFrameComponent', () => {
  let component: HomeFrameComponent;
  let fixture: ComponentFixture<HomeFrameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeFrameComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
