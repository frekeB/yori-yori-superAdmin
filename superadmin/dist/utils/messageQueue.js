"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.susMessage = exports.publishMessage = exports.createChannel = void 0;
const amqplib_1 = __importDefault(require("amqplib"));
const config_1 = require("../config");
const createChannel = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connection = yield amqplib_1.default.connect(config_1.MESSAGE_BROKER_URL);
        const channel = yield connection.createChannel();
        // await channel.assertExchange(exchange, "direct");
        return channel;
    }
    catch (err) {
        throw err;
    }
});
exports.createChannel = createChannel;
const publishMessage = (channel, queueName, message) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        channel.assertQueue(queueName);
        const status = channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
        console.log(`Message sent to ${queueName}`);
        return status;
    }
    catch (err) {
        throw err;
    }
});
exports.publishMessage = publishMessage;
const susMessage = (queueName, channel, suscriber) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        channel.assertQueue(queueName);
        channel.consume(queueName, (msg) => {
            if (msg) {
                console.log("The message is: ", msg.content.toString());
                suscriber.suscribe(msg.content.toString());
            }
        }, {
            noAck: true,
        });
    }
    catch (err) {
        throw err;
    }
});
exports.susMessage = susMessage;
