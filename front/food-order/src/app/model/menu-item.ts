export class MenuItem {
  public id: number;
  public price: number;
  public name: string;

  constructor(id: number, price: number, name: string) {
    this.id = id;
    this.price = price;
    this.name = name;
  }
}
