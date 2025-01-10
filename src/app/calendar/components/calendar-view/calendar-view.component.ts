import { ChangeDetectorRef, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppointmentFormComponent } from '../appointment-form/appointment-form.component';

@Component({
  selector: 'app-calendar-view',
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.scss'],
})
export class CalendarViewComponent {
  selectedMonth: Date = new Date();
  daysInMonth: Date[] = [];
  appointments: { [key: string]: any[] } = {};
  minDate: Date = new Date();

  constructor(private dialog: MatDialog, private cdr: ChangeDetectorRef) {
    this.updateCalendar();
  }

  onMonthChange() {
    this.updateCalendar();
  }

  updateCalendar() {
    if (!this.selectedMonth) return;
    const startOfMonth = new Date(
      this.selectedMonth.getFullYear(),
      this.selectedMonth.getMonth(),
      1
    );
    const endOfMonth = new Date(
      this.selectedMonth.getFullYear(),
      this.selectedMonth.getMonth() + 1,
      0
    );
    this.daysInMonth = [];

    for (let i = 0; i <= endOfMonth.getDate() - 1; i++) {
      const date = new Date(
        this.selectedMonth.getFullYear(),
        this.selectedMonth.getMonth(),
        i + 1
      );
      this.daysInMonth.push(date);
    }
  }

  isToday(day: Date): boolean {
    const today = new Date();
    return (
      today.getDate() === day.getDate() &&
      today.getMonth() === day.getMonth() &&
      today.getFullYear() === day.getFullYear()
    );
  }

  openAppointmentForm(day: Date) {
    const dialogRef = this.dialog.open(AppointmentFormComponent, {
      width: '400px',
      data: { selectedDate: day },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.addAppointment(result);
      }
    });
  }

  addAppointment(appointment: { title: string; date: string; time: string }) {
    const dateKey = new Date(appointment.date).toISOString();
    if (!this.appointments[dateKey]) {
      this.appointments[dateKey] = [];
    }
    this.appointments[dateKey].push(appointment);
    this.cdr.detectChanges();
  }

  hasAppointments(day: Date): boolean {
    const dateKey = day.toISOString();
    return this.appointments[dateKey] && this.appointments[dateKey].length > 0;
  }

  dateClass(date: Date): string {
    const today = new Date();
    return today.getDate() === date.getDate() &&
      today.getMonth() === date.getMonth() &&
      today.getFullYear() === date.getFullYear()
      ? 'highlight-today' // Example: apply a CSS class to today
      : '';
  }
}
