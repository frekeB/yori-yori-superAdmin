"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FINTECH_URL = exports.USER_SENDING_KEY = exports.LOGISTICS_SENDING_KEY = exports.SUPERADMIN_LISTENING_KEY = exports.CRYPTOJS_KEY = exports.REFRESH_TOKEN_EXPIRES_IN = exports.REFRESH_TOKEN_SECRET = exports.ACCESS_TOKEN_EXPIRES_IN = exports.ACCESS_TOKEN_SECRET = exports.PORT = exports.ENV = exports.MESSAGE_BROKER_URL = exports.EXCHANGE_NAME = exports.INTERSERVICE_TOKEN = exports.USER_URL = exports.LOGISTICS_URL = exports.SLACK_ADMIN_CHANNEL_ID = exports.SLACK_BOT_TOKEN = exports.DB = void 0;
require("./envConfig");
// console.log(process.env)
let DB;
exports.DB = DB;
if (process.env.ENV === "prod")
    exports.DB = DB = process.env.DB_PROD;
else
    exports.DB = DB = process.env.DB_DEV;
const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;
exports.SLACK_BOT_TOKEN = SLACK_BOT_TOKEN;
const SLACK_ADMIN_CHANNEL_ID = process.env.SLACK_ADMIN_CHANNEL_ID;
exports.SLACK_ADMIN_CHANNEL_ID = SLACK_ADMIN_CHANNEL_ID;
// LOGISTICS SERVICE configs
const LOGISTICS_IP = process.env.LOGISTICS_HOST;
const LOGISTICS_PORT = process.env.LOGISTICS_PORT;
const LOGISTICS_URL = `http://${LOGISTICS_IP}:${LOGISTICS_PORT}`;
exports.LOGISTICS_URL = LOGISTICS_URL;
// USER SERVICE configs
const USER_IP = process.env.USER_SERVICE_HOST;
const USER_PORT = process.env.USER_SERVICE_PORT;
const USER_URL = `http://${USER_IP}:${USER_PORT}`;
exports.USER_URL = USER_URL;
// FINTECH SERVICE configs
const FINTECH_IP = process.env.FINTECH_HOST;
const FINTECH_PORT = process.env.FINTECH_PORT;
const FINTECH_URL = `http://${FINTECH_IP}:${FINTECH_PORT}`;
exports.FINTECH_URL = FINTECH_URL;
const INTERSERVICE_TOKEN = process.env.INTERSERVICE_TOKEN;
exports.INTERSERVICE_TOKEN = INTERSERVICE_TOKEN;
const EXCHANGE_NAME = process.env.EXCHANGE_NAME;
exports.EXCHANGE_NAME = EXCHANGE_NAME;
const MESSAGE_BROKER_URL = process.env.MESSAGE_BROKER_URL;
exports.MESSAGE_BROKER_URL = MESSAGE_BROKER_URL;
const ENV = process.env.ENV;
exports.ENV = ENV;
const PORT = process.env.SUPERADMIN_PORT || 3101;
exports.PORT = PORT;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
exports.ACCESS_TOKEN_SECRET = ACCESS_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN;
exports.ACCESS_TOKEN_EXPIRES_IN = ACCESS_TOKEN_EXPIRES_IN;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
exports.REFRESH_TOKEN_SECRET = REFRESH_TOKEN_SECRET;
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN;
exports.REFRESH_TOKEN_EXPIRES_IN = REFRESH_TOKEN_EXPIRES_IN;
const CRYPTOJS_KEY = process.env.CRYPTOJS_KEY;
exports.CRYPTOJS_KEY = CRYPTOJS_KEY;
const SUPERADMIN_LISTENING_KEY = "SUPERADMIN_SERVICE";
exports.SUPERADMIN_LISTENING_KEY = SUPERADMIN_LISTENING_KEY;
const LOGISTICS_SENDING_KEY = "LOGISTICS_SERVICE";
exports.LOGISTICS_SENDING_KEY = LOGISTICS_SENDING_KEY;
const USER_SENDING_KEY = "USER_SERVICE";
exports.USER_SENDING_KEY = USER_SENDING_KEY;
