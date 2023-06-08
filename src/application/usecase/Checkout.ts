import CouponRepository from '../repository/CouponRepository';
import CurrencyGateway from '../gateway/CurrencyGateway';
import CurrencyTable from '../../domain/entity/CurrencyTable';
import FreightCalculator from '../../domain/entity/FreightCalculator';
import Order from '../../domain/entity/Order';
import ProductRepository from '../repository/ProductRepository';
import OrderRepository from '../repository/OrderRepository';

export default class Checkout {
  constructor(
    readonly currencyGateway: CurrencyGateway,
    readonly productRepository: ProductRepository,
    readonly couponRepository: CouponRepository,
    readonly orderRepository: OrderRepository,
  ) {}

  async execute(input: Input): Promise<Output> {
    const currencies = await this.currencyGateway.getCurrencies();
    const currencyTable = new CurrencyTable();
    currencyTable.addCurrency('USD', currencies.usd);
    const sequence = await this.orderRepository.count();
    const order = new Order(
      input.uuid,
      input.cpf,
      currencyTable,
      sequence,
      new Date(),
    );
    let freight = 0;
    if (input.items) {
      for (const item of input.items) {
        const product = await this.productRepository.getProduct(item.idProduct);
        order.addItem(product, item.quantity);
        const itemFreight = FreightCalculator.calculate(product, item.quantity);
        freight += itemFreight;
      }
    }
    if (input.from && input.to) {
      order.freight = freight;
    }
    if (input.coupon) {
      const coupon = await this.couponRepository.getCoupon(input.coupon);
      order.addCoupon(coupon);
    }
    const total = order.getTotal();
    await this.orderRepository.save(order);
    return {
      total,
      freight,
    };
  }
}

type Input = {
  uuid?: string;
  cpf: string;
  items: { idProduct: number; quantity: number; price?: number }[];
  coupon?: string;
  from?: string;
  to?: string;
};

type Output = {
  total: number;
  freight: number;
};
