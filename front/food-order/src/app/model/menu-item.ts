export class MenuItem {
  public id: number;
  public name: string;
  public weight: number;
  public price: number;


  constructor(id: number, name: string, weight: number, price: number) {
    this.id = id;
    this.name = name;
    this.weight = weight;
    this.price = price;
  }
}
