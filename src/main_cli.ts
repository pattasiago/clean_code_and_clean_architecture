import CLIController from './CLIController';
import CLIHandlerNode from './CLIHandlerNode';
import CouponRepositoryDatabase from './CouponRepositoryDatabase';
import CurrencyGatewayHttp from './CurrencyGatewayHttp';
import OrderRepositoryDatabase from './OrderRepositoryDatabase';
import ProductRepositoryDatabase from './ProductRepositoryDatabase';
import SQLITE from './SQLITEAdapter';
import Checkout from './application/usecase/Checkout';

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
const handler = new CLIHandlerNode();
new CLIController(handler, checkout);
