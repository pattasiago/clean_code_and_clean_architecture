export default class Product {
  public description: string;
  public quantity: number;
  public price: number;

  constructor(description: string, quantity: number, price: number) {
    this.description = description;
    this.quantity = quantity;
    this.price = price;
  }
}
