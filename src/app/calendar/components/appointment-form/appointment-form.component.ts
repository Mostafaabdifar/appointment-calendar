import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppointmentFormValues } from '../../model/appointment';

@Component({
  selector: 'app-appointment-form',
  templateUrl: './appointment-form.component.html',
  styleUrls: ['./appointment-form.component.scss'],
})
export class AppointmentFormComponent {
  @Output() appointmentCreated = new EventEmitter<AppointmentFormValues>();
  @Output() close = new EventEmitter<void>();

  appointmentForm: FormGroup;
  selectedDate: string | null;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AppointmentFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { selectedDate?: Date }
  ) {
    const initialDate = data.selectedDate
      ? data.selectedDate.toLocaleDateString()
      : '';
    this.selectedDate = initialDate;

    this.appointmentForm = this.fb.group({
      title: ['', Validators.required],
      date: [initialDate, Validators.required],
      time: ['', Validators.required],
    });
  }

  onDateChange(event: MatDatepickerInputEvent<Date>): void {
    this.selectedDate = event.value?.toLocaleDateString() || null;
  }

  onSubmit(): void {
    if (this.appointmentForm.valid) {
      const appointment = {
        ...this.appointmentForm.value,
        date: this.selectedDate || this.appointmentForm.value.date,
      };
      this.appointmentCreated.emit(appointment);
      this.dialogRef.close(appointment);
      this.appointmentForm.reset();
    }
  }

  closeForm(): void {
    this.dialogRef.close();
  }
}
