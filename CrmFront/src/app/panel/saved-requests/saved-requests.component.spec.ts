import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedRequestsComponent } from './saved-requests.component';

describe('SavedRequestsComponent', () => {
  let component: SavedRequestsComponent;
  let fixture: ComponentFixture<SavedRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SavedRequestsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SavedRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
