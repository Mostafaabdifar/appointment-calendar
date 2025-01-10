import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentAlertComponent } from './appointment-alert.component';

describe('AppointmentAlertComponent', () => {
  let component: AppointmentAlertComponent;
  let fixture: ComponentFixture<AppointmentAlertComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppointmentAlertComponent]
    });
    fixture = TestBed.createComponent(AppointmentAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
