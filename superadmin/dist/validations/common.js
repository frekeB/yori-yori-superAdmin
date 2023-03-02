"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyCodeSchema = exports.resetEmailSchema = exports.sendVerificationCodeSchema = exports.resetPasswordReqBodySchema = exports.verifyTokenReqBodySchema = exports.sendResetLinkReqBodySchema = void 0;
const joi_1 = __importDefault(require("joi"));
const accountTypeSchema = joi_1.default.string().required().valid("franchise", "admin", "user");
exports.sendResetLinkReqBodySchema = joi_1.default.object({
    email: joi_1.default.string().required(),
    accountType: accountTypeSchema
});
exports.verifyTokenReqBodySchema = joi_1.default.object({
    verificationToken: joi_1.default.string().required(),
    accountType: accountTypeSchema
});
exports.resetPasswordReqBodySchema = joi_1.default.object({
    email: joi_1.default.string().required(),
    newPassword: joi_1.default.string().required(),
    accountType: accountTypeSchema
});
exports.sendVerificationCodeSchema = joi_1.default.object({
    email: joi_1.default.string(),
    phone: joi_1.default.string(),
    accountType: accountTypeSchema
});
exports.resetEmailSchema = joi_1.default.object({
    email: joi_1.default.string().required(),
    newEmail: joi_1.default.string().required(),
    accountType: accountTypeSchema
});
exports.verifyCodeSchema = joi_1.default.object({
    email: joi_1.default.string().required(),
    verificationCode: joi_1.default.string().required(),
    accountType: accountTypeSchema
});
