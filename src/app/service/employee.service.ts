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
    // covert date string to date object
    employee.joinDateTimestamp = new Date(employee.joinDate);
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
    // covert date string to date object
    employee.joinDateTimestamp = new Date(employee.joinDate);
    // add date when last time updated
    employee.lastUpdated = new Date();
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

  // this method takes an employee object and
  // we takes parameter from this employee object to
  // pass to firebase query, so that we get desired search results
  // later this method returns list of employees fetched from
  // Firestore Query
  searchEmployees(employee: Employee) {
    /*  #A) one way of applying search query:
        In case when we have `single` where statement to search.
        this query will result list of employee matched with
        given employee.name parameter
    */
    // 👇 un-comment this code to use single-query👇
    // return this.firestore.collection(
    //   'Employees', ref => ref.where('name', '==', employee.name)).snapshotChanges();

    /* #B) second way of applying search query:
        In case when we have `multiple` where statement to search.
        this query will result list of employee matched with
        all given parameters:
        #1. Query for `multiple` where statement.
        #2. Query for range '>=' operators.
        #3. Query order by `ascending`.
        #4. Query order by `descending` by date or strings.
        #5. Apply limit to Query result.
        #6. Offset by a property, suppose we want employee whose
            name starts with `An` then apply startAt('An')
    */

    /*
      After applying these query you may face this error:
      "ERROR FirebaseError: The query requires an index. You can create it here: URL"

      You will get above error with an URL - Click over that URL - Login in Firebase
      and this will prompt to Create an Index which is required in Firebase 
      to apply queries to Database Collection.
    */
    return this.firestore.collection(
      'Employees', ref => {
        // declare var `query` of type either `CollectionReference` or `Query`
        let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;

        // 👇 the below conditions will be applied to query
        // 👇 only when params have value in given `employee` object.

        // where condition to match employee with given phone
        if (employee.phone) {
          query = query.where('phone', '==', employee.phone);
        }
        // where condition to match employee with given salary
        if (employee.salary) {
          // #2. Get items by range '>=' operators, this query
          // will return the employee whose salary is
          // greater than or equal to given `employee.salary`
          query = query.where('salary', '>=', employee.salary);
        }
        // where condition to match employee with given designation
        if (employee.designation) {
          query = query.where('designation', '==', employee.designation);
        }
        // where condition to match employee with given joinDate
        if (employee.joinDate) {
          // covert date string to date object
          employee.joinDateTimestamp = new Date(employee.joinDate);
          query = query.where('joinDateTimestamp', '==', employee.joinDateTimestamp);
        }

        /* #3 also apply query to salary order by `ascending`. */
        // query = query.orderBy('salary', 'asc');

        /* #4 apply query to joinDateTimestamp order by `descending`. */
        // query = query.orderBy('joinDateTimestamp', 'desc');

        /* #5. Apply limit to Query result.
           default order by is ascending (when we not pass second param to orderBy)
           this query will return only 2 employees
        */
        // query = query.orderBy('designation').limit(2);

        /* IMPORTANT: Reason I put this query at last because
         * We can not call Query.startAt() or Query.startAfter()
         * before calling Query.orderBy().
        */

        // where condition to match employee with given name
        if (employee.name) {
          /* look: orderBy and equality '==' cannot apply together.
              that is the reason I comment this equality
          */
          // query = query.where('name', '==', employee.name);

          // #6. Offset by a property, suppose we want employee whose
          // name starts with `An` then apply startAt('An')
          query = query.orderBy('name', 'asc').startAt('An');

          /* similar query `endAt`, `startAfter` and `endBefore`
              can be applied like this:
          */
          // query = query.endAt('An');
          // query = query.startAfter('An');
          // query = query.endBefore('An');
        }

        // finally return query back to the collection second argument.
        return query;
    }).snapshotChanges();
  }


  anyfunc() {
    // Firestore Collection name: 'Employees'

    // Order ascending
    this.firestore.collection('Employees', ref => ref.orderBy('age'));

    // Order descending by numbers or strings
    this.firestore.collection('Employees', ref => ref.orderBy('age', 'desc'));
    this.firestore.collection('Employees', ref => ref.orderBy('name', 'desc')); // reverse alphabetical

    // Limit results
    this.firestore.collection('Employees', ref => ref.orderBy('age').limit(5));

    // Offset by a property
    this.firestore.collection('Employees', ref => ref.orderBy('name').startAt('An'));

    // Get items by equality to a property
    this.firestore.collection('Employees', ref => ref.where('name', '==', 'Ankit'));

    // Get items by range operators
    this.firestore.collection('Employees', ref => ref.where('age', '>=', 5));

    // Chain equality for multiple properties
    this.firestore.collection('Employees', ref => ref.where('age', '==', 5) .where('name', '==', 'Ankit'));
  }

}
