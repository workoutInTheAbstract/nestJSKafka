import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, KafkaOptions } from "@nestjs/microservices";
import { memoizedFetchKafkaConfig } from './config/kafka/fetch-kafka-options.config';


@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: "restaurant-kafka-client",
        async useFactory(): Promise<KafkaOptions> {
          return await memoizedFetchKafkaConfig();
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
