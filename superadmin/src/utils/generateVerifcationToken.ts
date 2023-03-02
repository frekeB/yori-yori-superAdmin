import crypto from 'crypto'

const generateRandomToken = (uid: string, size: number): string => {
    const buffer = crypto.randomBytes(size)
    const token = buffer.toString('hex') + uid
    return token
}

export default generateRandomToken