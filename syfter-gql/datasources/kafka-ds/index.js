import kafkajs from "kafkajs";
import dotenv from "dotenv";
dotenv.config();

console.log(`broker1: ${process.env.KAFKA_BROKER_1}`);
console.log(`broker1: ${process.env.KAFKA_CLIENT_ID}`);
console.log(`broker1: ${process.env.KAFKA_TOPIC_NAME}`);
export default class KafkaDS {
    constructor() {
        const { Kafka } = kafkajs;
        const kafka = new Kafka({
            clientId: process.env.KAFKA_CLIENT_ID,
            brokers: [process.env.KAFKA_BROKER_1],
        });
        this.producer = kafka.producer();

    }

    async init() {
       await this.producer.connect()
    }
    async placeRequest(request) {

        await this.producer.send({
            topic: process.env.KAFKA_TOPIC_NAME,
            messages: [
                { value: JSON.stringify(request) },
            ],
        })
    }
}

