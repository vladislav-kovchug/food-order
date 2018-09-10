import {ApplicationRef, Component, OnDestroy, OnInit} from '@angular/core';
import {AngularFireDatabase} from "angularfire2/database";
import {AngularFireAuth} from "angularfire2/auth";
import {Subscription} from "rxjs/Subscription";
import {User} from "firebase";
import {Order} from "../../model/order";
import {MatDialog} from "@angular/material";
import {ProceedOrderComponent} from "./proceed-order/proceed-order.component";
import {UserData} from "../../model/user-data";
import {Promise} from "q";
import {MenuCategory} from "../../model/menu-category";
import {MenuItem} from "../../model/menu-item";
import Reference = firebase.database.Reference;

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit, OnDestroy {
  activeUser: User;
  displayedColumns: string[] = ['name', 'weight', 'price', 'order'];
  menu: MenuCategory<MenuItem>[] = [];
  subscriptions: Subscription[] = [];
  activeOrder: { [userId: string]: Order } = {};
  users: { [userId: string]: UserData } = {};
  orderComments: string;

  constructor(private firedb: AngularFireDatabase, private fireAuth: AngularFireAuth, private dialog: MatDialog,
              private applicationRef: ApplicationRef) {
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

  public increment(item: MenuItem) {
    let count = this.getMenuItemOrdersCount(item);
    this.updateActiveOrder(item, count + 1);
  }

  public decrement(item: MenuItem) {
    let count = this.getMenuItemOrdersCount(item);
    if (count === 0) {
      return;
    }
    this.updateActiveOrder(item, count - 1);
  }

  public getMenuItemOrdersCount(item: MenuItem) {
    let myOrder = this.activeOrder[this.activeUser.uid];
    if (!myOrder) {
      return 0;
    }
    let orderItem = myOrder.items[item.id];
    if (!orderItem) {
      return 0;
    }

    return orderItem.count;
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

  private updateActiveOrder(item: MenuItem, newCount: number) {
    let count = this.getMenuItemOrdersCount(item);
    let isNewItem = count === 0;

    if (newCount > 0) {
      if (isNewItem) {
        this.getActiveOrderRef().child("/" + this.activeUser.uid + "/items/" + item.id).set({
          count: newCount,
          name: item.name,
          price: item.price
        });
      } else {
        this.getActiveOrderRef().child("/" + this.activeUser.uid + "/items/" + item.id + "/count").set(newCount);
      }
    } else {
      this.getActiveOrderRef().child("/" + this.activeUser.uid + "/items/" + item.id).remove();
    }
  }

  private startListenFireBaseUpdates() {
    this.firedb.database.ref("/users").once("value", (snapshot) => {
      this.users = snapshot.val();
    });

    this.loadMenu().then(() => {
      this.getActiveOrderRef().once("value", (snapshot) => {
        let activeOrder = snapshot.val();
        if (activeOrder) {
          this.activeOrder = activeOrder;
        }
        this.applicationRef.tick();
      });
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

  private loadMenu(): Promise<void> {
    return Promise<void>((resolve) => {
      this.firedb.database.ref("/menu").once("value", (snapshot) => {
        let menu = snapshot.val();
        console.log("Menu: ", menu);
        if (menu) {
          this.menu = menu;
          resolve(null);
        }
      })
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
