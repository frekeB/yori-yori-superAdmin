"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const validations_1 = require("../validations");
const { sendPasswordResetLink, verifyToken, resetPassword, sendCode, resetEmail } = new controllers_1.AuthController();
const router = express_1.default.Router();
router.patch('/send-reset-link', (0, middlewares_1.validateReqBody)(validations_1.sendResetLinkReqBodySchema), sendPasswordResetLink);
router.patch('/send-code', (0, middlewares_1.validateReqBody)(validations_1.sendVerificationCodeSchema), sendCode);
router.patch('/verify-token', (0, middlewares_1.validateReqBody)(validations_1.verifyTokenReqBodySchema), verifyToken);
router.patch('/reset-password', (0, middlewares_1.validateReqBody)(validations_1.resetPasswordReqBodySchema), resetPassword);
router.patch('/reset-email', (0, middlewares_1.validateReqBody)(validations_1.resetEmailSchema), resetEmail);
exports.default = router;
