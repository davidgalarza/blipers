import { Component, ViewChild, NgZone } from '@angular/core';
import { Nav, Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AuthProvider } from '../providers/auth/auth';
import { DatabaseProvider } from '../providers/database/database';
import firebase from 'firebase';


import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { LoginPage } from '../pages/login/login';
import { ProfilePage } from '../pages/profile/profile';
import { AnalyticsPage } from '../pages/analytics/analytics';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  buttonText:string ='';
  uid:string;
  bliperStatus: boolean;
  bliperName: string;
  rootPage: any;
  zone:NgZone;
  rate: number = 0;
  pages: Array<{title: string, component: any, icon: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public auth: AuthProvider, public alertCtrl: AlertController, public db: DatabaseProvider) {
    
    this.zone = new NgZone({});
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Inicio', component: HomePage,icon:'md-planet' },
      { title: 'Estadísticas', component: AnalyticsPage, icon:'md-list' },
      {title: 'Cerrar sesión', component: null, icon:'md-log-out'}
    ];
    firebase.auth().onAuthStateChanged((user) => { 
      if (user) {
      this.uid = user.uid;
      this.db.getMyOrder(this.uid).subscribe(orders=>{
        let sum = 0;
        let numOrders = 0
        if(orders.length != 0){
          orders.forEach(order => {
            if(order.rate != undefined){
              sum += order.rate;
              numOrders++;
              this.rate = sum / numOrders
            }
          });
        }else{
          this.rate = 0;
        }
        
      });
      this.db.getBliper(this.uid).once('value', (bliper)=>{
        this.bliperStatus = bliper.val().active;
        this.initializeApp();
        
      });
    this.db.getBliper(this.uid).on('value', (bliper)=>{
      if(bliper.val().active == false){
        this.buttonText = 'ACTIVARME';
      }else{
        this.buttonText = 'DESACTIVARME';
      }
      this.bliperName = bliper.val().name;
      });
    }else{
      this.initializeApp();
    }
  });
  
    

  }

  initializeApp() {
        const unsubscribe = firebase.auth().onAuthStateChanged((user) => { 
  this.zone.run( () => {
    if (!user) {
      this.rootPage = LoginPage;
      unsubscribe();
    } else { 
      console.log(this.bliperStatus);
      if(!this.bliperStatus){
        this.rootPage = ProfilePage;
        unsubscribe();
      }else{
        this.rootPage = HomePage;
        unsubscribe();
      }
      
    }
  });     
  });



    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if(page.component) {
      this.nav.setRoot(page.component);
  } else {
      // Since the component is null, this is the logout option
      // ...
      this.db.setBliperStatus(this.uid, false);
      this.auth.logout();
      
      // redirect to home
      this.nav.setRoot(LoginPage);
  }
  }
  changeState(){
    console.log(this.bliperStatus);
    this.db.setBliperStatus(this.uid, !this.bliperStatus)
  }
  
}
