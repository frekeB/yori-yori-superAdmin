import { Channel } from "amqplib"
import { Response, NextFunction } from "express"
import {RequestWithChannel} from '../types'

export default (ch: Channel) => {
    return (req: RequestWithChannel, res: Response, next: NextFunction) => {
        req.channel = ch;
        next();
    }
}