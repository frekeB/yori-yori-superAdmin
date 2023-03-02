import express from 'express'
import {AuthController, AdminController} from '../controllers'
import {validateJwt, validateReqBody} from '../middlewares'
import {registerAdminReqBodySchema, loginAdminReqBodySchema} from '../validations'

const {
    registerAdmin,
    loginAdmin,
    deleteAdmin: deleteMe
} = new AuthController()

const {
    getAdmin,
    getAllAdmins,
    deleteAdmin
} = new AdminController()

const router = express.Router()

router.route('/').get(getAllAdmins).post(validateReqBody(registerAdminReqBodySchema), registerAdmin)
router.post('/login', validateReqBody(loginAdminReqBodySchema), loginAdmin)
router.route('/me').delete(validateJwt(), deleteMe)
router.route('/:id').get(getAdmin).delete(deleteAdmin)

export default router
