import Coupon from './Coupon';
import CouponValidationHandler from './CouponValidationHandler';
import AppError from './Error';

export default class CouponDateValidationHandler
  implements CouponValidationHandler
{
  constructor(readonly next?: CouponValidationHandler) {}
  validate(coupon: Coupon): boolean {
    const current_date: Date = new Date();
    current_date.setHours(0, 0, 0, 0);
    if (coupon.expiry_date < current_date)
      throw new AppError('Coupon has Expired');
    if (!this.next) return true;
    return this.next.validate(coupon);
  }
}
