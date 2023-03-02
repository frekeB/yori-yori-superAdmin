import {Schema, model} from 'mongoose'
import {Settings} from '../interfaces'

const settingsSchema = new Schema<Settings>(
  {
    dayStart: {
      type: Number,
      required: true,
    },
    dayEnd: {
      type: Number,
      required: true,
    },
    verificationExpiryInHours: {
      type: Number,
      required: true,
    },
    conversionCommissionHigh: {
      type: Number,
      required: true,
    },
    conversionCommissionLow: {
      type: Number,
      required: true,
    },
    withdrawlCommission: {
      type: Number,
      required: true,
    },
    conversionRefreshTime: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const SettingsModel = model<Settings>('Settings', settingsSchema)

export default SettingsModel