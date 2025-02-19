const readConn = require('../dbconnection').readPool
const writeConn = require('../dbconnection').writePool
const util = require('../utility/util');
const axios = require('axios');





module.exports.generateOtp = async (data) => {
    try {
        let sql = "INSERT INTO verificationTokens (userId, tokenType, tokenRefId, verifyType, tokenDescription, tokenSession, token, expiresAt, status, createdAt) VALUES (?,?,?,?,?,?,?,?,?,?)";
        const [resp] = await writeConn.query(sql, [data.userId, data.tokenType, data.tokenRefId, data.verifyType, data.tokenDescription, data.tokenSession ,data.token, data.tokenExpires, 0, data.currentDateTime]);
        return resp;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.verifyOtp = async (data) => {
    try {
        let sql = "SELECT tokenId, userId, token, expiresAt, status FROM verificationTokens WHERE tokenType = ? AND verifyType = ? and tokenRefId = ? and status = 0"
        let param = [data.tokenType, data.verifyType, data.tokenRefId]
        
        if(data.token !== undefined && data.token != null && data.token != ''){
            sql += " and token = ?";
            param.push(data.token)
        }

        if(data.tokenSession !== undefined && data.tokenSession != null && data.tokenSession != ''){
            sql += " and tokenSession = ?";
            param.push(data.tokenSession)
        }
        
        
        let [resp] = await readConn.query(sql, param);
        return resp;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}


module.exports.updateOtpStatus = async (data) => {
    try {
        let sql = "UPDATE verificationTokens SET status = ? WHERE tokenId = ?";
        const [resp] = await writeConn.query(sql, [data.status, data.tokenId]);
        return resp;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}


module.exports.getAddressFromGoogleApi = async (lattitude, longitude) => {
    try {
        // let apiPath = "https://maps.googleapis.com/maps/api/geocode/json?latlng="+lattitude+","+longitude+"&key=AIzaSyCGommPN8RHFH0qRpm5Hhg1IwbYt0Vyhjw";
        let apiPath = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lattitude + "," + longitude + "&key=" + GOOGLE_API;
        util.createLog("Calling Google Api for Location");
        var apiRes = await axios.get(apiPath)
        var addressFromGoogleApi = apiRes.data.results[0].formatted_address;
        return addressFromGoogleApi;
    } catch (e) {
        util.createLog(e);
        return null;
    }
}

module.exports.addLocationActivityWithAddrs = async (data, insertId, tableName) => {
    try {
        if (data.address === undefined || data.address == null || data.address == "") {
            data.address = null;
        }

        let date_ob = '';

        if (data.currentDateTime === undefined || data.currentDateTime == "" || data.currentDateTime == null) {

            date_ob = new Date();

        } else {
            date_ob = new Date(data.currentDateTime)
        }

        // let date_ob = new Date();

        let date = ("0" + date_ob.getDate()).slice(-2);
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        let year = date_ob.getFullYear();
        let hours = date_ob.getHours();
        let minutes = date_ob.getMinutes();
        let seconds = date_ob.getSeconds();

        let currentDateTime = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds

        let checkSql = "SELECT * FROM activityLocation WHERE refId = ? AND tableName = ? AND isLatest = 1"
        const [checkresp] = await writeConn.query(checkSql, [insertId, tableName]);
        if (checkresp.length == 0) {
            let sql = "INSERT INTO activityLocation (tableName, refId, lat, lng, address, createDate) VALUES (?,?,?,?,?,?)";
            const [resp] = await writeConn.query(sql, [tableName, insertId, data.lattitude, data.longitude, data.address, currentDateTime]);
            return resp.insertId;
        } else {
            let exsistId = checkresp[0].id
            let sql = "INSERT INTO activityLocation (tableName, refId, lat, lng, address, createDate) VALUES (?,?,?,?,?,?)";
            const [resp] = await writeConn.query(sql, [tableName, insertId, data.lattitude, data.longitude, data.address, currentDateTime]);
            let sqlUp = "UPDATE activityLocation SET isLatest = 0 WHERE id = ?";
            const [respUp] = await writeConn.query(sqlUp, [exsistId]);
            return resp.insertId;
        }
    } catch (e) {
        // util.createLog(e);
        return false;
    }
}


module.exports.addLocationActivity = async (data, insertId, tableName) => {
    try {

        let checkSql = "SELECT * FROM activityLocation WHERE refId = ? AND tableName = ?"
        const [checkresp] = await writeConn.query(checkSql, [insertId, tableName]);

        if (checkresp.length == 0) {

            let sql = "INSERT INTO activityLocation (tableName, refId, lat, lng) VALUES (?,?,?,?)";
            const [resp] = await writeConn.query(sql, [tableName, insertId, data.lattitude, data.longitude]);
            return resp.insertId;


        } else {

            let exsistId = checkresp[0].id

            let sql = "INSERT INTO activityLocation (tableName, refId, lat, lng) VALUES (?,?,?,?)";
            const [resp] = await writeConn.query(sql, [tableName, insertId, data.lattitude, data.longitude]);


            let sqlUp = "UPDATE activityLocation SET isLatest = 0 WHERE id = ?";
            const [respUp] = await writeConn.query(sqlUp, [exsistId]);

            return resp.insertId;

        }

    } catch (e) {

        // util.createLog(e);
        return false;
    }
}


module.exports.getTypeSpecLookUpInfo = async (lookupType) => {
    let query = "SELECT * FROM lookup WHERE status = 1 AND lookuptype=? ORDER BY lookuptype ASC,id ASC";
    try {
        const [results, fields] = await readConn.query(query, [lookupType]);
        return results;
    } catch (err) {
        let log = util.createLog(err);
        return false;
    }
};

module.exports.getOrgCompanyId = async (clientId) => {
    try {
        let sql = "SELECT companyId FROM mstClient WHERE clientId = ?"

        const [resp] = await readConn.query(sql, [clientId]);
        return resp.length > 0 ? resp[0].companyId : 0
    } catch (e) {
        util.createLog(e);
        return false;
    }
}



module.exports.checkSysApprovedaccess = async (clientId) => {
    try {
        const sql = "SELECT settingsValue FROM clientSettings WHERE clientId = ? AND settingsType LIKE 'systemApprovalRequired'";
        const [resp] = await readConn.query(sql, [clientId]);

        // return resp[0].settingsValue;
        return resp.length > 0 ? resp[0].settingsValue : 0
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.checkCompanyOrderApprovalSettings = async (clientId) => {
    try {
        const sql = "SELECT settingsValue FROM clientSettings WHERE clientId = ? AND settingsType LIKE 'systemApprovalRequiredForOrder'";
        const [resp] = await readConn.query(sql, [clientId]);

        // return resp[0].settingsValue;
        return resp.length > 0 ? resp[0].settingsValue : "0"
    } catch (e) {
        util.createLog(e);
        return "0";
    }
}

module.exports.checkCompanyLoginSettings = async (clientId) => {
    try {
        const sql = "SELECT settingsValue, IF(settingsValue=1, 'phone', 'email') AS settingValType FROM clientSettings WHERE clientId = ? AND settingsType LIKE 'userLoginParam'";
        const [resp] = await readConn.query(sql, [clientId]);

        // return resp[0].settingsValue;
        return resp.length > 0 ? resp[0].settingsValue : "0"
    } catch (e) {
        util.createLog(e);
        return "0";
    }
}

module.exports.checkCompanyGamificationSettings = async (clientId) => {
    try {
        const sql = "SELECT settingsValue FROM clientSettings WHERE clientId = ? AND settingsType LIKE 'companyGamificationSetting'";
        const [resp] = await readConn.query(sql, [clientId]);

        // return resp[0].settingsValue;
        return resp.length > 0 ? resp[0].settingsValue : "0"
    } catch (e) {
        util.createLog(e);
        return "0";
    }
}

module.exports.checkCompanyOTPVerificationSettings = async (clientId) => {
    try {
        const sql = "SELECT settingsValue FROM clientSettings WHERE clientId = ? AND settingsType LIKE 'orderOTPVerification'";
        const [resp] = await readConn.query(sql, [clientId]);

        // return resp[0].settingsValue;
        return resp.length > 0 ? resp[0].settingsValue : "0"
    } catch (e) {
        util.createLog(e);
        return "0";
    }
}

//Souradeep 
//Organization
// module.exports.check_SysApprovedaccess = async(clientId) => {
//     try {
//         const sql = "SELECT settingsValue FROM clientSettings WHERE clientId = ? AND settingsType LIKE 'systemApprovalRequired'";
//         const [resp] = await readConn.query(sql, [clientId]);

//         // return resp[0].settingsValue;
//         return resp.length > 0 ? resp[0].settingsValue : 0
//     } catch (e) {
//         util.createLog(e);
//         return false;
//     }
// }


module.exports.getOpportunityfrstStatus = async (clientId) => {
    try {
        const sql = "SELECT id FROM mstDataNature WHERE clientId = ? AND natureType = 2 AND status = 1 AND slNo = 0";
        const [resp] = await readConn.query(sql, [clientId]);

        return resp[0].id;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.getSystemUserId = async (clientId) => {
    try {
        const sql = "SELECT userId FROM user WHERE clientId = ? AND userType LIKE '3'";
        const [resp] = await readConn.query(sql, [clientId]);

        // return resp[0].userId;
        return resp.length > 0 ? resp[0].userId : 0
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

// module.exports.getSystem_UserId = async (clientId) => {
//     try {
//         const sql = "SELECT userId FROM user WHERE clientId = ? AND userType LIKE '3'";
//         const [resp] = await readConn.query(sql, [clientId]);

//         // return resp[0].userId;
//         return resp.length > 0 ? resp[0].userId : 0
//     } catch (e) {
//         util.createLog(e);
//         return false;
//     }
// }


module.exports.getCRMAdminUserId = async (clientId) => {
    try {
        const sql = "SELECT userId FROM user WHERE clientId = ? AND userType LIKE '4'";
        const [resp] = await readConn.query(sql, [clientId]);

        // return resp[0].userId;
        return resp.length > 0 ? resp[0].userId : 0
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.getCRMAdminUserDetails = async (clientId) => {
    try {
        const sql = "SELECT userId, CONCAT(COALESCE(firstName,''),' ',COALESCE(lastName,'')) AS userName, email, phone FROM user WHERE clientId = ? AND userType LIKE '4'";
        const [resp] = await readConn.query(sql, [clientId]);

        // return resp[0].userId;
        return resp
    } catch (e) {
        util.createLog(e);
        return false;
    }
}




module.exports.addclientlocation = async (data, insertId, tableName) => {
    try {
        if (data.zoneId === undefined || data.zoneId == null || data.zoneId == "") {
            data.zoneId = "0"
        }
        if (data.countryId === undefined || data.countryId == null || data.countryId == "") {
            data.countryId = "0"
        }
        if (data.stateId === undefined || data.stateId == null || data.stateId == "") {
            data.stateId = "0"
        }
        if (data.districtId === undefined || data.districtId == null || data.districtId == "") {
            data.districtId = "0"
        }
        // if(data.cityId === undefined || data.cityId ==null || data.cityId ==""){
        //     data.cityId = "0"
        // }

        if (data.cityId === undefined) {
            data.districtId = data.districtId
        } else {
            data.districtId = data.cityId
        }


        let updateSql = "UPDATE clientLocationMap SET status=2 WHERE refId = ? AND tableName = ?"
        const [updateResp] = await readConn.query(updateSql, [insertId, tableName]);


        let sql = "INSERT INTO clientLocationMap (clientId, tableName, refId, countryId, stateId , districtId, zoneId, status, assignedBy) VALUES (?,?,?,?,?,?,?,?,?)";

        const [resp] = await writeConn.query(sql, [data.clientId, tableName, insertId, data.countryId, data.stateId, data.districtId, data.zoneId, 1, data.userId]);
        return resp.insertId;

    } catch (err) {

        util.createLog(err);
        return false;
    }
}

module.exports.genUniqueId = async (insertId, contactTypeId, clientId) => {
    try {
        let getUserTypeQuery = "SELECT LEFT(contactTypeName , 1) AS contactType FROM mstContactType WHERE contactTypeId = ? AND clientId = ?";
        const [results] = await readConn.query(getUserTypeQuery, [contactTypeId, clientId]);
        return "ERP-" + results[0].contactType + "-" + insertId
    } catch (err) {
        util.createLog(err);
        return false;
    }
}



module.exports.addCalenderActivity = async (data) => {
    try {





        let sql = "INSERT INTO calenderActivity (clientId, userId, eventName, description, refTable, refId, serviceType, date) VALUES (?,?,?,?,?,?,?,?)";
        const [resp] = await writeConn.query(sql, [data.clientId, data.userId, data.eventName, data.description, data.refTable, data.refId, data.serviceType, data.date]);
        return resp.insertId;


    } catch (e) {
        // util.createLog(e);
        return false;
    }
}



module.exports.getChildUserByParent_withRecursive = async (data) => {
    try {
        
        let finalRes = [];
        let userIds = [data.userId];

        async function hello(userIdsArr) {


            let sql = `SELECT DISTINCT(clientEntityHierarchy.childId),clientEntityHierarchy.parentId,CONCAT(COALESCE(userParent.firstName,''),' ',COALESCE(userParent.lastName,'')) AS parentUserName,CONCAT(COALESCE(userChild.firstName,''),' ',COALESCE(userChild.lastName,'')) AS childUserName
            FROM clientEntityHierarchy, user userParent, user userChild
            WHERE clientEntityHierarchy.clientId = ?
            AND clientEntityHierarchy.parentId in (?) 
            AND clientEntityHierarchy.status = 1 
            AND clientEntityHierarchy.parentTable = 'user'
            AND clientEntityHierarchy.childTable = 'user'
            AND clientEntityHierarchy.parentId = userParent.userId
            AND clientEntityHierarchy.childId = userChild.userId`

            const [resp] = await writeConn.query(sql, [data.clientId, userIdsArr]);

            // console.log(userIdsArr +"===================== userIdsArr")

            if (resp.length > 0) {
                userIds = [];
                for (let el of resp) {
                    finalRes.push(el);
                    userIds.push(el.childId)
                }
                await hello(userIds);

            } else {
                return 0;
            }
        }

       await hello(userIds);

    


        // console.log(JSON.stringify(finalRes) + "===================");

        return finalRes;

    } catch (e) {
        util.createLog(e);
        return false;
    }
}

/**
 * @author : Sourav Bhoumik
 * @date : 20/05/2023
 * @description : get childern(all) by parent id for reporting
 * @argument : 
 * @returns
 */

module.exports.getChildUserByParent = async (data) => {
    try {
        // let sql = `SELECT clientEntityHierarchy.childId,clientEntityHierarchy.parentId,CONCAT(userParent.firstName,' ',userParent.lastName) AS parentUserName,CONCAT(userChild.firstName,' ',userChild.lastName) AS childUserName 
        //             FROM clientEntityHierarchy 
        //             LEFT JOIN user userParent ON userParent.userId = clientEntityHierarchy.parentId AND userParent.isActive = 1 AND userParent.deleted = 0 
        //             LEFT JOIN user userChild ON userChild.userId = clientEntityHierarchy.childId AND userChild.isActive = 1 AND userChild.deleted = 0 
        //             WHERE clientEntityHierarchy.parentId = ? 
        //             AND clientEntityHierarchy.clientId = ? 
        //             AND clientEntityHierarchy.status = 1`;

        let sql = `SELECT clientEntityHierarchy.childId,clientEntityHierarchy.parentId,CONCAT(COALESCE(userParent.firstName,''),' ',COALESCE(userParent.lastName,'')) AS parentUserName,CONCAT(COALESCE(userChild.firstName,''),' ',COALESCE(userChild.lastName,'')) AS childUserName
                    FROM clientEntityHierarchy, user userParent, user userChild
                    WHERE clientEntityHierarchy.clientId = ?
                    AND clientEntityHierarchy.parentId = ? 
                    AND clientEntityHierarchy.status = 1 
                    AND clientEntityHierarchy.parentTable = 'user'
                    AND clientEntityHierarchy.childTable = 'user'
                    AND clientEntityHierarchy.parentId = userParent.userId
                    AND clientEntityHierarchy.childId = userChild.userId`

        const [resp] = await writeConn.query(sql, [data.clientId, data.userId]);
        return resp;

    } catch (e) {
        util.createLog(e);
        return false;
    }
}

/**
 * @author : Sourav Bhoumik
 * @date : 20/05/2023
 * @description : get children by parent for any live listing
 * @argument : 
 * @returns
 */

module.exports.getChildUserByParentV2 = async (data) => {
    try {
        // let sql = `SELECT clientEntityHierarchy.childId,CONCAT(COALESCE(userParent.firstName,''),' ',COALESCE(userParent.lastName,'')) AS parentUserName,CONCAT(COALESCE(userChild.firstName,''),' ',COALESCE(userChild.lastName,'')) AS childUserName, clientLocationMap.countryId AS childCountryId, clientLocationMap.stateId AS childStateId, clientLocationMap.districtId AS childDistrictId, clientLocationMap.zoneId AS childZoneId 
        //             FROM clientEntityHierarchy 
        //             LEFT JOIN user userParent ON userParent.userId = clientEntityHierarchy.parentId AND userParent.isActive = 1 AND userParent.deleted = 0 
        //             LEFT JOIN user userChild ON userChild.userId = clientEntityHierarchy.childId AND userChild.isActive = 1 AND userChild.deleted = 0 
        //             LEFT JOIN clientLocationMap ON userChild.userId = clientLocationMap.refId AND clientLocationMap.tableName = 'user' AND clientLocationMap.status = 1 
        //             WHERE clientEntityHierarchy.parentId = ? 
        //             AND clientEntityHierarchy.clientId = ? 
        //             AND clientEntityHierarchy.status = 1 
        //             AND clientLocationMap.clientId = ? GROUP BY clientEntityHierarchy.childId`;


        let sql = `SELECT clientEntityHierarchy.childId,clientEntityHierarchy.parentId,CONCAT(COALESCE(userParent.firstName,''),' ',COALESCE(userParent.lastName,'')) AS parentUserName,CONCAT(COALESCE(userChild.firstName,''),' ',COALESCE(userChild.lastName,'')) AS childUserName
                    FROM clientEntityHierarchy, user userParent, user userChild
                    WHERE clientEntityHierarchy.parentId = ? 
                    AND clientEntityHierarchy.clientId = ? 
                    AND clientEntityHierarchy.status = 1 
                    AND clientEntityHierarchy.parentTable = 'user'
                    AND clientEntityHierarchy.childTable = 'user'
                    AND userParent.userId = clientEntityHierarchy.parentId 
                    AND userChild.userId = clientEntityHierarchy.childId AND userChild.isActive = 1 AND userChild.deleted = 0`

        const [resp] = await writeConn.query(sql, [data.userId, data.clientId]);
        return resp;

    } catch (e) {
        util.createLog(e);
        return false;
    }
}






module.exports.pickUserCurrentLocation = async (data) => {
    try {
        let sql = "INSERT INTO activityLocation(tableName, refId, lat, lng, isLatest, createDate) VALUES (?,?,?,?,?,NOW())";
        const [resp] = await writeConn.query(sql, [data.type, data.userId, data.lattitude, data.longitude, data.isLatest]);
        return true;
    } catch (e) {

        return false;
    }
}

module.exports.pickCustomerCurrentLocation = async (data) => {
    try {

        let sql = "INSERT INTO activityLocation(tableName, refId, lat, lng, isLatest, createDate) VALUES (?,?,?,?,?,NOW())";
        const [resp] = await writeConn.query(sql, [data.type, data.customerId, data.lattitude, data.longitude, data.isLatest]);
        return true;
    } catch (e) {

        return false;
    }
}


module.exports.updateActivityLocation = async (data) => {
    try {
        let sql = 'UPDATE activityLocation SET isLatest="0" WHERE tableName=? AND refId= ? AND isLatest="1"';
        const [resp] = await writeConn.query(sql, [data.type, data.userId]);
        return true;
    } catch (e) {

        return false;
    }
}

module.exports.updateCustomerActivityLocation = async (data) => {
    try {

        let sql = 'UPDATE activityLocation SET isLatest="0" WHERE tableName=? AND refId= ? AND isLatest="1"';
        const [resp] = await writeConn.query(sql, [data.type, data.customerId]);
        return true;
    } catch (e) {

        return false;
    }
}


module.exports.checkMasterContactType = async (data) => {
    try {
        const sql = "SELECT masterContactTypes.name FROM mstContactType, masterContactTypes WHERE mstContactType.mstSlNo = masterContactTypes.slNo AND mstContactType.contactTypeId = ?";
        const [resp] = await readConn.query(sql, [data.contactTypeId]);

        // return resp[0].userId;
        return resp[0].name
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.checkMasterContactTypeModified = async (contactTypeId, clientId) => {
    try {
        const sql = "SELECT masterContactTypes.name FROM mstContactType, masterContactTypes WHERE mstContactType.mstSlNo = masterContactTypes.slNo AND mstContactType.contactTypeId = ? AND mstContactType.clientId = ?";
        const [resp] = await readConn.query(sql, [contactTypeId, clientId]);

        // return resp[0].userId;
        // return resp[0].name
        if (resp.length > 0) {
            return resp[0].name
        }
        return ""
    } catch (e) {
        util.createLog(e);
        return false;
    }
}


// module.exports.getChildUserByParent  = async(data) => {
//     try {
//         let sql = "SELECT clientEntityHierarchy.childId,CONCAT(userParent.firstName,' ',userParent.lastName) AS parentUserName,CONCAT(userChild.firstName,' ',userChild.lastName) AS childUserName \
//                     FROM clientEntityHierarchy \
//                     LEFT JOIN user userParent ON userParent.userId = clientEntityHierarchy.parentId AND userParent.isActive = 1 AND userParent.deleted = 0 \
//                     LEFT JOIN user userChild ON userChild.userId = clientEntityHierarchy.childId AND userParent.isActive = 1 AND userParent.deleted = 0 \
//                     WHERE clientEntityHierarchy.parentId = ? \
//                     AND clientEntityHierarchy.clientId = ? \
//                     AND clientEntityHierarchy.status = 1";

//         const [resp] = await writeConn.query(sql, [data.userId,data.clientId]);
//         return resp;

//     } catch (e) {
//         util.createLog(e);
//         return false;
//     }
// }


module.exports.getMappedUsrchildLocationMappedSFA = async (data) => {
    try {

        let where = '';
        var queryparams = []

        let allUserArr = [];

        subordinateSql = "SELECT childId FROM clientEntityHierarchy WHERE parentTable = 'user' AND childTable = 'user' AND status = 1 AND clientId = ? AND parentId = ?"
        let [getSubordinateUser] = await readConn.query(subordinateSql, [data.clientId, data.userId]);

        if (getSubordinateUser.length > 0) {

            if (Array.isArray(getSubordinateUser)) {
                for (let i = 0; i < getSubordinateUser.length; i++) {
                    allUserArr.push(getSubordinateUser[i].childId);
                }
            }
        }

        data.allUserArr = allUserArr


        let query = "SELECT clientLocationMap.refId FROM clientLocationMap WHERE clientLocationMap.status = 1 AND clientLocationMap.tableName = 'user' AND clientLocationMap.clientId = ? AND clientLocationMap.refId IN (SELECT childId FROM clientEntityHierarchy WHERE parentTable = 'user' AND childTable = 'user' AND status = 1 AND clientId = ? AND parentId = ?)";

        // let query = "SELECT clientLocationMap.refId FROM clientLocationMap WHERE clientLocationMap.status = 1 AND clientLocationMap.tableName = 'user' AND clientLocationMap.clientId = ? AND clientLocationMap.refId IN (" + data.allUser.join(',') + ")";


        queryparams.push(data.clientId, data.clientId, data.userId)

        if (data.countryId !== undefined && data.countryId != "") {
            query += " AND clientLocationMap.countryId = ? ";
            queryparams.push(data.countryId);
        }
        if (data.stateId !== undefined && data.stateId != "") {
            query += " AND clientLocationMap.stateId = ? ";
            queryparams.push(data.stateId);
        }
        if (data.districtId !== undefined && data.districtId != "") {
            query += " AND clientLocationMap.districtId = ? ";
            queryparams.push(data.districtId);
        }
        if (data.zoneId !== undefined && data.zoneId != "") {
            query += " AND clientLocationMap.zoneId = ? ";
            queryparams.push(data.zoneId);
        }

        query += " GROUP BY clientLocationMap.refId ";

        let [result] = await readConn.query(query, queryparams);
        return result

    } catch (e) {
        util.createLog(e);
        return false;
    }
}


module.exports.getMappedUsrchildLocationMappedCRM = async (data) => {
    try {

        let where = '';
        var queryparams = []


        let query = "SELECT clientLocationMap.refId FROM clientLocationMap WHERE clientLocationMap.clientId = ? AND clientLocationMap.tableName = 'user' AND clientLocationMap.status = 1 ";

        queryparams.push(data.clientId)

        if (data.countryId !== undefined && data.countryId != "") {
            query += " AND clientLocationMap.countryId = ? ";
            queryparams.push(data.countryId);
        }
        if (data.stateId !== undefined && data.stateId != "") {
            query += " AND clientLocationMap.stateId = ? ";
            queryparams.push(data.stateId);
        }
        if (data.districtId !== undefined && data.districtId != "") {
            query += " AND clientLocationMap.districtId = ? ";
            queryparams.push(data.districtId);
        }
        if (data.zoneId !== undefined && data.zoneId != "") {
            query += " AND clientLocationMap.zoneId = ? ";
            queryparams.push(data.zoneId);
        }

        query += " GROUP BY clientLocationMap.refId ";

        let [result] = await readConn.query(query, queryparams);
        return result

    } catch (e) {
        util.createLog(e);
        return false;
    }
}



module.exports.getAllCompanyUsers = async (data) => {
    try {

        let where = '';
        var queryparams = []


        let query = "SELECT userId FROM user WHERE isActive = 1 AND deleted = 0 AND clientId = ?";

        queryparams.push(data.clientId)

        // if (data.countryId !== undefined && data.countryId != "") {
        //     query += " AND clientLocationMap.countryId = ? ";
        //     queryparams.push(data.countryId);
        // }
        // if (data.stateId !== undefined && data.stateId != "") {
        //     query += " AND clientLocationMap.stateId = ? ";
        //     queryparams.push(data.stateId);
        // }
        // if (data.districtId !== undefined && data.districtId != "") {
        //     query += " AND clientLocationMap.districtId = ? ";
        //     queryparams.push(data.districtId);
        // }
        // if (data.zoneId !== undefined && data.zoneId != "") {
        //     query += " AND clientLocationMap.zoneId = ? ";
        //     queryparams.push(data.zoneId);
        // }

        // query += " GROUP BY clientLocationMap.refId ";


        let [result] = await readConn.query(query, queryparams);
        return result

    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.getUserName = async (userId) => {
    try {
        let sql = `SELECT CONCAT(COALESCE(firstName,''),' ',COALESCE(lastName,'')) AS userName FROM user WHERE userId = ? `;
        const [resp] = await readConn.query(sql, [userId]);

        return resp[0].userName;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}


module.exports.getZoneSpecificUserListByDesignation = async (data) => {
    try {

        let sql = `SELECT DISTINCT user.userId, CONCAT(COALESCE(user.firstName),' ',COALESCE(user.lastName)) AS userName,
                    mstDesig.designationName, zone.zoneName
                    FROM user
                    LEFT JOIN clientLocationMap AS clm ON user.userId = clm.refId
                    LEFT JOIN zone ON clm.zoneId = zone.zoneId
                    LEFT JOIN mstDesignation AS mstDesig ON user.designationId = mstDesig.designationId
                    WHERE user.clientId = ?
                    AND user.clientId = clm.clientId
                    AND clm.zoneId = ?
                    AND clm.tableName = 'user'
                    AND clm.status = '1'
                    AND user.isActive = '1'`;

        const [resp] = await readConn.query(sql, [data.clientId, data.zoneId]);

        return resp;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.checkSys_Approvedaccess = async (clientId) => {
    try {
        const sql = "SELECT settingsValue FROM clientSettings WHERE clientId = ? AND settingsType LIKE 'systemApprovalRequired'";
        const [resp] = await readConn.query(sql, [clientId]);

        // return resp[0].settingsValue;
        return resp.length > 0 ? resp[0].settingsValue : 0
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.getSystem_UserId = async (clientId) => {
    try {
        const sql = "SELECT userId FROM user WHERE clientId = ? AND userType LIKE '3'";
        const [resp] = await readConn.query(sql, [clientId]);

        // return resp[0].userId;
        return resp.length > 0 ? resp[0].userId : 0
    } catch (e) {
        util.createLog(e);
        return false;
    }
}


module.exports.getNoOrganizationId = async (clientId) => {
    try {
        const sql = "SELECT organizationId  FROM organizationManagement WHERE clientId = ? AND organizationName LIKE 'No Organization' AND status LIKE '1' AND deleted LIKE '0'";
        const [resp] = await readConn.query(sql, [clientId]);

        // return resp[0].userId;
        return resp.length > 0 ? resp[0].organizationId : 0
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

/**
 * @author : Anjishnu Chakraborty
 * @date : 28/03/2023
 * @description : insert into lead history table 
 * @argument : 
 * @returns : 
 */

module.exports.addLeadHistoryLog = async (data) => {
    try {

        const sql = "INSERT INTO leadHistoryLogs (clientId, leadId, description, createdBy) VALUES (?,?,?,?)";
        let params = [data.clientId, data.leadId, data.description, data.createdBy]
        let [resp] = await writeConn.query(sql, params);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

/**
 * @author : Sourav Bhoumik
 * @date : 24/11/2023
 * @description : insert into lead history table 
 * @argument : 
 * @returns : 
 */

module.exports.addLeadHistoryLogV2 = async (data) => {
    try {

        const sql = "INSERT INTO leadHistoryLogs (clientId, leadId, description, createdBy, createdAt) VALUES (?,?,?,?,?)";
        let params = [data.clientId, data.leadId, data.description, data.createdBy, data.createdAt]
        let [resp] = await writeConn.query(sql, params);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}




module.exports.getDataNature = async (id) => {
    try {

        let sql = `SELECT name FROM mstDataNature WHERE id = ? AND status = 1 `;
        let [resp] = await readConn.query(sql, [id]);
        return resp[0].name
    } catch (e) {
        util.createLog(e);
        return false;
    }
}
module.exports.getSalesStageName = async (id) => {
    try {

        let sql = `SELECT salesStageName FROM mstDataNature WHERE salesStageId = ? AND isActive = 1 AND deleted = 0 `;
        let [resp] = await readConn.query(sql, [id]);
        return resp[0].salesStageName
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

// module.exports.add_LocationActivity = async(data, insertId, tableName) => {
//     try{
//         let checkSql = "SELECT * FROM activityLocation WHERE refId = ? AND tableName = ?"
//         const [checkresp] = await writeConn.query(checkSql,[insertId, tableName]);

//         if(checkresp.length == 0){

//             let sql = "INSERT INTO activityLocation (tableName, refId, lat, lng) VALUES (?,?,?,?)";
//             const [resp] = await writeConn.query(sql,[tableName, insertId, data.lattitude, data.longitude]);
//             return resp.insertId;


//         }else{

//             let exsistId = checkresp[0].id

//             let sql = "INSERT INTO activityLocation (tableName, refId, lat, lng) VALUES (?,?,?,?)";
//             const [resp] = await writeConn.query(sql,[tableName, insertId, data.lattitude, data.longitude]);


//             let sqlUp = "UPDATE activityLocation SET isLatest = 0 WHERE id = ?";
//             const [respUp] = await writeConn.query(sqlUp,[exsistId]);

//             return resp.insertId;

//         }
//     } catch (e) {

//         // util.createLog(e);
//         return false;
//     }
// }

// module.exports.add_clientlocation = async(data,insertId,tableName) =>{
//     try{
//         if(data.zoneId === undefined || data.zoneId ==null || data.zoneId ==""){
//             data.zoneId = "0"
//         }
//         if(data.countryId === undefined || data.countryId ==null || data.countryId ==""){
//             data.countryId = "0"
//         }
//         if(data.stateId === undefined || data.stateId ==null || data.stateId ==""){
//             data.stateId = "0"
//         }
//         if(data.districtId === undefined || data.districtId ==null || data.districtId ==""){
//             data.districtId = "0"
//         }
//         // if(data.cityId === undefined || data.cityId ==null || data.cityId ==""){
//         //     data.cityId = "0"
//         // }

//         if(data.cityId === undefined){
//             data.districtId = data.districtId
//         }else{
//             data.districtId = data.cityId
//         }


//         let updateSql   =   "UPDATE clientLocationMap SET status=2 WHERE refId = ? AND tableName = ?"
//         const [updateResp] = await readConn.query(updateSql,[insertId, tableName]);


//         let sql = "INSERT INTO clientLocationMap (clientId, tableName, refId, countryId, stateId , districtId, zoneId, status, assignedBy) VALUES (?,?,?,?,?,?,?,?,?)";

//         const [resp] = await writeConn.query(sql,[data.clientId, tableName, insertId, data.countryId, data.stateId, data.districtId, data.zoneId,1, data.userId]);
//             return resp.insertId;

//     }catch(err){

//         util.createLog(err);
//         return false;
//     }
// }



module.exports.checkSysApprovedaccessForEnquery = async (clientId) => {
    try {
        const sql = "SELECT settingsValue FROM clientSettings WHERE clientId = ? AND settingsType LIKE 'systemApprovalRequiredForEnquery'";
        const [resp] = await readConn.query(sql, [clientId]);

        // return resp[0].settingsValue;
        return resp.length > 0 ? resp[0].settingsValue : 0
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.checkSysApprovedaccessForTargets = async (clientId) => {
    try {
        const sql = "SELECT settingsValue FROM clientSettings WHERE clientId = ? AND settingsType LIKE 'systemApprovalRequiredForTarget'";
        const [resp] = await readConn.query(sql, [clientId]);

        // return resp[0].settingsValue;
        return resp.length > 0 ? resp[0].settingsValue : 0
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.ifNAZoneCheck = async (clientId, zoneId) => {
    try {

        let sql = `SELECT zoneName  FROM zone WHERE clientId = ? AND zoneId = ? `;
        let [resp] = await readConn.query(sql, [clientId, zoneId]);

        return resp.length > 0 ? resp[0].zoneName : ''
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.getMappedZonesForUser = async (userId, clientId) => {
    try {
        let sql = "SELECT zoneId FROM clientLocationMap WHERE clientId = ? AND tableName LIKE 'user' AND refId = ? AND status = 1 ORDER BY zoneId DESC";

        const [resp] = await readConn.query(sql, [clientId, userId]);
        return resp;

    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.getMappedZonesForUser_gn = async (userId, clientId) => {
    try {
        let sql = "SELECT DISTINCT hierarchyDataId FROM clientLocationMap WHERE clientId = ? AND tableName = 'user' AND refId = ? AND status = 1";

        const [resp] = await readConn.query(sql, [clientId, userId]);
        return resp;

    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.getMappedZonesForCustomer = async (customerId, clientId) => {
    try {
        let sql = "SELECT zoneId FROM clientLocationMap WHERE clientId = ? AND tableName LIKE 'clientCustomer' AND refId = ? AND status = 1 ORDER BY zoneId DESC";

        const [resp] = await readConn.query(sql, [clientId, customerId]);
        return resp;

    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.getMappedZonesForCustomer_gn = async (customerId, clientId) => {
    try {
        let sql = "SELECT hierarchyDataId FROM clientLocationMap WHERE clientId = ? AND tableName LIKE 'clientCustomer' AND refId = ? AND status = 1 ORDER BY hierarchyDataId DESC";

        const [resp] = await readConn.query(sql, [clientId, customerId]);
        return resp;

    } catch (e) {
        util.createLog(e);
        return false;
    }
}


module.exports.getMappedUserForZones = async (clientId, zoneArr, tableName) => {
    try {
        let sql = "SELECT refId FROM clientLocationMap WHERE clientId = ? AND status = 1 AND tableName = ? AND zoneId IN (" + zoneArr.join(',') + ")";

        const [resp] = await readConn.query(sql, [clientId, tableName]);
        return resp;

    } catch (e) {
        util.createLog(e);
        return false;
    }
}

/**
 * @author : Sourav Bhoumik
 * @date : 16/06/2023
 * @description : get all items of mstHierarchyTypes
 * @argument : 
 * @returns
 */
module.exports.getClientmstHierarchyTypes = async (clientId, hmId) => {
    try {
        let sql = `SELECT dlocation_mstHierarchyTypes.hierarchyTypeId, dlocation_mstHierarchyTypes.hmTypDesc, dlocation_mstHierarchyTypes.SlNo 
        FROM dlocation_mstHierarchyTypes 
        WHERE dlocation_mstHierarchyTypes.clientId = ?
        AND dlocation_mstHierarchyTypes.hmId = ? 
        AND dlocation_mstHierarchyTypes.status = 1 
        ORDER BY dlocation_mstHierarchyTypes.SlNo ASC`;

        const [resp] = await readConn.query(sql, [clientId, hmId]);
        return resp;

    } catch (e) {
        util.createLog(e);
        return false;
    }
}

/**
 * @author : Sourav Bhoumik
 * @date : 16/06/2023
 * @description : get all HierarchyTypes name of mstHierarchyTypes
 * @argument : 
 * @returns
 */
module.exports.getHierarchyTypesName = async (data) => {
    try {
        let sql = `SELECT hierarchyDataId, hmName, mstHierarchyTypeId 
        FROM dlocation_mstHierarchyData 
        WHERE clientId = ?
        AND hmId = ? 
        AND mstHierarchyTypeId = ? 
        ORDER BY hierarchyDataId  DESC`;

        const [resp] = await readConn.query(sql, [data.clientId, data.hmTYpeId, data.hierarchyTypeId]);
        return resp;

    } catch (e) {
        util.createLog(e);
        return false;
    }
}

/**
 * @author : Sourav Bhoumik
 * @date : 16/06/2023
 * @description : get all mapped zone for user
 * @argument : 
 * @returns
 */
module.exports.getUserhierarchyDataIdAll = async (clientId, userId) => {
    try {
        let sql = `SELECT DISTINCT hierarchyDataId FROM clientLocationMap WHERE clientId = ? AND tableName = 'user' AND refId = ? AND status = 1`;

        const [resp] = await readConn.query(sql, [clientId, userId]);
        return resp.length > 0 ? resp : [];

    } catch (e) {
        util.createLog(e);
        return false;
    }
}


/**
 * @author : Sourav Bhoumik
 * @date : 19/06/2023
 * @description : get last level Hierarchy Types
 * @argument : 
 * @returns
 */
module.exports.getClientLocationLastLevelDataTypeId = async (clientId, hmId) => {
    try {
        let sql = `SELECT hierarchyTypeId, hmTypDesc, SlNo  FROM dlocation_mstHierarchyTypes WHERE clientId = ? AND status = 1 AND hmId = ? ORDER BY SlNo  DESC LIMIT 1`;

        const [resp] = await readConn.query(sql, [clientId, hmId]);

        return resp.length > 0 ? resp : [];

    } catch (e) {
        util.createLog(e);
        return false;
    }
}


module.exports.getImmediateLocationChilds = async (clientId, hierarchyTypeId, hierarchyDataIdArr, hmTypId) => {
    try {
        // let sql = `SELECT hierarchyDataId, hmName, mstHierarchyTypeId  FROM dlocation_mstHierarchyData WHERE clientId = ? AND hmId = 1 AND parentHMtypId = ? AND parentHMId = ? AND status = 1 ORDER BY hmName ASC`

        let params = [];

        let sql = `SELECT dlocation_mstHierarchyData.hierarchyDataId, dlocation_mstHierarchyData.hmName, dlocation_mstHierarchyData.mstHierarchyTypeId, dlocation_mstHierarchyTypes.hmTypDesc AS hmTypeName 
        FROM dlocation_mstHierarchyData, dlocation_mstHierarchyTypes 
        WHERE dlocation_mstHierarchyData.clientId = ? 
        AND dlocation_mstHierarchyData.hmId = ? 
        AND dlocation_mstHierarchyData.parentHMtypId = ?  
        AND dlocation_mstHierarchyData.status = 1 
        AND dlocation_mstHierarchyTypes.clientId = ? 
        AND dlocation_mstHierarchyData.mstHierarchyTypeId = dlocation_mstHierarchyTypes.hierarchyTypeId`

        params.push(clientId)
        params.push(hmTypId)
        params.push(hierarchyTypeId)
        params.push(clientId)


        sql += " AND dlocation_mstHierarchyData.parentHMId IN (" + hierarchyDataIdArr.join(',') + ")"

        let [result] = await writeConn.query(sql, params);

        return result
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

/**
 * @author : Sourav Bhoumik
 * @date : 19/06/2023
 * @description : add generic location data
 * @argument : clientId, roleId, userId
 * @returns : token
 */

module.exports.addGenericClientLocation = async (data, insertId, tableName) => {
    try {

        let date_ob = '';

        if (data.currentDateTime === undefined || data.currentDateTime == "" || data.currentDateTime == null) {

            date_ob = new Date();

        } else {
            date_ob = new Date(data.currentDateTime)
        }

        // let date_ob = new Date();

        let date = ("0" + date_ob.getDate()).slice(-2);
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        let year = date_ob.getFullYear();
        let hours = date_ob.getHours();
        let minutes = date_ob.getMinutes();
        let seconds = date_ob.getSeconds();

        let currentDateTime = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds

        let updateSql = "UPDATE clientLocationMap SET status=2 WHERE refId = ? AND tableName = ?"
        const [updateResp] = await readConn.query(updateSql, [insertId, tableName]);


        let sql = "INSERT INTO clientLocationMap (clientId, tableName, refId, mstHierarchyTypeId, hierarchyDataId, status, assignedBy,createDate) VALUES (?,?,?,?,?,?,?,?)";

        const [resp] = await writeConn.query(sql, [data.clientId, tableName, insertId, data.hierarchyTypeId, data.hierarchyDataId, 1, data.userId, currentDateTime]);
        return resp.insertId;

    } catch (err) {

        util.createLog(err);
        return false;
    }
}

module.exports.addGenericClientLocationNotUpdate = async (data, insertId, tableName) => {
    try {

        let sql = "INSERT INTO clientLocationMap (clientId, tableName, refId, mstHierarchyTypeId, hierarchyDataId, status, assignedBy) VALUES (?,?,?,?,?,?,?)";

        const [resp] = await writeConn.query(sql, [data.clientId, tableName, insertId, data.hierarchyTypeId, data.hierarchyDataId, 1, data.userId]);
        return resp.insertId;

    } catch (err) {

        util.createLog(err);
        return false;
    }
}


module.exports.addGenericClientLocationNotUpdateClieniSepcs = async (data, data1, insertId, tableName) => {
    try {

        let date_ob = '';

        if (data.currentDateTime === undefined || data.currentDateTime == "" || data.currentDateTime == null) {

            date_ob = new Date();

        } else {
            date_ob = new Date(data.currentDateTime)
        }

        // let date_ob = new Date();

        let date = ("0" + date_ob.getDate()).slice(-2);
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        let year = date_ob.getFullYear();
        let hours = date_ob.getHours();
        let minutes = date_ob.getMinutes();
        let seconds = date_ob.getSeconds();

        let currentDateTime = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds

        let sql = "INSERT INTO clientLocationMap (clientId, tableName, refId, mstHierarchyTypeId, hierarchyDataId, status, assignedBy,createDate) VALUES (?,?,?,?,?,?,?,?)";

        const [resp] = await writeConn.query(sql, [data.clientId, tableName, insertId, data1.hierarchyTypeId, data1.hierarchyDataId, 1, data.userId, currentDateTime]);
        return resp.insertId;

    } catch (err) {

        util.createLog(err);
        return false;
    }
}

module.exports.addGenericClientLocationNotUpdateClieniSepcsV2 = async (data, data1, insertId, tableName) => {
    try {

        let date_ob = '';

        if (data.currentDateTime === undefined || data.currentDateTime == "" || data.currentDateTime == null) {

            date_ob = new Date();

        } else {
            date_ob = new Date(data.currentDateTime)
        }

        // let date_ob = new Date();

        let date = ("0" + date_ob.getDate()).slice(-2);
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        let year = date_ob.getFullYear();
        let hours = date_ob.getHours();
        let minutes = date_ob.getMinutes();
        let seconds = date_ob.getSeconds();

        let currentDateTime = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds

        let sql = "INSERT INTO clientLocationMap (clientId, tableName, refId, mstHierarchyTypeId, hierarchyDataId, status, assignedBy,createDate) VALUES (?,?,?,?,?,?,?,?)";

        const [resp] = await writeConn.query(sql, [data.clientId, tableName, insertId, data1.hierarchyTypeId, data1.hierarchyDataId, 1, data.systemUserId, currentDateTime]);
        return resp.insertId;

    } catch (err) {

        util.createLog(err);
        return false;
    }
}

module.exports.addGenericClientLocationWithUpdateClieniSepcs = async (data, data1, insertId, tableName) => {
    try {

        let date_ob = '';

        if (data.currentDateTime === undefined || data.currentDateTime == "" || data.currentDateTime == null) {

            date_ob = new Date();

        } else {
            date_ob = new Date(data.currentDateTime)
        }

        // let date_ob = new Date();

        let date = ("0" + date_ob.getDate()).slice(-2);
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        let year = date_ob.getFullYear();
        let hours = date_ob.getHours();
        let minutes = date_ob.getMinutes();
        let seconds = date_ob.getSeconds();

        let currentDateTime = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds

        let updateSql = "UPDATE clientLocationMap SET status=2 WHERE refId = ? AND tableName = ?"
        const [updateResp] = await readConn.query(updateSql, [insertId, tableName]);

        let sql = "INSERT INTO clientLocationMap (clientId, tableName, refId, mstHierarchyTypeId, hierarchyDataId, status, assignedBy,createDate) VALUES (?,?,?,?,?,?,?,?)";

        const [resp] = await writeConn.query(sql, [data.clientId, tableName, insertId, data1.hierarchyTypeId, data1.hierarchyDataId, 1, data.userId, currentDateTime]);
        return resp.insertId;

    } catch (err) {

        util.createLog(err);
        return false;
    }
}




module.exports.getUserAllLastLevelLocationData = async (clientId, userId) => {
    try {
        let sql = `SELECT DISTINCT clientLocationMap.hierarchyDataId, clientLocationMap.mstHierarchyTypeId 
        FROM clientLocationMap 
        WHERE clientLocationMap.clientId = ? 
        AND clientLocationMap.tableName = 'user' 
        AND clientLocationMap.refId = ? 
        AND clientLocationMap.status = 1`

        let [result, fields] = await writeConn.query(sql, [clientId, userId]);
        return result
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.getCustomerAllLastLevelLocationData = async (clientId, customerId) => {
    try {
        let sql = `SELECT DISTINCT clientLocationMap.hierarchyDataId, clientLocationMap.mstHierarchyTypeId 
        FROM clientLocationMap 
        WHERE clientLocationMap.clientId = ? 
        AND clientLocationMap.tableName = 'clientCustomer' 
        AND clientLocationMap.refId = ? 
        AND clientLocationMap.status = 1`

        let [result, fields] = await writeConn.query(sql, [clientId, customerId]);
        return result
    } catch (e) {
        util.createLog(e);
        return false;
    }
}


module.exports.getAllUserData = async (clientId, offset) => {
    try {
        let sql = "SELECT *  FROM haldiram_RAWDistributerMaster LIMIT 1 OFFSET " + offset + ""

        let [result, fields] = await writeConn.query(sql, [clientId]);
        return result
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.getUserResionDataType = async (clientId, region, mstHierarchyTypeId, hmId) => {
    try {
        let sql = `SELECT *  FROM dlocation_mstHierarchyData WHERE clientId = ? AND hmId = ? AND mstHierarchyTypeId = ? AND hmName = ?`

        let [result, fields] = await writeConn.query(sql, [clientId, hmId, mstHierarchyTypeId, region]);
        return result
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.insertIntoLocatioTable = async (clientId, refId, tableName, hierarchyTypeId, hierarchyDataId) => {
    try {

        let sql = "INSERT INTO clientLocationMap (clientId, tableName, refId, mstHierarchyTypeId, hierarchyDataId, status, assignedBy) VALUES (?,?,?,?,?,?,?)";

        const [resp] = await writeConn.query(sql, [clientId, tableName, refId, hierarchyTypeId, hierarchyDataId, 1, 1768]);
        return resp.insertId;

    } catch (err) {

        util.createLog(err);
        return false;
    }
}



module.exports.insercustomer = async (data, clientId) => {
    try {

        let sql = "INSERT INTO clientCustomer(tempId, clientId, custBusinessName, ERPCode, primaryCustomer, firstName, phoneNumber, email, title, contactTypeId, businessType, address, description, profilePic, approvedStatus, approvedBy, approvedDatetime, approvedRemarks,pincode, landmark, yrOfEstablmnt, createdBy, primaryitem, visitDate, tempTableName, organizationId) VALUES  (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

        const [resp] = await writeConn.query(sql, [data.id, clientId, null, data.DistributorErpId, 1, data.DistributorName, data.DistributorContactNumber, data.DistributorSecondaryEmailId, data.DistributorType, data.contactTypeId, 1, data.tempRegion, data.DistributorType, "/images/business.jpg", 1, 1769, null, "Approved by system admin", data.PinCode, data.Address, data.tempCreatedDateMod, 1768, 0, data.tempCreatedDateMod, "haldiram_RAWDistributerMaster", 167512]);
        return resp.insertId;

    } catch (err) {

        util.createLog(err);
        return false;
    }
}

/**
 * @author : Sukanta Samanta
 * @date : 23/06/2023
 * @description : get Location Data By Table Name
 * @argument : refId, clientId, tableName
 * @returns : token
 */

module.exports.getLocationDataByTableName = async (refId, clientId, tableName) => {
    try {
        let sql = `SELECT clm.hierarchyDataId, clm.mstHierarchyTypeId FROM clientLocationMap AS clm WHERE clm.refId = ? AND clm.clientId = ? AND clm.tableName = ? AND clm.status = '1'`;
        const [resp] = await readConn.query(sql, [refId, clientId, tableName]);
        return resp;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}


/**
 * @author : Sukanta Samanta
 * @date : 24/06/2023
 * @description : get Daily Activity list
 * @argument : 
 * @returns
 */
module.exports.getDailyActivities = async (data) => {
    try {
        let sql = `SELECT activityId,activityName FROM mstDailyActivities WHERE clientId= ? AND status = '1'`;
        const [resp] = await readConn.query(sql, [data.clientId]);
        return resp;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

/**
 * @author : Sukanta Samanta
 * @date : 29/06/2023
 * @description : get type of Item by hierarchyType
 * @argument : 
 * @returns
 */
module.exports.getTypeOfItemFromHierarchyType = async (data) => {
    try {
        let sql = `SELECT dlocation_mstHierarchy.hmName, dlocation_mstHierarchy.hmId 
        FROM dlocation_mstHierarchyTypes, dlocation_mstHierarchy 
        WHERE dlocation_mstHierarchyTypes.hierarchyTypeId = ?
        AND dlocation_mstHierarchyTypes.clientId = ? 
        AND dlocation_mstHierarchyTypes.status = 1 
        AND dlocation_mstHierarchyTypes.hmId = dlocation_mstHierarchy.hmId`;
        const [resp] = await readConn.query(sql, [data.hierarchyTypeId, data.clientId]);
        return resp;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

/**
 * @author : SKH
 * @date : 11/07/2023
 * @description : get All Measurements units list
 * @argument : type (	1=branding, 2=items,3=expenses)
 * @returns : ListData
 */
module.exports.getAllMeasurementUnitList = async (data) => {
    try {
        // let sql = `SELECT id, unitName, unitShort FROM mstMeasurementUnits WHERE unitType= ? AND status = '1'`;
        // const [resp] = await readConn.query(sql, [data.type]);
        let sql = `SELECT id, unitName, unitShort FROM mstMeasurementUnits WHERE clientId=? AND unitType= ? AND status = '1'`;
        const [resp] = await readConn.query(sql, [data.clientId,data.type]);
        return resp;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

/**
 * @author : Sourav Bhoumik
 * @date : 17/07/2023
 * @description : insert user activity data
 * @argument : 
 * @returns : input
 */

module.exports.addUserActivityRoute = async (data, insertId, tableName, activityDetails) => {
    try {

        let currentDate = '';

        if (data.currentDateTime === undefined || data.currentDateTime == "" || data.currentDateTime == null) {
            currentDate = new Date();

        } else {
            currentDate = new Date(data.currentDateTime)
        }

        let year = currentDate.getFullYear();
        let month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
        let day = ("0" + currentDate.getDate()).slice(-2);

        let timeHours = ("0" + currentDate.getHours()).slice(-2);
        let timeMinutes = ("0" + currentDate.getMinutes()).slice(-2);
        let seconds = ("0" + currentDate.getSeconds()).slice(-2);

        data.today_datetime = year + '-' + month + '-' + day + ' ' + timeHours + ':' + timeMinutes + ':' + seconds;



        let sql = "INSERT INTO userActivityRoute (clientId,userId,refTable, refId,activityDetails,status, createdAt) VALUES (?,?,?,?,?,?,?)";
        const [resp, fields] = await writeConn.query(sql, [data.clientId, data.userId, tableName, insertId, activityDetails, 1, data.today_datetime]);
        return resp.insertId;
    } catch (e) {
        // util.createLog(e);
        return false;
    }
}


/**
 * @author : Sourav Bhoumik
 * @date : 19/07/2023
 * @description : insert into clientDownloadList download list
 * @argument : 
 * @returns : input
 */

module.exports.addIntoClientDownloadList = async (clientId, userId, fileName, purpose, createdAt) => {
    try {
        let sql = "INSERT INTO clientDownloadList (clientId,userId,fileName, purpose,createdAt) VALUES (?,?,?,?,?)";
        const [resp, fields] = await writeConn.query(sql, [clientId, userId, fileName, purpose, createdAt]);
        return true;
    } catch (e) {
        // util.createLog(e);
        return false;
    }
}

module.exports.addIntoClientDownloadListV2 = async (clientId, userId, fileName, purpose, createdAt, moduleName) => {
    try {
        let sql = "INSERT INTO clientDownloadList (clientId,userId,fileName, purpose,createdAt, module) VALUES (?,?,?,?,?,?)";
        const [resp, fields] = await writeConn.query(sql, [clientId, userId, fileName, purpose, createdAt, moduleName]);
        return true;
    } catch (e) {
        // util.createLog(e);
        return false;
    }
}


/**
 * @author : sourav bhoumik
 * @date : 19/07/2023
 * @description : get All download list
 * @argument : clientId, userId
 * @returns : ListData
 */
module.exports.getAllDownloadList = async (data) => {
    try {
        let queryparams = [];
        let sql = `SELECT clientDownloadList.fileName, clientDownloadList.purpose, clientDownloadList.createdAt,DATE_FORMAT(clientDownloadList.createdAt, '%Y-%m-%d %r') AS createDateTime, clientDownloadList.downloadStatus FROM clientDownloadList WHERE  clientDownloadList.status = 1 AND clientDownloadList.userId = ? AND clientDownloadList.clientId = ?`;


        // let sql = `SELECT clientDownloadList.fileName, clientDownloadList.purpose, clientDownloadList.createdAt,DATE_FORMAT(clientDownloadList.createdAt, '%Y-%m-%d %r') AS createDateTime, '2' downloadStatus FROM clientDownloadList WHERE  clientDownloadList.status = 1 AND clientDownloadList.userId = ? AND clientDownloadList.clientId = ?`;


        queryparams.push(data.userId)
        queryparams.push(data.clientId)

        if (data.moduleType !== undefined && data.moduleType != "" && data.moduleType != null) {

            sql += " AND clientDownloadList.module = ?"
            queryparams.push(data.moduleType)
        }

        sql += "  ORDER BY clientDownloadList.id DESC"


        if (data.limit != undefined && data.limit != null && data.limit != '') {
            data.offset === '' ? 0 : data.offset
            sql = sql + ' LIMIT ? OFFSET ?'
            queryparams.push(Number(data.limit), Number(data.offset));
        }

        const [resp] = await readConn.query(sql, queryparams);
        return resp;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.getAllDownloadProcessList = async (data) => {
    try {

        let queryparams = []
        let sql = `(SELECT clientDownloadList.fileName, clientDownloadList.purpose, clientDownloadList.createdAt,DATE_FORMAT(clientDownloadList.createdAt, '%Y-%m-%d %r') AS createDateTime, '2' downloadStatus FROM clientDownloadList WHERE  clientDownloadList.status = 1 AND clientDownloadList.userId = ? AND clientDownloadList.clientId = ?`;


        queryparams.push(data.userId)
        queryparams.push(data.clientId)

        if (data.moduleType !== undefined && data.moduleType != "" && data.moduleType != null) {

            sql += " AND clientDownloadList.module = ?"
            queryparams.push(data.moduleType)
        }

        sql += "  ORDER BY clientDownloadList.id DESC)"



        sql += ` UNION (SELECT clientDownloadProcessList.fileName, clientDownloadProcessList.purpose, clientDownloadProcessList.createdAt,DATE_FORMAT(clientDownloadProcessList.createdAt, '%Y-%m-%d %r') AS createDateTime, clientDownloadProcessList.processStatus as downloadStatus FROM clientDownloadProcessList WHERE  clientDownloadProcessList.status = 1 AND clientDownloadProcessList.userId = ? AND clientDownloadProcessList.clientId = ?`;
        queryparams.push(data.userId)
        queryparams.push(data.clientId)

        if (data.moduleType !== undefined && data.moduleType != "" && data.moduleType != null) {

            sql += " AND clientDownloadProcessList.module = ?"
            queryparams.push(data.moduleType)
        }

        sql += "  ORDER BY clientDownloadProcessList.id DESC) ORDER BY `createdAt` DESC "


        if (data.limit != undefined && data.limit != null && data.limit != '') {
            data.offset === '' ? 0 : data.offset
            sql = sql + ' LIMIT ? OFFSET ?'
            queryparams.push(Number(data.limit), Number(data.offset));
        }

        const [resp] = await readConn.query(sql, queryparams);
        return resp;
    } catch (e) {
        util.createLog(e);
        throw e
    }
}




/**
 * @author : Poritosh Byapari
 * @date : 08/03/2024
 * @description : Get download list Status
 * @argument : 
 * @returns : input
 */
module.exports.getDownloadProcessStatus = async (data) => {
    try {

        let queryparams = []
        let sql = `SELECT '2' downloadStatus, clientDownloadList.createdAt FROM clientDownloadList WHERE  clientDownloadList.status = 1 AND clientDownloadList.userId = ? AND clientDownloadList.clientId = ? AND clientDownloadList.purpose = ?`;
        queryparams.push(data.userId)
        queryparams.push(data.clientId)
        queryparams.push(data.purpose)

        // if (data.moduleType !== undefined && data.moduleType != "" && data.moduleType != null) {
        //     sql += " AND clientDownloadList.module = ?"
        //     queryparams.push(data.moduleType)
        // }

        sql += "  ORDER BY clientDownloadList.createdAt DESC LIMIT 1"

        const [resp] = await readConn.query(sql, queryparams);


        let queryparams2 = []
        let sql2 = `SELECT clientDownloadProcessList.processStatus as downloadStatus, clientDownloadProcessList.createdAt FROM clientDownloadProcessList WHERE  clientDownloadProcessList.status = 1 AND clientDownloadProcessList.userId = ? AND clientDownloadProcessList.clientId = ? AND clientDownloadProcessList.purpose = ?`;
        queryparams2.push(data.userId)
        queryparams2.push(data.clientId)
        queryparams2.push(data.purpose)

        // if (data.moduleType !== undefined && data.moduleType != "" && data.moduleType != null) {
        //     sql2 += " AND clientDownloadProcessList.module = ?"
        //     queryparams2.push(data.moduleType)
        // }

        sql2 += "  ORDER BY clientDownloadProcessList.createdAt DESC LIMIT 1"


        const [resp2] = await readConn.query(sql2, queryparams2);

        return [resp, resp2];
    } catch (e) {
        util.createLog(e);
        throw e
    }
}

/**
 * @author : Poritosh Byapari
 * @date : 28/02/2024
 * @description : insert into clientDownloadProcessList download list
 * @argument : 
 * @returns : input
 */
module.exports.addClientReportDownloadProcessList = async (clientId, userId, purpose, createdAt, moduleName, reqBody) => {
    try {
        let sql = "INSERT INTO clientDownloadProcessList (clientId, userId, purpose, createdAt, module, requestBody) VALUES (?,?,?,?,?,?)";
        const [resp, fields] = await writeConn.query(sql, [clientId, userId, purpose, createdAt, moduleName, JSON.stringify(reqBody)]);
        return true;
    } catch (e) {
        // util.createLog("addClientReportDownloadProcessList err",e);
        return false;
    }
}


/**
 * @author : Sourav Bhoumik
 * @date : 05/09/2023
 * @description : get token for external enquery
 * @argument : clientId, roleId, userId
 * @returns : token
 */

module.exports.ifClientExsist = async (clientId) => {
    try {
        const sql = "SELECT clientId FROM mstClient WHERE clientId = ? AND isActive = '1' AND deleted = '0'";
        const [resp] = await readConn.query(sql, [clientId]);

        return resp.length > 0 ? '1' : '0'
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.ifUserExsist = async (clientId, userId) => {
    try {
        const sql = "SELECT userId FROM user WHERE clientId = ? AND isActive = 1 AND deleted = 0 AND userType = '3' AND userId = ?";
        const [resp] = await readConn.query(sql, [clientId, userId]);
        return resp.length > 0 ? '1' : '0'
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.ifRoleExsist = async (clientId, roleId) => {
    try {
        const sql = "SELECT id FROM userRoles WHERE clientId = ? AND status = 1 AND id = ?";
        const [resp] = await readConn.query(sql, [clientId, roleId]);
        return resp.length > 0 ? '1' : '0'
    } catch (e) {
        util.createLog(e);
        return false;
    }
}


module.exports.getAllComapnys = async (data) => {
    try {
        const sql = "SELECT clientId, shortCode FROM mstClient";
        const [resp] = await readConn.query(sql);
        return resp;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}



module.exports.updateSatasdfe = async (clientId, clientSecret, companyKey) => {
    try {
        const sql = "UPDATE mstClient SET clientSecret = ?, companyKey = ? WHERE clientId = ?"
        const [res] = await writeConn.query(sql, [clientSecret, companyKey, clientId])

        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.getAllLastLevelDataForUser = async (data) => {
    try {
        const sql = `SELECT dlocation_mstHierarchyData.hmName, dlocation_mstHierarchyData.hierarchyDataId, clientLocationMap.mstHierarchyTypeId AS hierarchyTypeId 
                FROM clientLocationMap, dlocation_mstHierarchyData 
                WHERE clientLocationMap.clientId = ?
                AND clientLocationMap.tableName = 'user' 
                AND clientLocationMap.refId = ? 
                AND clientLocationMap.status = 1 
                AND clientLocationMap.hierarchyDataId = dlocation_mstHierarchyData.hierarchyDataId`;

        const [resp] = await readConn.query(sql, [data.clientId, data.userId]);
        return resp;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}


module.exports.empsMappedHigherLevelProducts = async (data) => {
    try {
        // const sql = `SELECT hierarchyTypeId, hierarchyDataId FROM clientProductMap WHERE clientId = ? AND tableName = 'user' AND refId = ? AND hmId = 2 AND status = 1`;

        let sql = `SELECT dlocation_mstHierarchyData.hierarchyDataId AS id, dlocation_mstHierarchyData.hmName AS name, dlocation_mstHierarchyData.mstHierarchyTypeId AS typeId, dlocation_mstHierarchyTypes.hmTypDesc AS typeName, dlocation_mstHierarchyTypes.SlNo AS slNo, dlocation_mstHierarchyData.parentHMtypId, dlocation_mstHierarchyData.parentHMId, dlocation_mstHierarchyData.leafLevel 
                FROM clientProductMap, dlocation_mstHierarchyData, dlocation_mstHierarchyTypes 
                WHERE clientProductMap.clientId = ? 
                AND clientProductMap.tableName = 'user' 
                AND clientProductMap.refId = ? 
                AND clientProductMap.hmId = 2 
                AND clientProductMap.status = 1
                AND clientProductMap.hierarchyDataId = dlocation_mstHierarchyData.hierarchyDataId 
                AND dlocation_mstHierarchyData.clientId = ?
                AND dlocation_mstHierarchyData.hmId = 2 
                AND dlocation_mstHierarchyData.status = 1 
                AND dlocation_mstHierarchyData.mstHierarchyTypeId = dlocation_mstHierarchyTypes.hierarchyTypeId`

        const [resp] = await readConn.query(sql, [data.clientId, data.userId, data.clientId]);
        return resp;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}


module.exports.getChildData = async (dataMain, data) => {
    try {

        let sql = `SELECT dlocation_mstHierarchyData.hierarchyDataId AS id, dlocation_mstHierarchyData.hmName AS name, dlocation_mstHierarchyData.mstHierarchyTypeId AS typeId, dlocation_mstHierarchyTypes.hmTypDesc AS typeName, dlocation_mstHierarchyTypes.SlNo AS slNo, dlocation_mstHierarchyData.parentHMtypId, dlocation_mstHierarchyData.parentHMId, dlocation_mstHierarchyData.leafLevel 
                FROM dlocation_mstHierarchyData, dlocation_mstHierarchyTypes 
                WHERE dlocation_mstHierarchyData.parentHMId = ?
                AND dlocation_mstHierarchyData.parentHMtypId = ?
                AND dlocation_mstHierarchyData.clientId = ?
                AND dlocation_mstHierarchyData.hmId = 2 
                AND dlocation_mstHierarchyData.status = 1 
                AND dlocation_mstHierarchyData.mstHierarchyTypeId = dlocation_mstHierarchyTypes.hierarchyTypeId`

        const [resp] = await readConn.query(sql, [data.id, data.typeId, dataMain.clientId]);

        return resp;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}


module.exports.getChildDataAttributes = async (dataMain, data) => {
    try {

        let sql = `SELECT dlocation_hierarchyAttributeTypes.hierarchyAttributeTypId, dlocation_hierarchyAttributeTypes.attributeTyesDesc, dlocation_hierarchyAttributes.attributeValue, dlocation_hierarchyAttributes.attributeDataValueId,dlocation_hierarchyAttributes.hierarchyDataId
            FROM dlocation_hierarchyAttributes 
            LEFT JOIN dlocation_hierarchyAttributeTypes ON dlocation_hierarchyAttributes.hierarchyAttributeTypId = dlocation_hierarchyAttributeTypes.hierarchyAttributeTypId 
            WHERE dlocation_hierarchyAttributes.clientId = ? 
            AND dlocation_hierarchyAttributes.hierarchyDataId = ? 
            AND dlocation_hierarchyAttributes.status = 1
            AND dlocation_hierarchyAttributeTypes.status = 1`

        const [resp] = await readConn.query(sql, [dataMain.clientId, data.id]);
        return resp;
    } catch (e) {
        util.createLog(e);

        return false;
    }
}


module.exports.visitStatusListing = async (data) => {
    try {

        let sql = `SELECT id, clientId, name, SlNo  FROM mstVisitStatus WHERE clientId = ? AND status = 1`

        const [resp] = await readConn.query(sql, [data.clientId]);
        return resp;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}


module.exports.getVisitFeedbackCategoryData = async (data) => {
    try {

        let sql = `SELECT id, feedbackCategory, clientId FROM mstVisitFeedbackCategories WHERE clientId = ? AND status = 1`

        const [resp] = await readConn.query(sql, [data.clientId]);
        return resp;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.getVisitSubCtegoryByCategpory = async (data) => {
    try {

        let sql = `SELECT id, clientId, feedbackCategoryId, feedbackSubCategory FROM mstVisitFeedbackSubCategories WHERE clientId = ? AND feedbackCategoryId = ? AND status = 1`

        const [resp] = await readConn.query(sql, [data.clientId, data.id]);
        return resp;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}



/**
 * @author : Prosenjit Paul
 * @date : 06/12/23
 * @date :  add into calendar Activity
 * @argument : 
 * @returns : 
 */


module.exports.addIntoCalendarActivity = async (data, tableName, refId) => {
    try {

        let sql = "INSERT INTO calenderActivity (clientId,userId,eventName,description,refTable,refId,serviceType,date,time) VALUES(?,?,?,?,?,?,?,?,?) "
        const [result] = await writeConn.query(sql, [data.clientId, data.userId, data.eventName, data.description, tableName, refId, data.serviceType, data.date, data.time])
        return true;

    } catch (e) {
        util.createLog(e);
        return false;
    }
}

/**
 * @author : Prosenjit Paul
 * @date : 06/12/23
 * @date :  delete into calendar Activity
 * @argument : 
 * @returns : 
 */

module.exports.updateIntoCalendarActivity = async (data) => {
    try {
        let sql = "UPDATE calenderActivity  SET  status = 2 WHERE  refId =?  AND clientId = ?"
        const [result] = await writeConn.query(sql, [data.taskId, data.clientId]);
        return true;
    } catch (e) {

        util.createLog(e);
        return false;
    }
}


/**
 * @author : Sourab Bhoumik
 * @date : 11/12/2023
 * @date :  get location specific subordinates
 * @argument : 
 * @returns : 
 */

module.exports.getUserSubordinateAsPerLocations = async (data) => {
    try {

        let params = [];

        let sql = `SELECT DISTINCT clientEntityHierarchy.childId, user.firstName
 
                FROM clientEntityHierarchy,clientLocationMap, user 

                WHERE clientEntityHierarchy.clientId = ? 
                AND clientEntityHierarchy.parentId = ? 
                AND clientEntityHierarchy.parentTable = 'user' 
                AND clientEntityHierarchy.childTable = 'user' 
                AND clientEntityHierarchy.status = 1
                AND clientEntityHierarchy.childId = clientLocationMap.refId
                AND clientLocationMap.clientId = ?
                AND clientLocationMap.tableName = 'user'
                AND clientLocationMap.status = 1
                AND clientEntityHierarchy.childId = user.userId `

        params.push(data.clientId)
        params.push(data.userId)
        params.push(data.clientId)

        if (data.finalSearchIdArr !== undefined && data.finalSearchIdArr != "" && data.finalSearchIdArr.length > 0) {

            sql += " AND clientLocationMap.hierarchyDataId IN (" + data.finalSearchIdArr.join(',') + ")";

        }

        if (data.searchName !== undefined && data.searchName != '' && data.searchName != null) {

            sql += " AND ( user.firstName LIKE ? OR user.lastName LIKE ? OR CONCAT(COALESCE(user.firstName, ''),' ', COALESCE(user.lastName, '')) LIKE ? )"

            params.push('%' + data.searchName + '%')
            params.push('%' + data.searchName + '%')
            params.push('%' + data.searchName + '%')
        }


        const [resp] = await readConn.query(sql, params);
        return resp;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}



/**
 * @author : Sourav Bhoumik
 * @date : 12/02/2024
 * @date :  get location specific customer if any
 * @argument : 
 * @returns : 
 */

module.exports.getCustomerAddressIfAnyUpdates = async (lattitude, longitude, customerId, clientId, currentDateTime) => {
    try {

        let params = [];

        let sql = `SELECT address  FROM clientCustomer WHERE customerId = ? AND clientId = ? `

        params.push(customerId)
        params.push(clientId)
        const [resp] = await readConn.query(sql, params);

        let address = '';

        if (resp.length > 0) {
            if (resp[0].address != null) {

                address = resp[0].address;

            }
        }

        if (address == '') {

            let address = await util.getLocationNameFromLatLng(lattitude, longitude);

            let updateCustAddressSql = "UPDATE clientCustomer SET address = ?, geoLocation = ? WHERE customerId = ? AND clientId = ?";
            const [updateCustAddressSql_res] = await writeConn.query(updateCustAddressSql, [address, address, customerId, clientId]);

            let checkSql = "SELECT * FROM activityLocation WHERE refId = ? AND tableName = ? AND isLatest = 1"
            const [checkresp] = await writeConn.query(checkSql, [customerId, "clientCustomer"]);

            if (checkresp.length == 0) {
                let sql = "INSERT INTO activityLocation (tableName, refId, lat, lng, address, createDate) VALUES (?,?,?,?,?,?)";
                const [resp] = await writeConn.query(sql, ["clientCustomer", customerId, lattitude, longitude, address, currentDateTime]);
            } else {
                let exsistId = checkresp[0].id
                let sql = "INSERT INTO activityLocation (tableName, refId, lat, lng, address, createDate) VALUES (?,?,?,?,?,?)";
                const [resp] = await writeConn.query(sql, ["clientCustomer", customerId, lattitude, longitude, address, currentDateTime]);
                let sqlUp = "UPDATE activityLocation SET isLatest = 0 WHERE id = ?";
                const [respUp] = await writeConn.query(sqlUp, [exsistId]);
            }

        }

        return address;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}


module.exports.getContactAddressIfAnyUpdates = async (lattitude, longitude, customerId, clientId, currentDateTime) => {
    try {

        let params = [];

        let sql = `SELECT address  FROM contactManagement WHERE contactId = ? AND clientId = ? `

        params.push(customerId)
        params.push(clientId)
        const [resp] = await readConn.query(sql, params);

        let address = '';

        if (resp.length > 0) {
            if (resp[0].address != null) {

                address = resp[0].address;

            }
        }

        if (address == '') {

            let address = await util.getLocationNameFromLatLng(lattitude, longitude);

            let updateCustAddressSql = "UPDATE contactManagement SET address = ?, goLocation = ? WHERE contactId = ? AND clientId = ?";
            const [updateCustAddressSql_res] = await writeConn.query(updateCustAddressSql, [address, address, customerId, clientId]);

            let checkSql = "SELECT * FROM activityLocation WHERE refId = ? AND tableName = ? AND isLatest = 1"
            const [checkresp] = await writeConn.query(checkSql, [customerId, "contactManagement"]);

            if (checkresp.length == 0) {
                let sql = "INSERT INTO activityLocation (tableName, refId, lat, lng, address, createDate) VALUES (?,?,?,?,?,?)";
                const [resp] = await writeConn.query(sql, ["contactManagement", customerId, lattitude, longitude, address, currentDateTime]);
            } else {
                let exsistId = checkresp[0].id
                let sql = "INSERT INTO activityLocation (tableName, refId, lat, lng, address, createDate) VALUES (?,?,?,?,?,?)";
                const [resp] = await writeConn.query(sql, ["contactManagement", customerId, lattitude, longitude, address, currentDateTime]);
                let sqlUp = "UPDATE activityLocation SET isLatest = 0 WHERE id = ?";
                const [respUp] = await writeConn.query(sqlUp, [exsistId]);
            }

        }

        return address;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}


module.exports.addIntoClientDownloadProcessListV4 = async (clientId, userId, purpose, createdAt, moduleName, data) => {
    try {
        let sql = "INSERT INTO clientDownloadProcessList (clientId,userId, purpose,createdAt, module,processStatus,requestBody) VALUES (?,?,?,?,?,?,?)";
        const [resp] = await writeConn.query(sql, [clientId, userId, purpose, createdAt, moduleName, 1, JSON.stringify(data)]);
        return resp.insertId;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}


module.exports.updateIntoClientDownloadProcessListV4 = async (fileName, id) => {
    try {
        let currentDate = new Date();
        // Add 5 hours and 30 minutes
        currentDate.setHours(currentDate.getHours() + 5);
        currentDate.setMinutes(currentDate.getMinutes() + 30);
        let date = ("0" + currentDate.getDate()).slice(-2);
        let month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
        let year = currentDate.getFullYear();
        let hours = ("0" + currentDate.getHours()).slice(-2);
        let minutes = ("0" + currentDate.getMinutes()).slice(-2);
        let seconds = ("0" + currentDate.getSeconds()).slice(-2);
        let currentDateTime = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;

        // let sql = "INSERT INTO clientDownloadList (clientId,userId,fileName, purpose,createdAt, module) VALUES (?,?,?,?,?,?)";
        // const [resp, fields] = await writeConn.query(sql, [clientId,userId,fileName, purpose,createdAt, moduleName]);
        let sql = "UPDATE clientDownloadProcessList SET fileName=?, processStatus=?,modifiedAt=? WHERE id=?";
        const [resp, fields] = await writeConn.query(sql, [fileName, 2, currentDateTime, id]);
        return true;
    } catch (e) {
        util.createLog(e);
        throw e
    }
}


/**
 * @author : Josimoddin Shaikh
 * @date : 28/02/2024
 * @description : insert into clientDownloadProcessList download list
 * @argument : 
 * @returns : input
 */
module.exports.addIntoDownloadProcessList = async (clientId, userId, filepath, purpose, createdAt, moduleName, reqBody) => {
    try {
        if (createdAt == null || createdAt == undefined || createdAt == "") {
            let currentDate = new Date();
            // Add 5 hours and 30 minutes
            currentDate.setHours(currentDate.getHours() + 5);
            currentDate.setMinutes(currentDate.getMinutes() + 30);
            let date = ("0" + currentDate.getDate()).slice(-2);
            let month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
            let year = currentDate.getFullYear();
            let hours = ("0" + currentDate.getHours()).slice(-2);
            let minutes = ("0" + currentDate.getMinutes()).slice(-2);
            let seconds = ("0" + currentDate.getSeconds()).slice(-2);
            let currentDateTime = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
            createdAt = currentDateTime
        }

        let sql = "INSERT INTO clientDownloadProcessList (clientId, userId,fileName, purpose, createdAt, module, requestBody) VALUES (?,?,?,?,?,?,?)";
        const [resp, fields] = await writeConn.query(sql, [clientId, userId, filepath, purpose, createdAt, moduleName, reqBody]);
        return true;
    } catch (e) {
        // util.createLog("addClientReportDownloadProcessList err",e);
        return false;
    }
}


module.exports.addIntoDownloadProcessList = async (clientId, userId, filepath, purpose, createdAt, moduleName, reqBody) => {
    try {
        if (createdAt == null || createdAt == undefined || createdAt == "") {
            let currentDate = new Date();
            // Add 5 hours and 30 minutes
            currentDate.setHours(currentDate.getHours() + 5);
            currentDate.setMinutes(currentDate.getMinutes() + 30);
            let date = ("0" + currentDate.getDate()).slice(-2);
            let month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
            let year = currentDate.getFullYear();
            let hours = ("0" + currentDate.getHours()).slice(-2);
            let minutes = ("0" + currentDate.getMinutes()).slice(-2);
            let seconds = ("0" + currentDate.getSeconds()).slice(-2);
            let currentDateTime = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
            createdAt = currentDateTime
        }

        let sql = "INSERT INTO clientDownloadProcessList (clientId, userId,fileName, purpose,processStatus, createdAt, module, requestBody) VALUES (?,?,?,?,?,?,?,?)";
        const [resp, fields] = await writeConn.query(sql, [clientId, userId, filepath, purpose, '2', createdAt, moduleName, reqBody]);
        return true;
    } catch (e) {
        // util.createLog("addClientReportDownloadProcessList err",e);
        return false;
    }
}


module.exports.getHierarchyDataStatus = async (dataArr) => {
    try {

        let sql = "SELECT hierarchyDataId,mstHierarchyTypeId,hmName,status FROM dlocation_mstHierarchyData WHERE hierarchyDataId IN (" + dataArr.join(',') + ")"

        // console.log(sql)

        const [resp] = await readConn.query(sql);
        return resp;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}




module.exports.deleteContactDate = async (data) => {
    try {


        let sql = "UPDATE contactManagement SET deleted = 1, modifiedBy = ?,modifiedAt = ? WHERE contactId IN (" + data.typeIdArr.join(',') + ")";

        const [resp, fields] = await writeConn.query(sql, [data.userId, data.currentDateTime]);
        return true;
    } catch (e) {
        util.createLog(e);
        throw e
    }
}


module.exports.deleteOrganizationDate = async (data) => {
    try {


        let sql = "UPDATE organizationManagement SET status = 0, deleted = 1, modifiedBy = ?,modifiedAt = ? WHERE organizationId IN (" + data.typeIdArr.join(',') + ")";

        const [resp, fields] = await writeConn.query(sql, [data.userId, data.currentDateTime]);
        return true;
    } catch (e) {
        util.createLog(e);
        throw e
    }
}



module.exports.deleteLeadDate = async (data) => {
    try {


        let sql = "UPDATE leadManagement SET status = 0, deleted = 1, modifiedBy = ?,modifiedAt = ? WHERE leadId IN (" + data.typeIdArr.join(',') + ")";

        const [resp, fields] = await writeConn.query(sql, [data.userId, data.currentDateTime]);
        return true;
    } catch (e) {
        util.createLog(e);
        throw e
    }
}

module.exports.deleteEnqueryDate = async (data) => {
    try {


        let sql = "UPDATE enqueryManagement SET isActive = 0, deleted = 1, modifiedBy = ?,modifiedAt = ? WHERE enqueryId IN (" + data.typeIdArr.join(',') + ")";

        const [resp, fields] = await writeConn.query(sql, [data.userId, data.currentDateTime]);
        return true;
    } catch (e) {
        util.createLog(e);
        throw e
    }
}