import SimulateFreight from '../../src/application/usecase/SimulateFreight';
import Connection from '../../src/infra/database/Connection';
import SQLITE from '../../src/infra/database/SQLITEAdapter';
import ProductRepositoryDatabase from '../../src/infra/repository/ProductRepositoryDatabase';

let simulateFreight: SimulateFreight;
let connection: Connection;

beforeEach(function () {
  connection = new SQLITE();
  const productRepository = new ProductRepositoryDatabase(connection);
  simulateFreight = new SimulateFreight(productRepository);
});

afterEach(async function () {
  await connection.close();
});

test('Deve calcular o frete para um pedido com 3 itens', async function () {
  const input = {
    items: [
      { idProduct: 1, quantity: 1 },
      { idProduct: 2, quantity: 1 },
      { idProduct: 3, quantity: 3 },
    ],
    from: '22060030',
    to: '88015600',
  };
  const output = await simulateFreight.execute(input);
  expect(output.freight).toBe(280);
});
