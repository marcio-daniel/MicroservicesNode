import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "kafka",
  brokers: ["localhost:9091"],
});

export { kafka };
