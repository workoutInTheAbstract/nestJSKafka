import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { KafkaOptions } from '@nestjs/microservices';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { memoizedFetchKafkaConfig } from './config/kafka/fetch-kafka-options.config';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const kafkaCredentials = await memoizedFetchKafkaConfig();
  app.connectMicroservice<KafkaOptions>(kafkaCredentials);
  await app.startAllMicroservices();


  // Configure Swagger API to generate API documentation
  const config = new DocumentBuilder()
    .setTitle("restaurant Service API Documentation")
    .setDescription(
      "Hotdog Stand is a Proof of concept of an event based ordering system"
    )
    .setVersion(process.env.npm_package_version || "")
    .addTag("carting-service")
    .build();

  // Initialize Swagger API documentation at http://localhost:3000/api
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("/", app, document);

  await app.listen(3000);
}
bootstrap();
