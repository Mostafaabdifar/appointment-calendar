import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { AppointmentFormValues } from '../../model/appointment';
import { AppointmentService } from '../../service/appointment.service';
import { AppointmentAlertComponent } from '../appointment-alert/appointment-alert.component';
import { AppointmentFormComponent } from '../appointment-form/appointment-form.component';

@Component({
  selector: 'app-calendar-view',
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.scss'],
})
export class CalendarViewComponent implements OnInit, OnDestroy {
  selectedMonth: Date = new Date();
  daysInMonth: Date[] = [];
  appointments: { [key: string]: any[] } = {};
  minDate: Date = new Date();
  connectedDropLists: string[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private appointmentService: AppointmentService
  ) {
    this.updateCalendar();
    this.connectedDropLists = this.daysInMonth.map((day) => day.toISOString());
  }

  ngOnInit() {
    this.appointmentService.appointments$
      .pipe(takeUntil(this.destroy$))
      .subscribe((appointments) => {
        this.appointments = appointments;
        this.cdr.detectChanges();
      });
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

    if (event.previousContainer !== event.container) {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }

    event.container.data[event.currentIndex].date = newDay.toLocaleDateString();

    this.appointmentService.updateAppointments(
      previousDayKey,
      event.previousContainer.data
    );
    this.appointmentService.updateAppointments(newDayKey, event.container.data);
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
  }

  updateAppointment(day: Date, oldAppointment: any, updatedAppointment: any) {
    const dateKey = day.toISOString();
    const appointmentIndex =
      this.appointments[dateKey]?.indexOf(oldAppointment);

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

  dateClass = (date: Date): string => {
    return this.isToday(date) ? 'highlight-today' : '';
  };

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
