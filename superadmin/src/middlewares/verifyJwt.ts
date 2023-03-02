import { Request, Response, NextFunction, RequestHandler} from 'express'
import {UnauthorizedError} from '../exceptions'
import JWT from 'jsonwebtoken'
import { AdminService } from '../services'
import {ACCESS_TOKEN_SECRET} from '../config'
import { ProtectedRequest } from '../types'

const {getAdmin} = new AdminService()


export default function (): RequestHandler {
    return async (req: ProtectedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const {authorization} = req.headers

            if (!authorization) throw new UnauthorizedError(`No authorization headers passed`)

            const bearer = authorization.split(" ")[0]
            const token = authorization.split(" ")[1]

            if (!bearer || !token) throw new UnauthorizedError(`Token not passed in authorization headers`)

            if (bearer !== "Bearer") throw new UnauthorizedError(`Bearer not passed in authorization headers`)

            const decoded: any = JWT.verify(token, String(ACCESS_TOKEN_SECRET))

            if (decoded.accountType === 'admin') {
                const admin = await getAdmin(decoded.id)
                if(!admin) throw new UnauthorizedError(`Admin recently deleted.`)
                req.admin = admin
            } else throw new UnauthorizedError()
            next()

        } catch(err: any) {
            next(err)
        }
    }
}
