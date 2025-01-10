import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { ChangeDetectorRef, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppointmentFormComponent } from '../appointment-form/appointment-form.component';
import { AppointmentAlertComponent } from '../appointment-alert/appointment-alert.component';
import { AppointmentFormValues } from '../../model/appointment';

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
  connectedDropLists: string[] = [];

  constructor(private dialog: MatDialog, private cdr: ChangeDetectorRef) {
    this.updateCalendar();
    this.connectedDropLists = this.daysInMonth.map((day) => day.toISOString());
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
    this.connectedDropLists = this.daysInMonth.map((day) => day.toISOString());
  }

  isToday(day: Date): boolean {
    const today = new Date();
    return (
      today.getDate() === day.getDate() &&
      today.getMonth() === day.getMonth() &&
      today.getFullYear() === day.getFullYear()
    );
  }

  onDrop(event: CdkDragDrop<any[]>, newDay: Date) {
    const newDayKey = newDay.toISOString();
    const previousDayKey = event.previousContainer.id;
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      const movedAppointment = event.container.data[event.currentIndex];
      movedAppointment.date = newDay.toLocaleDateString();

      this.appointments[previousDayKey] = [...event.previousContainer.data];
      this.appointments[newDayKey] = [...event.container.data];
    }
    this.cdr.detectChanges();
  }

  openAppointmentDialog(appointment: AppointmentFormValues): void {
    this.dialog.open(AppointmentAlertComponent, {
      data:appointment
    });
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

  isDayDisabled(day: Date): boolean {
    return day < this.minDate;
  }

  dateClass(date: Date): string {
    const today = new Date();
    return today.getDate() === date.getDate() &&
      today.getMonth() === date.getMonth() &&
      today.getFullYear() === date.getFullYear()
      ? 'highlight-today'
      : '';
  }
}
