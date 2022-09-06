import kafkajs from "kafkajs";
import dotenv from "dotenv";
import { spawn } from "child_process";
import  axios  from  'axios';
dotenv.config();

console.log(`broker1: ${process.env.broker1}`);
console.log(`groupId: ${process.env.groupId}`);
console.log(`clientId: ${process.env.clientId}`);

console.log("running...");
const { Kafka } = kafkajs;
const kafka = new Kafka({
  clientId: process.env.clientId,
  brokers: [process.env.broker1],
});
const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: process.env.groupId });

const run = async () => {
  // Producing
  await producer.connect();
  // await producer.send({
  //   topic: 'test-topic',
  //   messages: [
  //     { value: 'Hello KafkaJS user!' },
  //   ],
  // })

  // Consuming
  await consumer.connect();
  await consumer.subscribe({ topic: "test-topic", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        partition,
        offset: message.offset,
        value: message.value.toString(),
      });
      const payload = JSON.parse(message.value.toString())

      const sendResponse = async () => {
        try {
          console.log("going to update tracker")
          let trackerResp = await axios.post(`http://${process.env.TRACKER_SYFTER_TRACKER_SERVICE_HOST}:${process.env.TRACKER_SYFTER_TRACKER_SERVICE_PORT}/api/scans`, payload)
          console.log("tracker updated")
          console.log(`trackerResp: ${JSON.stringify(trackerResp.status)}`)
        } catch (error) {
          console.error(error)
        }
      }
      let resp = ""
      const syft = spawn("syft", [payload.image]);
      syft.stdout.on("data", (data) => {
        console.log(`stdout ${data.toString()}`);
        resp += data.toString()
      });
      syft.stderr.on("data", (data) => {
        console.log(`stderr ${data.toString()}`);
      });

      syft.on("close", (code) => {
        console.log(code);
        payload.response = resp
        sendResponse()
      });
      syft.on("error", (err) => {
        console.log(err.message);
        payload.error = err.message
        sendResponse()
      });
    },
  });
};

run().catch(console.error);
