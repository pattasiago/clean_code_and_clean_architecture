import Connection from '../src/Connection';
import CouponRepositoryDatabase from '../src/CouponRepositoryDatabase';
import SQLITE from '../src/SQLITEAdapter';
import ValidateCoupon from '../src/application/usecase/ValidateCoupon';

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
