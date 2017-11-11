import { Component } from '@angular/core';
import { NavController, NavParams,  ViewController } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthProvider } from '../../providers/auth/auth';
import { DatabaseProvider } from '../../providers/database/database';
import { HomePage } from '../../pages/home/home'

/**
 * Generated class for the ProfilePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  bliper: any;
  avatar: any;
  name: string;
  transport: string;
  phone: number;
  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController , public auth: AuthProvider, public database: DatabaseProvider, private _sanitizer: DomSanitizer) {
    this.database.getBliper(this.auth.getUser().uid).once('value', (bliper)=>{
      this.bliper = bliper;
      if(bliper.val().avatar != undefined){
        this.avatar = bliper.val().avatar;
      }else{
        this.avatar = 'assets/img/boy.svg';
      }
      this.name = bliper.val().name;
      if(bliper.val().transport != undefined){
        this.transport = bliper.val().transport;
      }
      if(bliper.val().phone != undefined){
        this.phone = bliper.val().phone;
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
    this.viewCtrl.showBackButton(false);
  }

  continueInactive(){
    this.navCtrl.setRoot(HomePage);
    this.navCtrl.popToRoot({
      animate: true
    });
  }
  active(){
    this.database.setBliperProfile(this.bliper.key, this.phone, this.transport);
    this.navCtrl.setRoot(HomePage);
    this.navCtrl.popToRoot({
      animate: true
    });
  }

}
