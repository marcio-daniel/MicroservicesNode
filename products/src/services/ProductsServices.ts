import { ProductRepository } from "../infra/data/ProductRepository";
import { KafkaProducer } from "../infra/kafka/producer/producer";
import {
  KafkaProduct,
  Product,
  ProductCreateRequest,
} from "../infra/types/types";

export class ProductsServices {
  private _productRepository: ProductRepository;

  constructor() {
    this._productRepository = new ProductRepository();
  }

  public async create(data: ProductCreateRequest) {
    if (await this._productRepository.getProductByCode(data.code)) {
      throw new Error("Product already exists!");
    }

    const product: Product = data;
    const productCreated = await this._productRepository.createProduct(product);
    const kafkaProducer = new KafkaProducer();
    const kafkaProduct: KafkaProduct = {
      id: productCreated.id!,
      name: product.name,
      quantity: product.quantity,
      price: product.price,
    };
    await kafkaProducer.sendMessage("PRODUCT_CREATED", kafkaProduct);

    return productCreated;
  }

  public async updatedQuantity(productId: string, newQuantity: number) {
    return await this._productRepository.updatedQuantity(
      productId,
      newQuantity
    );
  }
}
