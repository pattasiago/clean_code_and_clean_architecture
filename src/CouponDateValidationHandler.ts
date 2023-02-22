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
    if (coupon.expiry_date < current_date) return false;
    if (!this.next) return true;
    return this.next.validate(coupon);
  }
}
