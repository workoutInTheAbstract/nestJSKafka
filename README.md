# nestJSKafka
Simple event pattern example for NestJS with cp-all-in-one and the built in NestJS KafkaClient. 

### Description:
The purpose of this repository is to get a working example of an e2e test of a message being produced and consumed via the nestJS microservices library.

Production of a message is accomplished using emit for [event driven messaging. ](https://docs.nestjs.com/microservices/basics#client) and consumption is by the [@EventPattern decorator](https://docs.nestjs.com/microservices/basics#event-based)

#### 
1. NestJS application 
2. cp-all-in-one
  [cp-all-in-one repository](https://github.com/confluentinc/cp-all-in-one#cp-all-in-one)
  
  
### Dependencies
Ensure you have the following setup:
1. Node - Using v16.14.1
2. Docker - Docker version 20.10.21, build baeda1f


### Setup
1. cd `/cp-all-in-on/cp-all-in-one` and run `docker compose up --build` to run the `cp-all-in-one` containers
2. use `npm run start:dev`
3. Run the e2e test with `npm run test:e2e`


### Resources: 
1.[NestJS docs](https://docs.nestjs.com/microservices/kafka)
