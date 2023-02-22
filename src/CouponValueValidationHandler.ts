import Coupon from './Coupon';
import CouponValidationHandler from './CouponValidationHandler';
import AppError from './Error';

export default class CouponValueValidationHandler
  implements CouponValidationHandler
{
  constructor(readonly next?: CouponValidationHandler) {}
  validate(coupon: Coupon): boolean {
    if (
      !(
        coupon.discount_in_percentage > 0 &&
        coupon.discount_in_percentage <= 100
      )
    )
      return false;
    if (!this.next) return true;
    return this.next.validate(coupon);
  }
}
