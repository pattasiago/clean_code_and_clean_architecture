import CouponDateValidationHandler from './CouponDateValidationHandler';
import CouponValueValidationHandler from './CouponValueValidationHandler';
import CouponZeroValueValidationHandler from './CouponZeroValueValidationHandler';
import CouponRepositoryDatabase from './CouponRepositoryDatabase';
import CouponRepository from './CouponRepository';

const couponDateValidation = new CouponDateValidationHandler();
const couponValueValidation = new CouponValueValidationHandler(
  couponDateValidation,
);
const couponZeroValueValidation = new CouponZeroValueValidationHandler(
  couponValueValidation,
);

export default class ValidateCoupon {
  constructor(
    readonly couponRepo: CouponRepository = new CouponRepositoryDatabase(),
  ) {}
  async execute(discount: string): Promise<Output> {
    const coupon: any = await this.couponRepo.getCoupon(discount);
    const date: any = new Date(
      coupon.rows[0]?.expiry ? coupon.rows[0].expiry : '1994-01-01',
    );
    const percentage: any = coupon.rows[0]?.percentage
      ? coupon.rows[0].percentage
      : 0;
    const valid: boolean = couponZeroValueValidation.validate({
      discount_in_percentage: percentage,
      expiry_date: date,
    });

    return {
      status: 'OK',
      coupon_valid: valid,
    };
  }
}

interface Output {
  status: any;
  coupon_valid: boolean;
}
