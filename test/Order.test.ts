import axios from 'axios';

test('Should create an order with 3 products and calculates the final order price', async function () {
  const input = {
    cpf: '714.318.330-02',
    products: [
      { description: 'lençol', qty: 2, price: 10 },
      { description: 'toalha', qty: 1, price: 25 },
      { description: 'fronha', qty: 10, price: 12 },
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
      { description: 'lençol', qty: 2, price: 10 },
      { description: 'toalha', qty: 1, price: 25 },
      { description: 'fronha', qty: 10, price: 12 },
    ],
    discount: 10,
  };
  const response = await axios.post('http://localhost:3000/checkout', input);
  const output = response.data;
  expect(output.message).toBe(148.5);
});

const cases = [
  ['less', 0, -1],
  ['greater', 100, 101],
];

test.each(cases)(
  'Should throw an error if discount is %s than %d, e.g. discount = %d',
  async (condition, condition_limit, test) => {
    const input = {
      cpf: '714.318.330-02',
      products: [
        { description: 'lençol', qty: 2, price: 10 },
        { description: 'toalha', qty: 1, price: 25 },
        { description: 'fronha', qty: 10, price: 12 },
      ],
      discount: test as number,
    };
    const response = await axios.post('http://localhost:3000/checkout', input);
    const output = response.data;
    expect(output.message).toBe('Discount Could not be Inserted');
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
