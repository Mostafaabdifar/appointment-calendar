import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { AppointmentFormValues } from '../../model/appointment';

@Component({
  selector: 'app-appointment-alert',
  templateUrl: './appointment-alert.component.html',
  styleUrls: ['./appointment-alert.component.scss'],
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
})
export class AppointmentAlertComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: AppointmentFormValues,
    private dialogRef: MatDialogRef<AppointmentAlertComponent>
  ) {}

  closeForm(): void {
    this.dialogRef.close();
  }
}
