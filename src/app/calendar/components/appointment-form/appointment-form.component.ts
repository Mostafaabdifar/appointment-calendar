import { Component, EventEmitter, Inject, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AppointmentFormValues } from '../../model/appointment';
import { AppointmentService } from '../../service/appointment.service';

@Component({
  selector: 'app-appointment-form',
  templateUrl: './appointment-form.component.html',
  styleUrls: ['./appointment-form.component.scss'],
  standalone: true,
  imports: [
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
  ],
  providers: [AppointmentService],
})
export class AppointmentFormComponent {
  @Output() appointmentCreated = new EventEmitter<AppointmentFormValues>();
  @Output() appointmentUpdated = new EventEmitter<AppointmentFormValues>();
  @Output() close = new EventEmitter<void>();

  appointmentForm: FormGroup;
  selectedDate: string | null;
  submitButtonLabel: string = 'Save';

  constructor(
    private appointmentService: AppointmentService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AppointmentFormComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { appointment?: any; selectedDate?: Date }
  ) {
    const initialDate = data.selectedDate
      ? data.selectedDate.toLocaleDateString()
      : '';
    this.submitButtonLabel = data.appointment ? 'Update' : 'Save';
    this.selectedDate = initialDate;

    this.appointmentForm = this.fb.group({
      title: [data?.appointment?.title || '', Validators.required],
      date: [initialDate, Validators.required],
      time: [data?.appointment?.time || '', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.appointmentForm.valid) {
      const appointment = { ...this.appointmentForm.value };
      const dateKey = new Date(appointment.date).toISOString();
      let currentAppointments =
        this.appointmentService.appointmentsSubject.value[dateKey] || [];

      currentAppointments = this.data.appointment
        ? currentAppointments.map((item) =>
            item === this.data.appointment ? appointment : item
          )
        : [...currentAppointments, appointment];
      this.appointmentService.updateAppointments(dateKey, currentAppointments);
      this.dialogRef.close();
    }
  }

  closeForm(): void {
    this.dialogRef.close();
  }
}
