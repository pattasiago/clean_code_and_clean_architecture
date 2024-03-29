import CurrencyGateway from '../../src/application/gateway/CurrencyGateway';
import ProductRepository from '../../src/application/repository/ProductRepository';
import Checkout from '../../src/application/usecase/Checkout';
import GetOrder from '../../src/application/usecase/GetOrder';
import ListOrders from '../../src/application/usecase/ListOrders';
import Order from '../../src/domain/entity/Order';
import Product from '../../src/domain/entity/Product';
import Connection from '../../src/infra/database/Connection';
import SQLITE from '../../src/infra/database/SQLITEAdapter';
import CurrencyGatewayHttp from '../../src/infra/gateway/CurrencyGatewayHttp';
import AxiosAdapter from '../../src/infra/http/AxiosAdapter';
import CouponRepositoryDatabase from '../../src/infra/repository/CouponRepositoryDatabase';
import OrderRepositoryDatabase from '../../src/infra/repository/OrderRepositoryDatabase';
import ProductRepositoryDatabase from '../../src/infra/repository/ProductRepositoryDatabase';
import sinon from 'sinon';
import crypto from 'crypto';

let checkout: Checkout;
let getOrder: GetOrder;
let listOrders: ListOrders;
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
  getOrder = new GetOrder(orderRepository);
  listOrders = new ListOrders(orderRepository);
});

afterAll(async function () {
  await connection.close();
});

test('Não deve aceitar um pedido com cpf inválido', async function () {
  const input = {
    cpf: '406.302.170-27',
    items: [],
  };
  await expect(() => checkout.execute(input)).rejects.toThrow(
    new Error('Invalid cpf'),
  );
});

test('Deve criar um pedido vazio', async function () {
  const input = {
    cpf: '407.302.170-27',
    items: [],
  };
  const output = await checkout.execute(input);
  expect(output.total).toBe(0);
});

test('Deve criar um pedido com 3 produtos', async function () {
  const uuid = crypto.randomUUID();
  const input = {
    uuid,
    cpf: '407.302.170-27',
    items: [
      { idProduct: 1, quantity: 1 },
      { idProduct: 2, quantity: 1 },
      { idProduct: 3, quantity: 3 },
    ],
  };
  await checkout.execute(input);
  const output = await getOrder.execute(uuid);
  expect(output.total).toBe(6090);
});

test('Deve criar um pedido com 3 produtos com cupom de desconto', async function () {
  const input = {
    cpf: '407.302.170-27',
    items: [
      { idProduct: 1, quantity: 1 },
      { idProduct: 2, quantity: 1 },
      { idProduct: 3, quantity: 3 },
    ],
    coupon: 'VALE20',
  };
  const output = await checkout.execute(input);
  expect(output.total).toBe(4872);
});

test('Deve criar um pedido com 3 produtos com cupom de desconto expirado', async function () {
  const input = {
    cpf: '407.302.170-27',
    items: [
      { idProduct: 1, quantity: 1 },
      { idProduct: 2, quantity: 1 },
      { idProduct: 3, quantity: 3 },
    ],
    coupon: 'VALE10',
  };
  const output = await checkout.execute(input);
  expect(output.total).toBe(6090);
});

test('Não deve criar um pedido com quantidade negativa', async function () {
  const input = {
    cpf: '407.302.170-27',
    items: [{ idProduct: 1, quantity: -1 }],
  };
  await expect(() => checkout.execute(input)).rejects.toThrow(
    new Error('Invalid quantity'),
  );
});

test('Não deve criar um pedido com item duplicado', async function () {
  const input = {
    cpf: '407.302.170-27',
    items: [
      { idProduct: 1, quantity: 1 },
      { idProduct: 1, quantity: 1 },
    ],
  };
  await expect(() => checkout.execute(input)).rejects.toThrow(
    new Error('Duplicated item'),
  );
});

test('Deve criar um pedido com 1 produto calculando o frete', async function () {
  const input = {
    cpf: '407.302.170-27',
    items: [{ idProduct: 1, quantity: 3 }],
    from: '22060030',
    to: '88015600',
  };
  const output = await checkout.execute(input);
  expect(output.freight).toBe(90);
  expect(output.total).toBe(3090);
});

test('Não deve criar um pedido se o produto tiver alguma dimensão negativa', async function () {
  const input = {
    cpf: '407.302.170-27',
    items: [{ idProduct: 4, quantity: 1 }],
  };
  await expect(() => checkout.execute(input)).rejects.toThrow(
    new Error('Invalid dimension'),
  );
});

test('Deve criar um pedido com 1 produto calculando o frete com valor mínimo', async function () {
  const input = {
    cpf: '407.302.170-27',
    items: [{ idProduct: 3, quantity: 1 }],
    from: '22060030',
    to: '88015600',
  };
  const output = await checkout.execute(input);
  expect(output.freight).toBe(10);
  expect(output.total).toBe(40);
});

test('Deve criar um pedido com 1 produto em dólar usando um stub', async function () {
  const stubCurrencyGateway = sinon
    .stub(CurrencyGatewayHttp.prototype, 'getCurrencies')
    .resolves({
      usd: 3,
    });
  const stubProductRepository = sinon
    .stub(ProductRepositoryDatabase.prototype, 'getProduct')
    .resolves(new Product(5, 'A', 1000, 10, 10, 10, 10, 'USD'));
  const input = {
    cpf: '407.302.170-27',
    items: [{ idProduct: 5, quantity: 1 }],
  };
  const output = await checkout.execute(input);
  expect(output.total).toBe(3000);
  stubCurrencyGateway.restore();
  stubProductRepository.restore();
});

test('Deve criar um pedido com 3 produtos com cupom de desconto com spy', async function () {
  const spyProductRepository = sinon.spy(
    ProductRepositoryDatabase.prototype,
    'getProduct',
  );
  const spyCouponRepository = sinon.spy(
    CouponRepositoryDatabase.prototype,
    'getCoupon',
  );
  const input = {
    cpf: '407.302.170-27',
    items: [
      { idProduct: 1, quantity: 1 },
      { idProduct: 2, quantity: 1 },
      { idProduct: 3, quantity: 3 },
    ],
    coupon: 'VALE20',
  };
  const output = await checkout.execute(input);
  expect(output.total).toBe(4872);
  expect(spyCouponRepository.calledOnce).toBeTruthy();
  expect(spyCouponRepository.calledWith('VALE20')).toBeTruthy();
  expect(spyProductRepository.calledThrice).toBeTruthy();
  spyCouponRepository.restore();
  spyProductRepository.restore();
});

test('Deve criar um pedido com 1 produto em dólar usando um mock', async function () {
  const mockCurrencyGateway = sinon.mock(CurrencyGatewayHttp.prototype);
  mockCurrencyGateway.expects('getCurrencies').once().resolves({
    usd: 3,
  });
  const input = {
    cpf: '407.302.170-27',
    items: [{ idProduct: 5, quantity: 1 }],
  };
  const output = await checkout.execute(input);
  expect(output.total).toBe(3000);
  mockCurrencyGateway.verify();
  mockCurrencyGateway.restore();
});

test('Deve criar um pedido com 1 produto em dólar usando um fake', async function () {
  const currencyGateway: CurrencyGateway = {
    async getCurrencies(): Promise<any> {
      return {
        usd: 3,
      };
    },
  };
  const productRepository: ProductRepository = {
    async getProduct(idProduct: number): Promise<any> {
      return new Product(6, 'A', 1000, 10, 10, 10, 10, 'USD');
    },
  };
  const couponRepository = new CouponRepositoryDatabase(connection);
  const orderRepository = new OrderRepositoryDatabase(connection);
  checkout = new Checkout(
    currencyGateway,
    productRepository,
    couponRepository,
    orderRepository,
  );
  const input = {
    cpf: '407.302.170-27',
    items: [{ idProduct: 6, quantity: 1 }],
  };
  const output = await checkout.execute(input);
  expect(output.total).toBe(3000);
});

test('Deve criar um pedido e verificar o código de série', async function () {
  const stub = sinon
    .stub(OrderRepositoryDatabase.prototype, 'count')
    .resolves(1);
  const uuid = crypto.randomUUID();
  const input = {
    uuid,
    cpf: '407.302.170-27',
    items: [
      { idProduct: 1, quantity: 1 },
      { idProduct: 2, quantity: 1 },
      { idProduct: 3, quantity: 3 },
    ],
  };
  await checkout.execute(input);
  const output = await getOrder.execute(uuid);
  expect(output.code).toBe('202300000001');
  stub.restore();
});

test('Deve criar um pedido e verificar o código de série', async function () {
  const date1: Date = new Date();
  const date2: Date = new Date();
  const orders: Order[] = [
    new Order('123456789', '407.302.170-27', undefined, 1, date1),
    new Order('987654321', '407.302.170-27', undefined, 1, date2),
  ];
  const stub = sinon
    .stub(OrderRepositoryDatabase.prototype, 'getOrders')
    .resolves(orders);
  const output = await listOrders.execute();
  expect(output).toStrictEqual([
    {
      idOrder: '123456789',
      cpf: '407.302.170-27',
      date: date1,
    },
    {
      idOrder: '987654321',
      cpf: '407.302.170-27',
      date: date2,
    },
  ]);
  stub.restore();
});
