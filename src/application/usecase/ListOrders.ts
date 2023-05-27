import OrderRepository from '../../OrderRepository';
import OrderRepositoryDatabase from '../../OrderRepositoryDatabase';

export default class ListOrders {
  constructor(
    readonly orderRepository: OrderRepository = new OrderRepositoryDatabase(),
  ) {}

  async execute(): Promise<Output[]> {
    const orders = await this.orderRepository.getOrders();
    const output: Output[] = [];
    for (const order of orders) {
      output.push({
        idOrder: order.idOrder,
        cpf: order.cpf.value,
        date: order.date,
      });
    }
    return output;
  }
}

type Output = {
  idOrder: string | undefined;
  cpf: string;
  date: Date;
};
