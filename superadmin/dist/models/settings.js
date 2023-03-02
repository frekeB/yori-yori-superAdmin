"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const settingsSchema = new mongoose_1.Schema({
    dayStart: {
        type: Number,
        required: true,
    },
    dayEnd: {
        type: Number,
        required: true,
    },
    verificationExpiryInHours: {
        type: Number,
        required: true,
    },
    conversionCommissionHigh: {
        type: Number,
        required: true,
    },
    conversionCommissionLow: {
        type: Number,
        required: true,
    },
    withdrawlCommission: {
        type: Number,
        required: true,
    },
    conversionRefreshTime: {
        type: Number,
        required: true,
    },
}, { timestamps: true });
const SettingsModel = (0, mongoose_1.model)('Settings', settingsSchema);
exports.default = SettingsModel;
