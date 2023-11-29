import { ProductRepository } from "../infra/data/ProductRepository";
import { Product, ProductConsumer } from "../infra/types/types";

export class ProductsServices {
  private _productRepository: ProductRepository;

  constructor() {
    this._productRepository = new ProductRepository();
  }

  public async create(data: ProductConsumer) {
    const product: Product = {
      name: data.name,
      price: data.price,
      externalProductId: data.id,
      quantity: data.quantity,
    };
    const productCreated = await this._productRepository.createProduct(product);
    return productCreated;
  }

  public async checkQuantityAvailable(productId: string, quantity: number) {
    const product = await this._productRepository.getProductById(productId);
    if (!product) {
      return null;
    }
    return product.quantity >= quantity;
  }

  public async updateQuantity(productId: string, quantity: number) {
    const product = await this._productRepository.getProductById(productId);
    product!.quantity = product!.quantity - quantity;
    await this._productRepository.updateQuantity(product!);
    return product;
  }
}
