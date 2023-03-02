import express from 'express'
import {DispatcherController} from '../controllers'
import {validateJwt, validateReqBody} from '../middlewares'
import {registerDispatcherSchema, updateDispatcherSchema} from '../validations'

const {
    createDispatcher,
    updateDispatcher
} = new DispatcherController()

const router = express.Router()

router.post("/", validateReqBody(registerDispatcherSchema), validateJwt(), createDispatcher)

router.patch("/:id", validateReqBody(updateDispatcherSchema), validateJwt(), updateDispatcher("more"))

router.patch("/:id/activate", validateJwt(), updateDispatcher("activate"))

router.patch("/:id/deactivate", validateJwt(), updateDispatcher("deactivate"))

export default router