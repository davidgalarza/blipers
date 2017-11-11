import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { DatabaseProvider } from '../database/database';
import * as GeoFire from 'geofire';
import { Geolocation } from '@ionic-native/geolocation';



@Injectable()
export class GeofireProvider {
  deviceLocation: Array<any> = []
  geoFireShops = new GeoFire(this.db.getActiveRef());
  geoFireActiveP = new GeoFire(this.db.getActiveRefP());
  geoFireBlipers = new GeoFire(this.db.getBlipersRef());
  geofireOrders = new GeoFire(this.db.getOrdersRef());
  constructor( public db: DatabaseProvider, private geolocation: Geolocation) {
    
  }

  setMyPosition(uid, lat, lng){
    this.geoFireBlipers.set(uid, [lat,lng])
  }
  getNearActive(lat, lng, radius){
    return this.geoFireShops.query({
        center: [lat, lng],
        radius: radius
      });
  }
  getNearActiveP(lat, lng, radius){
    return this.geoFireActiveP.query({
        center: [lat, lng],
        radius: radius
      });
  }
  calculateDistance(lat1, lng1, lat2, lng2){
    return new Promise((resolve,reject)=>{
      resolve(GeoFire.distance([lat1, lng1], [lat2, lng2]));
    });

  }
  getOrderPosition(id){
    return this.geofireOrders.get(id);
  }


}
