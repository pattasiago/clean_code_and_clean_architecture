import OrderRepositoryDatabase from './OrderRepositoryDatabase';

export default class GetOrder {
  constructor(
    readonly orderRepo: OrderRepositoryDatabase = new OrderRepositoryDatabase(),
  ) {}
  async execute(id: string): Promise<Output> {
    const output: Output = {
      total: 0,
      freight: 0,
      serial: '',
    };
    const orderData = await this.orderRepo.getOrder(id);
    output.total = orderData.total;
    output.freight = orderData.freight;
    output.serial = orderData.serial_number;
    return output;
  }
}

interface Output {
  serial: string;
  total: any;
  freight: number;
}
