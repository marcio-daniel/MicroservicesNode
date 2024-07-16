### Documentação Técnica do Software

#### customer/src/controller/CustomerController.ts
**1. CustomerController**
- **Propriedades**
  - `_customerServices: CustomerServices`: Instância do serviço de cliente.
- **Construtor**
  - Inicializa a instância de `CustomerServices`.
- **Métodos**
  - `createCustomer(data: any)`: Método assíncrono que chama o serviço para criar um cliente e retorna o resultado.

#### customer/src/infra/data/CustomerRepository.ts
**1. CustomerRepository**
- **Propriedades**
  - `_prismaClient: PrismaClient`: Instância do cliente Prisma.
- **Construtor**
  - Inicializa a instância de `PrismaClient`.
- **Métodos**
  - `createCustomer(customer: Customer)`: Cria um cliente no banco de dados.
  - `getCustomerByEmail(email: string)`: Obtém um cliente pelo email.
  - `getCustomerByDocument(document: string)`: Obtém um cliente pelo documento.
  - `getCustomers()`: Obtém todos os clientes.

#### customer/src/infra/kafka/index.ts
**Kafka**
- **Propriedades**
  - `clientId: "kafka"`
  - `brokers: ["localhost:9091"]`: Lista de brokers do Kafka.

#### customer/src/infra/kafka/producer/producer.ts
**1. KafkaProducer**
- **Propriedades**
  - `_producer`: Instância do produtor Kafka.
- **Construtor**
  - Inicializa o produtor Kafka.
- **Métodos**
  - `connectProducer()`: Conecta o produtor ao Kafka.
  - `disconnectProducer()`: Desconecta o produtor do Kafka.
  - `sendMessage(topic: string, payload: any)`: Envia uma mensagem para um tópico do Kafka.

#### customer/src/infra/types/types.ts
**1. Tipos**
- `CreateCustomerRequest`
- `Customer`
- `CustomerResponse`
- `KafkaCustomer`

#### customer/src/server.ts
**Servidor Apollo**
- **Schema GraphQL**
  - **Mutations**
    - `createCustomer(request: CreateCustomerRequest)`: Cria um cliente.
  - **Queries**
    - `hello`: Retorna uma mensagem de saudação.

#### customer/src/services/CustomerServices.ts
**1. CustomerServices**
- **Propriedades**
  - `_customerRepository: CustomerRepository`
- **Construtor**
  - Inicializa a instância de `CustomerRepository`.
- **Métodos**
  - `create(data: CreateCustomerRequest)`: Cria um cliente se ele não existir, notifica via Kafka e retorna o cliente criado.

#### order/src/controller/OrderController.ts
**1. OrderController**
- **Propriedades**
  - `_orderServices: OrderServices`
- **Construtor**
  - Inicializa a instância de `OrderServices`.
- **Métodos**
  - `create(data: any)`: Método assíncrono que chama o serviço para criar um pedido e retorna o resultado.

#### order/src/infra/data/CustomerRepository.ts
**1. CustomerRepository**
- **Propriedades**
  - `_prismaClient: PrismaClient`
- **Construtor**
  - Inicializa a instância de `PrismaClient`.
- **Métodos**
  - `createCustomer(customer: Customer)`: Cria um cliente no banco de dados.
  - `getCustomerByEmail(email: string)`: Obtém um cliente pelo email.
  - `getCustomers()`: Obtém todos os clientes.

#### order/src/infra/data/OrderRepository.ts
**1. OrderRepository**
- **Propriedades**
  - `_prismaClient: PrismaClient`
- **Construtor**
  - Inicializa a instância de `PrismaClient`.
- **Métodos**
  - `create(request: CreateOrderRequest)`: Cria um pedido no banco de dados.

#### order/src/infra/data/ProductRepository.ts
**1. ProductRepository**
- **Propriedades**
  - `_prismaClient: PrismaClient`
- **Construtor**
  - Inicializa a instância de `PrismaClient`.
- **Métodos**
  - `createProduct(product: Product)`: Cria um produto no banco de dados.
  - `getProductById(productId: string)`: Obtém um produto pelo ID.
  - `updateQuantity(product: Product)`: Atualiza a quantidade do produto.

#### order/src/infra/kafka/consumer/createConsumer.ts
**Consumidor Kafka**
- **Métodos**
  - `createConsumer()`: Cria e executa um consumidor Kafka para os tópicos "CUSTOMER_CREATED" e "PRODUCT_CREATED".
  - `processMessage(message: string, topic: string)`: Processa mensagens por tópico.
  - `processMessageCustomerCreated(message: string)`: Processa mensagens de criação de clientes.
  - `processMessageProductCreated(message: string)`: Processa mensagens de criação de produtos.

#### order/src/infra/kafka/consumer/kafkaconsumer.ts
**Consumer Configuração Kafka**
- **Métodos**
  - `kafkaConsumer(topics: string[])`: Substitui a função que cria consumidor Kafka.

#### order/src/infra/kafka/index.ts
**Kafka**
- **Propriedades**
  - `clientId: "kafka"`
  - `brokers: ["localhost:9091"]`: Lista de brokers do Kafka.

#### order/src/infra/kafka/producer/producer.ts
**1. KafkaProducer**
- **Propriedades**
  - `_producer`: Instância do produtor Kafka.
- **Construtor**
  - Inicializa o produtor Kafka.
- **Métodos**
  - `connectProducer()`: Conecta o produtor ao Kafka.
  - `disconnectProducer()`: Desconecta o produtor do Kafka.
  - `sendMessage(topic: string, payload: any)`: Envia uma mensagem para um tópico do Kafka.

#### order/src/infra/types/types.ts
**1. Tipos**
- `Customer`
- `CreateOrderRequest`
- `CustomerConsumer`
- `Product`
- `OrderResponse`
- `ProductConsumer`

#### order/src/server.ts
**Servidor Apollo**
- **Schema GraphQL**
  - **Mutations**
    - `createOrder(request: CreateOrderRequest)`: Cria um pedido.
  - **Queries**
    - `hello`: Retorna uma mensagem de saudação.

#### order/src/services/CustomerServices.ts
**1. CustomerServices**
- **Propriedades**
  - `_customerRepository: CustomerRepository`
- **Construtor**
  - Inicializa a instância de `CustomerRepository`.
- **Métodos**
  - `create(data: CustomerConsumer)`: Cria um cliente com os dados fornecidos.

#### order/src/services/OrderServices.ts
**1. OrderServices**
- **Propriedades**
  - `_orderRepository: OrderRepository`
  - `_productService: ProductsServices`
- **Construtor**
  - Inicializa as instâncias de `OrderRepository` e `ProductsServices`.
- **Métodos**
  - `create(request: CreateOrderRequest)`: Cria um pedido se os produtos e quantidades forem válidos e notificam via Kafka.

#### order/src/services/ProductsServices.ts
**1. ProductsServices**
- **Propriedades**
  - `_productRepository: ProductRepository`
- **Construtor**
  - Inicializa a instância de `ProductRepository`.
- **Métodos**
  - `create(data: ProductConsumer)`: Cria um produto com os dados fornecidos.
  - `checkQuantityAvailable(productId: string, quantity: number)`: Verifica se a quantidade do produto está disponível.
  - `updateQuantity(productId: string, quantity: number)`: Atualiza a quantidade do produto.

#### products/src/controller/ProductController.ts
**1. ProductController**
- **Propriedades**
  - `_productServices: ProductsServices`
- **Construtor**
  - Inicializa a instância de `ProductsServices`.
- **Métodos**
  - `createProduct(data: any)`: Método assíncrono que chama o serviço para criar um produto e retorna o resultado.

#### products/src/infra/data/ProductRepository.ts
**1. ProductRepository**
- **Propriedades**
  - `_prismaClient: PrismaClient`
- **Construtor**
  - Inicializa a instância de `PrismaClient`.
- **Métodos**
  - `createProduct(product: Product)`: Cria um produto no banco de dados.
  - `getProductByCode(code: string)`: Obtém um produto pelo código.
  - `updatedQuantity(productId: string, newQuantity: number)`: Atualiza a quantidade do produto.

#### products/src/infra/kafka/consumer/createConsumer.ts
**Consumidor Kafka**
- **Métodos**
  - `createConsumer()`: Cria e executa um consumidor Kafka para o tópico "PRODUCT_UPDATE_QUANTITY".
  - `processMessage(message: string, topic: string)`: Processa mensagens por tópico.
  - `processMessageProductUpdated(message: string)`: Processa mensagens de atualização de produtos.

#### products/src/infra/kafka/consumer/kafkaconsumer.ts
**Consumer Configuração Kafka**
- **Métodos**
  - `kafkaConsumer(topics: string[])`: Substitui a função que cria consumidor Kafka.

#### products/src/infra/kafka/index.ts
**Kafka**
- **Propriedades**
  - `clientId: "kafka"`
  - `brokers: ["localhost:9091"]`: Lista de brokers do Kafka.

#### products/src/infra/kafka/producer/producer.ts
**1. KafkaProducer**
- **Propriedades**
  - `_producer`: Instância do produtor Kafka.
- **Construtor**
  - Inicializa o produtor Kafka.
- **Métodos**
  - `connectProducer()`: Conecta o produtor ao Kafka.
  - `disconnectProducer()`: Desconecta o produtor do Kafka.
  - `sendMessage(topic: string, payload: any)`: Envia uma mensagem para um tópico do Kafka.

#### products/src/infra/types/types.ts
**1. Tipos**
- `ProductCreateRequest`
- `KafkaProduct`
- `ProductConsumer`
- `Product`

#### products/src/server.ts
**Servidor Apollo**
- **Schema GraphQL**
  - **Mutations**
    - `createProduct(request: CreateProductRequest)`: Cria um produto.
  - **Queries**
    - `hello`: Retorna uma mensagem de saudação.

#### products/src/services/ProductsServices.ts
**1. ProductsServices**
- **Propriedades**
  - `_productRepository: ProductRepository`
- **Construtor**
  - Inicializa a instância de `ProductRepository`.
- **Métodos**
  - `create(data: ProductCreateRequest)`: Cria um produto se ele não existir, notifica via Kafka e retorna o produto criado.
  - `updatedQuantity(productId: string, newQuantity: number)`: Atualiza a quantidade de um produto.

---

### Documentação Funcional do Software

#### Descrição Geral
O software é um sistema de microserviços para gerenciamento de clientes, pedidos e produtos. Ele usa GraphQL para manejar comunicações em um backend baseado em Apollo Server e Kafka para mensageria entre serviços.

#### customer/src/controller/CustomerController.ts
- **CustomerController**: Controlador responsável pelo CRUD de clientes.
  - `createCustomer(data: any)`: Cria um cliente novo com base nos dados fornecidos.

#### customer/src/infra/data/CustomerRepository.ts
- **CustomerRepository**: Repositório que interage com o banco de dados para clientes.
  - `createCustomer(customer: Customer)`: Insere um novo cliente no banco.
  - `getCustomerByEmail(email: string)`: Busca um cliente pelo email.
  - `getCustomerByDocument(document: string)`: Busca um cliente pelo documento.
  - `getCustomers()`: Busca todos os clientes.

#### customer/src/infra/kafka/index.ts
- **Kafka**: Inicializa a configuração do cliente Kafka usado para produção e consumo de mensagens.

#### customer/src/infra/kafka/producer/producer.ts
- **KafkaProducer**: Produtor Kafka que envia mensagens de eventos de cliente.
  - `sendMessage(topic: string, payload: any)`: Envia uma mensagem JSON para o tópico Kafka especificado.

#### customer/src/infra/types/types.ts
- **Tipos**: Define as estruturas de dados usadas no serviço.

#### customer/src/server.ts
- **Servidor Apollo**
  - **Mutation**: Define a operação de criação de cliente.
  - **Query**: Define uma saudação de validação ("hello").

#### customer/src/services/CustomerServices.ts
- **CustomerServices**: Serviço que lida com operações de clientes incluindo validações e mensagem Kafka.

#### order/src/controller/OrderController.ts
- **OrderController**: Controlador responsável pelo CRUD de pedidos.
  - `create(data: any)`: Cria um novo pedido com base nos dados fornecidos.

#### order/src/infra/data/CustomerRepository.ts
- **CustomerRepository**: Repositório que interage com o banco de dados para clientes.
  - `createCustomer(customer: Customer)`: Insere um novo cliente no banco.
  - `getCustomerByEmail(email: string)`: Busca um cliente pelo email.
  - `getCustomers()`: Busca todos os clientes.

#### order/src/infra/data/OrderRepository.ts
- **OrderRepository**: Repositório que interage com o banco de dados para pedidos.
  - `create(request: CreateOrderRequest)`: Insere um novo pedido no banco.

#### order/src/infra/data/ProductRepository.ts
- **ProductRepository**: Repositório que interage com o banco de dados para produtos.
  - `createProduct(product: Product)`: Insere um novo produto no banco.
  - `getProductById(productId: string)`: Busca um produto pelo ID.
  - `updateQuantity(product: Product)`: Atualiza a quantidade do produto.

#### order/src/infra/kafka/consumer/createConsumer.ts
- **KafkaConsumer**: Consumidor Kafka que processa mensagens de eventos de cliente e produto criado.
  - `createConsumer()`: Cria o consumidor para os tópicos especificados.
  - `processMessage(topic: string, message: string)`: Processa a mensagem com base no tópico.

#### order/src/infra/kafka/index.ts
- **Kafka**: Inicializa a configuração do cliente Kafka usado para produção e consumo de mensagens.

#### order/src/infra/kafka/producer/producer.ts
- **KafkaProducer**: Produtor Kafka que envia mensagens de eventos de produto e pedido.
  - `sendMessage(topic: string, payload: any)`: Envia uma mensagem JSON para o tópico Kafka especificado.

#### order/src/infra/types/types.ts
- **Tipos**: Define as estruturas de dados usadas no serviço.

#### order/src/server.ts
- **Servidor Apollo**
  - **Mutation**: Define a operação de criação de pedido.
  - **Query**: Define uma saudação de validação ("hello").

#### order/src/services/CustomerServices.ts
- **CustomerServices**: Serviço que lida com operações de clientes incluindo validações e mensagem Kafka.

#### order/src/services/OrderServices.ts
- **OrderServices**: Serviço que lida com operações de pedidos incluindo validação de produto e notificações Kafka.

#### order/src/services/ProductsServices.ts
- **ProductsServices**: Serviço que lida com operações de produto e quantidades.

#### products/src/controller/ProductController.ts
- **ProductController**: Controlador responsável pelo CRUD de produtos.
  - `createProduct(data: any)`: Cria um novo produto com base nos dados fornecidos.

#### products/src/infra/data/ProductRepository.ts
- **ProductRepository**: Repositório que interage com o banco de dados para produtos.
  - `createProduct(product: Product)`: Insere um novo produto no banco.
  - `getProductByCode(code: string)`: Busca um produto pelo código.
  - `updatedQuantity(productId: string, newQuantity: number)`: Atualiza a quantidade do produto.

#### products/src/infra/kafka/consumer/createConsumer.ts
- **KafkaConsumer**: Consumidor Kafka que processa mensagens de eventos de atualização de produtos.
  - `createConsumer()`: Cria o consumidor para o tópico "PRODUCT_UPDATE_QUANTITY".
  - `processMessage(topic: string, message: string)`: Processa a mensagem com base no tópico.

#### products/src/infra/kafka/index.ts
- **Kafka**: Inicializa a configuração do cliente Kafka usado para produção e consumo de mensagens.

#### products/src/infra/kafka/producer/producer.ts
- **KafkaProducer**: Produtor Kafka que envia mensagens de eventos de produto.
  - `sendMessage(topic: string, payload: any)`: Envia uma mensagem JSON para o tópico Kafka especificado.

#### products/src/infra/types/types.ts
- **Tipos**: Define as estruturas de dados usadas no serviço.

#### products/src/server.ts
- **Servidor Apollo**
  - **Mutation**: Define a operação de criação de produto.
  - **Query**: Define uma saudação de validação ("hello").

#### products/src/services/ProductsServices.ts
- **ProductsServices**: Serviço que lida com operações de produtos e notificações Kafka.

### Conclusão
Este software consiste em microserviços altamente desacoplados que interagem via Kafka. Ele usa o Apollo Server para fornecer uma interface GraphQL para interações com clientes, pedidos e produtos, além de notificações em tempo real via Kafka. As estruturas bem definidas e o uso de repositórios para interações com banco de dados garantem manutenibilidade e escalabilidade do sistema.