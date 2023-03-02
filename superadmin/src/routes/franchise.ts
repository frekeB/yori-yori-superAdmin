import express from 'express'
import {FranchiseController} from '../controllers'
import {validateJwt, validateReqBody} from '../middlewares'
import {registerFranchiseSchema, updateFranchiseAdminSchema} from '../validations'

const {
    createFranchise,
    updateFranchise,
    deactivateAndActivateFranchise,
    deleteFranchise
} = new FranchiseController()

const router = express.Router()

router.post("/", validateReqBody(registerFranchiseSchema), validateJwt(), createFranchise)

router.route("/:id")
    .patch(validateReqBody(updateFranchiseAdminSchema), validateJwt(), updateFranchise)
    .delete(validateJwt(), deleteFranchise)

router.patch("/:id/activate", validateJwt(), deactivateAndActivateFranchise("activate"))

router.patch("/:id/deactivate", validateJwt(), deactivateAndActivateFranchise("deactivate"))

export default router

