"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const expectedTime = (0, moment_1.default)(Date.now()).subtract(5, 'hours');
console.log(Date.now(), expectedTime.isBefore());
