import Coupon from '../../domain/entity/Coupon';
import CouponRepository from '../../application/repository/CouponRepository';
import Connection from '../database/Connection';

export default class CouponRepositoryDatabase implements CouponRepository {
  constructor(readonly connection: Connection) {}

  async getCoupon(code: string): Promise<any> {
    const coupon: any = await this.connection.query(
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
