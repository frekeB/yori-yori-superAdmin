import CryptoJS from "crypto-js";
import { Request, Response, NextFunction } from "express";
import {AdminService, SettingsService} from '../services'
import {ConflictError, BadRequestError, NotFoundError, UnauthorizedError, ForbiddenError} from '../exceptions'
import {Admin} from '../interfaces'
import JWT from 'jsonwebtoken'
import {ACCESS_TOKEN_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN, COOKIE_VALIDITY} from '../constants'
import {generateRandomToken} from '../utils'
import { sendSlackMessage, generateCode } from "../utils";
import moment from "moment";
import axios from "axios";
import { publishMessage } from "../utils";
import { Event, RequestWithChannel, ProtectedRequest } from "../types";
import {
  SLACK_ADMIN_CHANNEL_ID,
  SLACK_BOT_TOKEN,
  INTERSERVICE_TOKEN,
  LOGISTICS_SENDING_KEY,
  USER_SENDING_KEY,
  LOGISTICS_URL,
  USER_URL,
  CRYPTOJS_KEY,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET
} from "../config";

// const {
//     createFranchise,
//     findFranchise,
//     updateFranchise
// } = new FranchiseService()

const {
  findAdmin,
  createAdmin,
  updateAdmin,
  deleteAdmin: deleteOneAdmin,
} = new AdminService();

const { getSettings } = new SettingsService();

const decodePassword = (password: string) => {
  const decrypted = CryptoJS.AES.decrypt(
    password,
    String(CRYPTOJS_KEY)
  ).toString(CryptoJS.enc.Utf8);

  return decrypted;
};

const encryptPassword = (password: string) => {
  const encrypted = CryptoJS.AES.encrypt(
    password,
    String(CRYPTOJS_KEY)
  ).toString();

  return encrypted;
};

class AuthController {
    public async registerAdmin(req: Request, res: Response, next: NextFunction): Promise<Response | void>{
        try {
            const {
                name,
                email,
                password
            } = req.body

            const duplicateEmail = await findAdmin({email}, "one")
            
            if (duplicateEmail !== null) {
                throw new ConflictError(`An admin already exists with the email ${email}`)
            }

            const admin: Admin = {
                name,
                email,
                password: ''
            }

            admin.password = encryptPassword(password)

            const newAdmin = await createAdmin(admin)

            // Send email to admin with their login details

            // Construct and send slack message to admin-actions channel that an admin has been created
            const slackMsg = `Admin Creation Alert:\nName: ${name}\nEmail: ${email}`
            await sendSlackMessage(SLACK_BOT_TOKEN, slackMsg, SLACK_ADMIN_CHANNEL_ID)

            return res.status(201).json({status: "success", data: newAdmin})

        } catch(err: any) {
            next(err)
        }
    }

    public async loginAdmin(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const {
                email,
                password
            } = req.body;

            const foundAdmin: any = await findAdmin({email}, "one")

            if (foundAdmin === null)
             throw new UnauthorizedError(`Invalid Credentials`)

            if (password !== decodePassword(foundAdmin.password)) 
             throw new UnauthorizedError(`Invalid Credentials`)

            const {
                password: adminPassword,
                refreshToken: adminRefreshToken,
                ...admin
            } = foundAdmin
            
            const adminToSign = {
                accountType: 'admin',
                id: admin._doc._id
            }

            const accessToken = JWT.sign(
              adminToSign,
              String(ACCESS_TOKEN_SECRET),
              {
                expiresIn: ACCESS_TOKEN_EXPIRES_IN,
              }
            );

            const refreshToken = JWT.sign(
              adminToSign,
              String(REFRESH_TOKEN_SECRET),
              {
                expiresIn: REFRESH_TOKEN_EXPIRES_IN,
              }
            );

            foundAdmin.refreshToken = refreshToken
            await foundAdmin.save()

            return res.cookie("jwt", refreshToken, {
                httpOnly: true,
                maxAge: COOKIE_VALIDITY
            })
            .status(200)
            .json({
                status: 'success',
                data: {...admin._doc, refreshToken, accessToken}
            })

        } catch(err: any) {
            next(err)
        }
    }

    public async sendPasswordResetLink(req: RequestWithChannel, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const {email, accountType} = req.body

            let finder: any
            let updatedFinder: any
            
            const settings: any = await getSettings()

            const expiryTimeinHours = settings.verificationExpiryInHours

            const verificationTokenExpiry = moment(Date.now()).add(expiryTimeinHours, 'hours').format()

            if (accountType === "admin"){
                finder = await findAdmin({email}, "one")

                if(!finder) throw new NotFoundError(`No admin found with the email ${email}`)

                const verificationToken = generateRandomToken(finder._id, 38)
                
                updatedFinder = await updateAdmin(finder._id, {verificationToken, verificationTokenExpiry})

            } else if (accountType === "franchise") {
              const response = await axios.get(
                `${LOGISTICS_URL}/franchises/email/${email}`
              );
              finder = response.data.data;

              const verificationToken = generateRandomToken(finder._id, 38);

              const messageToSend: Event = {
                originator: "SUPERADMIN",
                destination: "LOGISTICS",
                action: "UPDATE",
                filter: finder._id,
                resource: "franchise",
                data: { verificationToken, verificationTokenExpiry },
                token: INTERSERVICE_TOKEN
              };

              publishMessage(
                req.channel,
                LOGISTICS_SENDING_KEY,
                messageToSend
              );

              // const updateRes = await axios.patch(`${LOGISTICS_URL}/franchises/${finder._id}`, {verificationToken, verificationTokenExpiry}, {
              //     headers: {
              //         interservicetoken: INTERSERVICE_TOKEN
              //     }
              // })

              // updatedFinder = updateRes.data.data
            } else if (accountType === "user") {
                const response = await axios.get(`${USER_URL}/users/email/${email}`)
                finder = response.data.data

                const verificationToken = generateRandomToken(finder._id, 38)

                const messageToSend: Event = {
                  originator: "SUPERADMIN",
                  destination: "USER",
                  action: "UPDATE",
                  filter: finder._id,
                  resource: "user",
                  data: { verificationToken, verificationTokenExpiry },
                  token: INTERSERVICE_TOKEN
                };

                publishMessage(
                  req.channel,
                  USER_SENDING_KEY,
                  messageToSend
                );

                // const updateRes = await axios.patch(`${USER_URL}/users/${finder._id}`, {verificationToken, verificationTokenExpiry}, {
                //     headers: {
                //         interservicetoken: INTERSERVICE_TOKEN
                //     }
                // })

                // updatedFinder = updateRes.data.data
            }

            // Send email with template and password reset link to email address


            return res.status(200).json({status: "success", message: "Verification link sent"})
        } catch(err: any) {
            next(err)
        }
    }

    public async sendCode(req: RequestWithChannel, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const {email, phone, accountType} = req.body
            
            if (email && phone) throw new BadRequestError('Please pass one of email and phone, not both')

            if(!email && !phone) throw new BadRequestError('Please pass email or phone number in request body')

            // if (email) // Send email with verification code
            // if(phone) // send text message with verification code

            let finder: any
            let updatedFinder: any

            const settings: any = await getSettings()

            const expiryTimeinHours = settings.verificationExpiryInHours

            const verificationCodeExpiry = moment(Date.now()).add(expiryTimeinHours, 'hours').format()

            const verificationCode = generateCode(6)

            if (accountType === "admin") {
                finder = await findAdmin({email}, "one")

                if(!finder) throw new NotFoundError(`No admin found with the email ${email}`)
                
                updatedFinder = await updateAdmin(finder._id, {verificationCode, verificationCodeExpiry})

            } else if (accountType === "franchise") {
                const response = await axios.get(`${LOGISTICS_URL}/franchises/email/${email}`)
                finder = response.data.data

                const messageToSend: Event = {
                  originator: "SUPERADMIN",
                  destination: "LOGISTICS",
                  action: "UPDATE",
                  filter: finder._id,
                  resource: "franchise",
                  data: { verificationCode, verificationCodeExpiry },
                  token: INTERSERVICE_TOKEN
                };

                publishMessage(
                  req.channel,
                  LOGISTICS_SENDING_KEY,
                  messageToSend
                );

                // const updateRes = await axios.patch(`${LOGISTICS_URL}/franchises/${finder._id}`, {verificationCode, verificationCodeExpiry}, {
                //     headers: {
                //         interservicetoken: INTERSERVICE_TOKEN
                //     }
                // })

                // updatedFinder = updateRes.data.data

            } else if (accountType === "user") {
                const response = await axios.get(`${USER_URL}/users/email/${email}`)
                finder = response.data.data

                const messageToSend: Event = {
                    originator: "SUPERADMIN",
                    destination: "USER",
                    action: "UPDATE",
                    filter: finder._id,
                    resource: "user",
                    data: { verificationCode, verificationCodeExpiry },
                    token: INTERSERVICE_TOKEN
                };

                publishMessage(
                    req.channel,
                    USER_SENDING_KEY,
                    messageToSend
                );
               
                // const updateRes = await axios.patch(`${USER_URL}/users/${finder._id}`, {verificationCode, verificationCodeExpiry}, {
                //     headers: {
                //         interservicetoken: INTERSERVICE_TOKEN
                //     }
                // })

                // updatedFinder = updateRes.data.data
            }

            return res.status(200).json({status: "success", message: "Verification code sent"})

        } catch(err: any) {
            next(err)
        }
    }

    public async verifyToken(req: RequestWithChannel, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { verificationToken, accountType } = req.body

            let finder: any
            let updatedFinder: any

            // if(accountType === 'franchise') finder = await findFranchise({verification_token}, "one")
            if (accountType === 'admin') {
                finder = await findAdmin({verificationToken}, "one")

                if(!finder) throw new UnauthorizedError(`Wrong token!`)

                if (moment(finder.verificationTokenExpiry).isAfter()) throw new UnauthorizedError('Token expired!') 

                updatedFinder = await updateAdmin(finder._id, {verificationToken: ''})
            } else if (accountType === "franchise") {
                finder = await axios.get(`${LOGISTICS_URL}/franchises/token/${verificationToken}`)

                if (moment(finder.verificationTokenExpiry).isAfter()) throw new UnauthorizedError('Token expired!') 

                const messageToSend: Event = {
                  originator: "SUPERADMIN",
                  destination: "LOGISTICS",
                  action: "UPDATE",
                  filter: finder._id,
                  resource: "franchise",
                  data: { verificationToken: '' },
                  token: INTERSERVICE_TOKEN
                };

                publishMessage(
                  req.channel,
                  LOGISTICS_SENDING_KEY,
                  messageToSend
                );

                // updatedFinder = await axios.patch(`${LOGISTICS_URL}/franchises/${finder.data.data._id}`, {verificationToken: ''}, {
                //     headers: {
                //         interservicetoken: INTERSERVICE_TOKEN
                //     }
                // })
            } else if (accountType === "user") {
                finder = await axios.get(`${USER_URL}/users/token/${verificationToken}`)

                if (moment(finder.verificationTokenExpiry).isAfter()) throw new UnauthorizedError('Token expired!') 

                const messageToSend: Event = {
                  originator: "SUPERADMIN",
                  destination: "USER",
                  action: "UPDATE",
                  filter: finder._id,
                  resource: "user",
                  data: { verificationToken: '' },
                  token: INTERSERVICE_TOKEN
                };

                publishMessage(
                  req.channel,
                  USER_SENDING_KEY,
                  messageToSend
                );
                // updatedFinder = await axios.patch(`${USER_URL}/users/${finder.data.data._id}`, {verificationToken: ''}, {
                //     headers: {
                //         interservicetoken: INTERSERVICE_TOKEN
                //     }
                // })
            }

            return res.status(200).json({status: 'success', message: 'Verification successful'})

        } catch (err: any) {
            next(err)
        }
    }

    public async verifyCode(req: RequestWithChannel, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { verificationCode, email,  accountType } = req.body

            let finder: any
            let updatedFinder: any

            // if(accountType === 'franchise') finder = await findFranchise({verification_token}, "one")
            if (accountType === 'admin') {
                finder = await findAdmin({email}, "one")

                if(!finder) throw new UnauthorizedError(`Wrong token!`)

                if(finder.verificationCode !== verificationCode) throw new UnauthorizedError('Invalid code')

                if (moment(finder.verificationCodeExpiry).isAfter()) throw new UnauthorizedError('Code expired!') 

                updatedFinder = await updateAdmin(finder._id, {verificationCode: ''})
            } else if (accountType === "franchise") {
                finder = await axios.get(`${LOGISTICS_URL}/franchises/email/${email}`)

                if(finder.verificationCode !== verificationCode) throw new UnauthorizedError('Invalid code')

                if (moment(finder.verificationCodeExpiry).isAfter()) throw new UnauthorizedError('Token expired!') 

                
                const messageToSend: Event = {
                  originator: "SUPERADMIN",
                  destination: "LOGISTICS",
                  action: "UPDATE",
                  filter: finder._id,
                  resource: "franchise",
                  data: { verificationCode: "" },
                  token: INTERSERVICE_TOKEN
                };

                publishMessage(
                  req.channel,
                  LOGISTICS_SENDING_KEY,
                  messageToSend
                );                
                
                // updatedFinder = await axios.patch(`${LOGISTICS_URL}/franchises/${finder.data.data._id}`, {verificationCode: ''}, {
                //     headers: {
                //         interservicetoken: INTERSERVICE_TOKEN
                //     }
                // })
            } else if (accountType === "user") {
                finder = await axios.get(`${USER_URL}/users/token/${email}`)

                if(finder.verificationCode !== verificationCode) throw new UnauthorizedError('Invalid code')

                if (moment(finder.verificationCodeExpiry).isAfter()) throw new UnauthorizedError('Token expired!') 

               const messageToSend: Event = {
                 originator: "SUPERADMIN",
                 destination: "USER",
                 action: "UPDATE",
                 filter: finder._id,
                 resource: "user",
                 data: { verificationToken: "" },
                 token: INTERSERVICE_TOKEN
               };

               publishMessage(
                 req.channel,
                 USER_SENDING_KEY,
                 messageToSend
               );
               
                // updatedFinder = await axios.patch(`${USER_URL}/users/${finder.data.data._id}`, {verificationCode: ''}, {
                //     headers: {
                //         interservicetoken: INTERSERVICE_TOKEN
                //     }
                // })
            }

            return res.status(200).json({status: 'success', message: 'Verification successful'})

        } catch(err: any) {
            next(err)
        }
    }

    public async resetPassword(req: RequestWithChannel, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { email, newPassword, accountType} = req.body

            let finder: any
            let updatedFinder: any
            
            if (accountType === 'admin') {
                finder = await findAdmin({email}, "one")

                if(!finder) throw new UnauthorizedError(`Wrong token!`)

                updatedFinder = await updateAdmin(finder._id, {password: encryptPassword(newPassword)})
            } else if (accountType === "franchise") {
                finder = await axios.get(`${LOGISTICS_URL}/franchises/email/${email}`)

               const messageToSend: Event = {
                 originator: "SUPERADMIN",
                 destination: "LOGISTICS",
                 action: "UPDATE",
                 filter: finder._id,
                 resource: "franchise",
                 data: { password: encryptPassword(newPassword) },
                 token: INTERSERVICE_TOKEN
               };

               publishMessage(
                 req.channel,
                 LOGISTICS_SENDING_KEY,
                 messageToSend
               );
               
                // updatedFinder = await axios.patch(`${LOGISTICS_URL}/franchises/${finder.data.data._id}`, {password: encryptPassword(newPassword)}, {
                //     headers: {
                //         interservicetoken: INTERSERVICE_TOKEN
                //     }
                // })
            } else if (accountType === "user") {
                finder = await axios.get(`${USER_URL}/users/email/${email}`)

                const messageToSend: Event = {
                  originator: "SUPERADMIN",
                  destination: "USER",
                  action: "UPDATE",
                  filter: finder._id,
                  resource: "user",
                  data: { password: encryptPassword(newPassword) },
                  token: INTERSERVICE_TOKEN
                };

                publishMessage(
                  req.channel,
                  USER_SENDING_KEY,
                  messageToSend
                );                
                
                // updatedFinder = await axios.patch(`${USER_URL}/users/${finder.data.data._id}`, {password: encryptPassword(newPassword)}, {
                //     headers: {
                //         interservicetoken: INTERSERVICE_TOKEN
                //     }
                // })
            }

            return res.status(200).json({status: 'success', message: 'Password reset successful'})

        } catch(err: any) {
            next(err)
        }
    }

    public async resetEmail(req: RequestWithChannel, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { email, newEmail, accountType} = req.body

            let finder: any
            let updatedFinder: any
            
            if (accountType === 'admin') {
                finder = await findAdmin({email}, "one")

                if(!finder) throw new UnauthorizedError(`Wrong token!`)

                updatedFinder = await updateAdmin(finder._id, {email: newEmail})
            } else if (accountType === "franchise") {
                finder = await axios.get(`${LOGISTICS_URL}/franchises/email/${email}`)

                const messageToSend: Event = {
                  originator: "SUPERADMIN",
                  destination: "LOGISTICS",
                  action: "UPDATE",
                  filter: finder._id,
                  resource: "franchise",
                  data: { email: newEmail },
                  token: INTERSERVICE_TOKEN
                };

                publishMessage(
                  req.channel,
                  LOGISTICS_SENDING_KEY,
                  messageToSend
                );
                
                
                // updatedFinder = await axios.patch(`${LOGISTICS_URL}/franchises/${finder.data.data._id}`, {email: newEmail}, {
                //     headers: {
                //         interservicetoken: INTERSERVICE_TOKEN
                //     }
                // })
            } else if (accountType === "user") {
                finder = await axios.get(`${USER_URL}/users/email/${email}`)

                const messageToSend: Event = {
                  originator: "SUPERADMIN",
                  destination: "USER",
                  action: "UPDATE",
                  filter: finder._id,
                  resource: "user",
                  data: { email: newEmail },
                  token: INTERSERVICE_TOKEN
                };

                publishMessage(
                  req.channel,
                  USER_SENDING_KEY,
                  messageToSend
                );
                                
                // updatedFinder = await axios.patch(`${USER_URL}/users/${finder.data.data._id}`, {email: newEmail}, {
                //     headers: {
                //         interservicetoken: INTERSERVICE_TOKEN
                //     }
                // })
            }

            return res.status(200).json({status: 'success', message: 'Email reset successful'})
        } catch(err: any) {
            next(err)
        }
    }

    public async deleteAdmin(req: ProtectedRequest, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const admin = req.admin

            if (!admin) throw new UnauthorizedError(`Please login as an admin to continue!`)

            await deleteOneAdmin(admin._id)

            return res.status(204).json({})
        } catch(err: any) {
            next(err)
        }
    }
}

export default AuthController