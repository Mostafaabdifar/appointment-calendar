import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentFormComponent } from './components/appointment-form/appointment-form.component';
import { CalendarViewComponent } from './components/calendar-view/calendar-view.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { routes } from './calendar.routing.module';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [CalendarViewComponent, AppointmentFormComponent],
  imports: [
    CommonModule,
    DragDropModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MatButtonModule,
    MatToolbarModule,
    MatDialogModule,
    MatIconModule,
    FormsModule,
    RouterModule.forChild(routes),
  ],
})
export class CalendarModule {}
