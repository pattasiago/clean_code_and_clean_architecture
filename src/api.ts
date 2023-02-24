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
