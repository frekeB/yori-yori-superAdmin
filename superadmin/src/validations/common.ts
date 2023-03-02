import Joi from 'joi'

const accountTypeSchema = Joi.string().required().valid("franchise", "admin", "user")

export const sendResetLinkReqBodySchema = Joi.object({
    email: Joi.string().required(),
    accountType: accountTypeSchema
})

export const verifyTokenReqBodySchema = Joi.object({
    verificationToken: Joi.string().required(),
    accountType: accountTypeSchema
})

export const resetPasswordReqBodySchema = Joi.object({
    email: Joi.string().required(),
    newPassword: Joi.string().required(),
    accountType: accountTypeSchema
})

export const sendVerificationCodeSchema = Joi.object({
    email: Joi.string(),
    phone: Joi.string(),
    accountType: accountTypeSchema
})

export const resetEmailSchema = Joi.object({
    email: Joi.string().required(),
    newEmail: Joi.string().required(),
    accountType: accountTypeSchema
})

export const verifyCodeSchema = Joi.object({
    email: Joi.string().required(),
    verificationCode: Joi.string().required(),
    accountType: accountTypeSchema
})