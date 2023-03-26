import 'reflect-metadata';
import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import AppError from './Error';
import Checkout from './Checkout';
const app = express();
app.use(express.json());

app.post('/checkout', async function (request: Request, response: Response) {
  const checkout = new Checkout();
  const output = await checkout.execute(request.body);
  response.send(output);
});

// app.post('/order', async function (request: Request, response: Response) {
//   const checkout = new Checkout();
//   const orderDatabase = new OrderDatabase();
//   const output_checkout = await checkout.execute(request.body);
//   request.body.freight = output_checkout.freight;
//   request.body.total = output_checkout.total;
//   request.body.coupon_valid = output_checkout.coupon_valid;
//   const output_order = await orderDatabase.execute(request.body);
//   response.send(output_order);
// });

app.use(
  (error: Error, request: Request, response: Response, next: NextFunction) => {
    if (error instanceof AppError) {
      return response.status(error.statusCode).json({
        message: error.message,
      });
    }
    console.log(error);
    return response.status(500).json({
      message: 'Internal Server Error',
    });
  },
);

app.listen(3000, () => {
  console.log('Server Running at Port 3000');
});
