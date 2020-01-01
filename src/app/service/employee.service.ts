import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Employee } from 'src/app/model/employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private firestore: AngularFirestore) { }

  // this method takes an employee object and
  // add a new employee to Firestore database collection
  addEmployee(employee: Employee) {
    // convert object of type Employee to JSON object
    // because Firestore understand JSON
    const employeeObject = {...employee};
    return this.firestore.collection('Employees').add(employeeObject);
  }

  // this method returns list of employees fetched from Firestore database collection
  getEmployees() {
    return this.firestore.collection('Employees').snapshotChanges();
  }

  // this method takes an employee object and
  // update an object of employee to the Firestore document
  updateEmployee(employee: Employee) {
    // convert object of type Employee to JSON object
    // because Firestore understand JSON
    const employeeObject = {...employee};
    this.firestore.doc('Employees/' + employee.id).update(employeeObject);
  }

  // this method takes an employee Id and
  // delete an employee document from the Firestore collection
  deleteEmployee(employeeId: string) {
    this.firestore.doc('Employees/' + employeeId).delete();
  }

}
