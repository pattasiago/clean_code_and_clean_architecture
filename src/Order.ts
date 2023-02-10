import Product from './Product';
import AppError from './Error';
import CouponValidationHandler from './CouponDateValidationHandler';

const DISTANCE = 1000;
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
    // const current_date: Date = new Date();
    // current_date.setHours(0, 0, 0, 0);
    // this.discount_in_percentage = 0;
    // if (discount_in_percentage === 0) return;
    // if (!(discount_in_percentage > 0 && discount_in_percentage <= 100))
    //   throw new AppError('Discount Invalid');
    // if (expiry_date < current_date) throw new AppError('Coupon has Expired');
    // this.discount_in_percentage = discount_in_percentage;
    this.discount_in_percentage = 0;
    this.couponValidationHandler.validate({
      discount_in_percentage,
      expiry_date,
    });
    this.discount_in_percentage = discount_in_percentage;
    return;
  }

  calculateOrderPrice() {
    let finalPrice = 0;
    for (const product of this.products) {
      finalPrice += product.price * product.quantity;
    }
    return finalPrice - (finalPrice * this.discount_in_percentage) / 100;
  }

  calculateShipment(product: Product) {
    const shipment =
      DISTANCE * product.calculateVolume() * (product.calculateDensity() / 100);
    return shipment > MIN_SHIPMENT_PRICE ? shipment : MIN_SHIPMENT_PRICE;
  }
}
