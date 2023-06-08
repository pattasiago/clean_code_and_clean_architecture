import Order from '../../domain/entity/Order';
import Item from '../../domain/entity/Item';
import Connection from '../database/Connection';
import OrderRepository from '../../application/repository/OrderRepository';

export default class OrderRepositoryDatabase implements OrderRepository {
  constructor(readonly connection: Connection) {}
  async getById(id: string): Promise<Order> {
    const orderData: any = await this.connection.query(
      `SELECT * FROM orders WHERE id_order='${id}'`,
      [],
    );

    const order = new Order(
      orderData.rows[0].id_order,
      orderData.rows[0].cpf,
      undefined,
      1,
      new Date(),
    );

    const itemsData: any = await this.connection.query(
      `SELECT * FROM item WHERE id_order='${id}'`,
      [],
    );

    for (const itemData of itemsData.rows) {
      order.items.push(
        new Item(
          itemData.id_product,
          parseFloat(itemData.price),
          itemData.quantity,
          'BRL',
        ),
      );
    }
    return order;
  }

  async getOrders(): Promise<Order[]> {
    const ordersData: any = await this.connection.query(
      `SELECT * FROM orders`,
      [],
    );
    const orders: Order[] = [];
    for (const order of ordersData.rows) {
      orders.push(
        new Order(order.id_order, order.cpf, undefined, 1, new Date()),
      );
    }
    return orders;
  }

  async count(): Promise<number> {
    const options: any = await this.connection.query(
      'select count(*) as count from orders',
      [],
    );
    return parseInt(options.rows[0].count);
  }

  async save(order: Order): Promise<void> {
    await this.connection.insertdb(
      'insert into orders (id_order, cpf, code, total, freight) values (?, ?, ?, ?, ?)',
      [
        order.idOrder,
        order.cpf.value,
        order.code,
        order.getTotal(),
        order.freight,
      ],
    );
    for (const item of order.items) {
      await this.connection.insertdb(
        'insert into item (id_order, id_product, price, quantity) values (?, ?, ?, ?)',
        [order.idOrder, item.idProduct, item.price, item.quantity],
      );
    }
  }
}
