"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const validations_1 = require("../validations");
const { registerAdmin, loginAdmin, deleteAdmin: deleteMe } = new controllers_1.AuthController();
const { getAdmin, getAllAdmins, deleteAdmin } = new controllers_1.AdminController();
const router = express_1.default.Router();
router.route('/').get(getAllAdmins).post((0, middlewares_1.validateReqBody)(validations_1.registerAdminReqBodySchema), registerAdmin);
router.post('/login', (0, middlewares_1.validateReqBody)(validations_1.loginAdminReqBodySchema), loginAdmin);
router.route('/me').delete((0, middlewares_1.validateJwt)(), deleteMe);
router.route('/:id').get(getAdmin).delete(deleteAdmin);
exports.default = router;
