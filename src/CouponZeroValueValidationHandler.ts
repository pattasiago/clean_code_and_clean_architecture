import Coupon from './Coupon';
import CouponValidationHandler from './CouponValidationHandler';
import AppError from './Error';

export default class CouponZeroValueValidationHandler
  implements CouponValidationHandler
{
  constructor(readonly next?: CouponValidationHandler) {}
  validate(coupon: Coupon): boolean {
    if (coupon.discount_in_percentage === 0) return true;
    if (!this.next) throw new AppError('Internal Error');
    return this.next.validate(coupon);
  }
}
