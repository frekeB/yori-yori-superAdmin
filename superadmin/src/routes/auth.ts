import express from 'express'
import {AuthController} from '../controllers'
import {validateReqBody} from '../middlewares'
import {
    sendResetLinkReqBodySchema,
    resetPasswordReqBodySchema,
    verifyTokenReqBodySchema,
    sendVerificationCodeSchema,
    resetEmailSchema
} from '../validations'


const {
    sendPasswordResetLink,
    verifyToken,
    resetPassword,
    sendCode,
    resetEmail
} = new AuthController()

const router = express.Router()

router.patch('/send-reset-link', validateReqBody(sendResetLinkReqBodySchema), sendPasswordResetLink)
router.patch('/send-code', validateReqBody(sendVerificationCodeSchema), sendCode)
router.patch('/verify-token', validateReqBody(verifyTokenReqBodySchema), verifyToken)
router.patch('/reset-password', validateReqBody(resetPasswordReqBodySchema), resetPassword)
router.patch('/reset-email', validateReqBody(resetEmailSchema), resetEmail)

export default router;
