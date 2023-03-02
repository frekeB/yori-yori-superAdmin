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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
class FranchiseController {
    createFranchise(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const admin = req.admin;
                if (!admin)
                    throw new exceptions_1.UnauthorizedError('Unauthorized! Please log in as an admin to continue');
                const newFranchise = yield axios_1.default.post(`${config_1.LOGISTICS_URL}/franchises`, req.body, {
                    headers: {
                        interservicetoken: config_1.INTERSERVICE_TOKEN
                    }
                });
                const _a = req.body, { password } = _a, restOfBody = __rest(_a, ["password"]);
                const transformedBody = (0, utils_1.transformKeysToString)(restOfBody);
                const slackMsg = `Franchise creation alert:\nNew franchise created by ${admin.name}, ${admin.email}\nFranchise details:${transformedBody}\nTime of creation: ${(0, moment_1.default)()}`;
                yield (0, utils_1.sendSlackMessage)(config_1.SLACK_BOT_TOKEN, slackMsg, config_1.SLACK_ADMIN_CHANNEL_ID);
                const actions = admin.actions;
                actions === null || actions === void 0 ? void 0 : actions.push(slackMsg);
                yield updateAdmin(admin._id, { actions });
                return res.status(201).json({ status: "success", data: newFranchise.data.data });
            }
            catch (err) {
                next(err);
            }
        });
    }
    updateFranchise(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const admin = req.admin;
                const { id } = req.params;
                if (!id)
                    throw new exceptions_1.BadRequestError(`Id not passed`);
                if (!mongoose_1.Types.ObjectId.isValid(id))
                    throw new exceptions_1.BadRequestError(`Please pass a valid object id`);
                if (!admin)
                    throw new exceptions_1.UnauthorizedError('Unauthorized! Please log in as an admin to continue');
                const updatedFranchise = yield axios_1.default.patch(`${config_1.LOGISTICS_URL}/franchises/${id}`, req.body, {
                    headers: {
                        interservicetoken: config_1.INTERSERVICE_TOKEN
                    }
                });
                const transformedBody = (0, utils_1.transformKeysToString)(req.body);
                const slackMsg = `Franchise update alert:\nFranchise updated by ${admin.name}, ${admin.email}\nFranchise details:${transformedBody}\nTime of update: ${(0, moment_1.default)()}`;
                yield (0, utils_1.sendSlackMessage)(config_1.SLACK_BOT_TOKEN, slackMsg, config_1.SLACK_ADMIN_CHANNEL_ID);
                const actions = admin.actions;
                actions === null || actions === void 0 ? void 0 : actions.push(slackMsg);
                yield updateAdmin(admin._id, { actions });
                return res.status(200).json({ status: "success", data: updatedFranchise.data.data });
            }
            catch (err) {
                next(err);
            }
        });
    }
    deactivateAndActivateFranchise(action) {
        return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const admin = req.admin;
                const { id } = req.params;
                if (!id)
                    throw new exceptions_1.BadRequestError(`Id not passed`);
                if (!mongoose_1.Types.ObjectId.isValid(id))
                    throw new exceptions_1.BadRequestError(`Please pass a valid object id`);
                if (!admin)
                    throw new exceptions_1.UnauthorizedError('Unauthorized! Please log in as an admin to continue');
                const updatedFranchise = yield axios_1.default.patch(`${config_1.LOGISTICS_URL}/franchises/${id}/${action}`, null, {
                    headers: {
                        interservicetoken: config_1.INTERSERVICE_TOKEN
                    }
                });
                const slackMsg = `Franchise update alert:\nFranchise ${action}d by ${admin.name}, ${admin.email}\nFranchise details:${updatedFranchise.data.data.country}, ${updatedFranchise.data.data.coordinates}\nTime of update: ${(0, moment_1.default)()}`;
                yield (0, utils_1.sendSlackMessage)(config_1.SLACK_BOT_TOKEN, slackMsg, config_1.SLACK_ADMIN_CHANNEL_ID);
                const actions = admin.actions;
                actions === null || actions === void 0 ? void 0 : actions.push(slackMsg);
                yield updateAdmin(admin._id, { actions });
                return res.status(200).json({ status: "success", data: updatedFranchise.data.data });
            }
            catch (err) {
                next(err);
            }
        });
    }
    deleteFranchise(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const admin = req.admin;
                const { id } = req.params;
                if (!id)
                    throw new exceptions_1.BadRequestError(`Id not passed`);
                if (!mongoose_1.Types.ObjectId.isValid(id))
                    throw new exceptions_1.BadRequestError(`Please pass a valid object id`);
                if (!admin)
                    throw new exceptions_1.UnauthorizedError('Unauthorized! Please log in as an admin to continue');
                yield axios_1.default.delete(`${config_1.LOGISTICS_URL}/franchises/${id}`, {
                    headers: {
                        interservicetoken: config_1.INTERSERVICE_TOKEN
                    }
                });
                const slackMsg = `Franchise deletion alert:\nFranchise ${id} deleted by ${admin.name}, ${admin.email}\nTime of deletion: ${(0, moment_1.default)()}`;
                yield (0, utils_1.sendSlackMessage)(config_1.SLACK_BOT_TOKEN, slackMsg, config_1.SLACK_ADMIN_CHANNEL_ID);
                const actions = admin.actions;
                actions === null || actions === void 0 ? void 0 : actions.push(slackMsg);
                yield updateAdmin(admin._id, { actions });
                return res.status(204).json({});
            }
            catch (err) {
                next(err);
            }
        });
    }
}
exports.default = FranchiseController;
