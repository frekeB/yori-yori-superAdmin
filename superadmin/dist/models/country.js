"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const countrySchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Country must have a name!"],
        unique: true,
    },
    coordinates: {
        type: String,
        required: [true, "Country must have coordinates!"],
        unique: true,
    },
    regularPricesInternational: {
        type: mongoose_1.Schema.Types.Mixed,
        // required: true
    },
    expressPricesInternational: {
        type: mongoose_1.Schema.Types.Mixed,
        // required: true
    },
    regularPricesLocal: {
        type: mongoose_1.Schema.Types.Mixed,
        // required: true
    },
    expressPricesLocal: {
        type: mongoose_1.Schema.Types.Mixed,
        // required: true
    },
    vehicleDistanceRanges: {
        type: mongoose_1.Schema.Types.Mixed,
        // required: true
    },
    minimumPrice: {
        type: Number,
        // required: [true, "Country must have a minimum price for delivery!"],
    },
    currency: {
        type: String,
        required: [true, "Country must have a currency accepted my Yoris!"],
    },
    longDistance: {
        type: Number,
        // required: [true, "Country must have a long distance range!"],
    },
    maximumDistance: {
        type: Number,
        // required: [true, "Country must have a maximum distance!"],
    },
    yorisDeliveryCut: {
        type: Number,
        // required: true,
    },
    franchiseDeliveryCut: {
        type: Number,
        // required: true,
    },
    dispatcherDeliveryCut: {
        type: Number,
        // required: true
    },
    localDeliveries: {
        type: Boolean,
        required: true,
    },
    internationalDeliveries: {
        type: Boolean,
        required: true,
    },
}, {
    timestamps: true,
});
const CountryModel = (0, mongoose_1.model)("Country", countrySchema);
exports.default = CountryModel;
