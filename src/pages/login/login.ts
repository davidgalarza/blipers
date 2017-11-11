import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { DatabaseProvider } from '../../providers/database/database';

import { UserModel } from '../../models/user-model';

import { HomePage } from '../home/home';

/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  userModel: UserModel;
  open=false;
  constructor(public navCtrl: NavController, public navParams: NavParams,public auth: AuthProvider, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public database: DatabaseProvider ) {
    this.userModel = new UserModel();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    window.addEventListener('native.keyboardshow', ()=>{
        this.open = true
    });
  }
  signIn() {
      let loading = this.loadingCtrl.create({
          content: 'Iniciando sesión. Por favor, espere...'
      });
      loading.present();

      this.auth.signInWithEmailAndPassword(this.userModel).then(result => {
          loading.dismiss();

                this.database.getBliper(result.uid).once('value', (bliper)=>{
                  console.log(bliper);
                  if(bliper.val() == undefined){
                  this.alert('Aun no eres Bliper', 'Parese que aun no estas registrado como bliper');
                  this.auth.logout();
                  }else{

                  this.navCtrl.setRoot(HomePage);
                  }
                
                });

           
      }).catch(error => {
          loading.dismiss();

          console.log(error);
          this.alert('Error', 'Ha ocurrido un error inesperado. Por favor intente nuevamente.');
      });
    }

   alert(title: string, message: string) {
        let alert = this.alertCtrl.create({
            title: title,
            subTitle: message,
            buttons: ['OK']
        });
        alert.present();
    }

}
