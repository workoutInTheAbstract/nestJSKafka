# nestJSKafka
Simple event pattern example for NestJS with cp-all-in-one

### Description:
The purpose of this repository is to get a working example of an e2e test of a message being produced and consumed via the nestJS microservices library.

Production of a message is doing using the 

1. NestJS application 
2. cp-all-in-one
  [cp-all-in-one repository](https://github.com/confluentinc/cp-all-in-one#cp-all-in-one)
  
  
### Software Systems
1. Node
2. Docker


### Setup
1. cd `/cp-all-in-on/cp-all-in-one` and run `docker compose up --build` to run the cp all in one containers
2. use `npm run start:dev`

### Resources: 
1.[NestJS docs](https://docs.nestjs.com/microservices/kafka)
2. 
