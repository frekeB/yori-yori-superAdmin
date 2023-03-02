export default interface Admin {
    name: string,
    email: string,
    password: string,
    refreshToken?: string,
    actions?: string[],
    verificationToken?: string,
    verificationCode?: string,
    verificationTokenExpiry?: Date,
    verificationCodeExpiry?: Date
    _id?: any
}