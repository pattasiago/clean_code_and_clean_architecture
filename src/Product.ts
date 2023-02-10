import AppError from './Error';

class Product {
  constructor(
    public id: number,
    public description: string,
    public quantity: number,
    public price: number,
    public weight: number,
    public height: number,
    public width: number,
    public depth: number,
  ) {
    if (this.quantity < 0) throw new AppError('Quantity cannot be less than 0');
    if (this.weight <= 0)
      throw new AppError('Weight cannot be less than or equal to 0');
    if (this.height <= 0)
      throw new AppError('Height cannot be less than or equal to 0');
    if (this.width <= 0)
      throw new AppError('Width cannot be less than or equal to 0');
    if (this.depth <= 0)
      throw new AppError('Depth cannot be less than or equal to 0');
  }

  static hasProductInArray(product: Product, products_array: Product[]) {
    for (const current_product of products_array) {
      if (product.id === current_product.id) return true;
    }
    return false;
  }

  calculateVolume() {
    return (this.height * this.width * this.depth) / 1e6;
  }

  calculateDensity() {
    return this.weight / this.calculateVolume();
  }

  getWeight() {
    return this.weight;
  }
}

export default Product;
