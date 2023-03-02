import "./envConfig";


// console.log(process.env)

let DB: any
if (process.env.ENV === "prod") DB = process.env.DB_PROD
else DB = process.env.DB_DEV

const SLACK_BOT_TOKEN: any = process.env.SLACK_BOT_TOKEN;
const SLACK_ADMIN_CHANNEL_ID: any = process.env.SLACK_ADMIN_CHANNEL_ID;

// LOGISTICS SERVICE configs
const LOGISTICS_IP: any = process.env.LOGISTICS_HOST;
const LOGISTICS_PORT: any = process.env.LOGISTICS_PORT;
const LOGISTICS_URL = `http://${LOGISTICS_IP}:${LOGISTICS_PORT}`;

// USER SERVICE configs
const USER_IP: any = process.env.USER_SERVICE_HOST;
const USER_PORT: any = process.env.USER_SERVICE_PORT;
const USER_URL: any = `http://${USER_IP}:${USER_PORT}`;

// FINTECH SERVICE configs
const FINTECH_IP: any = process.env.FINTECH_HOST;
const FINTECH_PORT: any = process.env.FINTECH_PORT;
const FINTECH_URL: string = `http://${FINTECH_IP}:${FINTECH_PORT}`;

const INTERSERVICE_TOKEN: any = process.env.INTERSERVICE_TOKEN;
const EXCHANGE_NAME: any = process.env.EXCHANGE_NAME;
const MESSAGE_BROKER_URL: any = process.env.MESSAGE_BROKER_URL;
const ENV: any = process.env.ENV;
const PORT = process.env.SUPERADMIN_PORT || 3101;
const ACCESS_TOKEN_SECRET: any = process.env.ACCESS_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRES_IN: any = process.env.ACCESS_TOKEN_EXPIRES_IN;
const REFRESH_TOKEN_SECRET: any = process.env.REFRESH_TOKEN_SECRET;
const REFRESH_TOKEN_EXPIRES_IN: any = process.env.REFRESH_TOKEN_EXPIRES_IN;
const CRYPTOJS_KEY: any = process.env.CRYPTOJS_KEY;
const SUPERADMIN_LISTENING_KEY = "SUPERADMIN_SERVICE";
const LOGISTICS_SENDING_KEY = "LOGISTICS_SERVICE";
const USER_SENDING_KEY = "USER_SERVICE";

export {
    DB,
    SLACK_BOT_TOKEN,
    SLACK_ADMIN_CHANNEL_ID,
    LOGISTICS_URL,
    USER_URL,
    INTERSERVICE_TOKEN,
    EXCHANGE_NAME,
    MESSAGE_BROKER_URL,
    ENV,
    PORT,
    ACCESS_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRES_IN,
    REFRESH_TOKEN_SECRET,
    REFRESH_TOKEN_EXPIRES_IN,
    CRYPTOJS_KEY,
    SUPERADMIN_LISTENING_KEY,
    LOGISTICS_SENDING_KEY,
    USER_SENDING_KEY,
    FINTECH_URL
}