"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const adminSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Admin must have a name'],
        unique: true
    },
    email: {
        type: String,
        required: [true, 'Admin must have an email address'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Admin must have a password']
    },
    refreshToken: String,
    actions: [{
            type: String
        }],
    verificationToken: String,
    verificationCode: String,
    verificationTokenExpiry: Date,
    verificationCodeExpiry: Date
}, { timestamps: true });
const AdminModel = (0, mongoose_1.model)('Admin', adminSchema);
exports.default = AdminModel;
