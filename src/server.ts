import 'reflect-metadata';
import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import AppError from './Error';
import Product from './Product';
import OrderFactory from './OrderFactory';
import { Database } from 'sqlite3';
import CouponDateValidationHandler from './CouponDateValidationHandler';
import CouponValueValidationHandler from './CouponValueValidationHandler';
import CouponZeroValueValidationHandler from './CouponZeroValueValidationHandler';
const app = express();
app.use(express.json());

const couponDateValidation = new CouponDateValidationHandler();
const couponValueValidation = new CouponValueValidationHandler(
  couponDateValidation,
);
const couponZeroValueValidation = new CouponZeroValueValidationHandler(
  couponValueValidation,
);

// Open a SQLite database, stored in the file db.sqlite
const db = new Database('projectdb.sqlite');
// hack to simulate node-postgres
db.query = function (sql, params) {
  let that = this;
  return new Promise(function (resolve, reject) {
    that.all(sql, params, function (error, rows) {
      if (error) reject(error);
      else resolve({ rows: rows });
    });
  });
};

app.post('/checkout', async function (request: Request, response: Response) {
  const cpf: string = request.body.cpf;
  const products = request.body.products ? request.body.products : [];
  const discount = request.body.discount ? request.body.discount : '';
  const order = OrderFactory.create(cpf, couponZeroValueValidation);
  for (const product of products) {
    const res_product = await db.query(
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

  const coupon = await db.query(
    `SELECT percentage, expiry FROM coupon WHERE code='${discount}'`,
    [],
  );
  order.applyDiscount(
    coupon.rows[0]?.percentage ? coupon.rows[0].percentage : 0,
    new Date(coupon.rows[0]?.expiry ? coupon.rows[0].expiry : '1994-01-01'),
  );
  response.send({ status: 'OK', message: order.calculateOrderPrice() });
});

app.use(
  (error: Error, request: Request, response: Response, next: NextFunction) => {
    if (error instanceof AppError) {
      return response.status(200).json({
        status: 'error',
        message: error.message,
      });
    }
    console.log(error);
    return response.status(200).json({
      status: 'error',
      message: 'Internal Server Error',
    });
  },
);

app.listen(3000, () => {
  console.log('Server Running at Port 3000');
});
