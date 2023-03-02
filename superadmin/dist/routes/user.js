"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const controllers_1 = require("../controllers");
const express_1 = __importDefault(require("express"));
const { Search, Engagement } = new controllers_1.UserAccount();
const router = express_1.default.Router();
router.route("/search").get(Search);
router.route("/engagement/:id").get(Engagement);
exports.default = router;
