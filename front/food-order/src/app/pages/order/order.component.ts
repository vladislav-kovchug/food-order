import {ApplicationRef, Component, OnDestroy, OnInit} from '@angular/core';
import {AngularFireDatabase} from "angularfire2/database";
import {AngularFireAuth} from "angularfire2/auth";
import {Subscription} from "rxjs/Subscription";
import {User} from "firebase";
import {MatDialog} from "@angular/material";
import {ProceedOrderComponent} from "./proceed-order/proceed-order.component";
import {Promise} from "q";
import {MenuCategory} from "../../model/menu-category";
import {MenuItem} from "../../model/menu-item";
import {GroupOrder} from "../../model/group-order";
import {UserGroup} from "../../model/user-group";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit, OnDestroy {
  activeUser: User;
  displayedColumns: string[] = ['name', 'weight', 'price', 'order'];
  menu: MenuCategory[] = [];
  subscriptions: Subscription[] = [];
  activeOrder: GroupOrder = {};
  users: UserGroup = {};
  orderComments: FormControl = new FormControl('');

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
    if (!myOrder || !myOrder.items) {
      return 0;
    }
    let orderItem = myOrder.items[item.id];
    if (!orderItem) {
      return 0;
    }

    return orderItem.count;
  }

  public toggleOrderState() {
    if (this.activeUser && this.activeOrder[this.activeUser.uid]) {
      let isOrderFinished = !this.activeOrder[this.activeUser.uid].finished;
      this.getActiveOrderItemsRef().child("/" + this.activeUser.uid).update({
        finished: isOrderFinished,
        comments: this.orderComments.value || null,
      });
      this.activeOrder[this.activeUser.uid].finished = isOrderFinished;
      this.activeOrder[this.activeUser.uid].comments = this.orderComments.value;
      isOrderFinished ? this.orderComments.disable() : this.orderComments.enable();
    }
  }

  public clearOrder() {
    this.getActiveOrderItemsRef().child("/" + this.activeUser.uid).remove();
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
        this.getActiveOrderItemsRef().child("/" + this.activeUser.uid + "/items/" + item.id).set({
          count: newCount,
          name: item.name,
          price: item.price
        });
      } else {
        this.getActiveOrderItemsRef().child("/" + this.activeUser.uid + "/items/" + item.id + "/count").set(newCount);
      }
    } else {
      this.getActiveOrderItemsRef().child("/" + this.activeUser.uid + "/items/" + item.id).remove();
    }
  }

  private startListenFireBaseUpdates() {
    this.firedb.database.ref("/users").once("value", (snapshot) => {
      this.users = snapshot.val();
    });

    this.loadMenu().then(() => {
      this.getActiveOrderRef().once("value", (snapshot) => {
        let activeOrder = snapshot.val();
        console.log(activeOrder);
        if (activeOrder && activeOrder.items) {
          this.activeOrder = activeOrder.items;
          let myOrder = this.activeOrder[this.activeUser.uid];
          if (myOrder) {
            this.orderComments.setValue(myOrder.comments);
            myOrder.finished ? this.orderComments.disable() : this.orderComments.enable();
          }
        }

        if (!activeOrder || !activeOrder.timestamp) {
          let todayTimestamp = new Date(OrderComponent.getTodayOrderDate()).getTime();
          this.getActiveOrderRef().child("timestamp").set(todayTimestamp)
        }
        this.applicationRef.tick();
      });
    });

    this.getActiveOrderItemsRef().on("child_changed", (snapshot) => {
      console.log("Order for user updated: " + snapshot.key);
      console.log("Order value: ", snapshot.val());
      this.activeOrder[snapshot.key] = snapshot.val();
      this.applicationRef.tick();
    });

    this.getActiveOrderItemsRef().on("child_removed", (snapshot) => {
      console.log("Order for user removed: " + snapshot.key);
      delete this.activeOrder[snapshot.key];
      this.applicationRef.tick();
    });

    this.getActiveOrderItemsRef().on("child_added", (snapshot) => {
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

  private getActiveOrderRef(): firebase.database.Reference {
    return this.firedb.database.ref("/orders/" + OrderComponent.getTodayOrderDate());
  }

  private getActiveOrderItemsRef(): firebase.database.Reference {
    return this.getActiveOrderRef().child("items");
  }

  private static getTodayOrderDate(): string {
    let date = new Date();

    let month = (date.getMonth() + 1).toString().padStart(2, "0");
    let day = date.getDate().toString().padStart(2, "0");
    return month + "-" + day + "-" + date.getFullYear();
  }

}
