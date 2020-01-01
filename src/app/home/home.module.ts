import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { EmployeeListComponent } from '../employee-list/employee-list.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      },
      {
        path: 'employees',
        component: EmployeeListComponent
      }
    ])
  ],
  declarations: [
    HomePage,
    EmployeeListComponent
  ]
})
export class HomePageModule {}
