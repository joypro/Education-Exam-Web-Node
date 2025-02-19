const readConn = require('../dbconnection').readPool
const writeConn = require('../dbconnection').writePool
const util = require('../utility/util');



module.exports.checkUserStatus  = async(data) => {
    try {
        const sql = "SELECT userId, status, deleted, email, lastActiveDate FROM user WHERE deleted = 0 AND email = ?"
        const [result, fields] = await readConn.query(sql, [data.email]);
        return result
    } catch (e) {
        util.createLog(e);
        return [];
    }
}

module.exports.signIn  = async(data) => {
    try {
        const sql = "SELECT userId, userType, psw FROM user WHERE status = 1 AND deleted = 0 AND email = ?"
        const [result, fields] = await readConn.query(sql, [data.email]);
        return result
    } catch (e) {
        util.createLog(e);
        return [];
    }
}

module.exports.signUp  = async(data) => {
    try {
        const sql = `INSERT INTO user(firstName, lastName, psw, username, email, phone, countryCode, address, profileImgUrl, userType, status, deleted, isApproved, approvedBy, approvedAt, approvedRemarks, lastActiveDate, createdBy, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        const [result, fields] = await writeConn.query(sql, [data.firstName, data.lastName, data.password, data.email, data.email, data.phone, data.countryCode, data.address, data.profileImgUrl, '1', '0', '0', '1', '0', data.currentDateTime, 'Approved By System', data.currentDateTime, '0', data.currentDateTime]);
        return result
    } catch (e) {
        util.createLog(e);
        return false;
    }
}



module.exports.updateUserPassword  = async(data) => {
    try {
        const sql = `UPDATE user SET psw = ?, modifiedAt = ?, modifiedBy = ? WHERE userId = ?`
        const [result, fields] = await writeConn.query(sql, [data.psw, data.currentDateTime, data.userId, data.userId]);
        return result
    } catch (e) {
        util.createLog(e);
        return false;
    }
}


module.exports.getUserDetail  = async(data) => {
    try {
        const sql = "SELECT usr.firstName,usr.lastName,usr.username,usr.profileImgUrl,DATE_FORMAT(usr.createdAt, '%d/%m/%Y') AS createdAt, mstUserTypes.userTypeName AS userType FROM user AS usr, mstUserTypes AS usrtp WHERE usr.status = 1 AND usr.deleted = 0 AND usr.userId = ? AND usr.userType = usrtp.id "
        const [result, fields] = await readConn.query(sql, [data.userId]);
        return result
    } catch (e) {
        util.createLog(e);
        return [];
    }
}


module.exports.updateUserDetail  = async(data) => {
    try {
        const sql = `UPDATE user SET firstName = ?, lastName = ?, phone = ?, countryCode = ?, address = ?, modifiedAt = ?, modifiedBy = ? WHERE userId = ?`
        const [result, fields] = await writeConn.query(sql, [data.firstName, data.lastName, data.phone, data.countryCode, data.address, data.currentDateTime, data.userId, data.userId]);
        return result
    } catch (e) {
        util.createLog(e);
        return false;
    }
}



