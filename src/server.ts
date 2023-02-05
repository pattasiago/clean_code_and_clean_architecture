import 'reflect-metadata';
import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import AppError from './Error';
import Product from './Product';
import OrderFactory from './OrderFactory';
const app = express();
app.use(express.json());

app.post('/checkout', function (request: Request, response: Response) {
  const cpf: string = request.body.cpf;
  const products = request.body.products ? request.body.products : [];
  const discount = request.body.discount ? request.body.discount : 0;
  const order = OrderFactory.create(cpf);
  for (const product of products) {
    order.addProduct(
      new Product(product.description, product.qty, product.price),
    );
  }
  order.insertDiscount(discount);
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
