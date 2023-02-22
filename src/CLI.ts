import Product from './Product';
import OrderFactory from './OrderFactory';
import { Database } from 'sqlite3';
import CouponDateValidationHandler from './CouponDateValidationHandler';
import CouponValueValidationHandler from './CouponValueValidationHandler';
import CouponZeroValueValidationHandler from './CouponZeroValueValidationHandler';
const input: any = { cpf: '', products: [] };
const couponDateValidation = new CouponDateValidationHandler();
const couponValueValidation = new CouponValueValidationHandler(
  couponDateValidation,
);
const couponZeroValueValidation = new CouponZeroValueValidationHandler(
  couponValueValidation,
);

process.stdin.on('data', async function (chunk) {
  const db = new Database('projectdb.sqlite');
  // hack to simulate node-postgres
  const query = function (db: any, sql: any, params: any) {
    const that = db;
    return new Promise(function (resolve, reject) {
      that.all(sql, params, function (error: any, rows: any) {
        if (error) reject(error);
        else resolve({ rows: rows });
      });
    });
  };
  const command = chunk.toString().replace(/\n/g, '');
  if (command.startsWith('set-cpf')) {
    input.cpf = command.replace('set-cpf ', '');
    console.log(input);
  }
  if (command.startsWith('add-product')) {
    const [idProduct, quantity] = command
      .replace('add-product ', '')
      .split(' ');
    input.products.push({
      id: parseInt(idProduct),
      qty: parseInt(quantity),
    });
    console.log(input);
  }
  if (command.startsWith('checkout')) {
    try {
      const cpf: string = input.cpf;
      const products = input.products ? input.products : undefined;
      const discount = input.discount ? input.discount : '';
      const order = OrderFactory.create(cpf, couponZeroValueValidation);
      if (products.size === 0) {
        throw new Error('There is no product inserted');
      }
      for (const product of products) {
        const res_product: any = await query(
          db,
          `SELECT * FROM product WHERE id=${product.id}`,
          [],
        );
        order.addProduct(
          new Product(
            res_product.rows[0].id,
            res_product.rows[0].description,
            product.qty,
            res_product.rows[0].price,
            res_product.rows[0].weight,
            res_product.rows[0].height,
            res_product.rows[0].width,
            res_product.rows[0].depth,
          ),
        );
      }

      const coupon: any = await query(
        db,
        `SELECT percentage, expiry FROM coupon WHERE code='${discount}'`,
        [],
      );
      order.applyDiscount(
        coupon.rows[0]?.percentage ? coupon.rows[0].percentage : 0,
        new Date(coupon.rows[0]?.expiry ? coupon.rows[0].expiry : '1994-01-01'),
      );
      console.log({
        status: 'OK',
        message:
          input.from && input.to
            ? order.calculateOrderPrice() + order.calculateShipmentOrder()
            : order.calculateOrderPrice(),
        freight: input.from && input.to ? order.calculateShipmentOrder() : 0,
      });
    } catch (e) {
      console.log(e);
    }
  }
});
