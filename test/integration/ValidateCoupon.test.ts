import ValidateCoupon from '../../src/application/usecase/ValidateCoupon';
import Connection from '../../src/infra/database/Connection';
import SQLITE from '../../src/infra/database/SQLITEAdapter';
import CouponRepositoryDatabase from '../../src/infra/repository/CouponRepositoryDatabase';

let validateCoupon: ValidateCoupon;
let connection: Connection;

beforeEach(function () {
  connection = new SQLITE();
  const couponRepository = new CouponRepositoryDatabase(connection);
  validateCoupon = new ValidateCoupon(couponRepository);
});

afterEach(async function () {
  await connection.close();
});

test('Deve validar um cupom de desconto válido', async function () {
  const input = 'VALE20';
  const output = await validateCoupon.execute(input);
  expect(output).toBeTruthy();
});

test('Deve validar um cupom de desconto expirado', async function () {
  const input = 'VALE10';
  const output = await validateCoupon.execute(input);
  expect(output).toBeFalsy();
});
