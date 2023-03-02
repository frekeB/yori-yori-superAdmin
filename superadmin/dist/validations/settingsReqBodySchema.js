"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSettingsSchema = exports.createSettingsSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createSettingsSchema = joi_1.default.object({
    dayStart: joi_1.default.number().required(),
    dayEnd: joi_1.default.number().required(),
    verificationExpiryInHours: joi_1.default.number().required(),
    conversionCommissionHigh: joi_1.default.number().required().max(1),
    conversionCommissionLow: joi_1.default.number().required().max(1),
    withdrawlCommission: joi_1.default.number().required().max(1),
    conversionRefreshTime: joi_1.default.number().required(),
});
exports.updateSettingsSchema = joi_1.default.object({
    dayStart: joi_1.default.number(),
    dayEnd: joi_1.default.number(),
    verificationExpiryInHours: joi_1.default.number(),
    conversionCommissionHigh: joi_1.default.number().max(1),
    conversionCommissionLow: joi_1.default.number().max(1),
    withdrawlCommission: joi_1.default.number().max(1),
    conversionRefreshTime: joi_1.default.number(),
});
