var path = require('path');

const local = true
//get root directoty of the location where source code is uploaded
const BASEPATH = path.resolve(__dirname, '..');

//configure enviroment file so source code can be executed from any location
require('dotenv').config({path: BASEPATH + '/src/.env'});

//url of the server
const URL = local ? 'http://localhost:8250/' : "http://localhost:8250/";

const controllerPath = BASEPATH + '/src/controller/';

//location where files will be stored
const FILEPATH = BASEPATH + '/public_html';


const MYSQL_HOST = 'localhost';
const MYSQL_USER = local ? 'root' : 'root';
const MYSQL_PASSWORD = local ? 'password' : 'password';
const MYSQL_DB = 'eduForLife';


// const MYSQL_HOST_SLAVE = '172.31.3.196';


const encoded_URI =`${encodeURIComponent('password')}`;
const MONGO_CONFIG          =   {
                            host:"localhost",
                            user:"root",
                            psw:encoded_URI,    
                            port:27017,
                            authdb:"admin",
                            db:MYSQL_DB
                        };
const MONGO_STR             =   `mongodb://${MONGO_CONFIG.user}:${MONGO_CONFIG.psw}@${MONGO_CONFIG.host}:${MONGO_CONFIG.port}/?authSource=${MONGO_CONFIG.authdb}&compressors=zlib`;

// Default Redis Configuratiom
// const REDIS_HOST = '172.31.11.91';
// const REDIS_PASSWORD = 'seCure@2023';
// const REDIS_PORT = 6379;

//token validity in seconds
const TOKEN_VALIDITY = 3000;

//JWT details
const JWTSECRET = "chaobecho@2021@react@node"
const JWTSECRETDECRYPT = "lingo@2021@node@react"
const JWT_ALGO = 'HS256';
const PAYLOAD_ENC_DEC = "2e35f242a46d67eeb74aabc37d5e5d05";

//server port where application will accept request
const PORT = 8250

const UPLOADFILE = FILEPATH + '/uploadFile/';


//mysql config for
const MYSQL_CONFIG = {
    connectionLimit: 25,
    host: process.env.MYSQL_HOST || MYSQL_HOST,
    user: process.env.MYSQL_USER || MYSQL_USER,
    password: process.env.MYSQL_PASSWORD || MYSQL_PASSWORD,
    database: process.env.MYSQL_DB || MYSQL_DB,
    multipleStatements: true
};

// const MYSQL_CONFIG_SLAVE = {
//     connectionLimit: 25,
//     host: process.env.MYSQL_HOST_SLAVE || MYSQL_HOST_SLAVE,
//     user: process.env.MYSQL_USER || MYSQL_USER,
//     password: process.env.MYSQL_PASSWORD || MYSQL_PASSWORD,
//     database: process.env.MYSQL_DB || MYSQL_DB,
//     multipleStatements: true
// };



// const REDIS_CONFIG = {
//     host: process.env.RADIS_HOST || '172.31.11.91',
//     port: process.env.RADIS_POST || 6379,
//     password: process.env.RADIS_PASSWORD || 'seCure@2023'
// }




// public routes that don't require authentication
const omitTokenAPiPath = [

];

const omitDecryptPayload = [

];

const omitEncryptResponse = [

];

//nodemailer config details
const SMTP_HOST = 'smtp.gmail.com';
const SMTP_PORT = '587';
const SMTP_USER = 'poritosh4mdgpr@gmail.com';
const SMTP_PWD = 'xbbnckyhdhvkxare';
const SENDER = 'Support Team <' + (SMTP_HOST).toString() + '>';
const SUBJECT = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';

//salt rounds for generate salt and match/create encrypted password
const SALTROUND = 10;



//for mode of execution
const EXECUTION_MODE = "stag";

//secret for payload decryption and encryption
const CRYPTO_ENCRYPT = "lingo@payload@node@response";
const CRYPTO_DECRYPT = "lingo@payload@react@request";


//api_url for calling from add requirment wrapper api
const API_BASE_URL                        =   "http://localhost:8250/api"

//export file genration path        

const EXPORT_FILE_PATH                    =   FILEPATH + '/downloads/'
const DOWN_FILE_URl                       =   'http://localhost:8250/downloads/'

const TASK_UPLOAD_FILE_PATH               =   FILEPATH + '/uploadFile/task/'


REPORT_FETCH_LIMIT=5000;






module.exports = {
	REPORT_FETCH_LIMIT:REPORT_FETCH_LIMIT,
    controllerPath: controllerPath,
    MYSQL_CONFIG: MYSQL_CONFIG,
    FILEPATH: FILEPATH,
    URL: URL,
    MODE: "dev",
    MYSQL_HOST: MYSQL_HOST,
    MYSQL_USER: MYSQL_USER,
    MYSQL_PASSWORD: MYSQL_PASSWORD,
    MYSQL_DB: MYSQL_DB,
    TOKEN_VALIDITY: TOKEN_VALIDITY,
    JWTSECRET: JWTSECRET,
    JWT_ALGO: JWT_ALGO,
    PORT: PORT,
    SMTP_HOST: SMTP_HOST,
    SMTP_PORT: SMTP_PORT,
    SMTP_USER: SMTP_USER,
    SMTP_PWD: SMTP_PWD,
    SENDER: SENDER,
    SUBJECT: SUBJECT,
    SALTROUND: SALTROUND,
    // TWILIO_ACCOUNT_SID: TWILIO_ACCOUNT_SID,
    // TWILIO_AUTH_TOKEN: TWILIO_AUTH_TOKEN,
    // TWILIO_SENDER_PHONE: TWILIO_SENDER_PHONE,
    EXECUTION_MODE: EXECUTION_MODE,
    CRYPTO_ENCRYPT: CRYPTO_ENCRYPT,
    CRYPTO_DECRYPT: CRYPTO_DECRYPT,
    JWTSECRETDECRYPT: JWTSECRETDECRYPT,
    BASEPATH: BASEPATH,
    UPLOADFILE: UPLOADFILE,
    API_BASE_URL:API_BASE_URL,
    EXPORT_FILE_PATH:EXPORT_FILE_PATH,
    DOWN_FILE_URl:DOWN_FILE_URl,
    TASK_UPLOAD_FILE_PATH: TASK_UPLOAD_FILE_PATH,
    PAYLOAD_ENC_DEC:PAYLOAD_ENC_DEC,
    omitTokenAPiPath: omitTokenAPiPath,
    omitDecryptPayload:omitDecryptPayload,
    omitEncryptResponse:omitEncryptResponse,
}                                        
