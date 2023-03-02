import { Request, Response, NextFunction } from 'express';
import {AdminService, SettingsService} from '../services'
import {BadRequestError, NotFoundError, UnauthorizedError} from '../exceptions'
import { Types } from 'mongoose';
import { ProtectedRequest } from '../types';
import {transformKeysToString, sendSlackMessage} from '../utils'
import moment from 'moment';
import {SLACK_ADMIN_CHANNEL_ID, SLACK_BOT_TOKEN} from '../config'

const {
    getAllAdmins: getAdmins,
    getAdmin: getOneAdmin,
    deleteAdmin: deleteOneAdmin,
    updateAdmin
} = new AdminService()

const {
    createSettings: createNewSetting,
    getSettings,
    updateSettings: updateASetting
} = new SettingsService()


class AdminController {
    public async getAllAdmins(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const {limit, skip} = req.query;
            const limitValue = limit ? Number(limit) : 20
            const offsetValue = skip ? Number(skip) : 0
            const admins = await getAdmins(limitValue, offsetValue)
            return res.status(200).json({status: 'success', data: admins})
        } catch(err: any) {
            next(err)
        }
    }

    public async getAdmin(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const {id} = req.params

            if (!id) throw new BadRequestError(`Please pass id in request parameters`)


            if (!Types.ObjectId.isValid(id)) throw new BadRequestError(`Please pass a valid object id`)

            const admin = await getOneAdmin(id)

            if (admin === null) throw new NotFoundError(`No admin found with id ${id}`)

            return res.status(200).json({status: 'success', data: admin})
        } catch(err: any) {
            next(err)
        }
    }

    public async deleteAdmin(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const {id} = req.params

            await deleteOneAdmin(id)

            return res.status(204).json({})
        } catch(err: any) {
            next(err)
        }
    }

    public async getSettings(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const settings = await getSettings()
            return res.status(200).json({status: 'success', data: settings})
        } catch(err: any) {
            next(err)
        }
    }

    public async createSettings(req: ProtectedRequest, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const admin = req.admin

            if(!admin) throw new UnauthorizedError(`Unauthorized, Please log in as an admin to continue!`)

            const settings = await createNewSetting(req.body)

            const createdFields = transformKeysToString(req.body)
            const action = `Global App Settings Creation Alert:\nSettings created by ${admin.email, admin.name}. These were the settings added: ${createdFields}\nTime of creation: ${moment()}`
            await sendSlackMessage(SLACK_BOT_TOKEN, action, SLACK_ADMIN_CHANNEL_ID)

            const actions = admin.actions
            actions?.push(action)

            await updateAdmin(admin._id, {actions})
            
            return res.status(201).json({status: 'success', data: settings})
        } catch(err: any) {
            next(err)
        }
    }

    public async updateSettings(req: ProtectedRequest, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const admin = req.admin

            if(!admin) throw new UnauthorizedError(`Unauthorized, Please log in as an admin to continue!`)

            const settings = await updateASetting(req.body)

            const updatedFields = transformKeysToString(req.body)
            const action = `Global App Settings Update Alert:\nSettings updated by ${admin.email, admin.name}. These were the settings added: ${updatedFields}\nTime of update: ${moment()}`
            await sendSlackMessage(SLACK_BOT_TOKEN, action, SLACK_ADMIN_CHANNEL_ID)

            const actions = admin.actions
            actions?.push(action)

            await updateAdmin(admin._id, {actions})

            return res.status(200).json({status: 'success', data: settings})

        } catch(err: any) {
            next(err)
        }
    }
}

export default AdminController