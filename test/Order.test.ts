import axios from 'axios';

test('Should create an order with 3 products and calculates the final order price', async function () {
  const input = {
    cpf: '714.318.330-02',
    products: [
      { id: 1, qty: 2 },
      { id: 2, qty: 1 },
      { id: 3, qty: 10 },
    ],
  };
  const response = await axios.post('http://localhost:3000/checkout', input);
  const output = response.data;
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
  const response = await axios.post('http://localhost:3000/checkout', input);
  const output = response.data;
  expect(output.message).toBe(148.5);
});

const cases = [
  ['less', 0, 'INVALID-1'],
  ['greater', 100, 'INVALID101'],
];

test.each(cases)(
  'Should throw an error if discount is %s than %d, e.g. discount_code = %s',
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
    const response = await axios.post('http://localhost:3000/checkout', input);
    const output = response.data;
    expect(output.message).toBe('Coupon Invalid');
  },
);

test('Should not create an order with invalid cpf', async function () {
  const input = {
    cpf: '714.318.330-01',
  };
  const response = await axios.post('http://localhost:3000/checkout', input);
  const output = response.data;
  expect(output.message).toBe('Invalid CPF');
});

test('Should not create an order with valid cpf', async function () {
  const input = {
    cpf: '714.318.330-02',
  };
  const response = await axios.post('http://localhost:3000/checkout', input);
  const output = response.data;
  expect(output.message).toBe(0);
});

test('Should not create an order if coupon has expired', async function () {
  const input = {
    cpf: '714.318.330-02',
    products: [
      { id: 1, qty: 2 },
      { id: 2, qty: 1 },
      { id: 3, qty: 10 },
    ],
    discount: 'EXPIRED',
  };
  const response = await axios.post('http://localhost:3000/checkout', input);
  const output = response.data;
  expect(output.message).toBe('Coupon has Expired');
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
  const response = await axios.post('http://localhost:3000/checkout', input);
  const output = response.data;
  expect(output.message).toBe('Quantity cannot be less than 0');
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
  const response = await axios.post('http://localhost:3000/checkout', input);
  const output = response.data;
  expect(output.message).toBe('Same Product Registered Twice');
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
    const response = await axios.post('http://localhost:3000/checkout', input);
    const output = response.data;
    expect(output.message).toBe(
      `${condition} cannot be less than or equal to 0`,
    );
  },
);
