import {Component, OnDestroy, OnInit} from '@angular/core';
import {FoodItem} from "../../model/food-item";
import {AngularFireDatabase} from "angularfire2/database";
import {AngularFireAuth} from "angularfire2/auth";
import {Subscription} from "rxjs/Subscription";
import {User} from "firebase";

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit, OnDestroy {
  activeUser: User;
  displayedColumns: string[] = ['name', 'price', 'order'];
  foodItems: FoodItem[] = [];
  subscriptions: Subscription[] = [];

  constructor(private firedb: AngularFireDatabase, private fireAuth: AngularFireAuth) {
    for (let i = 1; i < 20; i++) {
      let foodItem = new FoodItem(100 + i, 0.4 * i, "Item " + i, 0);
      this.foodItems.push(foodItem);
    }

    this.subscriptions.push(this.fireAuth.authState.subscribe(user => {
      if (user) {
        this.activeUser = user;
        this.startListenFireBaseUpdates()
      } else {
        //User logged out
      }
    }));
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => {
      s.unsubscribe();
    });
  }

  public getTotalCost() {
    return this.foodItems.map(item => item.price * item.count)
      .reduce((acc, value) => acc + value, 0);
  }

  public increment(item: FoodItem) {
    item.count++;
    this.firedb.database.ref("/activeOrder/" + this.activeUser.uid + "/items/" + item.id + "/count")
      .set(item.count);
    this.updateActiveOrder(item);
  }

  public decrement(item: FoodItem) {
    item.count--;
    if (item.count < 0) {
      item.count = 0;
    }
    this.updateActiveOrder(item);
  }

  public finishOrder() {

  }

  private updateActiveOrder(item: FoodItem) {
    if (item.count > 0) {
      this.firedb.database.ref("/activeOrder/" + this.activeUser.uid + "/items/" + item.id + "/count")
        .set(item.count);
    } else {
      this.firedb.database.ref("/activeOrder/" + this.activeUser.uid + "/items/" + item.id).remove();
    }
  }

  private startListenFireBaseUpdates() {
    this.firedb.database.ref("/activeOrder").once("value", (snapshot) => {
      let activeOrder = snapshot.val();

      if (activeOrder[this.activeUser.uid]) {
        let myOrder = activeOrder[this.activeUser.uid];

        Object.keys(myOrder.items).forEach((orderId) => {
          let currentFoodItem = this.foodItems.find((item) => {
            return item.id === parseInt(orderId);
          });

          if (currentFoodItem) {
            currentFoodItem.count = myOrder.items[orderId].count;
          }
        });
      }
    });

    this.firedb.database.ref("/activeOrder").on("child_changed", (snapshot) => {
      console.log("child_changed");
      console.log(snapshot.val());
    });
  }

}
