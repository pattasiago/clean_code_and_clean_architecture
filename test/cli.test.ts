import CLIController from '../src/CLIController';
import CLIHandler from '../src/CLIHandler';
import Connection from '../src/Connection';
import CouponRepositoryDatabase from '../src/CouponRepositoryDatabase';
import CurrencyGatewayHttp from '../src/CurrencyGatewayHttp';
import OrderRepositoryDatabase from '../src/OrderRepositoryDatabase';
import ProductRepositoryDatabase from '../src/ProductRepositoryDatabase';
import SQLITE from '../src/SQLITEAdapter';
import Checkout from '../src/application/usecase/Checkout';

let checkout: Checkout;
let connection: Connection;

beforeEach(function () {
  connection = new SQLITE();
  const currencyGateway = new CurrencyGatewayHttp();
  const productRepository = new ProductRepositoryDatabase(connection);
  const couponRepository = new CouponRepositoryDatabase(connection);
  const orderRepository = new OrderRepositoryDatabase(connection);
  checkout = new Checkout(
    currencyGateway,
    productRepository,
    couponRepository,
    orderRepository,
  );
});

afterAll(async function () {
  await connection.close();
});

test('Deve testar o cli', async function () {
  let output: any;
  const handler = new (class extends CLIHandler {
    write(text: string): void {
      output = JSON.parse(text);
    }
  })();
  new CLIController(handler, checkout);
  handler.type('set-cpf 407.302.170-27');
  handler.type('add-item 1 1');
  await handler.type('checkout');
  // console.log(output);
  expect(output.total).toBe(1000);
  expect(output.freight).toBe(30);
});
