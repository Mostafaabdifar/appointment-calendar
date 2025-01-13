import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { routes } from './calendar.routing.module';
import { CalendarViewComponent } from './components/calendar-view/calendar-view.component';
import { AppointmentService } from './service/appointment.service';

@NgModule({
  declarations: [CalendarViewComponent],
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatToolbarModule,
    MatDialogModule,
    MatIconModule,
    FormsModule,
    MatInputModule,
    DragDropModule,
    RouterModule.forChild(routes),
  ],
  providers: [AppointmentService],
})
export class CalendarModule {}
