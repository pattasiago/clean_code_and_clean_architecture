import { Database } from 'sqlite3';
import OrderRepository from './OrderRepository';

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

// const insermultipletdb = function (db: any, sql: any, params: any) {
//   const that = db;
//   return new Promise(function (resolve, reject) {
//     that.run(sql, params, function (this: any, error: any) {
//       if (error) reject(error);
//       else resolve(this);
//     });
//   });
// };

export default class OrderRepositoryDatabase implements OrderRepository {
  async getOrder(id: string): Promise<any> {
    const order: any = await query(
      db,
      `SELECT * FROM orders WHERE id='${id}'`,
      [],
    );
    return order.rows[0];
  }

  async getOrders(): Promise<any> {
    return query(db, `SELECT * FROM orders`, []);
  }

  async getLastSerialNumber(): Promise<any> {
    const serialNumberQuery: any = await query(
      db,
      `SELECT serial_number FROM orders ORDER BY 1 DESC LIMIT 1`,
      [],
    );
    return serialNumberQuery.rows[0]?.serial_number
      ? serialNumberQuery.rows[0].serial_number
      : '0';
  }

  async createOrder(order: any): Promise<any> {
    let lastSerialNumber = await this.getLastSerialNumber();
    if (lastSerialNumber === '0') {
      lastSerialNumber = parseInt(`${new Date().getFullYear()}00000000`);
    } else {
      lastSerialNumber = parseInt(lastSerialNumber) + 1;
    }
    lastSerialNumber = `${lastSerialNumber}`;
    let sql =
      'INSERT INTO orders(id, cpf, freight, total, coupon, coupon_valid, serial_number) VALUES (?,?,?,?,?,?,?)';

    const createOrderid: any = await insertdb(db, sql, [
      order.uuid,
      order.cpf,
      order.freight ? order.freight : 0,
      order.total,
      order.discount ? order.discount : 'NULL',
      order.discount ? Number(order.coupon_valid) : 0,
      lastSerialNumber,
    ]);

    const products = [];
    for (let i = 0; i < order.products.length; i++) {
      const product = [
        createOrderid.lastID,
        order.products[i].id,
        order.products[i].qty,
        order.products[i].price,
      ];
      products.push(...product);
    }
    // console.log(products);
    const placeholders = order.products.map(() => '(?, ?, ?, ?)').join(', ');
    sql =
      'INSERT INTO order_products(id_order, id_product, qty, price) VALUES ' +
      placeholders;

    const createOrderProductid = await insertdb(db, sql, products);
    // console.log(createOrderProductid);
    return true;
  }
}
