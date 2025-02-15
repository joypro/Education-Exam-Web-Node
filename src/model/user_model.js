const config = require('../config');
const dao = require('../dao/user_dao');
const token = require('../utility/token');
const util = require('../utility/util');
var parser = require('simple-excel-to-json');




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
        let resp = await dao.signIn(data);
        if (resp.length == 0) {
            return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Account does not exist. Please Sign Up', response: null }
        } else if (util.passwordHash(data.password) !== resp[0].psw) {
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

            return { success: true, status: util.statusCode.SUCCESS, message: 'Sign In successfully done', response: userData }
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

        let userData = await dao.signIn(data)
        if(userData.length == 0){

            if(data.profileImgUrl === undefined || data.profileImgUrl === null || data.profileImgUrl === ''){
                data.profileImgUrl = "/profile/default.png"
            }

            data.password = util.passwordHash(data.password)
            console.log(data)
            let resp = await dao.signUp(data);
            if (resp) {
                return { success: true, status: util.statusCode.SUCCESS, message: 'Sign Up successfully Done. Please Sign In now', response: null }
            } else {
                return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: util.Message.SOME_ERROR_OCCURRED, response: null }
            }
        
        }else{
            return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: "User account already exist", response: null }
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