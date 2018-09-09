import {Component, OnInit} from '@angular/core';
import {AngularFireAuth} from "angularfire2/auth";
import {AngularFireDatabase} from "angularfire2/database";
import {User} from "firebase";
import {UserData} from "../../model/user-data";

export interface TeamUser {
  uid: string;
  name: string;
  email: string;
  isMember: boolean;
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  activeUser: User;
  users: UserData[] = [];
  displayedColumns: string[] = ['name', 'email', 'toggle'];

  constructor(fireAuth: AngularFireAuth, private fireDb: AngularFireDatabase) {
    fireAuth.authState.subscribe(user => {
      if (user) {
        this.activeUser = user;
        this.readUsers();
      } else {
        this.activeUser = null;
      }
    })
  }

  ngOnInit() {
  }

  public onToggle(user, event) {
    // console.log(event);
  }

  public test() {
    // this.fireDb.database.ref("/users/" + this.activeUser.uid + "/moderator").set(true);
    // this.fireDb.database.ref("/users/" + this.activeUser.uid + "/moderator").set(false);
    // this.fireDb.database.ref("/users/" + this.activeUser.uid).set({
    //   "updatedName": "New Name",
    //   "email": "new Email"
    // });
  }

  private readUsers() {
    this.fireDb.database.ref("/users").once("value", (users) => {
      let usersMap = users.val();
      let result = [];
      console.log("users", usersMap);

      Object.keys(usersMap).forEach((uid) => {
        result.push({
          uid: uid,
          email: usersMap[uid].email,
          name: usersMap[uid].name,
          isMember: false
        })
      });

      console.log("mapped users: ", result);
      this.users = result;
    });
  }

}
