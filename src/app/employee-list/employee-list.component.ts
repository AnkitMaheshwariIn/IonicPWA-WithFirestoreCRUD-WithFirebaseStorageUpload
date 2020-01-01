import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../service/employee.service';
import { Employee } from '../model/employee.model';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss'],
})
export class EmployeeListComponent implements OnInit {

  // toggleUpdateBtn variable is resposible for show/hide update button
  toggleUpdateBtn = false;

  // emplyee object - type: Employee
  employee: Employee = new Employee();

  // array of emplyee - type: Employee
  employees: Employee[];

  constructor(private employeeService: EmployeeService) { }

  // constructor will be called first and Oninit will be called later
  // after constructor method, when component is being initialized.
  ngOnInit() {
    // we added getEmployees() method in ngOnInit()
    // so that we get data to display over template - as soon as template loads.

    // we call getEmployees() from EmployeeService to get list of employees
    this.employeeService.getEmployees().subscribe(data => {
      // this.employees stores list of employee
      this.employees = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        } as Employee;
      });
    });
  }

  // this method takes an employee object and
  // call addEmployee() method from EmployeeService
  addEmployee(employee: Employee) {
    return this.employeeService.addEmployee(employee);
  }

  // this method takes an employee object and
  // call updateEmployee() method from EmployeeService
  updateEmployee(employee: Employee) {
    this.employeeService.updateEmployee(employee);
    // update done, hide update-button, and show submit-button
    this.toggleUpdateBtn = false;
    // also clear/reset this.employee object
    this.employee = new Employee();
  }

  // this method takes an employee Id and
  // call deleteEmployee() method from EmployeeService
  deleteEmployee(employeeId: string) {
    this.employeeService.deleteEmployee(employeeId);
  }

  // this method takes employee object and
  // set to local variable this.employee, also enable update-button
  updateFunc(employee: Employee) {
    // set employee details to input fields
    this.employee = employee;
    // show update-button, and hide submit-button
    // so that user can change employee details
    this.toggleUpdateBtn = true;
  }

}
