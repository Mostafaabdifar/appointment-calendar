import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  public appointmentsSubject = new BehaviorSubject<{ [key: string]: any[] }>(
    {}
  );
  appointments$ = this.appointmentsSubject.asObservable();

  updateAppointments(dayKey: string, appointments: any[]) {
    this.appointmentsSubject.next({
      ...this.appointmentsSubject.value,
      [dayKey]: [...appointments],
    });
  }

  getAppointmentsForDay(dayKey: string): Observable<any[]> {
    return this.appointments$.pipe(
      map((appointments) => appointments[dayKey] || [])
    );
  }
}
