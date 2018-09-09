import {Component, OnInit} from '@angular/core';
import {User} from "firebase";
import {AngularFireDatabase} from "angularfire2/database";
import {AngularFireAuth} from "angularfire2/auth";
import {MenuItem} from "../../model/menu-item";
declare var gapi: any;

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  activeUser: User;
  menu: MenuItem[] = [];
  displayedColumns: string[] = ['name', 'email', 'toggle'];


  constructor(fireAuth: AngularFireAuth, private fireDb: AngularFireDatabase) {
    fireAuth.authState.subscribe(user => {
      if (user) {
        this.activeUser = user;
        console.log(user);
        this.readMenu();
      } else {
        this.activeUser = null;
      }
    });

  }

  updateMenu() {

  }

  saveMenu() {
    // this.fireDb.database.ref("/menu").set(this.menu);
  }


  private readMenu() {
    this.fireDb.database.ref("/menu").once("value", (snapshot) => {
      let menu = snapshot.val();
      console.log("Menu: ", menu);
      if (menu) {
        this.menu = menu;
      }
    });
  }

  ngOnInit() {
  }

}
