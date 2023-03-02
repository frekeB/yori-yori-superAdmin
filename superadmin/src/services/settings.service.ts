import {SettingsModel} from '../models'
import {Settings} from '../interfaces'
import {ConflictError, NotFoundError} from '../exceptions'

class SettingsService {
    public async getSettings(): Promise<Settings | void> {
        const settings = await SettingsModel.find()
        if (settings.length < 1) throw new NotFoundError('No settings predefined yet')
        return settings[0]
    }
    
    public async createSettings(setting: Settings): Promise<Settings | void> {
        const settings = await SettingsModel.find()
        if (settings.length > 0) 
            throw new ConflictError('There are already predefined settings, please update that!')

        const newSettings = await SettingsModel.create(setting)
        return newSettings
    }

    public async updateSettings(fields: object): Promise<Settings | void> {
        const settings = await SettingsModel.find()
        if (settings.length < 1) throw new NotFoundError('No settings predefined yet')

        await SettingsModel.findByIdAndUpdate(settings[0]._id, fields)

        const updatedSetting = await SettingsModel.find()
        return updatedSetting[0]
    }
}

export default SettingsService