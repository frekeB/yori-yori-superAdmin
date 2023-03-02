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
const exceptions_1 = require("../exceptions");
class SettingsService {
    getSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            const settings = yield models_1.SettingsModel.find();
            if (settings.length < 1)
                throw new exceptions_1.NotFoundError('No settings predefined yet');
            return settings[0];
        });
    }
    createSettings(setting) {
        return __awaiter(this, void 0, void 0, function* () {
            const settings = yield models_1.SettingsModel.find();
            if (settings.length > 0)
                throw new exceptions_1.ConflictError('There are already predefined settings, please update that!');
            const newSettings = yield models_1.SettingsModel.create(setting);
            return newSettings;
        });
    }
    updateSettings(fields) {
        return __awaiter(this, void 0, void 0, function* () {
            const settings = yield models_1.SettingsModel.find();
            if (settings.length < 1)
                throw new exceptions_1.NotFoundError('No settings predefined yet');
            yield models_1.SettingsModel.findByIdAndUpdate(settings[0]._id, fields);
            const updatedSetting = yield models_1.SettingsModel.find();
            return updatedSetting[0];
        });
    }
}
exports.default = SettingsService;
