import { ProductsServices } from "../../../services/ProductsServices";
import { ProductConsumer } from "../../types/types";
import { kafkaConsumer } from "./kafkaconsumer";

const _productServices = new ProductsServices();

export async function createConsumer() {
  const topics = ["PRODUCT_UPDATE_QUANTITY"];
  const consumer = await kafkaConsumer(topics);

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      const messageToString = message.value!.toString();
      processMessage(messageToString, topic);
    },
  });
}

async function processMessage(message: string, topic: string) {
  if (topic === "PRODUCT_UPDATE_QUANTITY") {
    await processMessageProductUpdated(message);
  }
}

async function processMessageProductUpdated(message: string) {
  console.log(`UPDATED PRODUCT \n${message}`);
  const productConsumer: ProductConsumer = JSON.parse(message);
  await _productServices.updatedQuantity(
    productConsumer.id,
    productConsumer.newQuantity
  );
}

createConsumer();
