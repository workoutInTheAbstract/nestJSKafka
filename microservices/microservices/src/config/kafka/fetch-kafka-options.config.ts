import { KafkaOptions, Transport } from "@nestjs/microservices";
import { KafkaConfig } from "@nestjs/microservices/external/kafka.interface";
import memoize from "lodash.memoize";

export async function fetchKafkaOptions(): Promise<KafkaOptions> {
  let kafkaConfigOptions: KafkaConfig;

    kafkaConfigOptions = {
      brokers: [
        "localhost:9092",
        "kafka:29092",
      ],
      retry: {
        initialRetryTime: 10_000,
      },
    };

  return {
    transport: Transport.KAFKA,
    options: {
      client: kafkaConfigOptions,
      consumer: {
        groupId:
          "restaurant-kafka-consumer",
      },
      producer: {
        allowAutoTopicCreation: true,
      },
    },
  } as KafkaOptions;
}

export const memoizedFetchKafkaConfig = memoize(fetchKafkaOptions);
