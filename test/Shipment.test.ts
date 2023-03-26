import Product from '../src/Product';
import SimulateShipment from '../src/SimulateShipment';

let simulateShipment: SimulateShipment;
beforeEach(function () {
  simulateShipment = new SimulateShipment();
});

test.each([
  ['camera', new Product(1, 'camera', 1, 10, 1, 20, 15, 10), 10],
  ['guitarra', new Product(2, 'guitarra', 1, 25, 3, 100, 30, 10), 30],
])(
  'Should calculate shipment for a %s',
  async (condition, condition_object, result) => {
    expect(Product.calculateShipmentProduct(condition_object)).toBe(result);
  },
);

test('Should simulate right shipment', async function () {
  const input = {
    cpf: '714.318.330-02',
    products: [
      { id: 1, qty: 10 },
      { id: 2, qty: 15 },
    ],
    from: '22060030',
    to: '88015600',
  };
  const output = await simulateShipment.execute(input);
  expect(output.freight).toBe(550);
});
