import AxiosAdapter from './infra/http/AxiosAdapter';
import CouponRepositoryDatabase from './infra/repository/CouponRepositoryDatabase';
import CurrencyGatewayHttp from './infra/gateway/CurrencyGatewayHttp';
import ExpressAdapter from './infra/http/ExpressAdapter';
import HttpController from './infra/http/HttpController';
import OrderRepositoryDatabase from './infra/repository/OrderRepositoryDatabase';
import ProductRepositoryDatabase from './infra/repository/ProductRepositoryDatabase';
import SQLITE from './infra/database/SQLITEAdapter';
import Checkout from './application/usecase/Checkout';

const httpServer = new ExpressAdapter();
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

new HttpController(httpServer, checkout);
httpServer.list(3000);
