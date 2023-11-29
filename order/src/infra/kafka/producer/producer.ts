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
