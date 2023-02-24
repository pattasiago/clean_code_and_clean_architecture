import Checkout from '../src/Checkout';
import AppError from '../src/Error';

let checkout: Checkout;

beforeEach(() => {
  checkout = new Checkout();
});

test('Should create an order with 3 products and calculates the final order price', async function () {
  const input = {
    cpf: '714.318.330-02',
    products: [
      { id: 1, qty: 2 },
      { id: 2, qty: 1 },
      { id: 3, qty: 10 },
    ],
  };
  const output = await checkout.execute(input);
  expect(output.message).toBe(165);
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
  expect(output.message).toBe(148.5);
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
    expect(output.message).toBe(165);
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
  expect(output.message).toBe(165);
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
  expect(output.message).toBe(110);
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
  expect(output.message).toBe(20);
  expect(output.freight).toBe(10);
});

test('Should create an order with 1 product in dolar', async function () {
  const input = {
    cpf: '714.318.330-02',
    products: [{ id: 8, qty: 1 }],
  };
  const output = await checkout.execute(input);
  expect(output.message).toBe(36);
});
