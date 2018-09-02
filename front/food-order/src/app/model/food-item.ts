export class FoodItem {
  public id: number;
  public price: number;
  public name: string;
  public count: number;


  constructor(id: number, price: number, name: string, count: number) {
    this.id = id;
    this.price = price;
    this.name = name;
    this.count = count;
  }
}
