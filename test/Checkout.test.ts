import Sinon from 'sinon';
import Checkout from '../src/Checkout';
import CouponRepositoryDatabase from '../src/CouponRepositoryDatabase';
import CurrencyGateway from '../src/CurrencyGateway';
import CurrencyGatewayHttp from '../src/CurrencyGatewayHttp';
import AppError from '../src/Error';
import GetOrder from '../src/GetOrder';
import ProductRepositoryDatabase from '../src/ProductRepositoryDatabase';
import ProductsRepository from '../src/ProductsRepository';
import crypto from 'crypto';
import OrderRepositoryDatabase from '../src/OrderRepositoryDatabase';

let checkout: Checkout;
let getOrder: GetOrder;

beforeEach(() => {
  checkout = new Checkout();
  getOrder = new GetOrder();
});

test('Should create an order with 3 products and calculates the final order price', async function () {
  const uuid = crypto.randomUUID();
  const input = {
    uuid,
    cpf: '714.318.330-02',
    products: [
      { id: 1, qty: 2 },
      { id: 2, qty: 1 },
      { id: 3, qty: 10 },
    ],
  };
  // const output = await checkout.execute(input);
  await checkout.execute(input);
  const output = await getOrder.execute(uuid);
  expect(output.total).toBe(165);
});

test('Should create an order with 3 products, apply 10% discount, and calculates the final order price', async function () {
  const input = {
    cpf: '714.318.330-02',
    products: [
      { id: 1, qty: 2 },
      { id: 2, qty: 1 },
      { id: 3, qty: 10 },
    ],
    discount: 'VALE10',
  };
  const output = await checkout.execute(input);
  expect(output.total).toBe(148.5);
});

const cases = [
  ['less', 0, 'INVALID-1'],
  ['greater', 100, 'INVALID101'],
];

test.each(cases)(
  'Should not apply discount if coupon discount is %s than %d, e.g. discount_code = %s',
  async (condition, condition_limit, test) => {
    const input = {
      cpf: '714.318.330-02',
      products: [
        { id: 1, qty: 2 },
        { id: 2, qty: 1 },
        { id: 3, qty: 10 },
      ],
      discount: test as string,
    };
    const output = await checkout.execute(input);
    expect(output.total).toBe(165);
  },
);

test('Should not create an order with invalid cpf', async function () {
  const input = {
    cpf: '714.318.330-01',
    products: [],
  };
  expect(() => checkout.execute(input)).rejects.toMatchObject(
    new AppError('Invalid CPF'),
  );
});

test('Should not create an order with valid cpf', async function () {
  const input = {
    cpf: '714.318.330-02',
    products: [],
  };
  expect(() => checkout.execute(input)).rejects.toMatchObject(
    new AppError('There is no product inserted'),
  );
});

test('Should not apply discount an order if coupon has expired', async function () {
  const input = {
    cpf: '714.318.330-02',
    products: [
      { id: 1, qty: 2 },
      { id: 2, qty: 1 },
      { id: 3, qty: 10 },
    ],
    discount: 'EXPIRED',
  };
  const output = await checkout.execute(input);
  expect(output.total).toBe(165);
});

test('Should not create if a product has negative quantity', async function () {
  const input = {
    cpf: '714.318.330-02',
    products: [
      { id: 1, qty: 2 },
      { id: 2, qty: -2 },
      { id: 3, qty: 10 },
    ],
  };
  expect(() => checkout.execute(input)).rejects.toMatchObject(
    new AppError('Quantity cannot be less than 0'),
  );
});

test('Should not create if the order has the same product more than one time', async function () {
  const input = {
    cpf: '714.318.330-02',
    products: [
      { id: 1, qty: 2 },
      { id: 1, qty: 12 },
      { id: 3, qty: 10 },
    ],
  };
  expect(() => checkout.execute(input)).rejects.toMatchObject(
    new AppError('Same Product Registered Twice'),
  );
});

test.each([
  ['Height', 7],
  ['Width', 6],
  ['Depth', 5],
  ['Weight', 4],
])(
  'Should throw an error if %s is negative',
  async (condition, condition_id) => {
    const input = {
      cpf: '714.318.330-02',
      products: [{ id: condition_id, qty: 2 }],
    };
    expect(() => checkout.execute(input)).rejects.toMatchObject(
      new AppError(`${condition} cannot be less than or equal to 0`),
    );
  },
);

test('Should create an order with 1 product calculating the freight', async function () {
  const input = {
    cpf: '714.318.330-02',
    products: [{ id: 2, qty: 2 }],
    from: '22060030',
    to: '88015600',
  };
  const output = await checkout.execute(input);
  expect(output.total).toBe(110);
  expect(output.freight).toBe(60);
});

test('Should create an order with 1 product calculating the freight with min value', async function () {
  const input = {
    cpf: '714.318.330-02',
    products: [{ id: 1, qty: 1 }],
    from: '22060030',
    to: '88015600',
  };
  const output = await checkout.execute(input);
  expect(output.total).toBe(20);
  expect(output.freight).toBe(10);
});

test('Should create an order with 1 product in dolar using stub', async function () {
  const stubCurrencyGateway = Sinon.stub(
    CurrencyGatewayHttp.prototype,
    'getCurrencies',
  ).resolves({
    usd: 3,
  });

  const stubProductRepository = Sinon.stub(
    ProductRepositoryDatabase.prototype,
    'getProduct',
  ).resolves({
    rows: [
      {
        id: 8,
        description: 'A',
        price: 12,
        width: 100,
        height: 200,
        depth: 50,
        weight: 40,
        currency: 'USD',
      },
    ],
  });

  const input = {
    cpf: '714.318.330-02',
    products: [{ id: 8, qty: 1 }],
  };
  const output = await checkout.execute(input);
  expect(output.total).toBe(36);
  stubCurrencyGateway.restore();
  stubProductRepository.restore();
});

test('Should create an order with 3 products, apply 10% discount, and calculates the final order price with spy', async function () {
  const spy = Sinon.spy(CouponRepositoryDatabase.prototype, 'getCoupon');

  const input = {
    cpf: '714.318.330-02',
    products: [
      { id: 1, qty: 2 },
      { id: 2, qty: 1 },
      { id: 3, qty: 10 },
    ],
    discount: 'VALE10',
  };
  const output = await checkout.execute(input);
  expect(output.total).toBe(148.5);
  expect(spy.calledOnce).toBeTruthy();
  expect(spy.calledWith('VALE10')).toBeTruthy();
});

test('Should create an order with 1 product in dolar using fake', async function () {
  const currencyGateway: CurrencyGateway = {
    async getCurrencies(): Promise<any> {
      return {
        usd: 3,
      };
    },
  };
  const productRepo: ProductsRepository = {
    async getProduct(): Promise<any> {
      return {
        rows: [
          {
            id: 8,
            description: 'A',
            price: 12,
            width: 100,
            height: 200,
            depth: 50,
            weight: 40,
            currency: 'USD',
          },
        ],
      };
    },
  };
  checkout = new Checkout(currencyGateway, productRepo);
  const input = {
    cpf: '714.318.330-02',
    products: [{ id: 8, qty: 1 }],
  };
  const output = await checkout.execute(input);
  expect(output.total).toBe(36);
});

test('Should create an order with 1 product in dolar using mock', async function () {
  const mockCurrencyGateway = Sinon.mock(CurrencyGatewayHttp.prototype);
  mockCurrencyGateway.expects('getCurrencies').once().resolves({
    usd: 3,
  });
  const input = {
    cpf: '714.318.330-02',
    products: [{ id: 8, qty: 1 }],
  };
  const output = await checkout.execute(input);
  expect(output.total).toBe(36);
  mockCurrencyGateway.verify();
  mockCurrencyGateway.restore();
});

test('Should create an order and verify the serial number', async function () {
  const stubGetOrder = Sinon.stub(
    OrderRepositoryDatabase.prototype,
    'getLastSerialNumber',
  ).resolves('202100000000');
  const uuid = crypto.randomUUID();
  const input = {
    uuid,
    cpf: '714.318.330-02',
    products: [
      { id: 1, qty: 2 },
      { id: 2, qty: 1 },
      { id: 3, qty: 10 },
    ],
    discount: 'VALE10',
  };
  await checkout.execute(input);
  const output = await getOrder.execute(uuid);
  expect(output.serial).toBe('202100000001');
  stubGetOrder.restore();
});
