import AxiosAdapter from './infra/http/AxiosAdapter';
import CLIController from './infra/cli/CLIController';
import CLIHandlerNode from './infra/cli/CLIHandlerNode';
import CouponRepositoryDatabase from './infra/repository/CouponRepositoryDatabase';
import CurrencyGatewayHttp from './infra/gateway/CurrencyGatewayHttp';
import OrderRepositoryDatabase from './infra/repository/OrderRepositoryDatabase';
import ProductRepositoryDatabase from './infra/repository/ProductRepositoryDatabase';
import SQLITE from './infra/database/SQLITEAdapter';
import Checkout from './application/usecase/Checkout';

const connection = new SQLITE();
const httpClient = new AxiosAdapter();
const currencyGateway = new CurrencyGatewayHttp(httpClient);
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
