import kafkajs from "kafkajs";
import dotenv from "dotenv";
import { spawn } from "child_process";
import axios from "axios";
dotenv.config();

console.log(`broker1: ${process.env.KAFKA_BROKER_1}`);
console.log(`groupId: ${process.env.KAFKA_GROUP_ID}`);
console.log(`clientId: ${process.env.KAFKA_CLIENT_ID}`);
console.log(
  `PARTITIONS_CONSUMED_CONCURRENTLY: ${process.env.PARTITIONS_CONSUMED_CONCURRENTLY}`
);
console.log(`topic: ${process.env.KAFKA_TOPIC_NAME}`);

console.log("running...");
const { Kafka } = kafkajs;
const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID,
  brokers: [process.env.KAFKA_BROKER_1],
});
const consumer = kafka.consumer({
  groupId: process.env.KAFKA_GROUP_ID,
});


const run = async () => {
  // Consuming
  await consumer.connect();
  await consumer.subscribe({
    topic: process.env.KAFKA_TOPIC_NAME,
    fromBeginning: true,
  });

  await consumer.run({
    //set PARTITIONS_CONSUMED_CONCURRENTLY to >1 to allow single pod handle requests from multipe partitions concurrently.
    partitionsConsumedConcurrently: parseInt(process.env.PARTITIONS_CONSUMED_CONCURRENTLY || 1),
    eachBatchAutoResolve: false,
    autoCommitThreshold: 1, //commit after each message

    eachMessage: async ({ topic, partition, message, heartbeat }) => {
      console.log({
        topic,
        partition,
        offset: message.offset,
        value: message.value.toString(),
      });

      const inter = setInterval(heartbeat, 3000);
      console.log({
        topic,
        partition,
        offset: message.offset,
        value: message.value.toString(),
      });
      const payload = JSON.parse(message.value.toString());
      payload.response = "";
      payload.error = "";

      return new Promise((resolve, reject) => {
        const sendResponse = async () => {
          try {
            console.log("going to update tracker");
            payload.status = "completed";
            console.log(`payload: ${JSON.stringify(payload)}`);
            let trackerResp = await axios.put(
              `http://${process.env.SYFTER_TRACKER_SERVICE_HOST}:${process.env.SYFTER_TRACKER_SERVICE_PORT}/api/scans/${payload.id}`,
              payload
            );
            console.log("tracker updated (put)");
            console.log(`trackerResp: ${JSON.stringify(trackerResp.status)}`);
            resolve();
          } catch (error) {
            console.error(error);
            reject(error);
          }
          clearInterval(inter);
        };

        const syft = spawn("syft", [payload.image]);
        syft.stdout.on("data", (data) => {
          console.log(`stdout ${data.toString()}`);
          payload.response += data.toString();
        });
        syft.stderr.on("data", (data) => {
          console.log(`stderr ${data.toString()}`);
          payload.error += data.toString();
        });

        syft.on("close", (code) => {
          console.log(code);
          sendResponse();
        });
        syft.on("error", (err) => {
          console.log(`got error: ${err.message}`);
          payload.error += err.message;
          sendResponse();
        });
      });
    },
  });
};

run().catch(console.error);
