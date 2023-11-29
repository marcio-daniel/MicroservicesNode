import { OrderRepository } from "../infra/data/OrderRepository";
import { KafkaProducer } from "../infra/kafka/producer/producer";
import { CreateOrderRequest } from "../infra/types/types";
import { ProductsServices } from "./ProductsServices";

export class OrderServices {
  private _orderRepository: OrderRepository;

  private _productService: ProductsServices;

  constructor() {
    this._orderRepository = new OrderRepository();
    this._productService = new ProductsServices();
  }

  public async create(request: CreateOrderRequest) {
    const products: any[] = [];
    let invalidProduct = false;
    let invalidQuantity = false;

    for (let index = 0; index < request.orderItems.length; index++) {
      const quantityAvailable =
        await this._productService.checkQuantityAvailable(
          request.orderItems[index].productId,
          request.orderItems[index].quantity
        );
      if (quantityAvailable === null) {
        invalidProduct = true;
        break;
      }
      if (!quantityAvailable) {
        invalidQuantity = true;
        break;
      }
    }

    if (invalidProduct) {
      throw new Error("Product invalid credentials!");
    }
    if (invalidQuantity) {
      throw new Error("Product invalid quantity!");
    }

    for (let index = 0; index < request.orderItems.length; index++) {
      products.push(
        await this._productService.updateQuantity(
          request.orderItems[index].productId,
          request.orderItems[index].quantity
        )
      );
    }

    const kafkaProducer = new KafkaProducer();

    products.forEach((product) => {
      kafkaProducer.sendMessage("PRODUCT_UPDATE_QUANTITY", {
        id: product.externalProductId,
        newQuantity: product.quantity,
      });
    });

    const order = await this._orderRepository.create(request);
    return order;
  }
}
