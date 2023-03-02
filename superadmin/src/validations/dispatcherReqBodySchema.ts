import joi from 'joi'

export const registerDispatcherSchema = joi.object({
    user: joi.string().required(),
    franchise: joi.string().required(),
    vehicleType: joi.string().required().valid("bicycle", "electric bike", "bike", "bus", "truck"),
    distanceRange: joi.string().required().valid("short", "any", "long"),
    dispatcherType: joi.string().required().valid("express", "regular")
})

export const updateDispatcherSchema = joi.object({
  franchise: joi.string(),
  vehicleType: joi
    .string()
    .valid("bicycle", "electric bike", "bike", "bus", "truck"),
  distanceRange: joi.string().valid("short", "any", "long"),
  dispatcherType: joi.string().valid("express", "regular"),
});