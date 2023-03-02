"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_js_1 = __importDefault(require("crypto-js"));
const services_1 = require("../services");
const exceptions_1 = require("../exceptions");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constants_1 = require("../constants");
const utils_1 = require("../utils");
const utils_2 = require("../utils");
const moment_1 = __importDefault(require("moment"));
const axios_1 = __importDefault(require("axios"));
const utils_3 = require("../utils");
const config_1 = require("../config");
// const {
//     createFranchise,
//     findFranchise,
//     updateFranchise
// } = new FranchiseService()
const { findAdmin, createAdmin, updateAdmin, deleteAdmin: deleteOneAdmin, } = new services_1.AdminService();
const { getSettings } = new services_1.SettingsService();
const decodePassword = (password) => {
    const decrypted = crypto_js_1.default.AES.decrypt(password, String(config_1.CRYPTOJS_KEY)).toString(crypto_js_1.default.enc.Utf8);
    return decrypted;
};
const encryptPassword = (password) => {
    const encrypted = crypto_js_1.default.AES.encrypt(password, String(config_1.CRYPTOJS_KEY)).toString();
    return encrypted;
};
class AuthController {
    registerAdmin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, password } = req.body;
                const duplicateEmail = yield findAdmin({ email }, "one");
                if (duplicateEmail !== null) {
                    throw new exceptions_1.ConflictError(`An admin already exists with the email ${email}`);
                }
                const admin = {
                    name,
                    email,
                    password: ''
                };
                admin.password = encryptPassword(password);
                const newAdmin = yield createAdmin(admin);
                // Send email to admin with their login details
                // Construct and send slack message to admin-actions channel that an admin has been created
                const slackMsg = `Admin Creation Alert:\nName: ${name}\nEmail: ${email}`;
                yield (0, utils_2.sendSlackMessage)(config_1.SLACK_BOT_TOKEN, slackMsg, config_1.SLACK_ADMIN_CHANNEL_ID);
                return res.status(201).json({ status: "success", data: newAdmin });
            }
            catch (err) {
                next(err);
            }
        });
    }
    loginAdmin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const foundAdmin = yield findAdmin({ email }, "one");
                if (foundAdmin === null)
                    throw new exceptions_1.UnauthorizedError(`Invalid Credentials`);
                if (password !== decodePassword(foundAdmin.password))
                    throw new exceptions_1.UnauthorizedError(`Invalid Credentials`);
                const { password: adminPassword, refreshToken: adminRefreshToken } = foundAdmin, admin = __rest(foundAdmin, ["password", "refreshToken"]);
                const adminToSign = {
                    accountType: 'admin',
                    id: admin._doc._id
                };
                const accessToken = jsonwebtoken_1.default.sign(adminToSign, String(config_1.ACCESS_TOKEN_SECRET), {
                    expiresIn: constants_1.ACCESS_TOKEN_EXPIRES_IN,
                });
                const refreshToken = jsonwebtoken_1.default.sign(adminToSign, String(config_1.REFRESH_TOKEN_SECRET), {
                    expiresIn: constants_1.REFRESH_TOKEN_EXPIRES_IN,
                });
                foundAdmin.refreshToken = refreshToken;
                yield foundAdmin.save();
                return res.cookie("jwt", refreshToken, {
                    httpOnly: true,
                    maxAge: constants_1.COOKIE_VALIDITY
                })
                    .status(200)
                    .json({
                    status: 'success',
                    data: Object.assign(Object.assign({}, admin._doc), { refreshToken, accessToken })
                });
            }
            catch (err) {
                next(err);
            }
        });
    }
    sendPasswordResetLink(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, accountType } = req.body;
                let finder;
                let updatedFinder;
                const settings = yield getSettings();
                const expiryTimeinHours = settings.verificationExpiryInHours;
                const verificationTokenExpiry = (0, moment_1.default)(Date.now()).add(expiryTimeinHours, 'hours').format();
                if (accountType === "admin") {
                    finder = yield findAdmin({ email }, "one");
                    if (!finder)
                        throw new exceptions_1.NotFoundError(`No admin found with the email ${email}`);
                    const verificationToken = (0, utils_1.generateRandomToken)(finder._id, 38);
                    updatedFinder = yield updateAdmin(finder._id, { verificationToken, verificationTokenExpiry });
                }
                else if (accountType === "franchise") {
                    const response = yield axios_1.default.get(`${config_1.LOGISTICS_URL}/franchises/email/${email}`);
                    finder = response.data.data;
                    const verificationToken = (0, utils_1.generateRandomToken)(finder._id, 38);
                    const messageToSend = {
                        originator: "SUPERADMIN",
                        destination: "LOGISTICS",
                        action: "UPDATE",
                        filter: finder._id,
                        resource: "franchise",
                        data: { verificationToken, verificationTokenExpiry },
                        token: config_1.INTERSERVICE_TOKEN
                    };
                    (0, utils_3.publishMessage)(req.channel, config_1.LOGISTICS_SENDING_KEY, messageToSend);
                    // const updateRes = await axios.patch(`${LOGISTICS_URL}/franchises/${finder._id}`, {verificationToken, verificationTokenExpiry}, {
                    //     headers: {
                    //         interservicetoken: INTERSERVICE_TOKEN
                    //     }
                    // })
                    // updatedFinder = updateRes.data.data
                }
                else if (accountType === "user") {
                    const response = yield axios_1.default.get(`${config_1.USER_URL}/users/email/${email}`);
                    finder = response.data.data;
                    const verificationToken = (0, utils_1.generateRandomToken)(finder._id, 38);
                    const messageToSend = {
                        originator: "SUPERADMIN",
                        destination: "USER",
                        action: "UPDATE",
                        filter: finder._id,
                        resource: "user",
                        data: { verificationToken, verificationTokenExpiry },
                        token: config_1.INTERSERVICE_TOKEN
                    };
                    (0, utils_3.publishMessage)(req.channel, config_1.USER_SENDING_KEY, messageToSend);
                    // const updateRes = await axios.patch(`${USER_URL}/users/${finder._id}`, {verificationToken, verificationTokenExpiry}, {
                    //     headers: {
                    //         interservicetoken: INTERSERVICE_TOKEN
                    //     }
                    // })
                    // updatedFinder = updateRes.data.data
                }
                // Send email with template and password reset link to email address
                return res.status(200).json({ status: "success", message: "Verification link sent" });
            }
            catch (err) {
                next(err);
            }
        });
    }
    sendCode(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, phone, accountType } = req.body;
                if (email && phone)
                    throw new exceptions_1.BadRequestError('Please pass one of email and phone, not both');
                if (!email && !phone)
                    throw new exceptions_1.BadRequestError('Please pass email or phone number in request body');
                // if (email) // Send email with verification code
                // if(phone) // send text message with verification code
                let finder;
                let updatedFinder;
                const settings = yield getSettings();
                const expiryTimeinHours = settings.verificationExpiryInHours;
                const verificationCodeExpiry = (0, moment_1.default)(Date.now()).add(expiryTimeinHours, 'hours').format();
                const verificationCode = (0, utils_2.generateCode)(6);
                if (accountType === "admin") {
                    finder = yield findAdmin({ email }, "one");
                    if (!finder)
                        throw new exceptions_1.NotFoundError(`No admin found with the email ${email}`);
                    updatedFinder = yield updateAdmin(finder._id, { verificationCode, verificationCodeExpiry });
                }
                else if (accountType === "franchise") {
                    const response = yield axios_1.default.get(`${config_1.LOGISTICS_URL}/franchises/email/${email}`);
                    finder = response.data.data;
                    const messageToSend = {
                        originator: "SUPERADMIN",
                        destination: "LOGISTICS",
                        action: "UPDATE",
                        filter: finder._id,
                        resource: "franchise",
                        data: { verificationCode, verificationCodeExpiry },
                        token: config_1.INTERSERVICE_TOKEN
                    };
                    (0, utils_3.publishMessage)(req.channel, config_1.LOGISTICS_SENDING_KEY, messageToSend);
                    // const updateRes = await axios.patch(`${LOGISTICS_URL}/franchises/${finder._id}`, {verificationCode, verificationCodeExpiry}, {
                    //     headers: {
                    //         interservicetoken: INTERSERVICE_TOKEN
                    //     }
                    // })
                    // updatedFinder = updateRes.data.data
                }
                else if (accountType === "user") {
                    const response = yield axios_1.default.get(`${config_1.USER_URL}/users/email/${email}`);
                    finder = response.data.data;
                    const messageToSend = {
                        originator: "SUPERADMIN",
                        destination: "USER",
                        action: "UPDATE",
                        filter: finder._id,
                        resource: "user",
                        data: { verificationCode, verificationCodeExpiry },
                        token: config_1.INTERSERVICE_TOKEN
                    };
                    (0, utils_3.publishMessage)(req.channel, config_1.USER_SENDING_KEY, messageToSend);
                    // const updateRes = await axios.patch(`${USER_URL}/users/${finder._id}`, {verificationCode, verificationCodeExpiry}, {
                    //     headers: {
                    //         interservicetoken: INTERSERVICE_TOKEN
                    //     }
                    // })
                    // updatedFinder = updateRes.data.data
                }
                return res.status(200).json({ status: "success", message: "Verification code sent" });
            }
            catch (err) {
                next(err);
            }
        });
    }
    verifyToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { verificationToken, accountType } = req.body;
                let finder;
                let updatedFinder;
                // if(accountType === 'franchise') finder = await findFranchise({verification_token}, "one")
                if (accountType === 'admin') {
                    finder = yield findAdmin({ verificationToken }, "one");
                    if (!finder)
                        throw new exceptions_1.UnauthorizedError(`Wrong token!`);
                    if ((0, moment_1.default)(finder.verificationTokenExpiry).isAfter())
                        throw new exceptions_1.UnauthorizedError('Token expired!');
                    updatedFinder = yield updateAdmin(finder._id, { verificationToken: '' });
                }
                else if (accountType === "franchise") {
                    finder = yield axios_1.default.get(`${config_1.LOGISTICS_URL}/franchises/token/${verificationToken}`);
                    if ((0, moment_1.default)(finder.verificationTokenExpiry).isAfter())
                        throw new exceptions_1.UnauthorizedError('Token expired!');
                    const messageToSend = {
                        originator: "SUPERADMIN",
                        destination: "LOGISTICS",
                        action: "UPDATE",
                        filter: finder._id,
                        resource: "franchise",
                        data: { verificationToken: '' },
                        token: config_1.INTERSERVICE_TOKEN
                    };
                    (0, utils_3.publishMessage)(req.channel, config_1.LOGISTICS_SENDING_KEY, messageToSend);
                    // updatedFinder = await axios.patch(`${LOGISTICS_URL}/franchises/${finder.data.data._id}`, {verificationToken: ''}, {
                    //     headers: {
                    //         interservicetoken: INTERSERVICE_TOKEN
                    //     }
                    // })
                }
                else if (accountType === "user") {
                    finder = yield axios_1.default.get(`${config_1.USER_URL}/users/token/${verificationToken}`);
                    if ((0, moment_1.default)(finder.verificationTokenExpiry).isAfter())
                        throw new exceptions_1.UnauthorizedError('Token expired!');
                    const messageToSend = {
                        originator: "SUPERADMIN",
                        destination: "USER",
                        action: "UPDATE",
                        filter: finder._id,
                        resource: "user",
                        data: { verificationToken: '' },
                        token: config_1.INTERSERVICE_TOKEN
                    };
                    (0, utils_3.publishMessage)(req.channel, config_1.USER_SENDING_KEY, messageToSend);
                    // updatedFinder = await axios.patch(`${USER_URL}/users/${finder.data.data._id}`, {verificationToken: ''}, {
                    //     headers: {
                    //         interservicetoken: INTERSERVICE_TOKEN
                    //     }
                    // })
                }
                return res.status(200).json({ status: 'success', message: 'Verification successful' });
            }
            catch (err) {
                next(err);
            }
        });
    }
    verifyCode(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { verificationCode, email, accountType } = req.body;
                let finder;
                let updatedFinder;
                // if(accountType === 'franchise') finder = await findFranchise({verification_token}, "one")
                if (accountType === 'admin') {
                    finder = yield findAdmin({ email }, "one");
                    if (!finder)
                        throw new exceptions_1.UnauthorizedError(`Wrong token!`);
                    if (finder.verificationCode !== verificationCode)
                        throw new exceptions_1.UnauthorizedError('Invalid code');
                    if ((0, moment_1.default)(finder.verificationCodeExpiry).isAfter())
                        throw new exceptions_1.UnauthorizedError('Code expired!');
                    updatedFinder = yield updateAdmin(finder._id, { verificationCode: '' });
                }
                else if (accountType === "franchise") {
                    finder = yield axios_1.default.get(`${config_1.LOGISTICS_URL}/franchises/email/${email}`);
                    if (finder.verificationCode !== verificationCode)
                        throw new exceptions_1.UnauthorizedError('Invalid code');
                    if ((0, moment_1.default)(finder.verificationCodeExpiry).isAfter())
                        throw new exceptions_1.UnauthorizedError('Token expired!');
                    const messageToSend = {
                        originator: "SUPERADMIN",
                        destination: "LOGISTICS",
                        action: "UPDATE",
                        filter: finder._id,
                        resource: "franchise",
                        data: { verificationCode: "" },
                        token: config_1.INTERSERVICE_TOKEN
                    };
                    (0, utils_3.publishMessage)(req.channel, config_1.LOGISTICS_SENDING_KEY, messageToSend);
                    // updatedFinder = await axios.patch(`${LOGISTICS_URL}/franchises/${finder.data.data._id}`, {verificationCode: ''}, {
                    //     headers: {
                    //         interservicetoken: INTERSERVICE_TOKEN
                    //     }
                    // })
                }
                else if (accountType === "user") {
                    finder = yield axios_1.default.get(`${config_1.USER_URL}/users/token/${email}`);
                    if (finder.verificationCode !== verificationCode)
                        throw new exceptions_1.UnauthorizedError('Invalid code');
                    if ((0, moment_1.default)(finder.verificationCodeExpiry).isAfter())
                        throw new exceptions_1.UnauthorizedError('Token expired!');
                    const messageToSend = {
                        originator: "SUPERADMIN",
                        destination: "USER",
                        action: "UPDATE",
                        filter: finder._id,
                        resource: "user",
                        data: { verificationToken: "" },
                        token: config_1.INTERSERVICE_TOKEN
                    };
                    (0, utils_3.publishMessage)(req.channel, config_1.USER_SENDING_KEY, messageToSend);
                    // updatedFinder = await axios.patch(`${USER_URL}/users/${finder.data.data._id}`, {verificationCode: ''}, {
                    //     headers: {
                    //         interservicetoken: INTERSERVICE_TOKEN
                    //     }
                    // })
                }
                return res.status(200).json({ status: 'success', message: 'Verification successful' });
            }
            catch (err) {
                next(err);
            }
        });
    }
    resetPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, newPassword, accountType } = req.body;
                let finder;
                let updatedFinder;
                if (accountType === 'admin') {
                    finder = yield findAdmin({ email }, "one");
                    if (!finder)
                        throw new exceptions_1.UnauthorizedError(`Wrong token!`);
                    updatedFinder = yield updateAdmin(finder._id, { password: encryptPassword(newPassword) });
                }
                else if (accountType === "franchise") {
                    finder = yield axios_1.default.get(`${config_1.LOGISTICS_URL}/franchises/email/${email}`);
                    const messageToSend = {
                        originator: "SUPERADMIN",
                        destination: "LOGISTICS",
                        action: "UPDATE",
                        filter: finder._id,
                        resource: "franchise",
                        data: { password: encryptPassword(newPassword) },
                        token: config_1.INTERSERVICE_TOKEN
                    };
                    (0, utils_3.publishMessage)(req.channel, config_1.LOGISTICS_SENDING_KEY, messageToSend);
                    // updatedFinder = await axios.patch(`${LOGISTICS_URL}/franchises/${finder.data.data._id}`, {password: encryptPassword(newPassword)}, {
                    //     headers: {
                    //         interservicetoken: INTERSERVICE_TOKEN
                    //     }
                    // })
                }
                else if (accountType === "user") {
                    finder = yield axios_1.default.get(`${config_1.USER_URL}/users/email/${email}`);
                    const messageToSend = {
                        originator: "SUPERADMIN",
                        destination: "USER",
                        action: "UPDATE",
                        filter: finder._id,
                        resource: "user",
                        data: { password: encryptPassword(newPassword) },
                        token: config_1.INTERSERVICE_TOKEN
                    };
                    (0, utils_3.publishMessage)(req.channel, config_1.USER_SENDING_KEY, messageToSend);
                    // updatedFinder = await axios.patch(`${USER_URL}/users/${finder.data.data._id}`, {password: encryptPassword(newPassword)}, {
                    //     headers: {
                    //         interservicetoken: INTERSERVICE_TOKEN
                    //     }
                    // })
                }
                return res.status(200).json({ status: 'success', message: 'Password reset successful' });
            }
            catch (err) {
                next(err);
            }
        });
    }
    resetEmail(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, newEmail, accountType } = req.body;
                let finder;
                let updatedFinder;
                if (accountType === 'admin') {
                    finder = yield findAdmin({ email }, "one");
                    if (!finder)
                        throw new exceptions_1.UnauthorizedError(`Wrong token!`);
                    updatedFinder = yield updateAdmin(finder._id, { email: newEmail });
                }
                else if (accountType === "franchise") {
                    finder = yield axios_1.default.get(`${config_1.LOGISTICS_URL}/franchises/email/${email}`);
                    const messageToSend = {
                        originator: "SUPERADMIN",
                        destination: "LOGISTICS",
                        action: "UPDATE",
                        filter: finder._id,
                        resource: "franchise",
                        data: { email: newEmail },
                        token: config_1.INTERSERVICE_TOKEN
                    };
                    (0, utils_3.publishMessage)(req.channel, config_1.LOGISTICS_SENDING_KEY, messageToSend);
                    // updatedFinder = await axios.patch(`${LOGISTICS_URL}/franchises/${finder.data.data._id}`, {email: newEmail}, {
                    //     headers: {
                    //         interservicetoken: INTERSERVICE_TOKEN
                    //     }
                    // })
                }
                else if (accountType === "user") {
                    finder = yield axios_1.default.get(`${config_1.USER_URL}/users/email/${email}`);
                    const messageToSend = {
                        originator: "SUPERADMIN",
                        destination: "USER",
                        action: "UPDATE",
                        filter: finder._id,
                        resource: "user",
                        data: { email: newEmail },
                        token: config_1.INTERSERVICE_TOKEN
                    };
                    (0, utils_3.publishMessage)(req.channel, config_1.USER_SENDING_KEY, messageToSend);
                    // updatedFinder = await axios.patch(`${USER_URL}/users/${finder.data.data._id}`, {email: newEmail}, {
                    //     headers: {
                    //         interservicetoken: INTERSERVICE_TOKEN
                    //     }
                    // })
                }
                return res.status(200).json({ status: 'success', message: 'Email reset successful' });
            }
            catch (err) {
                next(err);
            }
        });
    }
    deleteAdmin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const admin = req.admin;
                if (!admin)
                    throw new exceptions_1.UnauthorizedError(`Please login as an admin to continue!`);
                yield deleteOneAdmin(admin._id);
                return res.status(204).json({});
            }
            catch (err) {
                next(err);
            }
        });
    }
}
exports.default = AuthController;
