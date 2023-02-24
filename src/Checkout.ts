import Product from './Product';
import CouponDateValidationHandler from './CouponDateValidationHandler';
import CouponValueValidationHandler from './CouponValueValidationHandler';
import CouponZeroValueValidationHandler from './CouponZeroValueValidationHandler';
import OrderFactory from './OrderFactory';
import AppError from './Error';
import ProductRepositoryDatabase from './ProductRepositoryDatabase';
import CouponRepositoryDatabase from './CouponRepositoryDatabase';
import CurrencyGatewayHttp from './CurrencyGatewayHttp';
import CurrencyGateway from './CurrencyGateway';
import ProductsRepository from './ProductsRepository';
import CouponRepository from './CouponRepository';

const couponDateValidation = new CouponDateValidationHandler();
const couponValueValidation = new CouponValueValidationHandler(
  couponDateValidation,
);
const couponZeroValueValidation = new CouponZeroValueValidationHandler(
  couponValueValidation,
);

export default class Checkout {
  constructor(
    readonly currencyGateway: CurrencyGateway = new CurrencyGatewayHttp(),
    readonly productRepo: ProductsRepository = new ProductRepositoryDatabase(),
    readonly couponRepo: CouponRepository = new CouponRepositoryDatabase(),
  ) {}
  async execute(input: Input): Promise<Output> {
    const currencies = await this.currencyGateway.getCurrencies();
    const cpf: string = input.cpf;
    const products = input.products ? input.products : [];
    const discount = input.discount ? input.discount : '';
    const order = OrderFactory.create(cpf, couponZeroValueValidation);
    if (products.length === 0) {
      throw new AppError('There is no product inserted');
    }
    for (const product of products) {
      const res_product: any = await this.productRepo.getProduct(product.id);
      if (res_product.rows[0].currency === 'USD') {
        res_product.rows[0].price =
          parseFloat(res_product.rows[0].price) * currencies.usd;
      }
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

    const coupon: any = await this.couponRepo.getCoupon(discount);
    order.applyDiscount(
      coupon.rows[0]?.percentage ? coupon.rows[0].percentage : 0,
      new Date(coupon.rows[0]?.expiry ? coupon.rows[0].expiry : '1994-01-01'),
    );
    return {
      status: 'OK',
      message:
        input.from && input.to
          ? order.calculateOrderPrice() + order.calculateShipmentOrder()
          : order.calculateOrderPrice(),
      freight: input.from && input.to ? order.calculateShipmentOrder() : 0,
    };
  }
}

interface Input {
  cpf: string;
  products: Products[];
  discount?: string;
  from?: string;
  to?: string;
}

interface Products {
  id: number;
  qty: number;
}

interface Output {
  status: any;
  message: any;
  freight: number;
}
