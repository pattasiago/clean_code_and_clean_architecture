export default interface CouponRepository {
  getCoupon(discount: string): Promise<any>;
}
