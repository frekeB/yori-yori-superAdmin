"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsModel = exports.AdminModel = exports.CountryModel = void 0;
const country_1 = __importDefault(require("./country"));
exports.CountryModel = country_1.default;
const admin_1 = __importDefault(require("./admin"));
exports.AdminModel = admin_1.default;
const settings_1 = __importDefault(require("./settings"));
exports.SettingsModel = settings_1.default;
