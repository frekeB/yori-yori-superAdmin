"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const validations_1 = require("../validations");
const { getCountryById, getCountryByName, getAllCountries, createCountry, updateCountry, updateAllCountries, deleteCountry } = new controllers_1.CountryController();
const router = express_1.default.Router();
router.route('/')
    .get(getAllCountries)
    .post((0, middlewares_1.validateReqBody)(validations_1.createCountrySchema), (0, middlewares_1.validateJwt)(), createCountry)
    .patch((0, middlewares_1.validateReqBody)(validations_1.updateAllCountriesSchema), (0, middlewares_1.validateJwt)(), updateAllCountries);
router.get('/name/:name', getCountryByName);
router.route('/:id')
    .get(getCountryById)
    .patch((0, middlewares_1.validateReqBody)(validations_1.updateCountrySchema), (0, middlewares_1.validateJwt)(), updateCountry)
    .delete((0, middlewares_1.validateJwt)(), deleteCountry);
exports.default = router;
