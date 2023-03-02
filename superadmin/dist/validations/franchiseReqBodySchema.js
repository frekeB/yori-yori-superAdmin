"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFranchiseAdminSchema = exports.registerFranchiseSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.registerFranchiseSchema = joi_1.default.object({
    country: joi_1.default.string().required(),
    location: joi_1.default.string().required(),
    coordinates: joi_1.default.string().required(),
    email: joi_1.default.string().required(),
    password: joi_1.default.string().required(),
    phoneNumber: joi_1.default.string().required()
});
exports.updateFranchiseAdminSchema = joi_1.default.object({
    country: joi_1.default.string(),
    location: joi_1.default.string(),
    coordinates: joi_1.default.string()
});
