import { kafka } from "..";

export const kafkaConsumer = async (topics: string[]) => {
  const consumer = kafka.consumer({ groupId: "ORDER_API" });
  await consumer.connect();
  await consumer.subscribe({
    topics,
  });
  return consumer;
};
