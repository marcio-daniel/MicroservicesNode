import { CustomerServices } from "../../../services/CustomerServices";
import { CustomerConsumer } from "../../types/types";
import { ProductsServices } from "../../../services/ProductsServices";
import { ProductConsumer } from "../../types/types";
import { kafkaConsumer } from "./kafkaconsumer";

const _customerServices = new CustomerServices();
const _productServices = new ProductsServices();

export async function createConsumer() {
  const topics = ["CUSTOMER_CREATED", "PRODUCT_CREATED"];
  const consumer = await kafkaConsumer(topics);

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      const messageToString = message.value!.toString();
      processMessage(messageToString, topic);
    },
  });
}

async function processMessage(message: string, topic: string) {
  if (topic === "CUSTOMER_CREATED") {
    await processMessageCustomerCreated(message);
  }
  if (topic === "PRODUCT_CREATED") {
    await processMessageProductCreated(message);
  }
}

async function processMessageCustomerCreated(message: string) {
  console.log(`NEW CUSTOMER \n${message}`);
  const customerConsumer: CustomerConsumer = JSON.parse(message);
  await _customerServices.create(customerConsumer);
}

async function processMessageProductCreated(message: string) {
  console.log(`NEW PRODUCT \n${message}`);
  const productConsumer: ProductConsumer = JSON.parse(message);
  await _productServices.create(productConsumer);
}

createConsumer();
