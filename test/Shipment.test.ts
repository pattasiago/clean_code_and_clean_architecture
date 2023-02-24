import Product from '../src/Product';

test.each([
  ['camera', new Product(1, 'camera', 1, 10, 1, 20, 15, 10), 10],
  ['guitarra', new Product(2, 'camera', 1, 25, 3, 100, 30, 10), 30],
])(
  'Should calculate shipment for a %s',
  async (condition, condition_object, result) => {
    expect(Product.calculateShipmentProduct(condition_object)).toBe(result);
  },
);
