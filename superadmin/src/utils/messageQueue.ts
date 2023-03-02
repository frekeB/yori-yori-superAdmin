import amqplib, { Connection, Channel } from "amqplib";
import { MESSAGE_BROKER_URL } from "../config";
import {Event} from '../types'

export const createChannel = async (): Promise<Channel> => {
  try {
    const connection: Connection = await amqplib.connect(MESSAGE_BROKER_URL);
    const channel: Channel = await connection.createChannel();
    // await channel.assertExchange(exchange, "direct");
    return channel;
  } catch (err: any) {
    throw err;
  }
};

export const publishMessage = async (
  channel: any,
  queueName: string,
  message: Event
): Promise<boolean> => {
  try {
    channel.assertQueue(queueName);
    const status = channel.sendToQueue(
      queueName,
      Buffer.from(JSON.stringify(message))
    );
    console.log(`Message sent to ${queueName}`);
    return status;
  } catch (err: any) {
    throw err;
  }
};

export const susMessage = async (
  queueName: string,
  channel: Channel,
  suscriber: any
): Promise<void> => {
  try {
    channel.assertQueue(queueName);
    channel.consume(
      queueName,
      (msg: any) => {
        if (msg) {
          console.log("The message is: ", msg.content.toString());
          suscriber.suscribe(msg.content.toString());
        }
      },
      {
        noAck: true,
      }
    );
  } catch (err: any) {
    throw err;
  }
};
