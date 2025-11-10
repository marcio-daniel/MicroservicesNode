### Especificação Funcional do Sistema Relacionado

O sistema é composto por três subprocessos principais: **Customer**, **Order**, e **Products**, que são implementados como microserviços independentes. Cada um desses subprocessos utiliza arquitetura **GraphQL** para manipulação de dados e comunicação entre eles é facilitada pelo uso de **Apache Kafka** para troca assíncrona de mensagens.

#### 1. **Customer Service**

**Funcionalidades:**

1. **Criar Cliente:** 
   - Endpoint: `createCustomer(request: CreateCustomerRequest): CreateCustomerResult`
   - O cliente envia dados para criação de um novo usuário, incluindo atributos: `nome`, `email`, `senha`, e `número de documento`.
   - Antes de criar o cliente, o sistema valida se o email ou documento já existe no banco de dados.
   - Após a criação bem-sucedida, uma mensagem Kafka é enviada ao tópico `CUSTOMER_CREATED` com os dados do novo cliente.

---

#### 2. **Products Service**

**Funcionalidades:**

1. **Criar Produto:** 
   - Endpoint: `createProduct(request: CreateProductRequest): CreateProductResult`
   - O serviço recebe os detalhes do produto, incluindo: `nome`, `código único`, `quantidade inicial`, e `preço`.
   - Valida se o código do produto é único.
   - Após a criação bem-sucedida, uma mensagem Kafka é enviada ao tópico `PRODUCT_CREATED` com os detalhes do produto.

2. **Atualizar Quantidade:**
   - O consumidor Kafka escuta atualizações vindas do tópico `PRODUCT_UPDATE_QUANTITY`.
   - Atualiza a quantidade disponível para o produto conforme necessário.

---

#### 3. **Order Service**

**Funcionalidades:**

1. **Criar Pedido:** 
   - Endpoint: `createOrder(request: CreateOrderRequest): CreateOrderResult`
   - O serviço recebe uma solicitação contendo o ID do cliente e os itens do pedido (produto e quantidade).
   - Valida se os produtos do pedido existem e há estoque suficiente para atender a solicitação.
   - Reduz a quantidade do estoque dos produtos utilizados no pedido e publica atualização no tópico `PRODUCT_UPDATE_QUANTITY`.
   - Após a validação e a redução bem-sucedida, o pedido é criado e persistido no banco de dados.

2. **Consumidores Kafka:**
   - Consome mensagens de `CUSTOMER_CREATED` para criar um registro local correspondente ao cliente no contexto de pedidos.
   - Consome mensagens de `PRODUCT_CREATED` para inserir novos produtos no contexto local do serviço de pedidos.

---

### Diagrama de Arquitetura do Sistema

##### 1. **Fluxo de Criação de Clientes**
```plaintext
[Cliente (GraphQL)] --> [CustomerController] --> [CustomerServices] 
--> [CustomerRepository] 
     |
     --> [KafkaProducer -> Tópico Kafka: CUSTOMER_CREATED]
```

---

##### 2. **Fluxo de Criação de Produtos**
```plaintext
[Cliente (GraphQL)] --> [ProductsController] --> [ProductsServices] 
--> [ProductRepository]
     |
     --> [KafkaProducer -> Tópico Kafka: PRODUCT_CREATED]
```

---

##### 3. **Fluxo de Criação de Pedidos**
```plaintext
[Cliente (GraphQL)] --> [OrderController] --> [OrderServices] 
--> [OrderRepository] --> [ProductsServices]
     |                                    |
     --> [KafkaProducer -> Tópico Kafka: PRODUCT_UPDATE_QUANTITY]

[Consumer Kafka Escuta TOPIC: CUSTOMER_CREATED] --> Atualiza Cliente Local
[Consumer Kafka Escuta TOPIC: PRODUCT_CREATED] --> Atualiza Produto Local
```

---

### Relação entre os Componentes e Comunicação Kafka

O sistema utiliza o seguinte esquema para comunicação entre os microserviços via **Kafka**:

- **Customer Service:**
  - Publica eventos no tópico `CUSTOMER_CREATED` ao criar um cliente.
  - Order Service consome esses eventos para sincronizar clientes.

- **Products Service:**
  - Publica eventos no tópico `PRODUCT_CREATED` ao criar produtos.
  - Order Service consome esses eventos para sincronizar os produtos.

- **Order Service:**
  - Publica eventos no tópico `PRODUCT_UPDATE_QUANTITY` ao realizar um pedido que atualiza a quantidade de estoque.
  - Products Service consome esses eventos para atualizar o estoque.

---

### Diagrama de Contexto (Relação entre Microserviços)

```plaintext
                        +------------+
                        |  Customer  |
                        +------------+
                              |
          ---------------- Kafka --> "CUSTOMER_CREATED" -----------------
                              |
                        +------------+
                        |   Order    |
                        +------------+
                              |
          ---------------- Kafka --> "PRODUCT_UPDATE_QUANTITY" ----------
                              |
                        +------------+
                        |  Products  |
                        +------------+
```

---

### Princípios e Tecnologias:

1. **Tecnologias Utilizadas:**
   - Backend: TypeScript (Node.js)
   - Framework: Express.js e Apollo GraphQL Subgraph
   - Banco de Dados: Prisma ORM integrado à estrutura relacional (PostgreSQL/MySQL)
   - Mensageria: Apache Kafka para comunicação assíncrona entre microserviços.

2. **Princípios Arquiteturais**:
   - Microserviços Independentes.
   - Comunicação assíncrona baseada em eventos.
   - Validação antes de ações críticas (e.g., criação de cliente, produto, pedido).
   - Atualização automática entre serviços através de eventos Kafka. 

---

Esse sistema é altamente escalável e modular, permitindo maior flexibilidade no crescimento da aplicação com adição de novos serviços ou funcionalidades conforme necessário.