# Documentação: Software de Gestão de Clientes, Pedidos e Produtos

---

## Sumário
1. [Resumo](#resumo)
2. [Documentação Técnica](#documentacao-tecnica)

---

## Resumo <a name="resumo"></a>
Este software é dividido em três módulos principais: Gestão de Clientes, Gestão de Pedidos, e Gestão de Produtos. Cada módulo corresponde a serviços específicos, com controladores, repositórios de dados, integrações com Kafka e servidores Apollo GraphQL. A comunicação entre microserviços é feita via mensagens Kafka, permitindo a sincronização de dados entre os diferentes módulos.

---

## Documentação Técnica <a name="documentacao-tecnica"></a>

### Gestão de Clientes
#### Arquivos:
- **customer/src/controller/CustomerController.ts**
- **customer/src/infra/data/CustomerRepository.ts**
- **customer/src/infra/kafka/index.ts**
- **customer/src/infra/kafka/producer/producer.ts**
- **customer/src/infra/types/types.ts**
- **customer/src/server.ts**
- **customer/src/services/CustomerServices.ts**

#### Descrição:
1. **CustomerController.ts**:
    - Importa os módulos `Request` e `Response` do express e a classe `CustomerServices`.
    - A classe `CustomerController` possui um construtor que inicializa um objeto `CustomerServices`.
    - Método `createCustomer` executa a criação de um cliente com tratamento de exceções.

2. **CustomerRepository.ts**:
    - Repositório responsável por operações de CRUD utilizando `PrismaClient`.
    - Métodos disponíveis:
      - `createCustomer`: Cria um novo cliente.
      - `getCustomerByEmail`: Busca um cliente com base no email.
      - `getCustomerByDocument`: Busca um cliente usando o documento.
      - `getCustomers`: Retorna uma lista de todos os clientes.

3. **index.ts (Kafka)**:
    - Configura e exporta o cliente Kafka.

4. **producer.ts (Kafka Producer)**:
    - Configura e gerencia um produtor Kafka.
    - Método `sendMessage` envia mensagens para um tópico Kafka.

5. **types.ts**:
    - Define tipos TypeScript para solicitações de criação de clientes, resposta de clientes e modelo de cliente para Kafka.

6. **server.ts**:
    - Configura o servidor Apollo GraphQL.
    - Define esquemas e resolvers para criar clientes e responder a queries.

7. **CustomerServices.ts**:
    - Contém lógica de negócios para criação de clientes.
    - Valida duplicidade e envia mensagem para Kafka ao criar um cliente.

---

### Gestão de Pedidos
#### Arquivos:
- **order/src/controller/OrderController.ts**
- **order/src/infra/data/CustomerRepository.ts**
- **order/src/infra/data/OrderRepository.ts**
- **order/src/infra/data/ProductRepository.ts**
- **order/src/infra/kafka/consumer/createConsumer.ts**
- **order/src/infra/kafka/consumer/index.ts**
- **order/src/infra/kafka/consumer/kafkaconsumer.ts**
- **order/src/infra/kafka/index.ts**
- **order/src/infra/kafka/producer/producer.ts**
- **order/src/infra/types/types.ts**
- **order/src/server.ts**
- **order/src/services/CustomerServices.ts**
- **order/src/services/OrderServices.ts**
- **order/src/services/ProductsServices.ts**

#### Descrição:
1. **OrderController.ts**:
    - Controlador que gerencia a criação de pedidos, utilizando `OrderServices`.
    - Método `create` realiza a operação de criação com tratamento de exceções.

2. **CustomerRepository.ts**:
    - Semelhante ao módulo de clientes, gerencia operações de CRUD para clientes.

3. **OrderRepository.ts**:
    - Repositório de dados para pedidos, usando `PrismaClient`.
    - Métodos:
      - `create`: Cria um pedido e seus itens.

4. **ProductRepository.ts**:
    - Repositório para operações relacionadas a produtos, incluindo criação e atualização de quantidade.

5. **consumer (Kafka)**:
    - Configura consumidores Kafka para processar mensagens como `CUSTOMER_CREATED` e `PRODUCT_CREATED`.
    - Cria consumidores e define lógica de processamento das mensagens.

6. **producer.ts (Kafka Producer)**:
    - Semelhante ao produtor de clientes, envia mensagens relacionadas a atualizações de produtos.

7. **index.ts (Kafka)**:
    - Configura e exporta o cliente Kafka.

8. **types.ts**:
    - Define os tipos para pedidos, clientes e produtos, usados em operações de CRUD e Kafka.

9. **server.ts**:
    - Configura servidor Apollo GraphQL para operações de pedidos.
    - Define esquemas e resolvers para criaçâo de pedidos.

10. **CustomerServices.ts**:
    - Serviço que trata a lógica de criação de clientes a partir de mensagens Kafka.

11. **OrderServices.ts**:
    - Serviço que realiza a validação e criação de pedidos.
    - Verifica a disponibilidade de produtos e atualiza quantidades.

12. **ProductsServices.ts**:
    - Serviço que gerencia operações sobre produtos, incluindo a verificação de quantidade disponível e atualização de quantidade.

---

### Gestão de Produtos
#### Arquivos:
- **products/src/controller/ProductController.ts**
- **products/src/infra/data/ProductRepository.ts**
- **products/src/infra/kafka/consumer/createConsumer.ts**
- **products/src/infra/kafka/consumer/index.ts**
- **products/src/infra/kafka/consumer/kafkaconsumer.ts**
- **products/src/infra/kafka/index.ts**
- **products/src/infra/kafka/producer/producer.ts**
- **products/src/infra/types/types.ts**
- **products/src/server.ts**
- **products/src/services/ProductsServices.ts**

#### Descrição:
1. **ProductController.ts**:
    - Controlador de produtos que gerencia a criação de produtos, utilizando `ProductsServices`.
    - Método `createProduct` realiza a operação de criação com tratamento de exceções.

2. **ProductRepository.ts**:
    - Repositório de dados para produtos, usando `PrismaClient`.
    - Métodos:
      - `createProduct`: Cria um novo produto.
      - `getProductByCode`: Retorna produto com base no código.
      - `updatedQuantity`: Atualiza a quantidade de um produto.

3. **consumer (Kafka)**:
    - Configura consumidores Kafka para processar mensagens como `PRODUCT_UPDATE_QUANTITY`.
    - Cria consumidores e lógica de processamento de mensagens.

4. **producer.ts (Kafka Producer)**:
    - Envia mensagens relacionadas à criação e atualização de produtos.

5. **index.ts (Kafka)**:
    - Configura e exporta o cliente Kafka.

6. **types.ts**:
    - Define tipos para criação de produtos e integração com Kafka.

7. **server.ts**:
    - Configura servidor Apollo GraphQL para operações de produtos.
    - Define esquemas e resolvers para criação de produtos.

8. **ProductsServices.ts**:
    - Serviço de lógica de produtos.
    - Lida com a criação de produtos e atualização de quantidade.

---

Essa documentação aborda todos os principais aspectos técnicos e funcionais do software. Caso sejam necessárias melhorias ou ajustes, sugere-se a revisão de cada módulo especificamente conforme o nível de detalhe desejado.