import { Database } from 'sqlite3';
import ProductsRepository from './ProductsRepository';

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

export default class ProductRepositoryDatabase implements ProductsRepository {
  async getProduct(id: number): Promise<any> {
    return query(db, `SELECT * FROM product WHERE id=${id}`, []);
  }
}
