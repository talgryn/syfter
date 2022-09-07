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
const consumer = kafka.consumer({ 
  groupId: process.env.groupId 
});  //TODO upper case

const run = async () => {

  // Consuming
  await consumer.connect();
  await consumer.subscribe({ topic: "test-topic", fromBeginning: false }); //env var for topic 

  await consumer.run({
    //set PARTITIONS_CONSUMED_CONCURRENTLY to >1 to allow single pod handle requests from multipe partitions concurrently.
    partitionsConsumedConcurrently: process.env.PARTITIONS_CONSUMED_CONCURRENTLY || 1,
    autoCommitThreshold: 1,
    eachMessage: async ({ topic, partition, message, heartbeat }) => {
      const inter = setInterval(heartbeat, 3000);
      console.log({
        topic,
        partition,
        offset: message.offset,
        value: message.value.toString(),
      });
      const payload = JSON.parse(message.value.toString())

      return new Promise((resolve, reject) => {
        const sendResponse = async () => {
          try {
            console.log("going to update tracker")
            payload.status = "completed"
            console.log(`payload: ${JSON.stringify(payload)}`)
            let trackerResp = await axios.put(`http://${process.env.TRACKER_SYFTER_TRACKER_SERVICE_HOST}:${process.env.TRACKER_SYFTER_TRACKER_SERVICE_PORT}/api/scans/${payload.id}`, payload)
            console.log("tracker updated (put)")
            console.log(`trackerResp: ${JSON.stringify(trackerResp.status)}`)
            resolve()
          } catch (error) {
            console.error(error)
            reject(error)
          }
          clearInterval(inter);
        }
  
        const syft = spawn("syft", [payload.image]);
        syft.stdout.on("data", (data) => {
          console.log(`stdout ${data.toString()}`);
          payload.response += data.toString()
        })
        syft.stderr.on("data", (data) => {
          console.log(`stderr ${data.toString()}`);
          payload.error+= data.toString()
        })

        syft.on("close", (code) => {
          console.log(code);
          sendResponse()
        })
        syft.on("error", (err) => {
          console.log(`got error: ${err.message}`);
          payload.error+= err.message
          sendResponse()
        })
      })
    },
  });
};

run().catch(console.error);
