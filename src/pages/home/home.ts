import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  CameraPosition,
  MarkerOptions,
  Marker
 } from '@ionic-native/google-maps';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { DatabaseProvider } from '../../providers/database/database';
import { GeofireProvider } from '../../providers/geofire/geofire';
import { ProfilePage } from '../../pages/profile/profile';
import { Platform } from 'ionic-angular';

import { Firebase } from '@ionic-native/firebase';
import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationResponse } from '@ionic-native/background-geolocation';
import { Geolocation} from '@ionic-native/geolocation';
import { OrderPage } from '../../pages/order/order';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})

export class HomePage {
tabs: string = "avalibleOrders";
  isAndroid: boolean = false;
  avalibleOrders:Array<any> = [];
  takenOrders: Array<any> = [];
  personalizedOrders:Array<any> = [];
  lat:any;
  lng:any;
  location: String;
  speed:any;
  provider: any;
  time:any;
  marker:Marker;
  constructor(public navCtrl: NavController, public auth: AuthProvider, public database: DatabaseProvider, public platform: Platform, public gf: GeofireProvider, public firebase: Firebase, private backgroundGeolocation: BackgroundGeolocation, public geo: Geolocation, private googleMaps: GoogleMaps) {

    this.firebase.onTokenRefresh().subscribe((token)=>{
      this.database.setToken(this.auth.getUser().uid, token);
    });

    const config: BackgroundGeolocationConfig = {
      stationaryRadius: 20,
      distanceFilter: 1,
      desiredAccuracy: 20,
      debug: false,
      notificationTitle: 'Background tracking',
      notificationText: 'enabled',
      notificationIconColor: '#FEDD1E',
      notificationIconLarge: 'mappointer_large',
      notificationIconSmall: 'mappointer_small',
      locationProvider: 1,//backgroundGeolocation.provider.ANDROID_DISTANCE_FILTER_PROVIDER,
      interval: 1,
      fastestInterval: 1,
      activitiesInterval: 1,
      stopOnTerminate: false,
      startOnBoot: false,
      startForeground: true,
      stopOnStillActivity: true,
      activityType: 'AutomotiveNavigation',
      pauseLocationUpdates: false,
      saveBatteryOnBackground: false,
      maxLocations: 100
    };
    this.backgroundGeolocation.configure(config)
    .subscribe((location: BackgroundGeolocationResponse) => {
      this.gf.setMyPosition(this.auth.getUser().uid, location.latitude, location.longitude);
      this.lat = location.latitude;
      this.lng =location.longitude;
      this.avalibleOrders = [];
      this.personalizedOrders = [];
      this.database.getBliper(this.auth.getUser().uid).on('value', bliper=>{
        let distance = 0;
        console.log(bliper.val());
        if(bliper.val().transport == 'moto'){
          distance = 4;
        }else{
          distance = 2;
        }
        console.log(distance);
        let query = this.gf.getNearActive(location.latitude, location.longitude, distance);
        query.on("key_entered", (orderId)=>{
          if(!this.isInAvalible(orderId)){
            this.database.getOrderById(orderId).$ref.once('value',(order)=>{
              let object = order.val();
              object.$key = order.key;
              this.avalibleOrders.push(object);
            });
          }
        });  
        query.on("key_exited", order=>{
          this.removeOrderFromArray(this.avalibleOrders, order);
        });
      });
      
      let queryP = this.gf.getNearActiveP(location.latitude, location.longitude, 4);
      queryP.on("key_entered", (orderId)=>{
        console.log(orderId);
        if(!this.isInPersonalized(orderId)){
          this.database.getOrderById(orderId).$ref.once('value',(order)=>{
            let object = order.val();
            object.$key = order.key;
            console.log("push:", object);
            this.personalizedOrders.push(object);
          });
        }
      });  
      queryP.on("key_exited", order=>{
        console.log(order);
        this.removeOrderFromArray(this.personalizedOrders, order);
      });
    });
    this.backgroundGeolocation.start();
    this.database.getMyOrder(this.auth.getUser().uid).subscribe(orders=>{
      this.takenOrders = [];
      orders.forEach(order => {

        if(order.status != 'recived' && order.status != 'rated'){
          console.log("Entro", order);
          this.takenOrders.push(order);
        }
      });
    });
    
   

  }

  ionViewDidLoad(){
    
  }
  
  getCommerceName(id){
    this.database.getCommerceById(id).subscribe(shop=>{
      return shop.name;
    });
  }
  isInAvalible(orderId){
    let isInArray = false;
    for(let i =0; i<this.avalibleOrders.length; i++){
       isInArray = this.avalibleOrders[i].$key == orderId;
    }
    return isInArray;
  }
  isInPersonalized(orderId){
    let isInArray = false;
    for(let i =0; i<this.personalizedOrders.length; i++){
       isInArray = this.personalizedOrders[i].$key == orderId;
    }
    return isInArray;
  }
  pushOrder(id){
    console.log(id);
    this.navCtrl.push(OrderPage,{
      id: id
    })
  }

  removeOrderFromArray(array, id){
      for(let i=0; i<array.length; i++){
        if(array[i].$key == id){
          console.log("entro");
          array.splice(i, 1);
        }
      }
  }

  
  
}
