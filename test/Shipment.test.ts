import CouponDateValidationHandler from '../src/CouponDateValidationHandler';
import CouponValueValidationHandler from '../src/CouponValueValidationHandler';
import CouponZeroValueValidationHandler from '../src/CouponZeroValueValidationHandler';
import Order from '../src/Order';
import OrderFactory from '../src/OrderFactory';
import Product from '../src/Product';
let order: Order;

beforeEach(function () {
  const couponDateValidation = new CouponDateValidationHandler();
  const couponValueValidation = new CouponValueValidationHandler(
    couponDateValidation,
  );
  const couponZeroValueValidation = new CouponZeroValueValidationHandler(
    couponValueValidation,
  );
  order = OrderFactory.create('714.318.330-02', couponZeroValueValidation);
});

test.each([
  ['camera', new Product(1, 'camera', 1, 10, 1, 20, 15, 10), 10],
  ['guitarra', new Product(2, 'camera', 1, 25, 3, 100, 30, 10), 30],
])(
  'Should calculate shipment for a %s',
  async (condition, condition_object, result) => {
    expect(order.calculateShipmentProduct(condition_object)).toBe(result);
  },
);
