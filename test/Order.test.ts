import Order from '../src/Order';
import Product from '../src/Product';

test('Should create an order with 3 products and calculates the final order price', function () {
  const cpf = '714.318.330-02';
  const order = new Order(cpf);
  const product1 = new Product('lençol', 2, 10);
  const product2 = new Product('toalha', 1, 25);
  const product3 = new Product('fronha', 10, 12);

  order.addProduct(product1);
  order.addProduct(product2);
  order.addProduct(product3);

  expect(order.calculateOrderPrice()).toBe(165);
});

test('Should create an order with 3 products, apply 10% discount, and calculates the final order price', function () {
  const cpf = '714.318.330-02';
  const order = new Order(cpf);
  const product1 = new Product('lençol', 2, 10);
  const product2 = new Product('toalha', 1, 25);
  const product3 = new Product('fronha', 10, 12);

  order.addProduct(product1);
  order.addProduct(product2);
  order.addProduct(product3);
  order.insertDiscount(10);

  expect(order.calculateOrderPrice()).toBe(148.5);
});

test('Should not create an order with invalid cpf', function () {
  const cpf = '714.318.330-01';
  expect(() => new Order(cpf)).toThrow(new Error('Invalid CPF'));
});
