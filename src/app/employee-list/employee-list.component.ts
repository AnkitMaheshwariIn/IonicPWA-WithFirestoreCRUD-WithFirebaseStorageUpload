import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../service/employee.service';
import { Employee } from '../model/employee.model';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss'],
})
export class EmployeeListComponent implements OnInit {

  // toggleUpdateBtn variable is used to show/hide update button
  toggleUpdateBtn = false;

  // toggleSearchBtn variable is used to
  // show/hide -> search and clear-search button
  toggleSearchBtn = true;

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
    this.getEmployees();
  }

  getEmployees() {
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
  // so that user can edit information and update to database
  editFunc(employee: Employee) {
    // set employee details to input fields
    this.employee = employee;
    // show update-button, and hide submit-button
    // so that user can change employee details
    this.toggleUpdateBtn = true;
  }

  // this method takes an employee object and
  // call searchEmployee() method from EmployeeService
  // employeeService.updateEmployee(employee) method
  // will evaluate search parameter and fetch results from
  // Firebase and return back that result will be displayed on screen
  searchEmployee(employee: Employee) {
    // we call searchEmployees(employee) from EmployeeService to get
    // list of employees matched with search params
    // we pass `employee` object which contains search params
    this.employeeService.searchEmployees(employee).subscribe(data => {
      // this.employees stores list of employee get from search result
      this.employees = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        } as Employee;
      });
    });
  }

  // this function will clear search result and fetch all employee
  clearSearch() {
    // 1. clear employees list
    this.employees = [];

    // 2. get all employee
    this.getEmployees();
  }

}
