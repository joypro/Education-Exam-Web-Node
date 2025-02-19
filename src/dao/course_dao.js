const readConn = require('../dbconnection').readPool
const writeConn = require('../dbconnection').writePool
const util = require('../utility/util');


module.exports.getCourseList  = async(data) => {
    try {
        const sql = "SELECT courseId, courseName, createdBy, createdAt WHERE status = 1 AND deleted = 0 AND courseAccessType = %s"
        const [result, fields] = await readConn.query(sql, [1]);
        return result
    } catch (e) {
        util.createLog(e);
        return [];
    }
}


module.exports.getCourseSubjects  = async(data) => {
    try {
        const sql = "SELECT courseId, courseName, createdBy, createdAt WHERE status = 1 AND deleted = 0 AND courseAccessType = %s"
        const [result, fields] = await readConn.query(sql, [1]);
        return result
    } catch (e) {
        util.createLog(e);
        return [];
    }
}


module.exports.getCourseMaterials  = async(data) => {
    try {
        const sql = "SELECT courseId, courseName, createdBy, createdAt WHERE status = 1 AND deleted = 0 AND courseAccessType = %s"
        const [result, fields] = await readConn.query(sql, [1]);
        return result
    } catch (e) {
        util.createLog(e);
        return [];
    }
}


module.exports.getMaterialDetails  = async(data) => {
    try {
        const sql = "SELECT courseId, courseName, createdBy, createdAt WHERE status = 1 AND deleted = 0 AND courseAccessType = %s"
        const [result, fields] = await readConn.query(sql, [1]);
        return result
    } catch (e) {
        util.createLog(e);
        return [];
    }
}


