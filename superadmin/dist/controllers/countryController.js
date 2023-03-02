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
const moment_1 = __importDefault(require("moment"));
const axios_1 = __importDefault(require("axios"));
const mongoose_1 = require("mongoose");
const config_1 = require("../config");
const { getAllCountries: getCountries, getCountry: getOneCountry, createCountry: makeCountry, updateCountry: updateOneCountry, updateAllCountries: updateCountries, findCountry: findOneCountry, deleteCountry: deleteOneCountry } = new services_1.CountryService();
const { updateAdmin } = new services_1.AdminService();
class CountryController {
    getAllCountries(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const limit = req.query.limit ? Number(req.query.limit) : 20;
                const offset = req.query.skip ? Number(req.query.skip) : 0;
                const countries = yield getCountries(limit, offset);
                return res.status(200).json({ status: 'success', data: countries });
            }
            catch (err) {
                next(err);
            }
        });
    }
    getCountryByName(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name } = req.params;
                if (!name)
                    throw new exceptions_1.BadRequestError(`Country name not passed in request parameters`);
                const country = yield getOneCountry(name, "name");
                if (!country)
                    throw new exceptions_1.NotFoundError(`No country found with name "${name}"`);
                return res.status(200).json({ status: 'success', data: country });
            }
            catch (err) {
                next(err);
            }
        });
    }
    getCountryById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                if (!id)
                    throw new exceptions_1.BadRequestError(`Id not passed`);
                if (!mongoose_1.Types.ObjectId.isValid(id))
                    throw new exceptions_1.BadRequestError(`Please pass a valid object id`);
                const country = yield getOneCountry(id, "id");
                if (!country)
                    throw new exceptions_1.NotFoundError(`No country found with id "${id}"`);
                return res.status(200).json({ status: 'success', data: country });
            }
            catch (err) {
                next(err);
            }
        });
    }
    createCountry(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const admin = req.admin;
                if (!admin)
                    throw new exceptions_1.UnauthorizedError(`Unauthorized! Please log in as an admin to continue`);
                const { name, coordinates, yorisDeliveryCut, franchiseDeliveryCut, dispatcherDeliveryCut, regularPricesLocal, expressPricesLocal, longDistance, maximumDistance, minimumPrice, localDeliveries, vehicleDistanceRanges, internationalDeliveries, regularPricesInternational, expressPricesInternational } = req.body;
                if (localDeliveries && (!yorisDeliveryCut || !franchiseDeliveryCut || !dispatcherDeliveryCut || !regularPricesLocal || !expressPricesLocal || !longDistance || !maximumDistance || !minimumPrice || !vehicleDistanceRanges))
                    throw new exceptions_1.ConflictError(`All local related fields are required when local deliveries are enabled for country`);
                if (internationalDeliveries && (!regularPricesInternational || !expressPricesInternational))
                    throw new exceptions_1.ConflictError(`All international related fields are required when international are enabled for country`);
                let countryWithName;
                let countryWithCoord;
                countryWithName = yield findOneCountry({ name }, "one");
                countryWithCoord = yield findOneCountry({ coordinates }, "one");
                if (countryWithName !== null)
                    throw new exceptions_1.ConflictError(`A country already exists with name ${name}`);
                if (countryWithCoord !== null)
                    throw new exceptions_1.ConflictError(`A country already exists with coordinates ${coordinates}`);
                // Check the different entity cuts and make sure that the additions of all of them equals 1
                const totalCut = yorisDeliveryCut + franchiseDeliveryCut + dispatcherDeliveryCut;
                if (totalCut && totalCut !== 1)
                    throw new exceptions_1.ForbiddenError(`The totality of all cuts for this country must equal to 1.`);
                // Send request to fintech service to know if currency exists
                const currencyRes = yield axios_1.default.get(`${config_1.FINTECH_URL}/currencies`);
                const currencies = currencyRes.data.data;
                if (!currencies.includes(req.body.currency))
                    req.body.currency = "USD";
                const newCountry = yield makeCountry(req.body);
                // Construct and send slack message to admin-actions channel that a new country has been created and update admin
                const countryDetails = (0, utils_1.transformKeysToString)(req.body);
                const action = `Country Addition Alert:\nNew country added to Yoris DB by ${(admin.name, admin.email)} with the following details:${countryDetails}\nTime of creation: ${(0, moment_1.default)()}`;
                // Send slack message on this line
                yield (0, utils_1.sendSlackMessage)(config_1.SLACK_BOT_TOKEN, action, config_1.SLACK_ADMIN_CHANNEL_ID);
                const actions = admin.actions;
                actions === null || actions === void 0 ? void 0 : actions.push(action);
                yield updateAdmin(admin._id, { actions });
                return res.status(201).json({ status: "success", data: newCountry });
            }
            catch (err) {
                next(err);
            }
        });
    }
    updateCountry(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { name, coordinates } = req.body;
                const admin = req.admin;
                if (!admin)
                    throw new exceptions_1.UnauthorizedError(`Unauthorized! Please log in as an admin to continue`);
                if (name) {
                    let countryWithName;
                    countryWithName = yield findOneCountry({ name }, "one");
                    if (countryWithName !== null)
                        throw new exceptions_1.ConflictError(`A country already exists with name ${name}`);
                }
                if (coordinates) {
                    let countryWithCoord;
                    countryWithCoord = yield findOneCountry({ coordinates }, "one");
                    if (countryWithCoord !== null)
                        throw new exceptions_1.ConflictError(`A country already exists with coordinates ${coordinates}`);
                }
                const updatedCountry = yield updateOneCountry(id, req.body);
                if (updatedCountry === null)
                    throw new exceptions_1.NotFoundError(`Country not found!`);
                // Construct and send slack message to admin-actions channel that a country has been updated
                const updatedFields = (0, utils_1.transformKeysToString)(req.body);
                const action = `Country Update Alert:\nCountry updated by ${admin.name, admin.email}. The following details were updated:${updatedFields}\nTime of update: ${(0, moment_1.default)()}`;
                yield (0, utils_1.sendSlackMessage)(config_1.SLACK_BOT_TOKEN, action, config_1.SLACK_ADMIN_CHANNEL_ID);
                const actions = admin.actions;
                actions === null || actions === void 0 ? void 0 : actions.push(action);
                yield updateAdmin(admin._id, { actions });
                return res.status(200).json({ status: 'success', data: updatedCountry });
            }
            catch (err) {
                next(err);
            }
        });
    }
    updateAllCountries(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const admin = req.admin;
                if (!admin)
                    throw new exceptions_1.UnauthorizedError(`Unauthorized! Please log in as an admin to continue`);
                const updatedCountries = yield updateCountries(req.body);
                // Construct and send slcak message to admin-actions channel that all countries have been updated
                const updatedFields = (0, utils_1.transformKeysToString)(req.body);
                const action = `Country Update Alert:\nAll countries updated by ${admin.name, admin.email}. The following details were updated:${updatedFields}\nTime of update: ${(0, moment_1.default)()}`;
                const actions = admin.actions;
                actions === null || actions === void 0 ? void 0 : actions.push(action);
                yield updateAdmin(admin._id, { actions });
                return res.status(200).json({ status: 'success', data: updatedCountries });
            }
            catch (err) {
                next(err);
            }
        });
    }
    deleteCountry(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const admin = req.admin;
                if (!admin)
                    throw new exceptions_1.UnauthorizedError('Unathorized! Please log in as an admin to continue');
                const { id } = req.params;
                const country = yield getOneCountry(id, "id");
                if (!country)
                    throw new exceptions_1.NotFoundError(`No country found`);
                yield deleteOneCountry(id);
                const action = `Country Deletion Alert:\nCountry deleted by ${admin.name, admin.email}.\nCountry deleted: ${country.name}\nTime of deletion: ${(0, moment_1.default)()}`;
                yield (0, utils_1.sendSlackMessage)(config_1.SLACK_BOT_TOKEN, action, config_1.SLACK_ADMIN_CHANNEL_ID);
                const actions = admin.actions;
                actions === null || actions === void 0 ? void 0 : actions.push(action);
                yield updateAdmin(admin._id, { actions });
                return res.status(204).json({});
            }
            catch (err) {
                next(err);
            }
        });
    }
}
exports.default = CountryController;
