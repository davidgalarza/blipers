import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { GeofireProvider } from '../../providers/geofire/geofire';
import { AuthProvider } from '../../providers/auth/auth';
import { InfoPage } from '../../pages/info/info';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  LatLng,
  CameraPosition,
  MarkerOptions,
  Marker
 } from '@ionic-native/google-maps';
 
/**
 * Generated class for the OrderPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-order',
  templateUrl: 'order.html',
})
export class OrderPage {
  orderId:string;
  order:any;
  buttonText:string = 'ACEPTAR';
  steep:number = 1;
  commerce:any;
  userLocation:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public db: DatabaseProvider, private googleMaps: GoogleMaps, public gf: GeofireProvider, public auth:AuthProvider, private launchNavigator: LaunchNavigator) {
    this.orderId = this.navParams.get('id');
    console.log(this.orderId);
    this.db.getOrderById(this.orderId).subscribe(order=>{
      this.order = order;
      console.log(order.status);
      switch(order.status){
        case 'accepted':
                        this.buttonText = 'ACEPTAR';
                        break;
        case 'assigned':
                        this.buttonText = "LLEGUE A LA TIENDA";
                        break;
        case 'inShop':
                        this.buttonText = "ESTOY AFUERA";
                        console.log(order.status)
                        break;
        case 'arrived':
                      this.buttonText = "ENTREGADO";
                      break;
        case 'recived':
                      this.buttonText =  'GRACIAS!';
      }
    });
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderPage');
  }
  ngAfterViewInit() {
    this.loadMap();
  }
  loadMap() {
   

    let element: HTMLElement = document.getElementById('map');
   
    let map: GoogleMap = this.googleMaps.create(element);
   
    map.one(GoogleMapsEvent.MAP_READY).then(
      () => {
        map.setMyLocationEnabled(true);
        map.getMyLocation().then(location=>{
          let position = {
            target: location.latLng,
            zoom: 14,
            tilt: 30
          };
          map.moveCamera(position);
        })
        this.gf.getOrderPosition(this.orderId).then(location=>{
          this.userLocation = location;
          this.db.getCommerceById(this.order.commerceId).subscribe(commerce=>{
            this.commerce = commerce;
            console.log('Map is ready!');
            console.log(commerce);
            console.log(location);
            let shopPosition: LatLng = new LatLng(commerce.lat,commerce.lng);
            let userPosition: LatLng = new LatLng(location[0],location[1]);
            let imageS = {
              url: 'www/assets/img/store.png',
              size: {
                width: 25,
                height: 25
              }
            };
            let imageU = {
              url: 'www/assets/img/shop.png',
              size: {
                width: 25,
                height: 25
              }
            };
            let markerShopOptions: MarkerOptions = {
              position: shopPosition,
              title: commerce.name,
              icon:imageS,
              
            };
            let markerUserOptions: MarkerOptions = {
              position: userPosition,
              title: "Entregar",
              icon:imageU
            };
            const markerShop = map.addMarker(markerShopOptions);
            const markerUser = map.addMarker(markerUserOptions);
          });
        });
    
      }
    );
   
  }
  clickButton(){
    let status;
    switch(this.order.status){
      case 'accepted':
              status = 'assigned';
              break;
      case 'assigned':
              status = 'inShop';
              break;
      case 'inShop': 
              status = 'arrived';
              break;
      case 'arrived':
            status = 'recived';
    }

      this.db.setOrderStaus(this.orderId, status).then(()=>{
        if(status == 'assigned'){
          this.db.setBliperId(this.orderId, this.auth.getUser().uid);
        }
      });
  }
  pushInfo(){
    this.navCtrl.push(InfoPage,{
      order: this.order
    });
  }
  startNavigation(){
    if(this.order.type == 'personalized'){
      console.log("Personalized")
      let options: LaunchNavigatorOptions = {
        start: [this.userLocation[0], this.userLocation[1]]
      };
      console.log(options);
      this.launchNavigator.navigate([this.userLocation[0], this.userLocation[1]]);
    }else{
      if(this.order.status == 'accepted' || this.order.status == 'assigned' ){
        let options: LaunchNavigatorOptions = {
          start: [this.commerce.lat, this.commerce.lng]
        };
        this.launchNavigator.navigate([this.commerce.lat, this.commerce.lng]);
      }else{
        let options: LaunchNavigatorOptions = {
          start: [this.commerce.lat, this.commerce.lng]
        };
        this.launchNavigator.navigate([this.userLocation[0], this.userLocation[1]]);
      }
    }
  }

}
