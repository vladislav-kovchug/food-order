import { Component, OnInit } from '@angular/core';
import {SelectionModel} from "@angular/cdk/collections";
import {FoodItem} from "../../model/food-item";

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  private selection: SelectionModel<FoodItem>;

  displayedColumns: string[] = ['name', 'price', 'order'];
  foodItems: FoodItem[] = [
    {name: 'Beach ball', price: 4, count: 0},
    {name: 'Beach ball', price: 4, count: 0},
    {name: 'Beach ball', price: 4, count: 0},
    {name: 'Beach ball', price: 4, count: 0},
    {name: 'Beach ball', price: 4, count: 0},
    {name: 'Beach ball', price: 4, count: 0},
    {name: 'Beach ball', price: 4, count: 0},
    {name: 'Beach ball', price: 4, count: 0},
    {name: 'Beach ball', price: 4, count: 0},
    {name: 'Beach ball', price: 4, count: 0},
    {name: 'Beach ball', price: 4, count: 0},
    {name: 'Beach ball', price: 4, count: 0},
    {name: 'Beach ball', price: 4, count: 0},
    {name: 'Beach ball', price: 4, count: 0},
    {name: 'Beach ball', price: 4, count: 0},
    {name: 'Beach ball', price: 4, count: 0},
    {name: 'Beach ball', price: 4, count: 0},
    {name: 'Beach ball', price: 4, count: 0},
    {name: 'Beach ball', price: 4, count: 0},
    {name: 'Beach ball', price: 4, count: 0},
    {name: 'Beach ball', price: 4, count: 0},
    {name: 'Beach ball', price: 4, count: 0},
    {name: 'Beach ball', price: 4, count: 0},
    {name: 'Beach ball', price: 4, count: 0},
    {name: 'Beach ball', price: 4, count: 0},
    {name: 'Beach ball', price: 4, count: 0},
    {name: 'Beach ball', price: 4, count: 0},
    {name: 'Beach ball', price: 4, count: 0},
  ];

  constructor() {
    const initialSelection = [];
    const allowMultiSelect = true;
    this.selection = new SelectionModel<FoodItem>(allowMultiSelect, initialSelection);
  }

  /** Gets the total cost of all transactions. */
  getTotalCost() {
    return this.foodItems.map(item => item.price * item.count)
      .reduce((acc, value) => acc + value, 0);
  }

  public increment(item) {
    item.count++;
  }

  public decrement(item) {
    item.count--;
    if(item.count < 0) {
      item.count = 0;
    }
  }

  ngOnInit() {
  }

}
