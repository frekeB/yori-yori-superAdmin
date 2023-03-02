import { CountryModel } from "../models";
import {Country} from '../interfaces'
import {paginator} from '../utils'

class CountryService {
    public async getAllCountries(limitValue: number, offsetValue: number): Promise<Country[]>{
        const countries = await paginator(CountryModel, limitValue, offsetValue)
        return countries
    }

    public async getCountry(filter: string, option: "id" | "name"): Promise<Country | null> {
        let filterObj

        if (option === "id") filterObj = {_id: filter}
        else if (option === "name") filterObj = {name: filter.toLowerCase()}

        const country = await CountryModel.findOne(filterObj)

        if (!country) return null

        return country
    }

    public async findCountry(filter: object, amount: "one" | "multiple"): Promise<Country | Country[] | null > {
        let country = null

        if (amount === "one") {
            country = await CountryModel.findOne(filter)

            if (!country) {
                return null
            }
        } else if (amount === "multiple") {
            country = await CountryModel.find(filter)

            if(country.length < 1) {
                return null
            }
        }

        return country
    }

    public async createCountry(country: Country): Promise<Country | void> {
        country.name = country.name.toLowerCase()
        const newCountry = await CountryModel.create(country)
        return newCountry
    }

    public async updateCountry(uid: string, fields: object): Promise<Country | void | null> {
        await CountryModel.findByIdAndUpdate(uid, fields as any)
        
        const country = await CountryModel.findById(uid)

        if (!country) return null

        return country
    }

    public async updateAllCountries(fields: object): Promise<any[]> {
        const countries = await CountryModel.find()

        countries.forEach(async (country) => {
            await CountryModel.findByIdAndUpdate(country._id, fields as any)
        })

        const updatedCountries = await CountryModel.find()
        
        return updatedCountries
    }

    public async deleteCountry(uid: string): Promise<void> {
        await CountryModel.findByIdAndDelete(uid)
    }
}

export default CountryService