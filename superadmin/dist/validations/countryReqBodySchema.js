"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAllCountriesSchema = exports.updateCountrySchema = exports.createCountrySchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createCountrySchema = joi_1.default.object({
    name: joi_1.default.string().required(),
    coordinates: joi_1.default.string().required(),
    regularPricesInternational: joi_1.default.object({
        shippingFeeKg: joi_1.default.number().required(),
        shippingFeeCBM: joi_1.default.number().required(),
        importDutyKg: joi_1.default.number().required(),
        importDutyCBM: joi_1.default.number().required(),
    }),
    expressPricesInternational: joi_1.default.object({
        shippingFeeKg: joi_1.default.number().required(),
        shippingFeeCBM: joi_1.default.number().required(),
        importDutyKg: joi_1.default.number().required(),
        importDutyCBM: joi_1.default.number().required(),
    }),
    regularPricesLocal: joi_1.default.object({
        pricePerKmSmall: joi_1.default.number().required(),
        pricePerKmMedium: joi_1.default.number().required(),
        pricePerKmLarge: joi_1.default.number().required(),
    }),
    expressPricesLocal: joi_1.default.object({
        pricePerKmSmall: joi_1.default.number().required(),
        pricePerKmMedium: joi_1.default.number().required(),
        pricePerKmLarge: joi_1.default.number().required(),
    }),
    vehicleDistanceRanges: joi_1.default.object({
        bicycle: joi_1.default.number().required(),
        eBike: joi_1.default.number().required(),
        bike: joi_1.default.number().required(),
        bus: joi_1.default.number().required(),
        truck: joi_1.default.number().required(),
    }),
    longDistance: joi_1.default.number(),
    maximumDistance: joi_1.default.number(),
    yorisDeliveryCut: joi_1.default.number(),
    franchiseDeliveryCut: joi_1.default.number(),
    dispatcherDeliveryCut: joi_1.default.number(),
    localDeliveries: joi_1.default.boolean().required(),
    internationalDeliveries: joi_1.default.boolean().required(),
    minimumPrice: joi_1.default.number(),
    currency: joi_1.default.string().required(),
});
exports.updateCountrySchema = joi_1.default.object({
    name: joi_1.default.string(),
    coordinates: joi_1.default.string(),
    regularPricesInternational: joi_1.default.object({
        shippingFeeKg: joi_1.default.number(),
        shippingFeeCBM: joi_1.default.number(),
        importDutyKg: joi_1.default.number(),
        importDutyCBM: joi_1.default.number(),
    }),
    expressPricesInternational: joi_1.default.object({
        shippingFeeKg: joi_1.default.number(),
        shippingFeeCBM: joi_1.default.number(),
        importDutyKg: joi_1.default.number(),
        importDutyCBM: joi_1.default.number(),
    }),
    regularPricesLocal: joi_1.default.object({
        pricePerKmSmall: joi_1.default.number(),
        pricePerKmMedium: joi_1.default.number(),
        pricePerKmLarge: joi_1.default.number(),
    }),
    expressPricesLocal: joi_1.default.object({
        pricePerKmSmall: joi_1.default.number(),
        pricePerKmMedium: joi_1.default.number(),
        pricePerKmLarge: joi_1.default.number(),
    }),
    vehicleDistanceRanges: joi_1.default.object({
        bicycle: joi_1.default.number(),
        eBike: joi_1.default.number(),
        bike: joi_1.default.number(),
        bus: joi_1.default.number(),
        truck: joi_1.default.number(),
    }),
    longDistance: joi_1.default.number(),
    maximumDistance: joi_1.default.number(),
    yorisDeliveryCut: joi_1.default.number(),
    franchiseDeliveryCut: joi_1.default.number(),
    dispatcherDeliveryCut: joi_1.default.number(),
    localDeliveries: joi_1.default.boolean(),
    internationalDeliveries: joi_1.default.boolean(),
    minimumPrice: joi_1.default.number(),
    currency: joi_1.default.string(),
});
exports.updateAllCountriesSchema = joi_1.default.object({
    regularPricesInternational: joi_1.default.object({
        shippingFeeKg: joi_1.default.number(),
        shippingFeeCBM: joi_1.default.number(),
        importDutyKg: joi_1.default.number(),
        importDutyCBM: joi_1.default.number(),
    }),
    expressPricesInternational: joi_1.default.object({
        shippingFeeKg: joi_1.default.number(),
        shippingFeeCBM: joi_1.default.number(),
        importDutyKg: joi_1.default.number(),
        importDutyCBM: joi_1.default.number(),
    }),
    regularPricesLocal: joi_1.default.object({
        pricePerKmSmall: joi_1.default.number(),
        pricePerKmMedium: joi_1.default.number(),
        pricePerKmLarge: joi_1.default.number(),
    }),
    expressPricesLocal: joi_1.default.object({
        pricePerKmSmall: joi_1.default.number(),
        pricePerKmMedium: joi_1.default.number(),
        pricePerKmLarge: joi_1.default.number(),
    }),
    vehicleDistanceRanges: joi_1.default.object({
        bicycle: joi_1.default.number(),
        eBike: joi_1.default.number(),
        bike: joi_1.default.number(),
        bus: joi_1.default.number(),
        truck: joi_1.default.number(),
    }),
    longDistance: joi_1.default.number(),
    maximumDistance: joi_1.default.number(),
    yorisDeliveryCut: joi_1.default.number(),
    franchiseDeliveryCut: joi_1.default.number(),
    dispatcherDeliveryCut: joi_1.default.number(),
    localDeliveries: joi_1.default.boolean(),
    internationalDeliveries: joi_1.default.boolean(),
    minimumPrice: joi_1.default.number(),
    currency: joi_1.default.string(),
});
