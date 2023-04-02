import { Database } from 'sqlite3';
import Coupon from './domain/entity/Coupon';
import CouponRepository from './CouponRepository';

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

export default class CouponRepositoryDatabase implements CouponRepository {
  async getCoupon(code: string): Promise<any> {
    const coupon: any = await query(
      db,
      `SELECT * FROM coupon WHERE code='${code}'`,
      [],
    );
    return new Coupon(
      coupon.rows[0].code,
      parseFloat(coupon.rows[0].percentage),
      coupon.rows[0].expire_date,
    );
  }
}
