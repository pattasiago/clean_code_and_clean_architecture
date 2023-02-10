import Coupon from './Coupon';

export default interface CouponValidationHandler {
  next?: CouponValidationHandler;
  validate(coupon: Coupon): boolean;
}
