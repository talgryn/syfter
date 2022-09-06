import kafkajs from "kafkajs";
import dotenv from "dotenv";
dotenv.config();

console.log(`broker1: ${process.env.broker1}`);
console.log(`groupId: ${process.env.groupId}`);
console.log(`clientId: ${process.env.clientId}`);

export default class KafkaDS {
    constructor() {
        const { Kafka } = kafkajs;
        const kafka = new Kafka({
            clientId: process.env.clientId,
            brokers: [process.env.broker1],
        });
        this.producer = kafka.producer();

    }

    async init() {
       await this.producer.connect()
    }
    async placeRequest(request) {

        await this.producer.send({
            topic: 'test-topic',
            messages: [
                { value: JSON.stringify(request) },
            ],
        })
    }
}

