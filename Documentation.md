### Documentação Funcional

#### Resumo do Funcionamento do Software

O software fornecido é um sistema constituído por três microserviços principais: Customer (Clientes), Order (Pedidos) e Products (Produtos). Cada um desses microserviços possui funcionalidades específicas, em que cada um pode interagir com Kafka para realizar trocas de mensagens assíncronas entre os serviços. Este sistema tem como objetivo geral a gestão de clientes, produtos e pedidos, fornecendo suas respectivas APIs por meio de servidores Apollo.

#### Fluxo Básico de Funcionamento

1. **Customer Microservice:**
    - Gere e armazene clientes.
    - O serviço envia uma mensagem via Kafka quando um cliente é criado para notificar outros serviços.

2. **Order Microservice:**
    - Gere e armazene pedidos.
    - O serviço consome mensagens Kafka para obter dados de cliente e produto e, assim, validar e processar pedidos.

3. **Products Microservice:**
    - Gere e armazene produtos.
    - O serviço envia uma mensagem Kafka quando um produto é criado e consome mensagens para atualizar a quantidade dos produtos.

### Documentação Técnica

#### Estrutura do Código e Componentes

1. **Customer**

- **CustomerController.ts**
  ```typescript
  import { Request, Response } from "express";
  import { CustomerServices } from "../services/CustomerServices";

  export class CustomerController {
    private _customerServices: CustomerServices;

    constructor() {
      this._customerServices = new CustomerServices();
    }

    public async createCustomer(data: any) {
      try {
        const customer = await this._customerServices.create(data.request);
        return customer;
      } catch (error: any) {
        return { msg: error.message }
      }
    }
  }
  ```
  *Controller que recebe requisições e delega ao serviço para criar um cliente.*

- **CustomerRepository.ts**
  ```typescript
  import { PrismaClient } from "@prisma/client";
  import { Customer } from "../types/types";

  export class CustomerRepository {
    private _prismaClient: PrismaClient;

    constructor() {
      this._prismaClient = new PrismaClient();
    }

    public async createCustomer(customer: Customer) {
      return await this._prismaClient.customer.create({
        data: {
          ...customer,
        },
      });
    }

    public async getCustomerByEmail(email: string) {
      return await this._prismaClient.customer.findFirst({
        where: {
          email: email,
        },
      });
    }

    public async getCustomerByDocument(document: string) {
      return await this._prismaClient.customer.findFirst({
        where: {
          document: document,
        },
      });
    }

    public async getCustomers() {
      return await this._prismaClient.customer.findMany();
    }
  }
  ```
  *Repositório para realizar operações de banco de dados para o cliente.*

- **index.ts (Kafka)**
  ```typescript
  import { Kafka } from "kafkajs";

  const kafka = new Kafka({
    clientId: "kafka",
    brokers: ["localhost:9091"],
  });

  export { kafka };
  ```
  *Inicialização do cliente do Kafka.*

- **Producer.ts**
  ```typescript
  import { Partitioners } from "kafkajs";
  import { kafka } from "..";

  export class KafkaProducer {
    private _producer;
    constructor() {
      this._producer = kafka.producer({
        allowAutoTopicCreation: true,
        createPartitioner: Partitioners.LegacyPartitioner,
      });
    }

    private async connectProducer() {
      await this._producer.connect();
    }

    private async disconnectProducer() {
      await this._producer.disconnect();
    }

    public async sendMessage(topic: string, payload: any): Promise<void> {
      await this.connectProducer();
      await this._producer.send({
        topic,
        messages: [{ value: JSON.stringify(payload) }],
      });
      console.log(`MESSAGE SEND TO TOPIC ${topic}`);
      console.log(payload);
      await this.disconnectProducer();
    }
  }
  ```
  *Classe responsável por produzir mensagens para o Kafka.*

- **CustomerServices.ts**
  ```typescript
  import { CustomerRepository } from "../infra/data/CustomerRepository";
  import { KafkaProducer } from "../infra/kafka/producer/producer";
  import {
    CreateCustomerRequest,
    Customer,
    CustomerResponse,
    KafkaCustomer,
  } from "../infra/types/types";

  export class CustomerServices {
    private _customerRepository: CustomerRepository;

    constructor() {
      this._customerRepository = new CustomerRepository();
    }

    public async create(data: CreateCustomerRequest) {
      if (
        (await this._customerRepository.getCustomerByEmail(data.email)) ||
        (await this._customerRepository.getCustomerByDocument(data.document))
      ) {
        throw new Error("Customer already exists!");
      }
      const customer: Customer = data;
      const customerCreated = await this._customerRepository.createCustomer(
        customer
      );
      const kafkaProducer = new KafkaProducer();
      const kafkaCustomer: KafkaCustomer = {
        id: customerCreated.id!,
        name: customer.name,
        email: customer.email,
      };
      await kafkaProducer.sendMessage("CUSTOMER_CREATED", kafkaCustomer);
      const response = {
        id: customerCreated.id!,
        name: customer.name,
        email: customer.email,
      };
      return response;
    }
  }
  ```
  *Serviço responsável pela lógica de negócio do client e envio de mensagens para Kafka.*

- **server.ts**
  ```typescript
  import { ApolloServer, gql } from "apollo-server";
  import { buildSubgraphSchema } from "@apollo/subgraph";
  import { CustomerController } from "./controller/CustomerController";

  const PORT = process.env.PORT || 3010;

  const startServer = async () => {
    const typeDefs = gql`
      input CreateCustomerRequest {
        name: String!
        email: String!
        password: String!
        document: String!
      }

      type Customer {
        id: String!
        name: String!
        email: String!
      }

      type Msg {
        msg: String!
      }

      union CreateCustomerResult = Customer | Msg

      type Mutation {
        createCustomer(request: CreateCustomerRequest): CreateCustomerResult
      }

      type Query {
        hello: String!
      }
    `;

    const resolvers = {
      Query: {
        hello: () => {
          return "Hello";
        },
      },
      Mutation: {
        createCustomer: async (_, args) => {
          const response = (await new CustomerController().createCustomer(
            args
          )) as Customer | Msg;
          return response;
        },
      },
      CreateCustomerResult: {
        __resolveType: (obj) => {
          if (obj.msg) {
            return "Msg";
          } else if (obj.id) {
            return "Customer";
          }
        },
      },
    };

    const server = new ApolloServer({
      schema: buildSubgraphSchema({ typeDefs, resolvers }),
    });

    server.listen(PORT).then(() => {
      console.log(`🚀 Server ready`);
    });
  };

  startServer();
  ```
  *Servidor Apollo que inicializa a API GraphQL para gerenciamento de clientes.*

2. **Order**

- **OrderController.ts**
  ```typescript
  import { Request, Response } from "express";
  import { OrderServices } from "../services/OrderServices";

  export class OrderController {
    private _orderServices: OrderServices;

    constructor() {
      this._orderServices = new OrderServices();
    }

    public async create(data:any) {
      try {
        const order = await this._orderServices.create(data.request);
        return order
      } catch (error: any) {
        return { msg: error.message };
      }
    }
  }
  ```
  *Controller que recebe requisições e delega ao serviço para criar um pedido.*

- **CustomerRepository.ts, OrderRepository.ts, ProductRepository.ts**
  *Mesmo conceito do repositório do cliente, mas adaptado para obter informações sobre pedidos e produtos, respectivamente.*

- **createConsumer.ts, index.ts, kafkaconsumer.ts (Kafka)**
  *Mesma estrutura de inicialização do Kafka e implementação de consumidor do Kafka.*

- **OrderServices.ts**
  ```typescript
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
  ```
  *Serviço responsável pela lógica de negócios de pedidos e envio de mensagens para Kafka.*

- **server.ts**
  ```typescript
  import "./infra/kafka/consumer/";
  import { ApolloServer, gql } from "apollo-server";
  import { buildSubgraphSchema } from "@apollo/subgraph";
  import { OrderController } from "./controller/OrderController";
  import { GraphQLDate } from "graphql-scalars";

  const PORT = process.env.PORT || 3011;

  const startServer = async () => {
    const typeDefs = gql`
      scalar Date

      input OrderItem {
        quantity: Int!
        productId: String!
      }

      input CreateOrderRequest {
        customerId: String!
        orderItems: [OrderItem]
      }

      type Order {
        id: String!
        createdAt: Date
        customerId: String!
      }

      type Msg {
        msg: String!
      }

      union CreateOrderResult = Order | Msg

      type Mutation {
        createOrder(request: CreateOrderRequest): CreateOrderResult
      }

      type Query {
        hello: String!
      }
    `;

    const resolvers = {
      Query: {
        hello: () => {
          return "Hello";
        },
      },
      Mutation: {
        createOrder: async (_, args) => {
          const response = (await new OrderController().create(args)) as
            | Order
            | Msg;
          return response;
        },
      },
      CreateOrderResult: {
        __resolveType: (obj) => {
          if (obj.msg) {
            return "Msg";
          } else if (obj.id) {
            return "Order";
          }
        },
      },
      Date: GraphQLDate,
    };

    const server = new ApolloServer({
      schema: buildSubgraphSchema({ typeDefs, resolvers }),
    });

    server.listen(PORT).then(() => {
      console.log(`🚀 Server ready `);
    });
  };

  startServer();
  ```
  *Servidor Apollo que inicializa a API GraphQL para gerenciamento de pedidos.*

3. **Products**

- **ProductController.ts**
  ```typescript
  import { Request, Response } from "express";
  import { ProductsServices } from "../services/ProductsServices";

  export class ProductController {
    private _productServices: ProductsServices;
    constructor() {
      this._productServices = new ProductsServices();
    }

    public async createProduct(data:any) {
      try {
        const product = await this._productServices.create(data.request);
        return product;
      } catch (error: any) {
        return { msg: error.message }
      }
    }
  }
  ```
  *Controller que recebe requisições e delega ao serviço para criar um produto.*

- **ProductRepository.ts**
  *Repositório responsável por interagir com o banco de dados para criação e manipulação de produtos.*

- **createConsumer.ts, index.ts, kefkaconsumer.ts (Kafka)**
  *Mesma implementação de consumo e inicialização do Kafka conforme Customer e Order.*

- **ProductsServices.ts**
  ```typescript
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
  ```
  *Serviço responsável pela lógica de negócios de produtos e envio de mensagens para Kafka.*

- **server.ts**
  ```typescript
  import { ApolloServer, gql } from "apollo-server";
  import { buildSubgraphSchema } from "@apollo/subgraph";
  import { ProductController } from "./controller/ProductController";

  const PORT = process.env.PORT || 3012;
  import "./infra/kafka/consumer";

  const startServer = async () => {
    const typeDefs = gql`
      input CreateProductRequest {
        name: String!
        code: String!
        quantity: Int!
        price: Float!
      }

      type Product {
        id: String!
        name: String!
        code: String!
        quantity: Int!
        price: Float!
      }

      type Msg {
        msg: String!
      }

      union CreateProductResult = Product | Msg

      type Mutation {
        createProduct(request: CreateProductRequest): CreateProductResult
      }

      type Query {
        hello: String!
      }
    `;

    const resolvers = {
      Query: {
        hello: () => {
          return "Hello";
        },
      },
      Mutation: {
        createProduct: async (_, args) => {
          const response = (await new ProductController().createProduct(args)) as
            | Product
            | Msg;
          return response;
        },
      },
      CreateProductResult: {
        __resolveType: (obj) => {
          if (obj.msg) {
            return "Msg";
          } else if (obj.id) {
            return "Product";
          }
        },
      },
    };

    const server = new ApolloServer({
      schema: buildSubgraphSchema({ typeDefs, resolvers }),
    });

    server.listen(PORT).then(() => {
      console.log(`🚀 Server ready `);
    });
  };

  startServer();
  ```
  *Servidor Apollo que inicializa a API GraphQL para gerenciamento de produtos.*
  
Conclusão:
Este sistema modularizado utiliza práticas modernas como Kafka para comunicação assíncrona entre microserviços, Prisma para abstração de banco de dados e Apollo Server para GraphQL. Cada microserviço é responsável por gerenciar seus próprios dados e lógica de negócios, garantindo uma arquitetura escalável e de fácil manutenção.