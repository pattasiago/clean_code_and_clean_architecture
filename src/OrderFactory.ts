import { validate } from './ValidateCPF';
import AppError from './Error';
import Order from './Order';
import CouponValidationHandler from './CouponValidationHandler';
export default class OrderFactory {
  static create(cpf: string, couponValidationHandler: CouponValidationHandler) {
    if (!validate(cpf)) throw new AppError('Invalid CPF');
    return new Order(cpf, couponValidationHandler);
  }
}
