import {Model} from 'mongoose'

export default async (model: Model<any>, limitValue: number, offsetValue: number): Promise<any[]> => {
    const data = await model.find().limit(limitValue).skip(offsetValue)
    return data
}