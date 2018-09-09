import {ApplicationRef, Component, OnDestroy, OnInit} from '@angular/core';
import {FoodItem} from "../../model/food-item";
import {AngularFireDatabase} from "angularfire2/database";
import {AngularFireAuth} from "angularfire2/auth";
import {Subscription} from "rxjs/Subscription";
import {User} from "firebase";
import {Order} from "../../model/order";
import {MatDialog} from "@angular/material";
import {ProceedOrderComponent} from "./proceed-order/proceed-order.component";
import {UserData} from "../../model/user-data";
import Reference = firebase.database.Reference;
import {ProceedOrderDialogData} from "./proceed-order/proceed-order-dialog-data";

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
  activeOrder: { [userId: string]: Order } = {};
  users: { [userId: string]: UserData } = {};
  orderComments: string;

  constructor(private firedb: AngularFireDatabase, private fireAuth: AngularFireAuth, private dialog: MatDialog,
              private applicationRef: ApplicationRef) {
    for (let i = 1; i < 20; i++) {
      let foodItem = new FoodItem(100 + i, 0.4 * i, "Item " + i, 0);
      this.foodItems.push(foodItem);
    }

    this.subscriptions.push(this.fireAuth.authState.subscribe(user => {
      if (user) {
        this.activeUser = user;
        this.startListenFireBaseUpdates()
      } else {
        this.activeUser = null;
        //User logged out
      }
      this.applicationRef.tick();
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
    let isNewItem = item.count === 0;
    item.count++;
    this.updateActiveOrder(item, isNewItem);
  }

  public decrement(item: FoodItem) {
    if (item.count === 0) {
      return;
    }

    item.count--;
    this.updateActiveOrder(item);
  }

  public finishOrder() {
    if (this.activeUser && this.activeOrder[this.activeUser.uid]) {
      this.getActiveOrderRef().child("/" + this.activeUser.uid).update({
        finished: true,
        comments: this.orderComments,
      });
      this.activeOrder[this.activeUser.uid].finished = true;
      this.activeOrder[this.activeUser.uid].comments = this.orderComments;
    }
  }

  public isMyOrderFinished() {
    return this.activeOrder[this.activeUser.uid] && this.activeOrder[this.activeUser.uid].finished;
  }

  public hasItemsInMyOrder() {
    return this.activeOrder && this.activeOrder[this.activeUser.uid] &&
      this.activeOrder[this.activeUser.uid].items;
  }

  public showProceedDialog() {
    this.dialog.open(ProceedOrderComponent, {
      width: "1100px",
      data: {
        activeOrder: this.activeOrder,
        users: this.users
      }
    });
  }

  public getObjectKeys(object): string[] {
    if (!object) {
      return null;
    }
    return Object.keys(object);
  }

  private updateActiveOrder(item: FoodItem, isNewItem: boolean = false) {
    if (item.count > 0) {
      if (isNewItem) {
        this.getActiveOrderRef().child("/" + this.activeUser.uid + "/items/" + item.id).set({
          count: item.count,
          name: item.name,
          price: item.price
        });
        return;
      } else {
        this.getActiveOrderRef().child("/" + this.activeUser.uid + "/items/" + item.id + "/count").set(item.count);
      }
    } else {
      this.getActiveOrderRef().child("/" + this.activeUser.uid + "/items/" + item.id).remove();
    }
  }

  private startListenFireBaseUpdates() {
    this.firedb.database.ref("/users").once("value", (snapshot) => {
      this.users = snapshot.val();
    });

    this.getActiveOrderRef().once("value", (snapshot) => {
      let activeOrder = snapshot.val();
      if (!activeOrder) {
        this.applicationRef.tick();
        return;
      }

      this.activeOrder = activeOrder;

      let myOrder = this.activeOrder[this.activeUser.uid];
      if (myOrder) {
        Object.keys(myOrder.items).forEach((orderId) => {
          let currentFoodItem = this.foodItems.find((item) => {
            return item.id === parseInt(orderId);
          });

          if (currentFoodItem) {
            currentFoodItem.count = myOrder.items[orderId].count;
          }
        });
      }
      this.applicationRef.tick();
    });

    this.getActiveOrderRef().on("child_changed", (snapshot) => {
      console.log("Order for user updated: " + snapshot.key);
      console.log("Order value: ", snapshot.val());
      this.activeOrder[snapshot.key] = snapshot.val();
      this.applicationRef.tick();
    });

    this.getActiveOrderRef().on("child_removed", (snapshot) => {
      console.log("Order for user removed: " + snapshot.key);
      delete this.activeOrder[snapshot.key];
      this.applicationRef.tick();
    });

    this.getActiveOrderRef().on("child_added", (snapshot) => {
      console.log("Order for user added: " + snapshot.key);
      this.activeOrder[snapshot.key] = snapshot.val();
      this.applicationRef.tick();
    });

  }

  private getActiveOrderRef(): Reference {
    return this.firedb.database.ref("/orders/" + OrderComponent.getTodayOrderDate());
  }

  private static getTodayOrderDate(): string {
    let date = new Date();

    let month = (date.getMonth() + 1).toString().padStart(2, "0");
    let day = date.getDate().toString().padStart(2, "0");
    return month + "-" + day + "-" + date.getFullYear();
  }

}
