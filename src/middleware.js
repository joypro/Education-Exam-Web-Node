const expressJwt = require('express-jwt');
const config = require('./config');
const jwtToken = require('jsonwebtoken');
const util = require('./utility/util');
const headerJWTDecrypt = process.env.JWTSECRET || config.JWTSECRET;
const bodyJWTDecrypt = process.env.JWTSECRETDECRYPT || config.JWTSECRETDECRYPT;

//
function jwt() {
    return expressJwt({secret: headerJWTDecrypt, algorithms: [process.env.JWT_ALGO || config.JWT_ALGO]}).unless({
        path: config.omitTokenAPiPath
    });
}

function errorHandler(err, req, res, next) {
    if (typeof (err) === 'string') {
        // custom application error
        return res.status(400).json({success: false, message: err, status: 400, response: []});
    }

    if (err.name === 'UnauthorizedError') {
        // jwt authentication error
        return res.status(401).json({success: false, message: "Invalid Token", status: 401, response: []});
    }

    // default to 500 server error
    return res.status(500).json({success: false, message: err.message, status: 500, response: []});
}

function setResponseHeader(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    res.header('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'  https://ajax.googleapis.com  https://ssl.google-analytics.com https://assets.zendesk.com https://connect.facebook.net; img-src 'self' https://ssl.google-analytics.com https://s-static.ak.facebook.com https://assets.zendesk.com; style-src 'self' 'unsafe-inline' https://assets.zendesk.com; font-src 'self' https://fonts.gstatic.com  https://themes.googleusercontent.com; frame-src https://player.vimeo.com https://assets.zendesk.com https://www.facebook.com https://s-static.ak.facebook.com https://tautt.zendesk.com; object-src 'none'");
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
}

async function transformResponse(body, req, res) {
    // do something with body
    if (body.response) {
        body.response = await util.encryptResponse(body.response);
    }
    return body;
}

//Capture All 404 errors
function notFoundEvenHandler(req, res, next) {
    res.status(404).json({success: false, message: "Not Found", status: 404, response: []});
}

async function extractWebToken(data, secretDecrypt) {
    try {
        return jwtToken.verify(data, secretDecrypt, {algorithm: process.env.JWT_ALGO || config.JWT_ALGO})
    } catch (err) {
        console.log("JWT EXTRACT ERROR : ", err);
        return {}
    }
}

//extraction function call from index and check if token expired or not
async function validateSession(req, res, next) {
    var apiPath = req.originalUrl;
    let reqData;
    try {
        if (!config.omitTokenAPiPath.includes(apiPath)) {
            if (req.headers.authorization != undefined && req.headers.authorization != null && req.headers.authorization != "") {
                let auth = req.headers.authorization.split(" ");
                // let decryptAuth           =    await util.decryptPayload(auth[1]);
                let tokenInfo = await extractWebToken(auth[1], headerJWTDecrypt);
                // if(tokenInfo.data.userid!=undefined && (Date.now()-tokenInfo.data.reqtime) < process.env.TOKEN_VALIDITY || config.TOKEN_VALIDITY){
                if (tokenInfo.data.userId != undefined && tokenInfo.data.userTypeId != undefined && (Date.now() - tokenInfo.data.reqtime) < process.env.TOKEN_VALIDITY || config.TOKEN_VALIDITY) {
                    if (req.body.payload === "" || req.body.payload === undefined || req.body.payload == "") {
                        reqData = tokenInfo.data;
                        reqData.token = auth[1];
                    } else {
                        let decryptData = await util.decryptPayload(req.body.payload);
                        let payload = await extractWebToken(decryptData, bodyJWTDecrypt);
                        reqData = payload;
                        reqData.userId = tokenInfo.data.userId;
                        reqData.userTypeId = tokenInfo.data.userTypeId;
                        reqData.token = auth[1];
                    }
                    req.body = reqData;
                    next();
                } else {
                    return res.status(402).json({success: false, message: "invalid_token", status: 402, response: []});
                }
            } else {
                return res.status(401).json({success: 1, message: "unauthorized_client", status: 401, response: []});
            }
        } else if (config.omitTokenAPiPath.includes(apiPath)) {
            if (req.body.payload != undefined) {
                let decryptData = await util.decryptPayload(req.body.payload);
                let payload = await extractWebToken(decryptData, bodyJWTDecrypt);
                reqData = payload;
                req.body = reqData;
            } else {
                req.body = {};
            }
            next();
        } else {
            return res.status(401).json({success: 1, message: "unauthorized_client", status: 401, response: []});
        }
    } catch (e) {
        return res.status(401).json({success: 1, message: "unauthorized_client", status: 401, response: []});
    }
}


module.exports = {
    jwt: jwt,
    errorHandler: errorHandler,
    setResponseHeader: setResponseHeader,
    notFoundEvenHandler: notFoundEvenHandler,
    validateSession: validateSession,
    transformResponse: transformResponse
}

