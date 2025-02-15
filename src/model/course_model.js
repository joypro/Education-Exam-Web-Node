const config = require('../config');
const dao = require('../dao/user_dao');
const token = require('../utility/token');
const util = require('../utility/util');
var parser = require('simple-excel-to-json');




/**
 * @author : Poritosh
 * @date : 23/01/2025
 * @description :getCourseList
 * @argument : 
 * @returns
 */
module.exports.getCourseList = async (data) => {
    try {
        data = await util.setCurrentDateTime(data)
        let resp = await dao.getCourseList(data);
        if (resp.length > 0) {
            return { success: true, status: util.statusCode.SUCCESS, message: '', response: userData }
        }else {
            return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'No Course Found', response: null }   
        }

    } catch (e) {
        util.createLog(e)
        return { success: false, status: util.statusCode.INTERNAL, message: util.Message.INTERNAL, response: null }
    }
}
