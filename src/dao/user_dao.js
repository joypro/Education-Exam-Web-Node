const readConn = require('../dbconnection').readPool
const writeConn = require('../dbconnection').writePool
const util = require('../utility/util');



module.exports.checkUserSignUpStatus  = async(data) => {
    try {
        const sql = "SELECT id AS clientUserId, userId, clientId, firstName, lastName, profileImgUrl, email, phone, countryCode, address, dob, gender, userType, status, deleted, isApproved, createdBy, createdAt FROM clientUser WHERE deleted = 0 AND email = ?"
        const [result, fields] = await readConn.query(sql, [data.email]);
        return result
    } catch (e) {
        util.createLog(e);
        return [];
    }
}


module.exports.signUp  = async(data) => {
    try {

        const sql = `INSERT INTO clientUser(userId, clientId, firstName, lastName, profileImgUrl, email, phone, countryCode, address, dob, gender, userType, status, deleted, isApproved, createdBy, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        const [result, fields] = await writeConn.query(sql, [data.userId, data.clientId, data.firstName, data.lastName, data.profileImgUrl, data.email, data.phone, data.countryCode, data.address, data.dob, data.gender, data.userType, '1', '0', '1', '0', data.currentDateTime]);
        return result
    } catch (e) {
        util.createLog(e);
        return false;
    }
}




module.exports.verifySignUp  = async(data) => {
    try {
        const sql = `INSERT INTO user(clientUserId, clientId, roleId, firstName, lastName, psw, username, email, phone, countryCode, address, profileImgUrl, userType, status, deleted, isApproved, approvedBy, approvedAt, approvedRemarks, lastActiveDate, createdBy, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        const [result, fields] = await writeConn.query(sql, [data.clientUserId, data.clientId, data.roleId, data.firstName, data.lastName, data.password, data.email, data.email, data.phone, data.countryCode, data.address, data.profileImgUrl, '1', '1', '0', '1', '0', data.currentDateTime, 'Approved By System', data.currentDateTime, '0', data.currentDateTime]);
        return result
    } catch (e) {
        util.createLog(e);
        return false;
    }
}




module.exports.updateUserActiveStatus  = async(data) => {
    try {
        const sql = `UPDATE user SET status = ?, modifiedAt = ?, modifiedBy = ? WHERE userId = ?`
        const [result, fields] = await writeConn.query(sql, [data.status, data.currentDateTime, data.userId, data.userId]);
        return result
    } catch (e) {
        util.createLog(e);
        return false;
    }
}




module.exports.updateUserMstClientData  = async(data) => {
    try {
        const sql = `UPDATE user SET clientUserId = ? WHERE userId = ?`
        const [result, fields] = await writeConn.query(sql, [data.clientUserId, data.userId]);
        return result
    } catch (e) {
        util.createLog(e);
        return false;
    }
}



module.exports.updateClientUserData  = async(data) => {
    try {
        const sql = `UPDATE clientUser SET userId = ? WHERE id = ?`
        const [result, fields] = await writeConn.query(sql, [data.userId, data.clientUserId]);
        return result
    } catch (e) {
        util.createLog(e);
        return false;
    }
}



module.exports.signIn  = async(data) => {
    try {
        const sql = "SELECT clientId, userId, userType, psw, profileImgUrl, createdAt, roleId FROM user WHERE status = 1 AND deleted = 0 AND email = ?"
        const [result, fields] = await readConn.query(sql, [data.email]);
        return result
    } catch (e) {
        util.createLog(e);
        return [];
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





module.exports.removePreviousSession = async (data) => {
    let query = "UPDATE session SET status=1 WHERE userId = ?";
    try {
        const [results, fields] = await writeConn.query(query, [data.userId]);
        return true;
    } catch (err) {
        let log = util.createLog(err);
        return false;
    }
};



module.exports.createSession = async (data) => {
    let query = "INSERT INTO session(userId, deviceType, sessionId,deviceId,fcmToken , createDate, lastUpdated, userAgent, status, loginTime) VALUES (?,?,?,?,?,?,?,?,?,?)";
    try {
        const [results, fields] = await writeConn.query(query, [data.userId, data.deviceType, data.sessionId, data.deviceId, data.fcmToken, data.currentDateTime, data.currentDateTime, '', '0',data.currentDateTime ]);
        return true;
    } catch (err) {
        let log = util.createLog(err);
        return false;
    }
};


module.exports.unreadNotificationCount = async (userId, clientId) => {
    try {

        let values = [];

        let sql = `SELECT COUNT(id) AS notificationCount FROM notificationManagement WHERE clientId = ? AND userId = ? AND isSeen = 0 AND status = 1 `;
        values.push(clientId)
        values.push(userId)

        let [result] = await readConn.query(sql, values);

        let notificationCount = 0

        if(result.length > 0){

            notificationCount = result[0].notificationCount
        }

        return notificationCount;
    } catch (e) {
        util.createLog(e);
        return 0;
    }
}