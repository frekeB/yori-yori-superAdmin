"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = require("../services");
const exceptions_1 = require("../exceptions");
const mongoose_1 = require("mongoose");
const utils_1 = require("../utils");
const moment_1 = __importDefault(require("moment"));
const config_1 = require("../config");
const { getAllAdmins: getAdmins, getAdmin: getOneAdmin, deleteAdmin: deleteOneAdmin, updateAdmin } = new services_1.AdminService();
const { createSettings: createNewSetting, getSettings, updateSettings: updateASetting } = new services_1.SettingsService();
class AdminController {
    getAllAdmins(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { limit, skip } = req.query;
                const limitValue = limit ? Number(limit) : 20;
                const offsetValue = skip ? Number(skip) : 0;
                const admins = yield getAdmins(limitValue, offsetValue);
                return res.status(200).json({ status: 'success', data: admins });
            }
            catch (err) {
                next(err);
            }
        });
    }
    getAdmin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                if (!id)
                    throw new exceptions_1.BadRequestError(`Please pass id in request parameters`);
                if (!mongoose_1.Types.ObjectId.isValid(id))
                    throw new exceptions_1.BadRequestError(`Please pass a valid object id`);
                const admin = yield getOneAdmin(id);
                if (admin === null)
                    throw new exceptions_1.NotFoundError(`No admin found with id ${id}`);
                return res.status(200).json({ status: 'success', data: admin });
            }
            catch (err) {
                next(err);
            }
        });
    }
    deleteAdmin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                yield deleteOneAdmin(id);
                return res.status(204).json({});
            }
            catch (err) {
                next(err);
            }
        });
    }
    getSettings(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const settings = yield getSettings();
                return res.status(200).json({ status: 'success', data: settings });
            }
            catch (err) {
                next(err);
            }
        });
    }
    createSettings(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const admin = req.admin;
                if (!admin)
                    throw new exceptions_1.UnauthorizedError(`Unauthorized, Please log in as an admin to continue!`);
                const settings = yield createNewSetting(req.body);
                const createdFields = (0, utils_1.transformKeysToString)(req.body);
                const action = `Global App Settings Creation Alert:\nSettings created by ${admin.email, admin.name}. These were the settings added: ${createdFields}\nTime of creation: ${(0, moment_1.default)()}`;
                yield (0, utils_1.sendSlackMessage)(config_1.SLACK_BOT_TOKEN, action, config_1.SLACK_ADMIN_CHANNEL_ID);
                const actions = admin.actions;
                actions === null || actions === void 0 ? void 0 : actions.push(action);
                yield updateAdmin(admin._id, { actions });
                return res.status(201).json({ status: 'success', data: settings });
            }
            catch (err) {
                next(err);
            }
        });
    }
    updateSettings(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const admin = req.admin;
                if (!admin)
                    throw new exceptions_1.UnauthorizedError(`Unauthorized, Please log in as an admin to continue!`);
                const settings = yield updateASetting(req.body);
                const updatedFields = (0, utils_1.transformKeysToString)(req.body);
                const action = `Global App Settings Update Alert:\nSettings updated by ${admin.email, admin.name}. These were the settings added: ${updatedFields}\nTime of update: ${(0, moment_1.default)()}`;
                yield (0, utils_1.sendSlackMessage)(config_1.SLACK_BOT_TOKEN, action, config_1.SLACK_ADMIN_CHANNEL_ID);
                const actions = admin.actions;
                actions === null || actions === void 0 ? void 0 : actions.push(action);
                yield updateAdmin(admin._id, { actions });
                return res.status(200).json({ status: 'success', data: settings });
            }
            catch (err) {
                next(err);
            }
        });
    }
}
exports.default = AdminController;
