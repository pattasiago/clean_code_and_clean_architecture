import FreightCalculator from '../src/domain/entity/FreightCalculator';
import Product from '../src/domain/entity/Product';

test('Deve calcular o frete do produto com quantidade 1', function () {
  const product = new Product(6, 'A', 1000, 100, 30, 10, 3, 'USD');
  const freight = FreightCalculator.calculate(product);
  expect(freight).toBe(30);
});

test('Deve calcular o frete do produto com quantidade 3', function () {
  const product = new Product(6, 'A', 1000, 100, 30, 10, 3, 'USD');
  const freight = FreightCalculator.calculate(product, 3);
  expect(freight).toBe(90);
});

test('Deve calcular o frete do produto com preco minimo', function () {
  const product = new Product(6, 'A', 1000, 100, 30, 10, 0.9, 'USD');
  const freight = FreightCalculator.calculate(product);
  expect(freight).toBe(10);
});
