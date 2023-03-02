"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const generateCode = (n) => {
    let number = '';
    for (let i = 0; i < n; i++) {
        number += crypto_1.default.randomInt(0, 9);
    }
    return number;
};
exports.default = generateCode;
