import {Component, OnInit} from '@angular/core';
import {AngularFireAuth} from "angularfire2/auth";
import * as firebase from "firebase";
import {User} from "firebase";
import {AngularFireDatabase} from "angularfire2/database";
import {UserData} from "../model/user-data";

@Component({
  selector: 'app-user-sign-in',
  templateUrl: './user-sign-in.component.html',
  styleUrls: ['./user-sign-in.component.scss']
})
export class UserSignInComponent implements OnInit {

  user: User;
  constructor(private fireDb: AngularFireDatabase, private fireAuth: AngularFireAuth) {
    let unsubscribe = this.fireAuth.auth.onAuthStateChanged((firebaseUser) => {
      console.log("Firebase user", firebaseUser);
      if(firebaseUser) {
        this.user = firebaseUser;
        let userData = new UserData(firebaseUser.email, firebaseUser.displayName, firebaseUser.photoURL);
        this.fireDb.database.ref("/users/" + firebaseUser.uid).update(userData);
      }
    });


    // Gauth
    // this.socialAuthService.authState.subscribe((userData) => {
    //   console.log("Google user: ", userData);
    //   if (userData) {
    //     this.user = userData;
    //   }
    // })
  }

  ngOnInit() {
  }

  public signIn() {
    let provider = new firebase.auth.GoogleAuthProvider();
    this.fireAuth.auth.signInWithPopup(provider).then((userData) => {
      console.log("User data: ", userData);
    })

    // GAuth
    // let socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    //
    // this.socialAuthService.signIn(socialPlatformProvider).then(
    //   (userData) => {
    //     this.user = userData;
    //   }
    // );
  }

  public signOut() {
    this.fireAuth.auth.signOut().then(() => {
      this.user = null;
    })

    // GAuth
    // let socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    // this.socialAuthService.signOut().then((data) => {
    //   this.user = null;
    // });
  }

}
