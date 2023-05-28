import Product from './domain/entity/Product';
import ProductRepository from './ProductRepository';
import Connection from './Connection';

export default class ProductRepositoryDatabase implements ProductRepository {
  constructor(readonly connection: Connection) {}
  async getProduct(idProduct: number): Promise<Product> {
    const productData: any = await this.connection.query(
      `SELECT * FROM product WHERE id_product=${idProduct}`,
      [],
    );
    return new Product(
      productData.rows[0].id_product,
      productData.rows[0].description,
      parseFloat(productData.rows[0].price),
      productData.rows[0].width,
      productData.rows[0].height,
      productData.rows[0].length,
      parseFloat(productData.rows[0].weight),
      productData.rows[0].currency,
    );
  }
}
