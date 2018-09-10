import {Component, OnInit} from '@angular/core';
import {AngularFireDatabase} from "angularfire2/database";
import {GroupOrder} from "../../model/group-order";
import {UserGroup} from "../../model/user-group";

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

  constructor(private fireDb: AngularFireDatabase) {
    this.fireDb.database.ref("/users").once("value", (snapshot) => {
      this.users = snapshot.val();
    });

    fireDb.database.ref("/orders").limitToLast(20).once("value", (snapshot) => {
      let data = snapshot.val();
      console.log(data);

      if (data) {
        let history = [];
        Object.keys(data).forEach((date) => {
          history.push({
            date: new Date(date),
            ordersCount: Object.keys(data[date]).length,
            order: data[date]
          })
        });

        history.sort((a, b) => {
          return b.date - a.date;
        });

        this.history = history;
      }
    })
  }

  ngOnInit() {
  }

}
