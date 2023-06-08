import Checkout from '../../src/application/usecase/Checkout';
import CLIController from '../../src/infra/cli/CLIController';
import CLIHandler from '../../src/infra/cli/CLIHandler';
import Connection from '../../src/infra/database/Connection';
import SQLITE from '../../src/infra/database/SQLITEAdapter';
import CurrencyGatewayHttp from '../../src/infra/gateway/CurrencyGatewayHttp';
import AxiosAdapter from '../../src/infra/http/AxiosAdapter';
import CouponRepositoryDatabase from '../../src/infra/repository/CouponRepositoryDatabase';
import OrderRepositoryDatabase from '../../src/infra/repository/OrderRepositoryDatabase';
import ProductRepositoryDatabase from '../../src/infra/repository/ProductRepositoryDatabase';

let checkout: Checkout;
let connection: Connection;

beforeEach(function () {
  connection = new SQLITE();
  const httpClient = new AxiosAdapter();
  const currencyGateway = new CurrencyGatewayHttp(httpClient);
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
