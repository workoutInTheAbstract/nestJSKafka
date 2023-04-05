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
      topping: "onions",
    };

    // Getting the schema for the `value` subject for our topic
    const id = await registry.getLatestSchemaId(
      KafkaTopics.ORDERED_HOTDOGS_SUBJECT
    );

    // In the future we can define a key schema instead of this arbitrary key based on id
    const outgoingMessage = {
      key: msg.id,
      value: await registry.encode(id, msg),
    };

    await this.kafkaClient.connect();

    await this.kafkaClient.emit(
      KafkaTopics.ORDERED_HOTDOGS,
      outgoingMessage
    );

    await this.kafkaClient.close();

    return 'Hello World!';
  }
}
