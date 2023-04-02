import { Database } from 'sqlite3';
import Product from './domain/entity/Product';
import ProductRepository from './ProductRepository';

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

export default class ProductRepositoryDatabase implements ProductRepository {
  async getProduct(idProduct: number): Promise<Product> {
    const productData: any = await query(
      db,
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
