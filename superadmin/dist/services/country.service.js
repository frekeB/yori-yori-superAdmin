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
class CountryService {
    getAllCountries(limitValue, offsetValue) {
        return __awaiter(this, void 0, void 0, function* () {
            const countries = yield (0, utils_1.paginator)(models_1.CountryModel, limitValue, offsetValue);
            return countries;
        });
    }
    getCountry(filter, option) {
        return __awaiter(this, void 0, void 0, function* () {
            let filterObj;
            if (option === "id")
                filterObj = { _id: filter };
            else if (option === "name")
                filterObj = { name: filter.toLowerCase() };
            const country = yield models_1.CountryModel.findOne(filterObj);
            if (!country)
                return null;
            return country;
        });
    }
    findCountry(filter, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            let country = null;
            if (amount === "one") {
                country = yield models_1.CountryModel.findOne(filter);
                if (!country) {
                    return null;
                }
            }
            else if (amount === "multiple") {
                country = yield models_1.CountryModel.find(filter);
                if (country.length < 1) {
                    return null;
                }
            }
            return country;
        });
    }
    createCountry(country) {
        return __awaiter(this, void 0, void 0, function* () {
            country.name = country.name.toLowerCase();
            const newCountry = yield models_1.CountryModel.create(country);
            return newCountry;
        });
    }
    updateCountry(uid, fields) {
        return __awaiter(this, void 0, void 0, function* () {
            yield models_1.CountryModel.findByIdAndUpdate(uid, fields);
            const country = yield models_1.CountryModel.findById(uid);
            if (!country)
                return null;
            return country;
        });
    }
    updateAllCountries(fields) {
        return __awaiter(this, void 0, void 0, function* () {
            const countries = yield models_1.CountryModel.find();
            countries.forEach((country) => __awaiter(this, void 0, void 0, function* () {
                yield models_1.CountryModel.findByIdAndUpdate(country._id, fields);
            }));
            const updatedCountries = yield models_1.CountryModel.find();
            return updatedCountries;
        });
    }
    deleteCountry(uid) {
        return __awaiter(this, void 0, void 0, function* () {
            yield models_1.CountryModel.findByIdAndDelete(uid);
        });
    }
}
exports.default = CountryService;
