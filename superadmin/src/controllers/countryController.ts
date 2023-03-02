import {AdminService, CountryService} from '../services'
import {Request, Response, NextFunction} from 'express'
import {ProtectedRequest} from '../types'
import { BadRequestError, ConflictError, ForbiddenError, NotFoundError, UnauthorizedError } from '../exceptions'
import {sendSlackMessage, transformKeysToString} from '../utils'
import moment from "moment";
import axios from "axios";
import {Types} from 'mongoose'
import {
  SLACK_ADMIN_CHANNEL_ID,
  SLACK_BOT_TOKEN,
  FINTECH_URL,
} from "../config";

const {
    getAllCountries: getCountries,
    getCountry: getOneCountry,
    createCountry: makeCountry,
    updateCountry: updateOneCountry,
    updateAllCountries: updateCountries,
    findCountry: findOneCountry,
    deleteCountry: deleteOneCountry
} = new CountryService()

const {
    updateAdmin
} = new AdminService()


class CountryController {
    public async getAllCountries(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const limit = req.query.limit ? Number(req.query.limit) : 20
            const offset = req.query.skip ? Number(req.query.skip) : 0
            const countries = await getCountries(limit, offset)
            return res.status(200).json({status: 'success', data: countries})
        } catch(err: any) {
            next(err)
        }
    }

    public async getCountryByName(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const {name} = req.params

            if (!name) throw new BadRequestError(`Country name not passed in request parameters`)

            const country = await getOneCountry(name, "name")
            if (!country) throw new NotFoundError(`No country found with name "${name}"`)

            return res.status(200).json({status: 'success', data: country})
        } catch(err: any) {
            next(err)
        }
    }

    public async getCountryById(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const {id} = req.params

            if (!id) throw new BadRequestError(`Id not passed`)

            if (!Types.ObjectId.isValid(id)) throw new BadRequestError(`Please pass a valid object id`)

            const country = await getOneCountry(id, "id")
            if(!country) throw new NotFoundError(`No country found with id "${id}"`)

            return res.status(200).json({status: 'success', data: country})
        } catch(err: any) {
            next(err)
        }
    }

    public async createCountry(req: ProtectedRequest, res: Response, next: NextFunction): Promise<Response | void> {
        try {
          const admin = req.admin;

          if (!admin)
            throw new UnauthorizedError(
              `Unauthorized! Please log in as an admin to continue`
            );

          const { name, coordinates, yorisDeliveryCut, franchiseDeliveryCut, dispatcherDeliveryCut, regularPricesLocal, expressPricesLocal, longDistance, maximumDistance, minimumPrice, localDeliveries, vehicleDistanceRanges, internationalDeliveries, regularPricesInternational, expressPricesInternational } = req.body;

          if (localDeliveries && (!yorisDeliveryCut || !franchiseDeliveryCut || !dispatcherDeliveryCut || !regularPricesLocal || !expressPricesLocal || !longDistance || !maximumDistance || !minimumPrice || !vehicleDistanceRanges))
            throw new ConflictError(`All local related fields are required when local deliveries are enabled for country`)

          if (internationalDeliveries && (!regularPricesInternational || !expressPricesInternational))
            throw new ConflictError(`All international related fields are required when international are enabled for country`)

          let countryWithName: any;
          let countryWithCoord: any;

          countryWithName = await findOneCountry({ name }, "one");
          countryWithCoord = await findOneCountry({ coordinates }, "one");

          if (countryWithName !== null)
            throw new ConflictError(
              `A country already exists with name ${name}`
            );
          if (countryWithCoord !== null)
            throw new ConflictError(
              `A country already exists with coordinates ${coordinates}`
            );

          // Check the different entity cuts and make sure that the additions of all of them equals 1
          const totalCut = yorisDeliveryCut + franchiseDeliveryCut + dispatcherDeliveryCut
          if (totalCut && totalCut !== 1) throw new ForbiddenError(`The totality of all cuts for this country must equal to 1.`)

          // Send request to fintech service to know if currency exists
          const currencyRes = await axios.get(`${FINTECH_URL}/currencies`);
          const currencies: any = currencyRes.data.data

          if (!currencies.includes(req.body.currency)) req.body.currency = "USD";

          const newCountry = await makeCountry(req.body);

          // Construct and send slack message to admin-actions channel that a new country has been created and update admin
          const countryDetails = transformKeysToString(req.body);
          const action = `Country Addition Alert:\nNew country added to Yoris DB by ${
            (admin.name, admin.email)
          } with the following details:${countryDetails}\nTime of creation: ${moment()}`;

          // Send slack message on this line
          await sendSlackMessage(
            SLACK_BOT_TOKEN,
            action,
            SLACK_ADMIN_CHANNEL_ID
          );

          const actions = admin.actions;
          actions?.push(action);

          await updateAdmin(admin._id, { actions });

          return res.status(201).json({ status: "success", data: newCountry });
        } catch(err: any) {
            next(err)
        }
    }

    public async updateCountry(req: ProtectedRequest, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const {id} = req.params
            const {name, coordinates} = req.body
            const admin = req.admin

            if (!admin) throw new UnauthorizedError(`Unauthorized! Please log in as an admin to continue`)

            if (name) {
                let countryWithName: any
                countryWithName = await findOneCountry({name}, "one")
                if (countryWithName !== null) throw new ConflictError(`A country already exists with name ${name}`)
            }
            
            if (coordinates) {
                let countryWithCoord: any
                countryWithCoord = await findOneCountry({coordinates}, "one")
                if (countryWithCoord !== null) throw new ConflictError(`A country already exists with coordinates ${coordinates}`)
            }

            const updatedCountry = await updateOneCountry(id, req.body)

            if (updatedCountry === null) throw new NotFoundError(`Country not found!`)

            // Construct and send slack message to admin-actions channel that a country has been updated
            const updatedFields = transformKeysToString(req.body)

            const action = `Country Update Alert:\nCountry updated by ${admin.name, admin.email}. The following details were updated:${updatedFields}\nTime of update: ${moment()}`
            await sendSlackMessage(SLACK_BOT_TOKEN, action, SLACK_ADMIN_CHANNEL_ID)
            const actions = admin.actions
            actions?.push(action)

            await updateAdmin(admin._id, {actions})

            return res.status(200).json({status: 'success', data: updatedCountry})

        } catch(err: any) {
            next(err)
        }
    }

    public async updateAllCountries(req: ProtectedRequest, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const admin = req.admin

            if (!admin) throw new UnauthorizedError(`Unauthorized! Please log in as an admin to continue`)

            const updatedCountries = await updateCountries(req.body)

            // Construct and send slcak message to admin-actions channel that all countries have been updated
            const updatedFields = transformKeysToString(req.body)

            const action = `Country Update Alert:\nAll countries updated by ${admin.name, admin.email}. The following details were updated:${updatedFields}\nTime of update: ${moment()}`
            const actions = admin.actions
            actions?.push(action)

            await updateAdmin(admin._id, {actions})

            return res.status(200).json({status: 'success', data: updatedCountries})
        } catch(err: any) {
            next(err)
        }
    }

    public async deleteCountry(req: ProtectedRequest, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const admin = req.admin
            
            if(!admin) throw new UnauthorizedError('Unathorized! Please log in as an admin to continue')

            const {id} = req.params

            const country = await getOneCountry(id, "id")

            if(!country) throw new NotFoundError(`No country found`)

            await deleteOneCountry(id)

            const action = `Country Deletion Alert:\nCountry deleted by ${admin.name, admin.email}.\nCountry deleted: ${country.name}\nTime of deletion: ${moment()}`
            await sendSlackMessage(SLACK_BOT_TOKEN, action, SLACK_ADMIN_CHANNEL_ID)
            const actions = admin.actions
            actions?.push(action)

            await updateAdmin(admin._id, {actions})

            return res.status(204).json({})
        } catch(err: any) {
            next(err)
        }
    }
}

export default CountryController