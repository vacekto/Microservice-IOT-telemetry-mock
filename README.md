# Telemetry Microservices

## About

This project contains two microservices simulating IoT telemetry:

- Producer – simulates an IoT device sending telemetry data to RabbitMQ.
- Consumer – listens to RabbitMQ, stores telemetry in Redis, and exposes a REST API.

Both services run locally using Docker and Docker Compose. Project is structured as a monorepo using NestJS framework.

## Prerequisites

- Docker installed
- Docker Compose installed
- Git
- npm (Optional, for efficient local caching of dependencies)

## 1 Clone the repository

git clone <repo-url>
cd <repo-directory>

## 2 Create .env file

Create a .env file in the project root with the following variables and default values:

\## GLOBAL

- RABBITMQ_HOST=rabbitmq
- RABBITMQ_PORT=5672
- RABBITMQ_USER=myuser
- RABBITMQ_PWD=mypassword

\## CONSUMER

- CONSUMER_HTTP_PORT=3000
- REDIS_HOST=redis
- REDIS_PORT=6379

\## PRODUCER

- PRODUCER_HTTP_PORT=3000
  \# must be valid UUID !!
- PRODUCER_ID=bd5b41ef-fa8f-47b8-b62e-326dcaba7a44

These values will be used as default configuration and for Swagger “Try it out” in the consumer API.

## 3 Start

Both services use volumes to cache the node_modules folder, so either those need to be installed first or little change of setup is needed. You can therefore start the project in the following ways:

### 1

- Run the following command from the project root: "npm i", "docker compose up"

### 2

- Run the following command from the project root: "docker compose up"
- add "RUN npm i to base dockerfile in the root as last command"
- remove docker volumes to node_modules in both Producer and Consumer services in docker-compose.yml config file

This will start:

- RabbitMQ (AMQP broker)
- Redis (in-memory storage)
- Producer service
- Consumer service (exposes REST API and Swagger docs)

producer service will start to send mocked telemetry data every 10 seconds to the consumer service via RabbitMQ message broker

## 4. Access the services

### Consumer API (Swagger UI)

Swegger documentation is r=provided in the following link: http://localhost:${CONSUMER_HTTP_PORT}/api, where CONSUMER_HTTP_PORT is from your .env file.

## 5 Todo:

projects as of yet lacks testing and proper asynchronous initialization of services.
