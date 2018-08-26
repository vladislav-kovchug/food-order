export class FoodItem {
  public readonly price: number;
  public readonly name: string;
  public readonly count: number;


  constructor(price: number, name: string, count: number) {
    this.price = price;
    this.name = name;
    this.count = count;
  }
}
