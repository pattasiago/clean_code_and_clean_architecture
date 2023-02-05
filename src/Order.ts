import Product from './Product';
import AppError from './Error';

export default class Order {
  public products: Product[];
  public discount_in_percentage: number;
  public cpf: string;

  constructor(cpf: string) {
    this.cpf = cpf;
    this.products = [];
    this.discount_in_percentage = 0;
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
    throw new AppError('Discount Could not be Inserted');
  }

  calculateOrderPrice() {
    let finalPrice = 0;
    for (const product of this.products) {
      finalPrice += product.price * product.quantity;
    }
    return finalPrice - (finalPrice * this.discount_in_percentage) / 100;
  }
}
