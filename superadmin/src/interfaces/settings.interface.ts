export default interface Settings {
    dayStart: number,
    dayEnd: number,
    verificationExpiryInHours?: number,
    conversionCommissionHigh: number,
    conversionCommissionLow: number,
    conversionRefreshTime: number,
    withdrawlCommission: number
}