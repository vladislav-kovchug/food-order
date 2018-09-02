import {Component, OnDestroy, OnInit} from '@angular/core';
import {FoodItem} from "../../model/food-item";
import {CommunicatorService} from "../../service/communicator.service";
import {AngularFireDatabase} from "angularfire2/database";

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit, OnDestroy {
  private communicatorService: CommunicatorService;

  actor: number = 123456;
  displayedColumns: string[] = ['name', 'price', 'order'];
  foodItems: FoodItem[] = [];

  activeOrder = {
    "123456": {
      actor: "123456",
      items: [{
        id: 2,
        count: 0
      }]
    },

  };
  orders = [
    {
      actor: this.actor,
      items: [{
        id: 2,
        count: 0
      }]
    }
  ];

  constructor(private firedb: AngularFireDatabase) {
    for (let i = 1; i < 20; i++) {
      let foodItem = new FoodItem(100 + i, 0.4 * i, "Item " + i, 0);
      this.foodItems.push(foodItem);
    }

    this.firedb.database.ref("/activeOrder").once("value", (snapshot) => {
      let activeOrder = snapshot.val();

      if (activeOrder[this.actor]) {
        let myOrder = activeOrder[this.actor];

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

    // let angularFireList = this.firedb.list("/orders");
  }

  getTotalCost() {
    return this.foodItems.map(item => item.price * item.count)
      .reduce((acc, value) => acc + value, 0);
  }

  public increment(item: FoodItem) {
    item.count++;
    this.firedb.database.ref("/activeOrder/" + this.actor + "/items/" + item.id + "/count")
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
    // this.firedb.database.ref("/activeOrder/" + this.actor).set({
    //   actor: this.actor,
    //   items: [{
    //     id: 2,
    //     count: 2
    //   }]
    // })
  }

  ngOnInit() {
    console.log("ORDER COMPONENT INIT!!!");
  }

  ngOnDestroy() {
    console.log("ORDER COMPONENT DESTROY!!!");
  }

  private updateActiveOrder(item: FoodItem) {
    if(item.count > 0) {
      this.firedb.database.ref("/activeOrder/" + this.actor + "/items/" + item.id + "/count")
        .set(item.count);
    } else {
      this.firedb.database.ref("/activeOrder/" + this.actor + "/items/" + item.id).remove();
    }
  }

}
