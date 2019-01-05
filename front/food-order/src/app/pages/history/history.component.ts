import {Component, OnInit} from '@angular/core';
import {AngularFireDatabase} from "angularfire2/database";
import {GroupOrder} from "../../model/group-order";
import {UserGroup} from "../../model/user-group";
import {User} from "firebase";
import {AngularFireAuth} from "angularfire2/auth";

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  history: {
    date: Date,
    ordersCount: number,
    order: GroupOrder
  }[] = [];
  users: UserGroup;
  activeUser: User;

  constructor(private fireDb: AngularFireDatabase, private fireAuth: AngularFireAuth) {
    fireAuth.authState.subscribe(user => {
      if (user) {
        this.activeUser = user;
        this.loadHistory();
      } else {
        this.activeUser = null;
        this.history = [];
      }
    });
  }

  ngOnInit() {
  }

  private loadHistory() {
    this.fireDb.database.ref("/users").once("value", (snapshot) => {
      this.users = snapshot.val();
    });

    this.fireDb.database.ref("/orders")
      .orderByChild("timestamp")
      .limitToLast(20)
      .once("value", (snapshot) => {
        let orders = snapshot.val();
        // console.log(orders);

        if (orders) {
          let history = [];
          Object.keys(orders).forEach((date) => {
            let orderItems = orders[date].items;
            if (!orderItems) {
              return;
            }
            history.push({
              date: new Date(orders[date].timestamp),
              ordersCount: Object.keys(orderItems).length,
              order: orderItems
            });
          });

          history.sort((a, b) => {
            return b.date - a.date;
          });

          this.history = history;
        }
      });
  }

}
