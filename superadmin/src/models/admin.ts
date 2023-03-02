import {Schema, model} from 'mongoose'
import {Admin} from '../interfaces'

const adminSchema = new Schema<Admin>({
    name: {
        type: String,
        required: [true, 'Admin must have a name'],
        unique: true
    },
    email: {
        type: String,
        required: [true, 'Admin must have an email address'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Admin must have a password']
    },
    refreshToken: String,
    actions: [{
        type: String
    }],
    verificationToken: String,
    verificationCode: String,
    verificationTokenExpiry: Date,
    verificationCodeExpiry: Date
}, {timestamps: true})

const AdminModel = model<Admin>('Admin', adminSchema)

export default AdminModel