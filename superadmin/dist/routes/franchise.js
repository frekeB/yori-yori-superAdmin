"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const validations_1 = require("../validations");
const { createFranchise, updateFranchise, deactivateAndActivateFranchise, deleteFranchise } = new controllers_1.FranchiseController();
const router = express_1.default.Router();
router.post("/", (0, middlewares_1.validateReqBody)(validations_1.registerFranchiseSchema), (0, middlewares_1.validateJwt)(), createFranchise);
router.route("/:id")
    .patch((0, middlewares_1.validateReqBody)(validations_1.updateFranchiseAdminSchema), (0, middlewares_1.validateJwt)(), updateFranchise)
    .delete((0, middlewares_1.validateJwt)(), deleteFranchise);
router.patch("/:id/activate", (0, middlewares_1.validateJwt)(), deactivateAndActivateFranchise("activate"));
router.patch("/:id/deactivate", (0, middlewares_1.validateJwt)(), deactivateAndActivateFranchise("deactivate"));
exports.default = router;
