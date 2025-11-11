“What would you change to handle high volumes of telemetry data more effectively?”

RabbitMQ as message broker is built to send events accross multiple services that subscribe to them, so horizontal scaling by increasing number of running consumer instances is definitelly a possibility. Another point of potential improvement is to look properly on handling the data in the consumer. Telemetry inputs are currently stored in Redis instance in the sorted set for each IoT device. No immediate solutions come to mind but potential review could bring some ideas.
