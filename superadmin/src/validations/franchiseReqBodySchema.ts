import joi from 'joi'

export const registerFranchiseSchema = joi.object({
    country: joi.string().required(),
    location: joi.string().required(),
    coordinates: joi.string().required(),
    email: joi.string().required(),
    password: joi.string().required(),
    phoneNumber: joi.string().required()
})

export const updateFranchiseAdminSchema = joi.object({
    country: joi.string(),
    location: joi.string(),
    coordinates: joi.string()
})