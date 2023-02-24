import { Database } from 'sqlite3';

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

export default class CouponRepositoryDatabase {
  async getCoupon(discount: string): Promise<any> {
    return query(
      db,
      `SELECT percentage, expiry FROM coupon WHERE code='${discount}'`,
      [],
    );
  }
}
