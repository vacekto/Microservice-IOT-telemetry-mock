# Telemetry Microservices

## About

NestJS project containing two microservices simulating IoT telemetry:

- Producer – simulates an IoT device sending telemetry data via RabbitMQ message broker.
- Consumer – listens to RabbitMQ, stores telemetry in Redis instance, and exposes a REST API for persisted data.

Structured as NestJS monorepo, meaning all services share dependencies in single node_modules folder. Project contains shared code in the ./libs folder. Both services run locally using Docker and Docker Compose with their own dockerfile that extends base dockerfile in project root.

The Redis store in consumer service persists data in ZSET type with telemetry data saved as JSON string with its timestamp as a score, meaning more effective search by time range. Each IoT device has its own ZSET for its data identifed in the store with prefixed device ID.

## Prerequisites

- docker and Docker Compose installed

## Environment variables

Each service has its own.env file with all the needed values and global .env config is for RabbitMQ and other global settings. Default values:

- ./.env:

RMQ_USER=myuser

RMQ_PWD=mypassword

CONSUMER_EXPOSED_PORT=3000

- ./apps/consumer/producer/.env:

RMQ_HOST=rabbitmq

RMQ_PORT=5672

RMQ_USER=myuser

RMQ_PWD=mypassword

PORT=3000

PRODUCER_ID=bd5b41ef-fa8f-47b8-b62e-326dcaba7a44 # must be valid UUID !!

- ./apps/consumer/producer/.env:

RMQ_HOST=rabbitmq

RMQ_PORT=5672

RMQ_USER=myuser

RMQ_PWD=mypassword

PORT=3000

REDIS_HOST=redis

REDIS_PORT=6379

## Start

run in terminal: docker compose up

This will start:

- RabbitMQ (AMQP broker)
- Redis (in-memory storage)
- Producer service
- Consumer service (exposes REST API with Swagger docs)

producer service will start to send mocked telemetry data every 10 seconds to the consumer service via RabbitMQ message broker, which then loggs new data to standard output.

## Testing

project contains unit tests and testing setup for integration tests.

1. unit tests:

- npm i
- npm run test

2. integration tests:

- create testing .env files with the following default values:
  - ./.env.test:

    CONSUMER_EXPOSED_PORT=3000

  - ./apps/consumer/producer/.env:

    PORT=3000

    REDIS_HOST=redis

    REDIS_PORT=6379

- docker compose --env-file .env.test -f docker-compose.test.yml up

Integration tests are however implemented in a sort of "hacking" way, where output is redirected to the ./logs folder and are written only for the consumer, since producer consists of single service.

### Consumer API (Swagger UI)

Swegger documentation for consumer REST API is provided in /api route
