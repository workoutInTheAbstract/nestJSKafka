import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { join } from 'path';
import { ClientKafka, EventPattern, Payload } from '@nestjs/microservices';

import { registerSchema } from './kafka/register-schema.kafka';
import { registry } from './kafka/schema-registry.kafka';
import { KafkaTopics } from './kafka/topics.kafka';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
    @Inject("restaurant-kafka-client")
    private kafkaClient: ClientKafka
  ) {}

  @Get()
  async getHello(): Promise<string> {
    return await this.appService.getHello();
  }

  async onModuleInit(): Promise<void> {

    await this.kafkaClient.connect();
    const id = await registerSchema(
      join(__dirname, "../src/schemas", "queuing.restaurant.ordered_hotdogs.avsc")
    );

    const msg = {
      id: "1",
      name: "Hotdog",
      topping: "pickles",
    };

    const outgoingMessage = {
      key: msg.id,
      value: await registry.encode(id, msg),
    };

     this.kafkaClient.emit(
      KafkaTopics.ORDERED_HOTDOGS,
     outgoingMessage
    );

  }

  @EventPattern("queuing.restaurant.ordered_hotdogs")
  async handleOrderedHotdogs(@Payload() data: any): Promise<any> {
    // console.log(`ordered dogs event handler!!!!`);
    // console.log(`buffer off the topic`, data);

    const id = await registry.getLatestSchemaId(
      KafkaTopics.ORDERED_HOTDOGS_SUBJECT
    );

    const schema = await registry.getSchema(id);

    // console.log(`here is the schema for id:${id}`, schema);

    const decodedMessage = await registry.decode(data);

    // console.log(`decoded message`, decodedMessage);
    return decodedMessage;
  }


}
