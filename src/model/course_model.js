const config = require('../config');
const dao = require('../dao/user_dao');
const commondao = require('../dao/commondao');
const token = require('../utility/token');
const util = require('../utility/util');
var parser = require('simple-excel-to-json');



/**
 * @author : Poritosh
 * @date : 23/01/2025
 * @description :getHierarchyTypes
 * @argument : 
 * @returns
 */
module.exports.getHierarchyTypes = async (data) => {
    try {
        data = await util.setCurrentDateTime(data)
        let resp = await commondao.getHierarchyTypes(data);
        if (resp.length > 0) {
            return { success: true, status: util.statusCode.SUCCESS, message: '', response: resp }
        }else {
            return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'No Data Found', response: null }   
        }

    } catch (e) {
        util.createLog(e)
        return { success: false, status: util.statusCode.INTERNAL, message: util.Message.INTERNAL, response: null }
    }
}


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
        // data.hmTypeDesc = "Course";
        let resp = await commondao.getHierarchyData(data);
        if (resp.length > 0) {
            return { success: true, status: util.statusCode.SUCCESS, message: '', response: resp }
        }else {
            return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'No Course Found', response: null }   
        }

    } catch (e) {
        util.createLog(e)
        return { success: false, status: util.statusCode.INTERNAL, message: util.Message.INTERNAL, response: null }
    }
}

/**
 * @author : Poritosh
 * @date : 23/01/2025
 * @description :getCourseList
 * @argument : 
 * @returns
 */
module.exports.getCourseSubjects = async (data) => {
    try {
        data = await util.setCurrentDateTime(data)
        // data.hmTypeDesc = "Subject";
        let resp = await commondao.getHierarchyData(data);
        if (resp.length > 0) {
            return { success: true, status: util.statusCode.SUCCESS, message: '', response: resp }
        }else {
            return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'No Course Found', response: null }   
        }

    } catch (e) {
        util.createLog(e)
        return { success: false, status: util.statusCode.INTERNAL, message: util.Message.INTERNAL, response: null }
    }
}

/**
 * @author : Poritosh
 * @date : 23/01/2025
 * @description :getCourseList
 * @argument : 
 * @returns
 */
module.exports.getCourseMaterials = async (data) => {
    try {
        data = await util.setCurrentDateTime(data)
        let resp = await dao.getCourseMaterials(data);
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

/**
 * @author : Poritosh
 * @date : 23/01/2025
 * @description :getCourseList
 * @argument : 
 * @returns
 */
module.exports.getMaterialDetails = async (data) => {
    try {
        data = await util.setCurrentDateTime(data)
        let resp = await dao.getMaterialDetails(data);
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

