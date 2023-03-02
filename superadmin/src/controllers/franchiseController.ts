import { Response, NextFunction, RequestHandler } from 'express'
import {AdminService} from '../services'
import {ProtectedRequest} from '../types'
import {UnauthorizedError, BadRequestError} from '../exceptions'
import {transformKeysToString, sendSlackMessage} from '../utils'
import {Types} from 'mongoose'
import axios from 'axios'
import moment from 'moment'
import {INTERSERVICE_TOKEN, LOGISTICS_URL, SLACK_BOT_TOKEN, SLACK_ADMIN_CHANNEL_ID} from '../config'

const {
    updateAdmin
} = new AdminService()


class FranchiseController {
    public async createFranchise(req: ProtectedRequest, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const admin = req.admin

            if(!admin) throw new UnauthorizedError('Unauthorized! Please log in as an admin to continue')

            const newFranchise = await axios.post(`${LOGISTICS_URL}/franchises`, req.body, {
                headers: {
                    interservicetoken: INTERSERVICE_TOKEN
                }
            })

            const {password, ...restOfBody} = req.body

            const transformedBody = transformKeysToString(restOfBody)

            const slackMsg = `Franchise creation alert:\nNew franchise created by ${admin.name}, ${admin.email}\nFranchise details:${transformedBody}\nTime of creation: ${moment()}`

            await sendSlackMessage(SLACK_BOT_TOKEN, slackMsg, SLACK_ADMIN_CHANNEL_ID)

            const actions = admin.actions

            actions?.push(slackMsg)

            await updateAdmin(admin._id, {actions})

            return res.status(201).json({status: "success", data: newFranchise.data.data})

        } catch(err: any) {
            next(err)
        }
    }

    public async updateFranchise(req: ProtectedRequest, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const admin = req.admin
            const {id} = req.params

            if (!id) throw new BadRequestError(`Id not passed`)

            if (!Types.ObjectId.isValid(id)) throw new BadRequestError(`Please pass a valid object id`)

            if(!admin) throw new UnauthorizedError('Unauthorized! Please log in as an admin to continue')

            const updatedFranchise = await axios.patch(`${LOGISTICS_URL}/franchises/${id}`, req.body, {
                headers: {
                    interservicetoken: INTERSERVICE_TOKEN
                }
            })

            const transformedBody = transformKeysToString(req.body)

            const slackMsg = `Franchise update alert:\nFranchise updated by ${admin.name}, ${admin.email}\nFranchise details:${transformedBody}\nTime of update: ${moment()}`

            await sendSlackMessage(SLACK_BOT_TOKEN, slackMsg, SLACK_ADMIN_CHANNEL_ID)

            const actions = admin.actions

            actions?.push(slackMsg)

            await updateAdmin(admin._id, {actions})

            return res.status(200).json({status: "success", data: updatedFranchise.data.data})

        } catch(err: any) {
            next(err)
        }
    }

    public deactivateAndActivateFranchise(action: "activate" | "deactivate"): RequestHandler {
        return async (req: ProtectedRequest, res: Response, next: NextFunction): Promise<Response | void> => {
            try {
                const admin = req.admin
                const {id} = req.params

                if (!id) throw new BadRequestError(`Id not passed`)

                if (!Types.ObjectId.isValid(id)) throw new BadRequestError(`Please pass a valid object id`)

                if(!admin) throw new UnauthorizedError('Unauthorized! Please log in as an admin to continue')

                const updatedFranchise = await axios.patch(`${LOGISTICS_URL}/franchises/${id}/${action}`, null, {
                    headers: {
                        interservicetoken: INTERSERVICE_TOKEN
                    }
                })

                const slackMsg = `Franchise update alert:\nFranchise ${action}d by ${admin.name}, ${admin.email}\nFranchise details:${updatedFranchise.data.data.country}, ${updatedFranchise.data.data.coordinates}\nTime of update: ${moment()}`

                await sendSlackMessage(SLACK_BOT_TOKEN, slackMsg, SLACK_ADMIN_CHANNEL_ID)

                const actions = admin.actions

                actions?.push(slackMsg)

                await updateAdmin(admin._id, {actions})

                return res.status(200).json({status: "success", data: updatedFranchise.data.data})

            } catch(err: any) {
                next(err)
            }
        } 
    }

    public async deleteFranchise(req: ProtectedRequest, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const admin = req.admin
            const {id} = req.params

            if (!id) throw new BadRequestError(`Id not passed`)

            if (!Types.ObjectId.isValid(id)) throw new BadRequestError(`Please pass a valid object id`)

            if(!admin) throw new UnauthorizedError('Unauthorized! Please log in as an admin to continue')

            await axios.delete(`${LOGISTICS_URL}/franchises/${id}`, {
                headers: {
                    interservicetoken: INTERSERVICE_TOKEN
                }
            })

            const slackMsg = `Franchise deletion alert:\nFranchise ${id} deleted by ${admin.name}, ${admin.email}\nTime of deletion: ${moment()}`

            await sendSlackMessage(SLACK_BOT_TOKEN, slackMsg, SLACK_ADMIN_CHANNEL_ID)

            const actions = admin.actions

            actions?.push(slackMsg)

            await updateAdmin(admin._id, {actions})

            return res.status(204).json({})

        } catch(err: any) {
            next(err)
        }
    }
}


export default FranchiseController