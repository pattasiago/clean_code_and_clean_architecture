import { Database } from 'sqlite3';
import OrderRepository from './OrderRepository';
import Order from './domain/entity/Order';
import Item from './domain/entity/Item';

const db = new Database('projectdb.sqlite');

// hack to simulate node-postgres
const query = function (db: any, sql: any, params: any) {
  const that = db;
  return new Promise(function (resolve, reject) {
    that.all(sql, params, function (error: any, rows: any) {
      if (error) reject(error);
      else resolve({ rows: rows });
    });
  });
};

const insertdb = function (db: any, sql: any, params: any) {
  const that = db;
  return new Promise(function (resolve, reject) {
    that.serialize(function () {
      that.run(sql, params, function (this: any, error: any) {
        if (error) reject(error);
        else resolve(this);
      });
    });
  });
};

export default class OrderRepositoryDatabase implements OrderRepository {
  async getById(id: string): Promise<Order> {
    const orderData: any = await query(
      db,
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

    const itemsData: any = await query(
      db,
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
    const ordersData: any = await query(db, `SELECT * FROM orders`, []);
    const orders: Order[] = [];
    for (const order of ordersData.rows) {
      orders.push(
        new Order(order.id_order, order.cpf, undefined, 1, new Date()),
      );
    }
    return orders;
  }

  async count(): Promise<number> {
    const options: any = await query(
      db,
      'select count(*) as count from orders',
      [],
    );
    return parseInt(options.rows[0].count);
  }

  async save(order: Order): Promise<void> {
    await insertdb(
      db,
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
      await insertdb(
        db,
        'insert into item (id_order, id_product, price, quantity) values (?, ?, ?, ?)',
        [order.idOrder, item.idProduct, item.price, item.quantity],
      );
    }
  }
}
