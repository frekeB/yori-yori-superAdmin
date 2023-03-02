"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const generateRandomToken = (uid, size) => {
    const buffer = crypto_1.default.randomBytes(size);
    const token = buffer.toString('hex') + uid;
    return token;
};
exports.default = generateRandomToken;
