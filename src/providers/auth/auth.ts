import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { AngularFireAuth } from 'angularfire2/auth';
import { User, Promise } from 'firebase/app';
import { UserModel } from '../../models/user-model';
import { DatabaseProvider } from '../database/database'
/*
  Generated class for the AuthProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class AuthProvider {
  user: User;
  constructor(public angularFireAuth: AngularFireAuth, public database : DatabaseProvider) {
    
    angularFireAuth.authState.subscribe((user: User) => {
            this.user = user;
    });
  }

  get authenticated(): boolean {
        return this.user != null;
    }

  signInWithEmailAndPassword(userModel: UserModel): Promise<any> {
      return this.angularFireAuth.auth.signInWithEmailAndPassword(userModel.email, userModel.password);
  }

  logout(){
    this.angularFireAuth.auth.signOut();
  }

  getUser(){
    return this.user;
  }
}
