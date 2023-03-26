import Product from './Product';
import AppError from './Error';
import ProductRepositoryDatabase from './ProductRepositoryDatabase';
import ProductsRepository from './ProductsRepository';
import Order from './Order';

export default class SimulateShipment {
  constructor(
    readonly productRepo: ProductsRepository = new ProductRepositoryDatabase(),
  ) {}
  async execute(input: Input): Promise<Output> {
    const products = input.products ? input.products : [];
    const productsList = [];
    if (products.length === 0) {
      throw new AppError('There is no product inserted');
    }
    for (const product of products) {
      const res_product: any = await this.productRepo.getProduct(product.id);
      productsList.push(
        new Product(
          res_product.rows[0].id,
          res_product.rows[0].description,
          product.qty,
          res_product.rows[0].price,
          res_product.rows[0].weight,
          res_product.rows[0].height,
          res_product.rows[0].width,
          res_product.rows[0].depth,
        ),
      );
    }

    return {
      status: 'OK',
      freight: Order.calculateShipmentOrder(productsList),
    };
  }
}

interface Input {
  products: Products[];
  from?: string;
  to?: string;
}

interface Products {
  id: number;
  qty: number;
  price?: number;
}

interface Output {
  status: any;
  freight: number;
}
