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
const utils_1 = require("../utils");
const mongoose_1 = require("mongoose");
const axios_1 = __importDefault(require("axios"));
const moment_1 = __importDefault(require("moment"));
const config_1 = require("../config");
const { updateAdmin } = new services_1.AdminService();
class DispatcherController {
    createDispatcher(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const admin = req.admin;
                if (!admin)
                    throw new exceptions_1.UnauthorizedError('Unauthorized! Please log in as an admin to continue');
                const newDispatcher = yield axios_1.default.post(`${config_1.LOGISTICS_URL}/dispatchers/as-admin`, req.body, {
                    headers: {
                        interservicetoken: config_1.INTERSERVICE_TOKEN
                    }
                });
                const transformedBody = (0, utils_1.transformKeysToString)(req.body);
                const slackMsg = `Dispatcher creation alert:\nNew dispatcher created by ${admin.name}, ${admin.email}\Dispatcher details:${transformedBody}\nTime of creation: ${(0, moment_1.default)()}`;
                yield (0, utils_1.sendSlackMessage)(config_1.SLACK_BOT_TOKEN, slackMsg, config_1.SLACK_ADMIN_CHANNEL_ID);
                const actions = admin.actions;
                actions === null || actions === void 0 ? void 0 : actions.push(slackMsg);
                yield updateAdmin(admin._id, { actions });
                return res.status(201).json({ status: "success", data: newDispatcher.data.data });
            }
            catch (err) {
                next(err);
            }
        });
    }
    updateDispatcher(option) {
        return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const admin = req.admin;
            if (!admin)
                throw new exceptions_1.UnauthorizedError('Unauthorized! Please log in as an admin to continue');
            if (!id)
                throw new exceptions_1.BadRequestError(`Id not passed`);
            if (!mongoose_1.Types.ObjectId.isValid(id))
                throw new exceptions_1.BadRequestError(`Please pass a valid object id`);
            let updatedDispatcher;
            let slackMsg = `Dispatcher update alert\nUpdated by ${admin.name}, ${admin.email}\n`;
            if (option === "activate") {
                updatedDispatcher = yield axios_1.default.patch(`${config_1.LOGISTICS_URL}/dispatchers/${id}/as-admin/activate`, null, {
                    headers: {
                        interservicetoken: config_1.INTERSERVICE_TOKEN
                    }
                });
                slackMsg += `Dispatcher activated.\nTime of update: ${(0, moment_1.default)()}`;
            }
            else if (option === "deactivate") {
                updatedDispatcher = yield axios_1.default.patch(`${config_1.LOGISTICS_URL}/dispatchers/${id}/as-admin/deactivate`, null, {
                    headers: {
                        interservicetoken: config_1.INTERSERVICE_TOKEN
                    }
                });
                slackMsg += `Dispatcher deactivated.\nTime of update: ${(0, moment_1.default)()}`;
            }
            else if (option === "more") {
                updatedDispatcher = yield axios_1.default.patch(`${config_1.LOGISTICS_URL}/dispatchers/${id}/as-admin`, req.body, {
                    headers: {
                        interservicetoken: config_1.INTERSERVICE_TOKEN
                    }
                });
                const transformedFields = (0, utils_1.transformKeysToString)(req.body);
                slackMsg += `Details updated: ${transformedFields}\nTime of update: ${(0, moment_1.default)()}`;
            }
            yield (0, utils_1.sendSlackMessage)(config_1.SLACK_BOT_TOKEN, slackMsg, config_1.SLACK_ADMIN_CHANNEL_ID);
            const actions = admin.actions;
            actions === null || actions === void 0 ? void 0 : actions.push(slackMsg);
            yield updateAdmin(admin._id, { actions });
            return res.status(200).json({ status: "success", data: updatedDispatcher.data.data });
        });
    }
}
exports.default = DispatcherController;
