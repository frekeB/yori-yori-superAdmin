"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const validations_1 = require("../validations");
const { createDispatcher, updateDispatcher } = new controllers_1.DispatcherController();
const router = express_1.default.Router();
router.post("/", (0, middlewares_1.validateReqBody)(validations_1.registerDispatcherSchema), (0, middlewares_1.validateJwt)(), createDispatcher);
router.patch("/:id", (0, middlewares_1.validateReqBody)(validations_1.updateDispatcherSchema), (0, middlewares_1.validateJwt)(), updateDispatcher("more"));
router.patch("/:id/activate", (0, middlewares_1.validateJwt)(), updateDispatcher("activate"));
router.patch("/:id/deactivate", (0, middlewares_1.validateJwt)(), updateDispatcher("deactivate"));
exports.default = router;
