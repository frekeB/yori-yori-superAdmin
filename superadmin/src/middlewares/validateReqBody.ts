import {Request, Response, NextFunction, RequestHandler} from 'express'
import { ValidationOptions, Schema, ValidationErrorItem } from 'joi'

export default(schema: Schema): RequestHandler => {
    return async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        const validateOptions: ValidationOptions = {
            abortEarly: false,
            allowUnknown: true,
            stripUnknown: true   
        }

        try {
            const newReqBody = await schema.validateAsync(req.body, validateOptions)
            req.body = newReqBody
            next()
        } catch(err: any) {
            const errors: string[] = []
            err.details.forEach((e: ValidationErrorItem)=>{
                errors.push(e.message)
            })
            return res.status(409).json({status: 'failed', message: errors})
        }
    }
}