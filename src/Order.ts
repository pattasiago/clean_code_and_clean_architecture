import Product from './Product';
import AppError from './Error';
import CouponValidationHandler from './CouponDateValidationHandler';

const MIN_SHIPMENT_PRICE = 10;

export default class Order {
  public products: Product[];
  public discount_in_percentage: number;
  public cpf: string;
  readonly couponValidationHandler: CouponValidationHandler;

  constructor(cpf: string, couponValidationHandler: CouponValidationHandler) {
    this.cpf = cpf;
    this.products = [];
    this.discount_in_percentage = 0;
    this.couponValidationHandler = couponValidationHandler;
  }

  addProduct(product: Product) {
    if (Product.hasProductInArray(product, this.products))
      throw new AppError('Same Product Registered Twice');
    this.products.push(product);
  }

  applyDiscount(discount_in_percentage: number, expiry_date: Date) {
    this.discount_in_percentage = 0;
    if (
      this.couponValidationHandler.validate({
        discount_in_percentage,
        expiry_date,
      })
    ) {
      this.discount_in_percentage = discount_in_percentage;
      return true;
    }
    return false;
  }

  calculateOrderPrice() {
    let finalPrice = 0;
    for (const product of this.products) {
      finalPrice += product.price * product.quantity;
    }
    return finalPrice - (finalPrice * this.discount_in_percentage) / 100;
  }

  static calculateShipmentOrder(products: Product[]) {
    let shipment = 0;
    for (const product of products) {
      shipment += Product.calculateShipmentProduct(product);
    }

    return shipment > MIN_SHIPMENT_PRICE ? shipment : MIN_SHIPMENT_PRICE;
  }
}
