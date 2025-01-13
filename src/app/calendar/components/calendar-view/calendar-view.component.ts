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

    const year = this.selectedMonth.getFullYear();
    const month = this.selectedMonth.getMonth();
    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 0);
    this.daysInMonth = Array.from(
      { length: endOfMonth.getDate() },
      (_, i) => new Date(year, month, i + 1)
    );

    this.connectedDropLists = this.daysInMonth.map((day) => day.toISOString());
  }

  isToday(day: Date): boolean {
    const today = new Date();
    return today.toDateString() === day.toDateString();
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
    this.dialog.open(AppointmentAlertComponent, { data: appointment });
  }

  openAppointmentForm(day: Date) {
    const dialogRef = this.dialog.open(AppointmentFormComponent, {
      width: '400px',
      data: { selectedDate: day },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.addAppointment(result);
    });
  }

  addAppointment({
    title,
    date,
    time,
  }: {
    title: string;
    date: string;
    time: string;
  }) {
    const dateKey = new Date(date).toISOString();
    this.appointments[dateKey] = this.appointments[dateKey] || [];
    this.appointments[dateKey].push({ title, date, time });
    this.cdr.detectChanges();
  }

  deleteAppointment(day: Date, appointment: any): void {
    const dateKey = day.toISOString();
    const appointmentIndex = this.appointments[dateKey]?.indexOf(appointment);
    if (appointmentIndex !== -1) {
      this.appointments[dateKey].splice(appointmentIndex, 1);
    }
    this.cdr.detectChanges();
  }

  editAppointment(day: Date, appointment: any): void {
    const dialogRef = this.dialog.open(AppointmentFormComponent, {
      width: '400px',
      data: { appointment, selectedDate: day },
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.updateAppointment(day, appointment, result);
      }
    });
    // const dateKey = day.toISOString();
    // const appointmentIndex = this.appointments[dateKey]?.indexOf(appointment);

    // if (appointmentIndex !== -1) {
    //   const updatedTitle = prompt('Edit Title', appointment.title);
    //   const updatedTime = prompt('Edit Time (HH:MM)', appointment.time);

    //   if (updatedTitle && updatedTime) {
    //     this.appointments[dateKey][appointmentIndex] = {
    //       ...appointment,
    //       title: updatedTitle,
    //       time: updatedTime,
    //     };
    //     this.cdr.detectChanges();
    //   }
    // }
  }

  updateAppointment(day: Date, oldAppointment: any, updatedAppointment: any) {
    const dateKey = day.toISOString();
    const appointmentIndex = this.appointments[dateKey]?.indexOf(oldAppointment);
  
    if (appointmentIndex !== -1) {
      this.appointments[dateKey][appointmentIndex] = updatedAppointment;
      this.cdr.detectChanges();
    }
  }

  hasAppointments(day: Date): boolean {
    return (this.appointments[day.toISOString()]?.length || 0) > 0;
  }

  isDayDisabled(day: Date): boolean {
    return day < this.minDate;
  }

  dateClass(date: Date): string {
    return this.isToday(date) ? 'highlight-today' : '';
  }
}
