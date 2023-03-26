// interface Input {
//   cpf: string;
//   total: number;
//   freight?: number;
//   products: Products[];
//   discount?: string;
//   coupon_valid?: boolean;
//   from?: string;
//   to?: string;
// }

// interface Products {
//   id: number;
//   qty: number;
//   price?: number;
// }

export default interface OrderRepository {
  getOrder(id: string): Promise<any>;
  createOrder(order: any): Promise<void>;
}
