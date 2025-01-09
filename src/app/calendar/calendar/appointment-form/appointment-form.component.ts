import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-appointment-form',
  templateUrl: './appointment-form.component.html',
  styleUrls: ['./appointment-form.component.scss'],
})
export class AppointmentFormComponent {
  @Output() appointmentCreated = new EventEmitter<{
    title: string;
    date: string;
    time: string;
  }>();
  @Output() close = new EventEmitter<void>();

  appointmentForm: FormGroup;
  selectedDate: string | null = null;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AppointmentFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.appointmentForm = this.fb.group({
      title: ['', Validators.required],
      date: [data.selectedDate ? data.selectedDate : '', Validators.required],
      time: ['', Validators.required],
    });

    this.selectedDate = data.selectedDate
      ? data.selectedDate.toLocaleDateString()
      : null;
  }

  onDateChange(event: MatDatepickerInputEvent<Date>) {
    const date = event.value;
    if (date) {
      const formattedDate = date.toLocaleDateString();
      this.selectedDate = formattedDate;
    }
  }
  onSubmit() {
    if (this.appointmentForm.valid) {
      const appointment = this.appointmentForm.value;
      appointment.date = this.selectedDate || appointment.date;
      this.appointmentCreated.emit(appointment);
      this.dialogRef.close(this.appointmentForm.value);
      this.appointmentForm.reset();
    }
  }

  closeForm() {
    this.dialogRef.close();
  }
}
