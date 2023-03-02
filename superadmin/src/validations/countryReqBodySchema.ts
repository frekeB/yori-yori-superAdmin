import Joi from 'joi'

export const createCountrySchema = Joi.object({
  name: Joi.string().required(),
  coordinates: Joi.string().required(),
  regularPricesInternational: Joi.object({
    shippingFeeKg: Joi.number().required(),
    shippingFeeCBM: Joi.number().required(),
    importDutyKg: Joi.number().required(),
    importDutyCBM: Joi.number().required(),
  }),
  expressPricesInternational: Joi.object({
    shippingFeeKg: Joi.number().required(),
    shippingFeeCBM: Joi.number().required(),
    importDutyKg: Joi.number().required(),
    importDutyCBM: Joi.number().required(),
  }),
  regularPricesLocal: Joi.object({
    pricePerKmSmall: Joi.number().required(),
    pricePerKmMedium: Joi.number().required(),
    pricePerKmLarge: Joi.number().required(),
  }),
  expressPricesLocal: Joi.object({
    pricePerKmSmall: Joi.number().required(),
    pricePerKmMedium: Joi.number().required(),
    pricePerKmLarge: Joi.number().required(),
  }),
  vehicleDistanceRanges: Joi.object({
    bicycle: Joi.number().required(),
    eBike: Joi.number().required(),
    bike: Joi.number().required(),
    bus: Joi.number().required(),
    truck: Joi.number().required(),
  }),
  longDistance: Joi.number(),
  maximumDistance: Joi.number(),
  yorisDeliveryCut: Joi.number(),
  franchiseDeliveryCut: Joi.number(),
  dispatcherDeliveryCut: Joi.number(),
  localDeliveries: Joi.boolean().required(),
  internationalDeliveries: Joi.boolean().required(),
  minimumPrice: Joi.number(),
  currency: Joi.string().required(),
});

export const updateCountrySchema = Joi.object({
  name: Joi.string(),
  coordinates: Joi.string(),
  regularPricesInternational: Joi.object({
    shippingFeeKg: Joi.number(),
    shippingFeeCBM: Joi.number(),
    importDutyKg: Joi.number(),
    importDutyCBM: Joi.number(),
  }),
  expressPricesInternational: Joi.object({
    shippingFeeKg: Joi.number(),
    shippingFeeCBM: Joi.number(),
    importDutyKg: Joi.number(),
    importDutyCBM: Joi.number(),
  }),
  regularPricesLocal: Joi.object({
    pricePerKmSmall: Joi.number(),
    pricePerKmMedium: Joi.number(),
    pricePerKmLarge: Joi.number(),
  }),
  expressPricesLocal: Joi.object({
    pricePerKmSmall: Joi.number(),
    pricePerKmMedium: Joi.number(),
    pricePerKmLarge: Joi.number(),
  }),
  vehicleDistanceRanges: Joi.object({
    bicycle: Joi.number(),
    eBike: Joi.number(),
    bike: Joi.number(),
    bus: Joi.number(),
    truck: Joi.number(),
  }),
  longDistance: Joi.number(),
  maximumDistance: Joi.number(),
  yorisDeliveryCut: Joi.number(),
  franchiseDeliveryCut: Joi.number(),
  dispatcherDeliveryCut: Joi.number(),
  localDeliveries: Joi.boolean(),
  internationalDeliveries: Joi.boolean(),
  minimumPrice: Joi.number(),
  currency: Joi.string(),
});

export const updateAllCountriesSchema = Joi.object({
  regularPricesInternational: Joi.object({
    shippingFeeKg: Joi.number(),
    shippingFeeCBM: Joi.number(),
    importDutyKg: Joi.number(),
    importDutyCBM: Joi.number(),
  }),
  expressPricesInternational: Joi.object({
    shippingFeeKg: Joi.number(),
    shippingFeeCBM: Joi.number(),
    importDutyKg: Joi.number(),
    importDutyCBM: Joi.number(),
  }),
  regularPricesLocal: Joi.object({
    pricePerKmSmall: Joi.number(),
    pricePerKmMedium: Joi.number(),
    pricePerKmLarge: Joi.number(),
  }),
  expressPricesLocal: Joi.object({
    pricePerKmSmall: Joi.number(),
    pricePerKmMedium: Joi.number(),
    pricePerKmLarge: Joi.number(),
  }),
  vehicleDistanceRanges: Joi.object({
    bicycle: Joi.number(),
    eBike: Joi.number(),
    bike: Joi.number(),
    bus: Joi.number(),
    truck: Joi.number(),
  }),
  longDistance: Joi.number(),
  maximumDistance: Joi.number(),
  yorisDeliveryCut: Joi.number(),
  franchiseDeliveryCut: Joi.number(),
  dispatcherDeliveryCut: Joi.number(),
  localDeliveries: Joi.boolean(),
  internationalDeliveries: Joi.boolean(),
  minimumPrice: Joi.number(),
  currency: Joi.string(),
});