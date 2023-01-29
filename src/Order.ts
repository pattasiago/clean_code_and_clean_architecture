import { validate } from './ValidateCPF';
import Product from './Product';

export default class Order {
  public products: Product[];
  public cpf: string;
  public discount_in_percentage: number;

  constructor(cpf: string) {
    if (!validate(cpf)) throw new Error('Invalid CPF');
    this.products = [];
    this.discount_in_percentage = 0;
    this.cpf = cpf;
  }

  addProduct(product: Product) {
    this.products.push(product);
  }

  insertDiscount(discount_in_percentage: number) {
    this.discount_in_percentage = 0;
    if (discount_in_percentage >= 0 && discount_in_percentage <= 100) {
      this.discount_in_percentage = discount_in_percentage;
      return;
    }
    throw new Error('Discount Could not be Inserted');
  }

  calculateOrderPrice() {
    let finalPrice = 0;
    for (const product of this.products) {
      finalPrice += product.price * product.quantity;
    }
    return finalPrice - (finalPrice * this.discount_in_percentage) / 100;
  }
}
