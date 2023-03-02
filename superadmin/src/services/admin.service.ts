import {AdminModel} from '../models'
import {Admin} from '../interfaces'
import {paginator} from '../utils'

class AdminService {
    public async getAllAdmins(limitValue: number, offsetValue: number): Promise<Admin[]> {
        const admins = await paginator(AdminModel, limitValue, offsetValue)
        return admins
    }

    public async getAdmin(uid: string): Promise<Admin | null> {
        const admin = await AdminModel.findById(uid)

        if (!admin) {
            return null
        }

        return admin
    }

    public async findAdmin(field: object, amount: "one" | "multiple"): Promise<Admin | null | Admin[]> {
        let admin = null

        if (amount === "one") {
            admin = await AdminModel.findOne(field)

            if (!admin) {
                return null
            }
        } else if (amount === "multiple") {
            admin = await AdminModel.find(field)

            if(admin.length < 1) {
                return null
            }
        }

        return admin
    }

    public async createAdmin(admin: Admin): Promise<Admin | void> {
        const newAdmin = await AdminModel.create(admin)
        return newAdmin
    }

    public async updateAdmin(uid: string, fields: any): Promise<Admin | void | null> {
        await AdminModel.findByIdAndUpdate(uid, fields)
        const admin = await AdminModel.findById(uid)

        if (!admin) {
            return null
        }

        return admin
    }

    public async deleteAdmin(uid: string): Promise<void> {
        await AdminModel.findByIdAndDelete(uid)
    }
}

export default AdminService