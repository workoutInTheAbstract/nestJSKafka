import { Test, TestingModule } from '@nestjs/testing';
import {  INestApplication } from '@nestjs/common';
import request from 'supertest';
import { ClientKafka, KafkaOptions } from '@nestjs/microservices';

import { AppModule } from './../src/app.module';
import { AppController } from '../src/app.controller';
import { memoizedFetchKafkaConfig } from '../src/config/kafka/fetch-kafka-options.config';


describe('AppController (e2e)', () => {
  let app: INestApplication;
  let client: ClientKafka;
  let controller: AppController;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Connect to Kafka broker
    const kafkaCredentials = await memoizedFetchKafkaConfig();
    app.connectMicroservice<KafkaOptions>(kafkaCredentials);
    await app.startAllMicroservices();


    client = await app.get("resteraunt-kafka-client");
    await client.connect();

    controller = app.get<AppController>(AppController);

  });

  afterAll(async () => {
    await client.close();
    await app.close();
  });


  test('Should produce message on GET / and then confirm production via consumption ', async  () => {

    // I want to be able to confirm that messages produced by getHello are
    // in fact produced to the right topic by 'spying on' the eventHandler
    // in the controller

    const consumerSpy = jest.spyOn(controller, "handleOrderedHotdogs");

    await request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');


    expect(consumerSpy).toBeCalledTimes(1);

    const expectedMsg = {
      id: "1",
      name: "Hotdog",
      topping: "pickles",
    };

    expect(consumerSpy).lastReturnedWith(expectedMsg);

    // Here to allow jest to run long enough to facilitate consumption of messages
    return new Promise((Res) => {
      setTimeout(() => {
        console.log(`CONSUME DEBUG`);
        expect(true).toBeTruthy();
        Res(null);
      }, 5000);
    });

  });
});
