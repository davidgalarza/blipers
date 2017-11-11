import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';


import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { LoginPage } from '../pages/login/login';
import { ProfilePage } from '../pages/profile/profile';
import { OrderPage } from '../pages/order/order';
import { InfoPage } from '../pages/info/info';
import { AnalyticsPage } from '../pages/analytics/analytics';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';

import { Geolocation} from '@ionic-native/geolocation';

import { MomentModule } from 'angular2-moment';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthProvider } from '../providers/auth/auth';
import { DatabaseProvider } from '../providers/database/database';
import {RoundProgressModule} from 'angular-svg-round-progressbar';
import { GeofireProvider } from '../providers/geofire/geofire';

import { Firebase } from '@ionic-native/firebase';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { GoogleMaps } from '@ionic-native/google-maps';
import { LaunchNavigator } from '@ionic-native/launch-navigator';

import { DatePicker } from '@ionic-native/date-picker';

export const firebaseConfig = {
    apiKey: "AIzaSyD5-GtfArEanLasYBxACCsKZCAwX_lQp3I",
    authDomain: "atiempo-5533e.firebaseapp.com",
    databaseURL: "https://atiempo-5533e.firebaseio.com",
    projectId: "atiempo-5533e",
    storageBucket: "atiempo-5533e.appspot.com",
    messagingSenderId: "212855483806"
}

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    LoginPage,
    ProfilePage,
    OrderPage, 
    InfoPage,
    AnalyticsPage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig), 
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    RoundProgressModule,
    MomentModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    LoginPage, 
    ProfilePage,
    OrderPage,
    InfoPage,
    AnalyticsPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider,
    DatabaseProvider,
    GeofireProvider,
    Geolocation, 
    Firebase,
    BackgroundGeolocation,
    GoogleMaps,
    LaunchNavigator,
    DatePicker
  ]
})
export class AppModule {}
