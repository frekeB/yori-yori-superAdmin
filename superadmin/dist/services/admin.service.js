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
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const utils_1 = require("../utils");
class AdminService {
    getAllAdmins(limitValue, offsetValue) {
        return __awaiter(this, void 0, void 0, function* () {
            const admins = yield (0, utils_1.paginator)(models_1.AdminModel, limitValue, offsetValue);
            return admins;
        });
    }
    getAdmin(uid) {
        return __awaiter(this, void 0, void 0, function* () {
            const admin = yield models_1.AdminModel.findById(uid);
            if (!admin) {
                return null;
            }
            return admin;
        });
    }
    findAdmin(field, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            let admin = null;
            if (amount === "one") {
                admin = yield models_1.AdminModel.findOne(field);
                if (!admin) {
                    return null;
                }
            }
            else if (amount === "multiple") {
                admin = yield models_1.AdminModel.find(field);
                if (admin.length < 1) {
                    return null;
                }
            }
            return admin;
        });
    }
    createAdmin(admin) {
        return __awaiter(this, void 0, void 0, function* () {
            const newAdmin = yield models_1.AdminModel.create(admin);
            return newAdmin;
        });
    }
    updateAdmin(uid, fields) {
        return __awaiter(this, void 0, void 0, function* () {
            yield models_1.AdminModel.findByIdAndUpdate(uid, fields);
            const admin = yield models_1.AdminModel.findById(uid);
            if (!admin) {
                return null;
            }
            return admin;
        });
    }
    deleteAdmin(uid) {
        return __awaiter(this, void 0, void 0, function* () {
            yield models_1.AdminModel.findByIdAndDelete(uid);
        });
    }
}
exports.default = AdminService;
