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


class DispatcherController {
    public async createDispatcher(req: ProtectedRequest, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const admin = req.admin

            if(!admin) throw new UnauthorizedError('Unauthorized! Please log in as an admin to continue')

            const newDispatcher = await axios.post(`${LOGISTICS_URL}/dispatchers/as-admin`, req.body, {
                headers: {
                    interservicetoken: INTERSERVICE_TOKEN
                }
            })

            const transformedBody = transformKeysToString(req.body)

            const slackMsg = `Dispatcher creation alert:\nNew dispatcher created by ${admin.name}, ${admin.email}\Dispatcher details:${transformedBody}\nTime of creation: ${moment()}`

            await sendSlackMessage(SLACK_BOT_TOKEN, slackMsg, SLACK_ADMIN_CHANNEL_ID)

            const actions = admin.actions

            actions?.push(slackMsg)

            await updateAdmin(admin._id, {actions})

            return res.status(201).json({status: "success", data: newDispatcher.data.data})

        } catch(err: any) {
            next(err)
        }
    }

    public updateDispatcher(option: "activate" | "deactivate" | "more"): RequestHandler {
        return async (req: ProtectedRequest, res: Response, next: NextFunction): Promise<Response | void> => {
            const {id} = req.params
            const admin = req.admin

            if(!admin) throw new UnauthorizedError('Unauthorized! Please log in as an admin to continue')
            if (!id) throw new BadRequestError(`Id not passed`)

            if (!Types.ObjectId.isValid(id)) throw new BadRequestError(`Please pass a valid object id`)

            let updatedDispatcher: any
            let slackMsg = `Dispatcher update alert\nUpdated by ${admin.name}, ${admin.email}\n`

            if (option === "activate") {
                updatedDispatcher = await axios.patch(`${LOGISTICS_URL}/dispatchers/${id}/as-admin/activate`, null, {
                    headers: {
                        interservicetoken: INTERSERVICE_TOKEN
                    }
                })

                slackMsg += `Dispatcher activated.\nTime of update: ${moment()}`
            } else if (option === "deactivate") {
                updatedDispatcher = await axios.patch(`${LOGISTICS_URL}/dispatchers/${id}/as-admin/deactivate`, null, {
                    headers: {
                        interservicetoken: INTERSERVICE_TOKEN
                    }
                })

                slackMsg += `Dispatcher deactivated.\nTime of update: ${moment()}`
            } else if (option === "more") {
                updatedDispatcher = await axios.patch(`${LOGISTICS_URL}/dispatchers/${id}/as-admin`, req.body, {
                    headers: {
                        interservicetoken: INTERSERVICE_TOKEN
                    }
                })

                const transformedFields = transformKeysToString(req.body)

                slackMsg += `Details updated: ${transformedFields}\nTime of update: ${moment()}`
            }

            await sendSlackMessage(SLACK_BOT_TOKEN, slackMsg, SLACK_ADMIN_CHANNEL_ID)

            const actions = admin.actions

            actions?.push(slackMsg)

            await updateAdmin(admin._id, {actions})

            return res.status(200).json({status: "success", data: updatedDispatcher.data.data})
        }
    }
}

export default DispatcherController