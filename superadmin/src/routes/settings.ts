import express from 'express'
import {AdminController} from '../controllers'
import {validateJwt, validateReqBody} from '../middlewares'
import {createSettingsSchema, updateSettingsSchema} from '../validations'

const {
    createSettings,
    updateSettings,
    getSettings
} = new AdminController()

const router = express.Router()

router.route('/')
    .get(getSettings)
    .post(validateReqBody(createSettingsSchema), validateJwt(), createSettings)
    .patch(validateReqBody(updateSettingsSchema), validateJwt(), updateSettings)


export default router