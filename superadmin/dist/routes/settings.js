"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const validations_1 = require("../validations");
const { createSettings, updateSettings, getSettings } = new controllers_1.AdminController();
const router = express_1.default.Router();
router.route('/')
    .get(getSettings)
    .post((0, middlewares_1.validateReqBody)(validations_1.createSettingsSchema), (0, middlewares_1.validateJwt)(), createSettings)
    .patch((0, middlewares_1.validateReqBody)(validations_1.updateSettingsSchema), (0, middlewares_1.validateJwt)(), updateSettings);
exports.default = router;
