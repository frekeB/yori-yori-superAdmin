import {Schema, model} from 'mongoose'
import {Country} from '../interfaces'

const countrySchema = new Schema<Country>(
  {
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
      type: Schema.Types.Mixed,
      // required: true
    },
    expressPricesInternational: {
      type: Schema.Types.Mixed,
      // required: true
    },
    regularPricesLocal: {
      type: Schema.Types.Mixed,
      // required: true
    },
    expressPricesLocal: {
      type: Schema.Types.Mixed,
      // required: true
    },
    vehicleDistanceRanges: {
      type: Schema.Types.Mixed,
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
  },
  {
    timestamps: true,
  }
);  

const CountryModel = model<Country>("Country", countrySchema)

export default CountryModel