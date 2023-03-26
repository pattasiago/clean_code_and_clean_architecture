import ValidateCoupon from '../src/ValidateCoupon';

let couponValidation: ValidateCoupon;

beforeEach(function () {
  couponValidation = new ValidateCoupon();
});

test('Should check if a coupon is valid', async function () {
  const input = 'VALE100';
  const output = await couponValidation.execute(input);
  expect(output.coupon_valid).toBeTruthy();
});
