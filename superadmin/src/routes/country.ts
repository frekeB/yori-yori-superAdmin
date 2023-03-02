import express from 'express'
import {CountryController} from '../controllers'
import {validateReqBody, validateJwt} from '../middlewares'
import {createCountrySchema, updateCountrySchema, updateAllCountriesSchema} from '../validations'

const {
    getCountryById,
    getCountryByName,
    getAllCountries,
    createCountry,
    updateCountry,
    updateAllCountries,
    deleteCountry
} = new CountryController()

const router = express.Router();

router.route('/')
    .get(getAllCountries)
    .post(validateReqBody(createCountrySchema), validateJwt(), createCountry)
    .patch(validateReqBody(updateAllCountriesSchema), validateJwt(), updateAllCountries)

router.get('/name/:name', getCountryByName)

router.route('/:id')
    .get(getCountryById)
    .patch(validateReqBody(updateCountrySchema), validateJwt(), updateCountry)
    .delete(validateJwt(), deleteCountry)




export default router