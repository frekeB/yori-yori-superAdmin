type LocalPrices = {
  pricePerKmSmall: number;
  pricePerKmMedium: number;
  pricePerKmLarge: number;
};

type InternationalPrices = {
  shippingFeeKg: number;
  shippingFeeCBM: number;
  importDutyKg: number;
  importDutyCBM: number;
};

type VehicleDistanceRanges = {bicycle: number, eBike: number, bike: number, bus: number, truck: number}

export default interface Country {
    name: string,
    coordinates: string,
    regularPricesInternational?: InternationalPrices,
    expressPricesInternational?: InternationalPrices, 
    regularPricesLocal?: LocalPrices,
    expressPricesLocal?: LocalPrices,
    vehicleDistanceRanges?: VehicleDistanceRanges,
    longDistance?: number,
    maximumDistance?: number,
    yorisDeliveryCut?: number,
    franchiseDeliveryCut?: number,
    dispatcherDeliveryCut?: number,
    localDeliveries: boolean,
    internationalDeliveries: boolean,
    minimumPrice?: number,
    currency: string,
    // location: string,
    _id?: any
}

