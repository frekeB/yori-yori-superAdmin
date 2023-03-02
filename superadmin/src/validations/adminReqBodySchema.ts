import Joi from 'joi'

export const registerAdminReqBodySchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required()
})

export const loginAdminReqBodySchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required()
})