“What would you change to handle high volumes of telemetry data more effectively?”

1. RabbitMQ as message broker is built to handle events accross multiple services subscribing to them, so horizontal scaling by increasing number of running consumer instances is definitelly a possibility.

2. Telemetry data are sent immediately after receival, so batching them together would reduce network load.

3. Redis instance is currently running as on its own and communicates over network. Redis could be however connected using socket domain protocol on the same machine, if no other service needs the instance and its data, Not sure about production complexities though and might not be practical in case of consumer horizontal scaling..

4. Redis stores telemetry data as JSON strings and parsing is expensive. Possible solution would be to save data twice for more effective input retrieval while perserving effective search using the ZSET type. Both persistence solutions would however need to be synced introducing more complexity.
