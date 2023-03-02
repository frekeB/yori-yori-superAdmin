import Joi from 'joi'

export const createSettingsSchema = Joi.object({
  dayStart: Joi.number().required(),
  dayEnd: Joi.number().required(),
  verificationExpiryInHours: Joi.number().required(),
  conversionCommissionHigh: Joi.number().required().max(1),
  conversionCommissionLow: Joi.number().required().max(1),
  withdrawlCommission: Joi.number().required().max(1),
  conversionRefreshTime: Joi.number().required(),
});

export const updateSettingsSchema = Joi.object({
  dayStart: Joi.number(),
  dayEnd: Joi.number(),
  verificationExpiryInHours: Joi.number(),
  conversionCommissionHigh: Joi.number().max(1),
  conversionCommissionLow: Joi.number().max(1),
  withdrawlCommission: Joi.number().max(1),
  conversionRefreshTime: Joi.number(),
});