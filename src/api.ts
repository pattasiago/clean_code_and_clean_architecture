import express, { Request, Response } from 'express';
import Checkout from './application/usecase/Checkout';
import SQLITE from './SQLITEAdapter';
import CurrencyGatewayHttp from './CurrencyGatewayHttp';
import ProductRepositoryDatabase from './ProductRepositoryDatabase';
import CouponRepositoryDatabase from './CouponRepositoryDatabase';
import OrderRepositoryDatabase from './OrderRepositoryDatabase';
const app = express();
app.use(express.json());

app.post('/checkout', async function (req: Request, res: Response) {
  try {
    const connection = new SQLITE();
    const currencyGateway = new CurrencyGatewayHttp();
    const productRepository = new ProductRepositoryDatabase(connection);
    const couponRepository = new CouponRepositoryDatabase(connection);
    const orderRepository = new OrderRepositoryDatabase(connection);
    const checkout = new Checkout(
      currencyGateway,
      productRepository,
      couponRepository,
      orderRepository,
    );
    const output = await checkout.execute(req.body);
    res.json(output);
  } catch (e: any) {
    res.status(422).json({
      message: e.message,
    });
  }
});

app.listen(3000);
