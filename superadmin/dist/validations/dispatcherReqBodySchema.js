"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDispatcherSchema = exports.registerDispatcherSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.registerDispatcherSchema = joi_1.default.object({
    user: joi_1.default.string().required(),
    franchise: joi_1.default.string().required(),
    vehicleType: joi_1.default.string().required().valid("bicycle", "electric bike", "bike", "bus", "truck"),
    distanceRange: joi_1.default.string().required().valid("short", "any", "long"),
    dispatcherType: joi_1.default.string().required().valid("express", "regular")
});
exports.updateDispatcherSchema = joi_1.default.object({
    franchise: joi_1.default.string(),
    vehicleType: joi_1.default
        .string()
        .valid("bicycle", "electric bike", "bike", "bus", "truck"),
    distanceRange: joi_1.default.string().valid("short", "any", "long"),
    dispatcherType: joi_1.default.string().valid("express", "regular"),
});
