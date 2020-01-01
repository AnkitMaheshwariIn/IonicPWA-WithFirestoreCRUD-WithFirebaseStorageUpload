import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { Plugins } from '@capacitor/core';

import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { Observable, Subscription, Subject } from 'rxjs';
import { map, finalize } from 'rxjs/operators';

const { Geolocation, Clipboard } = Plugins;
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit, OnDestroy {
  requestToken: string = undefined;
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  uploadProgress: Observable<number>;
  downloadURL: Observable<string>;
  uploadState: Observable<string>;

  // create an 'Observable', variable name: 'observableNumber'
  observableNumber$: Observable<number>;
  // create another variable 'latestValue'
  // this variable will store the most updated value
  latestValue: number;
  // create a variable to store subscription
  subscriptionToObservableNumber: Subscription;
  // declare unsubscribe$
  unsubscribe$: Subject<void> = new Subject<void>();

  constructor(
    private afMessaging: AngularFireMessaging,
    private afStorage: AngularFireStorage) {}

  ngOnInit() {
    // create an Observable
    this.observableNumber$ = Observable.create(observer => {
      // initialize value of temp variable 'val' with 0
      let val = 0;
      const interval = setInterval(() => {
        // observer.next will announce the change made in 'val
        // by 'observableNumber'
        observer.next(val);
        // increment value of 'val' after every 1 sec
        val++;
      }, 1000);
      return () => clearInterval(interval);
    });

    this.observableNumber$
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(value => {
      this.latestValue = value;
    });

    // subscribe to an Observable
    // make sure to save a reference to subscription to
    // be able to unsubscribe later
    this.subscriptionToObservableNumber = this.observableNumber$.subscribe(value => {
      // this subscription make sure to have latest value always
      this.latestValue = value;
    });

    // create an Observable
    this.observableNumber$ = Observable.create(observer => {
      // initialize value of temp variable 'val' with 0
      let val = 0;
      const interval = setInterval(() => {
        // observer.next will announce the change made in 'val
        // by 'observableNumber'
        observer.next(val);
        // increment value of 'val' after every 1 sec
        val++;
      }, 1000);
      return () => clearInterval(interval);
    });
  }

  ngOnDestroy() {
    // Unsubscribe when the component is destroyed
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  requestPushNotificationsPermission = () => { // requesting permission
    this.afMessaging.requestToken // getting tokens
      .subscribe(
        (token) => { // USER-REQUESTED-TOKEN
          console.log('Permission granted! Save to the server!', token);
          this.requestToken = token;
        },
        (error) => {
          console.error(error);
        }
      );
  }

  // code to copy to clipboard using capacitor
  async copyToClipboard() {
    Clipboard.write({
      string: 'URL: ' + this.requestToken
    });
  }

  // code to get current position of user
  async getCurrentPosition() {
    const coordinates = await Geolocation.getCurrentPosition();
    console.log('Current', coordinates);
  }

  // code to watch users current active position
  watchPosition() {
    const wait = Geolocation.watchPosition({}, (position, err) => {
      console.log('Current position', position);
    });
  }

  upload = (event) => {
    // create a random id
    const randomId = Math.random().toString(36).substring(2);
    // create a reference to the storage bucket location
    this.ref = this.afStorage.ref('/images/' + randomId);
    // the put method creates an AngularFireUploadTask
    // and kicks off the upload
    this.task = this.ref.put(event.target.files[0]);
    // AngularFireUploadTask provides observable
    // to get uploadProgress value
    // this.uploadProgress = this.task.snapshotChanges()
    // .pipe(map(s => (s.bytesTransferred / s.totalBytes) * 100));

    // observe upload progress
    this.uploadProgress = this.task.percentageChanges();
    // get notified when the download URL is available
    this.task.snapshotChanges().pipe(
      finalize(() => this.downloadURL = this.ref.getDownloadURL())
    )
    .subscribe();

    this.uploadState = this.task.snapshotChanges().pipe(map(s => s.state));
  }

}
