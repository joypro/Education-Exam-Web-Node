const config = require('../config');
const dao = require('../dao/user_dao');
const commondao = require('../dao/commondao');
const token = require('../utility/token');
const util = require('../utility/util');
var parser = require('simple-excel-to-json');
const notificationcontrol = require('../utility/notificationcontrol');




/**
 * @author : Poritosh
 * @date : 23/01/2025
 * @description : signup via Web
 * @argument : 
 * @returns
 */


module.exports.signUp = async (data) => {
    try {
        data = await util.setCurrentDateTime(data)

        let userData = await dao.checkUserSignUpStatus(data)
        if(userData.length == 0){

            if(data.profileImgUrl === undefined || data.profileImgUrl === null || data.profileImgUrl === ''){
                data.profileImgUrl = "/profile/default.png"
            }

            if(data.userId === undefined || data.userId === null || data.userId === ''){
                data.userId = 0
            }

            if(data.clientId === undefined || data.clientId === null || data.clientId === ''){
                data.clientId = 0
            }

            if(data.lastName === undefined || data.lastName === null || data.lastName === ''){
                data.lastName = ""
            }

            if(data.phone === undefined || data.phone === null || data.phone === ''){
                data.phone = "/profile/default.png"
            }

            if(data.countryCode === undefined || data.countryCode === null || data.countryCode === ''){
                data.countryCode = "91"
            }

            if(data.address === undefined || data.address === null || data.address === ''){
                data.address = "India"
            }

            if(data.dob === undefined || data.dob === null || data.dob === ''){
                data.dob = null
            }

            if(data.gender === undefined || data.gender === null || data.gender === ''){
                data.gender = ""
            }

            if(data.userType === undefined || data.userType === null || data.userType === ''){
                data.userType = "1"
            }


            let resp = await dao.signUp(data);
                
            if(resp){
                data.tokenRefId = resp.insertId
                data.userId = 0
            }else{
                return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: util.Message.SOME_ERROR_OCCURRED, response: null }
            }
            
        }else if(userData[0].userId == 0){
            data.tokenRefId = userData[0].clientUserId
            data.userId = userData[0].userId
        
        }else{
            return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: "Account already exist", response: null }
        }
            

        data.tokenType = 0
        data.verifyTypeDescription = "userSignUp"
        data.tokenRefTable = "clientUser"

        let checkotp = await commondao.verifyOtp(data)

        if(checkotp.length == 0){
            data.token = await util.generateOtp()
            const currentDate = new Date();
            data.tokenExpires = await util.formatDateTime(new Date(currentDate.getTime() + config.EMAIL_TOKEN_VALIDITY * 1000));
            data.tokenVaidity = (config.EMAIL_TOKEN_VALIDITY / 60);
            data.tokenSession = await token.createJWTToken({
                "userId": data.userId,
                "tokenType": data.tokenType,
                "tokenRefTable": data.tokenRefTable,
                "token": data.token,
                "tokenRefId": data.tokenRefId,
            })

            otpResp = await commondao.generateOtp(data)
            
            if(otpResp){
                notificationcontrol.sendUserSignUpOtp(data)
                return { success: true, status: util.statusCode.SUCCESS, message: 'OTP is sent to your email id.', response: {"sessionId":data.tokenSession} }
            
            } else {
                return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: util.Message.SOME_ERROR_OCCURRED, response: null }
            }
        
        }else{
            return { success: true, status: util.statusCode.SUCCESS, message: 'OTP already sent to your email id.', response: null }
        }    
        
        

    } catch (e) {
        util.createLog(e)
        return { success: false, status: util.statusCode.INTERNAL, message: util.Message.INTERNAL, response: null }
    }
}





/**
 * @author : Poritosh
 * @date : 23/01/2025
 * @description : Verify signup Email
 * @argument : 
 * @returns
 */


module.exports.verifySignUpOtp = async (data) => {
    try {
        data = await util.setCurrentDateTime(data)

        let userData = await dao.checkUserSignUpStatus(data)
        if(userData.length != 0){
            data.tokenRefId = userData[0].clientUserId;
            data.tokenType = 0;
            data.verifyTypeDescription = "userSignUp"
            data.tokenRefTable = "clientUser"


            let tokenData = await commondao.verifyOtp(data)
            if(tokenData.length != 0){
                if(new Date(data.currentDateTime).getTime() <= new Date(tokenData[0].expiresAt).getTime() ){

                    data.password = util.passwordHash(data.password)
                    data = {...data, ...userData[0]}

                    if(data.clientUserId === undefined || data.clientUserId === null || data.clientUserId === ''){
                        data.clientUserId = 0
                    }

                    userResp = await dao.verifySignUp(data)
                    if(userResp){

                        dao.updateClientUserData({userId:userResp.insertId, clientUserId:data.clientUserId});
                        
                        dao.updateUserMstClientData({userId:userResp.insertId, clientUserId:data.clientUserId});
                        
                        commondao.updateOtpStatus({tokenId:tokenData[0].tokenId, status:1});
                        return { success: true, status: util.statusCode.SUCCESS, message: 'OTP verified successfully. Please sign in now', response: null }
                    }else{
                        return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: util.Message.SOME_ERROR_OCCURRED, response: null }
                    }
                    
                } else {
                    commondao.updateOtpStatus({tokenId:tokenData[0].tokenId, status:2});
                    return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: "OTP Expired. Try again", response: null }
                }
            
            }else{
                return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: "Invalid OTP. Verification Failed", response: null }
            }

        }else{
            return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: util.Message.SOME_ERROR_OCCURRED, response: null }
        }

    } catch (e) {
        util.createLog(e)
        return { success: false, status: util.statusCode.INTERNAL, message: util.Message.INTERNAL, response: null }
    }
}





/**
 * @author : Poritosh
 * @date : 23/01/2025
 * @description : Login via Web
 * @argument : 
 * @returns
 */
module.exports.signIn = async (data) => {
    try {
        data = await util.setCurrentDateTime(data)
        let checkUser = await dao.signIn(data);
        if(checkUser.length == 0){
            return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Account does not exist. Please Sign Up', response: null }

        }else if(util.passwordHash(data.password) !== checkUser[0].psw) {
                return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Entered password is incorrect', response: null }
        }else{

            if(checkUser[0].status == 0){
            
                return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Please complete sign up verification', response: null }
            
                data.userId = checkUser[0].userId
                data.tokenRefTable = "user"
                data.tokenType = 0
                data.verifyTypeDescription = "userSignIn"
                data.tokenRefId = data.userId

                let checkotp = await commondao.verifyOtp(data)

                if(checkotp.length == 0){
                    data.token = await util.generateOtp()
                    const currentDate = new Date();
                    data.tokenExpires = await util.formatDateTime(new Date(currentDate.getTime() + config.EMAIL_TOKEN_VALIDITY * 1000));
                    data.tokenVaidity = (config.EMAIL_TOKEN_VALIDITY / 60);
                    data.tokenSession = await token.createJWTToken({
                        "userId": data.userId,
                        "tokenType": data.tokenType,
                        "verifyTypeDescription": data.verifyTypeDescription,
                        "tokenRefId": data.tokenRefId,
                        "token": data.token,
                    })

                    otpResp = await commondao.generateOtp(data)
                    
                    if(otpResp){
                        notificationcontrol.sendUserSignInOtp(data)
                        return { success: true, status: util.statusCode.SUCCESS, message: 'Account is deactive. Please verify email to sign in', response: {"sessionId":data.tokenSession} }
                        // return { success: true, status: util.statusCode.SUCCESS, message: 'OTP is sent to your email id.', response: {"sessionId":data.tokenSession} }
                    
                    } else {
                        return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: util.Message.SOME_ERROR_OCCURRED, response: null }
                    }
                
                }else{
                    return { success: true, status: util.statusCode.SUCCESS, message: 'Sign In OTP already sent to your email id.', response: null }
                }
            
            }else{
                
                userData = checkUser[0]
                let bearerData = {
                    "userId": userData.userId,
                    "userTypeId": userData.userType,
                    "clientId": userData.clientId,
                    "roleId": userData.roleId,
                };
                let tokenData = await token.createJWTToken(bearerData)
                userData.token = tokenData
                delete userData.psw;

                let sessionData = {
                    "userId": userData.userId,
                    "deviceType": data.platform,
                    "sessionId": tokenData,
                    "deviceId": data.deviceId,
                    "fcmToken": data.fcmToken,
                    "clientId": userData.clientId,
                    "currentDateTime": data.currentDateTime,
                }
                // let removePreviousSession = await dao.removePreviousSession({ "userId": userData[j].userId, "deviceType": data.platform });
                let removePreviousSession = await dao.removePreviousSession({ "userId": userData.userId });
                let createSession = await dao.createSession(sessionData);

                // userData.unreadNotificationCount = await dao.unreadNotificationCount(userData.userId, userData.clientId)
                return { success: true, status: util.statusCode.SUCCESS, message: 'Sign In successfull', response: userData }
            
            }

        }

    } catch (e) {
        util.createLog(e)
        return { success: false, status: util.statusCode.INTERNAL, message: util.Message.INTERNAL, response: null }
    }
}






/**
 * @author : Poritosh
 * @date : 23/01/2025
 * @description : Verify signin Email
 * @argument : 
 * @returns
 */
module.exports.verifySignInOtp = async (data) => {
    try {
        data = await util.setCurrentDateTime(data)
        let checkUser = await dao.signIn(data);
        
        if(checkUser.length == 0){
            return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Account does not exist. Please Sign Up', response: null }
        }else{
            
            data.tokenRefId = checkUser[0].userId;
            data.userId = checkUser[0].userId;
            data.tokenType = 0;
            data.verifyTypeDescription = "userSignIn"
            data.tokenRefTable = "user"
                
            
            let tokenData = await commondao.verifyOtp(data)
            if(tokenData.length != 0){
                if(new Date(data.currentDateTime).getTime() <= new Date(tokenData[0].expiresAt).getTime() ){    
                    dao.updateUserActiveStatus({userId:userData[0].userId, status:1});
                    commondao.updateOtpStatus({tokenId:tokenData[0].tokenId, status:1});
                    return { success: true, status: util.statusCode.SUCCESS, message: 'OTP verified successfully. Please sign in now', response: null }
                } else {
                    commondao.updateOtpStatus({tokenId:tokenData[0].tokenId, status:2});
                    return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: "OTP Expired. Try again", response: null }
                }
            
            }else{
                return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: "Invalid OTP. Verification Failed", response: null }
            }
        }

    } catch (e) {
        util.createLog(e)
        return { success: false, status: util.statusCode.INTERNAL, message: util.Message.INTERNAL, response: null }
    }
}










/**
 * @author : Poritosh
 * @date : 23/01/2025
 * @description : signup via Web
 * @argument : 
 * @returns
 */


module.exports.genrateForgetPasswordOtp = async (data) => {
    try {
        data = await util.setCurrentDateTime(data)

        let userData = await dao.signIn(data)
        
        if(userData.length == 0){
            return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Account does not exist', response: null }
        }else{
            data.userId = userData[0].userId
            data.tokenType = 0
            data.verifyTypeDescription = "forgetPassword"
            data.tokenRefId = data.userId
            data.tokenRefTable = "user"

            let checkotp = await commondao.verifyOtp(data)

            if(checkotp.length == 0){
                data.token = await util.generateOtp()
                const currentDate = new Date();
                data.tokenExpires = await util.formatDateTime(new Date(currentDate.getTime() + config.EMAIL_TOKEN_VALIDITY * 1000));
                data.tokenVaidity = (config.EMAIL_TOKEN_VALIDITY / 60);
                data.tokenSession = await token.createJWTToken({
                    "userId": data.userId,
                    "tokenType": data.tokenType,
                    "verifyTypeDescription": data.verifyTypeDescription,
                    "tokenRefId": data.tokenRefId,
                    "token": data.token,
                })

                otpResp = await commondao.generateOtp(data)
                
                if(otpResp){
                    notificationcontrol.sendUserForgetPasswordOtp(data)
                    return { success: true, status: util.statusCode.SUCCESS, message: 'OTP is sent to your email id.', response: {"sessionId":data.tokenSession} }
                
                } else {
                    return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: util.Message.SOME_ERROR_OCCURRED, response: null }
                }
            
            }else{
                return { success: true, status: util.statusCode.SUCCESS, message: 'OTP already sent to your email id.', response: null }
            }    
        }

    } catch (e) {
        util.createLog(e)
        return { success: false, status: util.statusCode.INTERNAL, message: util.Message.INTERNAL, response: null }
    }
}



/**
 * @author : Poritosh
 * @date : 23/01/2025
 * @description : verifyForgetPasswordOtp
 * @argument : 
 * @returns
 */


module.exports.verifyForgetPasswordOtp = async (data) => {
    try {
        data = await util.setCurrentDateTime(data)

        let userData = await dao.checkUserStatus(data)
        
        if(userData.length == 0){
            return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Account does not exist', response: null }
        }else{
            data.userId = userData[0].userId
            data.psw = await util.passwordHash(data.newPassword)
            data.tokenType = 0
            data.verifyTypeDescription = "forgetPassword"
            data.tokenRefId = data.userId
            data.tokenRefTable = "user"

            let tokenData = await commondao.verifyOtp(data)

            if(tokenData.length != 0){

                if(data.tokenSession === undefined || data.tokenSession === null || data.tokenSession === '' || data.token === undefined || data.token === null || data.token === '' ){
                    commondao.updateOtpStatus({tokenId:tokenData[0].tokenId, status:2});
                    return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: "OTP Verification Failed. Try again", response: null }
                }else{
                    if(new Date(data.currentDateTime).getTime() <= new Date(tokenData[0].expiresAt).getTime() ){  
                        dao.updateUserPassword(data);
                        // dao.updateUserActiveStatus({userId:userData[0].userId, status:1});
                        commondao.updateOtpStatus({tokenId:tokenData[0].tokenId, status:1});
                        return { success: true, status: util.statusCode.SUCCESS, message: 'Password Reset successfully. Please sign in now', response: null }
                    } else {
                        commondao.updateOtpStatus({tokenId:tokenData[0].tokenId, status:2});
                        return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: "OTP Expired. Try again", response: null }
                    }
                }
                
            }else{
                return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: "OTP already sent to your email id", response: null }
            } 
        
        }

    } catch (e) {
        util.createLog(e)
        return { success: false, status: util.statusCode.INTERNAL, message: util.Message.INTERNAL, response: null }
    }
}




/** @author : Poritosh
 * @date : 23/01/2025
 * @description : getUserDetail
 * @argument : 
 * @returns
 */
module.exports.getUserDetail = async (data) => {
    try {
        data = await util.setCurrentDateTime(data)
        let resp = await dao.getUserDetail(data);
        if (resp) {
            return { success: true, status: util.statusCode.SUCCESS, message: '', response: resp }
        } else {
            return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: util.Message.SOME_ERROR_OCCURRED, response: null }
        }

    } catch (e) {
        util.createLog(e)
        return { success: false, status: util.statusCode.INTERNAL, message: util.Message.INTERNAL, response: null }
    }
}



/** @author : Poritosh
 * @date : 23/01/2025
 * @description : updateUserDetails
 * @argument : 
 * @returns
 */
module.exports.updateUserDetail = async (data) => {
    try {
        data = await util.setCurrentDateTime(data)
        let resp = await dao.updateUserDetail(data);
        if (resp) {
            return { success: true, status: util.statusCode.SUCCESS, message: 'User details updated successfully', response: null }
        } else {
            return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: util.Message.SOME_ERROR_OCCURRED, response: null }
        }

    } catch (e) {
        util.createLog(e)
        return { success: false, status: util.statusCode.INTERNAL, message: util.Message.INTERNAL, response: null }
    }
}