import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { AngularFireDatabase } from 'angularfire2/database';
import { User } from 'firebase/app';
/*
  Generated class for the DatabaseProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class DatabaseProvider {

  constructor(public db: AngularFireDatabase) {
    console.log('Hello DatabaseProvider Provider');
  }

  getBliper(uid: string){
    return this.db.database.ref('/blipers/' + uid);
  }
  setBliperProfile(uid: string, phone: number, transport: string){
    this.db.database.ref('/blipers/' + uid + '/phone').set(phone);
    this.db.database.ref('/blipers/' + uid + '/transport').set(transport);
    this.db.database.ref('/blipers/' + uid + '/active'). set(true);
  }
  setToken(uid, token){
    return this.db.database.ref('/blipers/' + uid + '/token').set(token);
  }

  getActiveRef(){
     return this.db.database.ref('/activeLocations').ref;
  }
  getActiveRefP(){
    return this.db.database.ref('/activeLocationsP').ref;
  }
  getBlipersRef(){
    return this.db.database.ref('/blipersLocations');
 }
 getOrdersRef(){
  return this.db.database.ref('/ordersLocations');
}
 getOrderById(id){
  return this.db.object('/orders/'+id);
 }
 getMyOrder(uid){
  return this.db.list('/orders',{
    query:{
      orderByChild: 'bliper',
      equalTo: uid
    }
  })
 }
 getCommerceById(id){
 return this.db.object('commerces/'+id);
}
setOrderStaus(id:string, status:string){
  return this.db.database.ref('/orders/'+id+'/status').set(status);
}
setBliperId(orderId:string, bliperId:string){
  return this.db.database.ref('/orders/'+orderId+'/bliper').set(bliperId);
}
setBliperStatus(uid, status){
  this.db.database.ref('/blipers/' + uid + '/active'). set(status);
}

}
