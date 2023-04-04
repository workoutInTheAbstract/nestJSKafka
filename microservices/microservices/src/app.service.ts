import {Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

import { registry } from './kafka/schema-registry.kafka';
import { KafkaTopics } from './kafka/topics.kafka';

@Injectable()
export class AppService {
  constructor(
    @Inject("restaurant-kafka-client")
    private kafkaClient: ClientKafka
  ) {}


 async  getHello(): Promise<string> {
    const msg = {
      id: "1",
      name: "Hotdog",
      topping: "pickles",
    };

    // Getting the schema for the `value` subject for our topic
    const id = await registry.getLatestSchemaId(
      KafkaTopics.ORDERED_HOTDOGS_SUBJECT
    );

    // In the future we can define a key schema instead of this arbitray key based on id
    const outgoingMessage = {
      key: msg.id,
      value: await registry.encode(id, msg),
    };

    const producer = await this.kafkaClient.connect();

    await producer.send({
      topic: KafkaTopics.ORDERED_HOTDOGS,
      messages: [outgoingMessage],
    });

    await producer.disconnect();

    return 'Hello World!';
  }
}
