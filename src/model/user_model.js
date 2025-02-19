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
 * @description : Login via Web
 * @argument : 
 * @returns
 */
module.exports.signIn = async (data) => {
    try {
        data = await util.setCurrentDateTime(data)
        let checkUser = await dao.checkUserStatus(data);
        if(checkUser.length == 0){
            return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Account does not exist. Please Sign Up', response: null }
        }else if(checkUser[0].status == 0){

            data.userId = checkUser[0].userId
            data.tokenType = 0
            data.verifyType = "userSignIn"
            data.tokenRefId = data.userId

            let checkotp = await commondao.verifyOtp(data)

            if(checkotp.length == 0){
                data.token = await util.generateOtp()
                data.tokenDescription = "Sign In"
                const currentDate = new Date();
                data.tokenExpires = await util.formatDateTime(new Date(currentDate.getTime() + config.EMAIL_TOKEN_VALIDITY * 1000));
                data.tokenVaidity = (config.EMAIL_TOKEN_VALIDITY / 60);
                data.tokenSession = await token.createJWTToken({
                    "userId": data.userId,
                    "tokenType": data.tokenType,
                    "verifyType": data.verifyType,
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
            let resp = await dao.signIn(data);
            if (util.passwordHash(data.password) !== resp[0].psw) {
                return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Entered password is incorrect', response: null }

            } else {
                userData = resp[0]
                let bearerData = {
                    "userId": userData.userId,
                    "userTypeId": userData.userType,
                };
                let tokenData = await token.createJWTToken(bearerData)
                userData.token = tokenData
                delete userData.psw;
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
        let checkUser = await dao.checkUserStatus(data);

        if(checkUser.length == 0){
            return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Account does not exist. Please Sign Up', response: null }
        }else{
            
            data.tokenRefId = data.userId;
            data.tokenType = 0;
            data.verifyType = "userSignIn"
            
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
 * @description : Verify signup Email
 * @argument : 
 * @returns
 */


module.exports.verifySignUpOtp = async (data) => {
    try {
        data = await util.setCurrentDateTime(data)

        let userData = await dao.checkUserStatus(data)
        if(userData.length != 0){
            data.tokenRefId = data.userId;
            data.tokenType = 0;
            data.verifyType = "user";
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
 * @description : signup via Web
 * @argument : 
 * @returns
 */


module.exports.signUp = async (data) => {
    try {
        data = await util.setCurrentDateTime(data)

        let userData = await dao.checkUserStatus(data)
        if(userData.length == 0 || userData[0].status == 0){

            if(data.profileImgUrl === undefined || data.profileImgUrl === null || data.profileImgUrl === ''){
                data.profileImgUrl = "/profile/default.png"
            }

            if(userData.length == 0){
                data.password = await util.passwordHash(data.password)
                let resp = await dao.signUp(data);
                if(resp){
                    data.userId = resp.insertId
                }else{
                    return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: util.Message.SOME_ERROR_OCCURRED, response: null }
                }
            
            }else{
                data.userId = userData[0].userId
            }

            data.tokenType = 0
            data.verifyType = "user"
            data.tokenRefId = data.userId

            let checkotp = await commondao.verifyOtp(data)

            if(checkotp.length == 0){
                data.token = await util.generateOtp()
                data.tokenDescription = "User Sign Up"
                const currentDate = new Date();
                data.tokenExpires = await util.formatDateTime(new Date(currentDate.getTime() + config.EMAIL_TOKEN_VALIDITY * 1000));
                data.tokenVaidity = (config.EMAIL_TOKEN_VALIDITY / 60);
                data.tokenSession = await token.createJWTToken({
                    "userId": data.userId,
                    "tokenType": data.tokenType,
                    "verifyType": data.verifyType,
                    "token": data.token,
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
        
        }else{
            return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: "Account already exist", response: null }
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

        let userData = await dao.checkUserStatus(data)
        
        if(userData.length == 0){
            return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Account does not exist', response: null }
        }else{
            data.userId = userData[0].userId

            data.tokenType = 0
            data.verifyType = "forgetPassword"
            data.tokenRefId = data.userId

            let checkotp = await commondao.verifyOtp(data)

            if(checkotp.length == 0){
                data.token = await util.generateOtp()
                data.tokenDescription = "forget Password"
                const currentDate = new Date();
                data.tokenExpires = await util.formatDateTime(new Date(currentDate.getTime() + config.EMAIL_TOKEN_VALIDITY * 1000));
                data.tokenVaidity = (config.EMAIL_TOKEN_VALIDITY / 60);
                data.tokenSession = await token.createJWTToken({
                    "userId": data.userId,
                    "tokenType": data.tokenType,
                    "verifyType": data.verifyType,
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
            data.verifyType = "forgetPassword"
            data.tokenRefId = data.userId
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