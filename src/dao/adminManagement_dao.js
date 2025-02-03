const readConn    = require('../dbconnection').readPool
const writeConn   = require('../dbconnection').writePool
const util        = require('../utility/util');



module.exports.getExsistingCmpnyLstData  = async(data) => {
    try {
        // let sql = "SELECT * FROM `clientSettings` WHERE `settingsType` NOT IN ('userLimit') AND clientId = ?"
        let sql = "SELECT * FROM clientSettings WHERE clientId = ?"

        // const [resp] = await readConn.query(sql,[data.clientId]);
        const [resp] = await readConn.query(sql,[data.selectedClientId]);
        return resp;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}


module.exports.updateExsistingCmpnyLstData  = async(data) => {
    try {
        const sql = "UPDATE clientSettings SET settingsValue = ? WHERE clientId = ? AND id = ?";
        const [resp] = await writeConn.query(sql, [data.settingsValue, data.selectedClientId, data.settingsId]);
        return true
    } catch (e) {
        util.createLog(e);
        return false;
    }
}


module.exports.checkCRMSetId  = async(data) => {
    try {
        let sql = "SELECT id  FROM `clientSettings` WHERE `clientId` = ? AND `title` LIKE '%Show CRM?%'"

        const [result] = await readConn.query(sql,[data.clientId]);

        return result.length > 0 ? result[0].id : 0;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}


module.exports.checkCRMSetRoleId  = async(data) => {
    try {
        let sql = "SELECT id  FROM userRoles WHERE `clientId` = ? AND roleName LIKE '%CRMAdmin%'"

        const [result] = await readConn.query(sql,[data.clientId]);

        return result.length > 0 ? result[0].id : 0;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}


module.exports.addCRMSetRoleId  = async(data) => {
    try {
        const sql = "INSERT INTO userRoles (clientId, roleName, description, roleType, createdBy) VALUES (?,?, ?, ?, ?)"
        const [res,fields] = await writeConn.query(sql, [data.clientId, 'CRMAdmin','role created by super admin for company', '2', data.userId])
        return res.insertId;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}



module.exports.getAdminUserData  = async(data) => {
    try {
        let sql = "SELECT user.firstName, email,phone, user.clientId,clientLocationMap.countryId, clientLocationMap.stateId, clientLocationMap.districtId, clientLocationMap.zoneId  FROM user, clientLocationMap WHERE user.userId = clientLocationMap.refId AND clientLocationMap.tableName = 'user' AND clientLocationMap.clientId = ? AND user.deleted = 0 AND user.isActive = 1 AND user.userType = '1'"

        const [result] = await readConn.query(sql,[data.clientId]);

        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}



module.exports.checkCRMShowStatus  = async(data) => {
    try {
        let sql = "SELECT userId  FROM user WHERE clientId = ? AND userType = '4'"

        const [result] = await readConn.query(sql,[data.clientId]);

        return result.length > 0 ? result[0].userId : 0;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}


module.exports.deleteCRMUserData  = async(data, crmUserId) => {
    try {
        const sql = "UPDATE user SET deleted = 1, isActive = 0 WHERE userId = ? AND clientId = ?";
        const [resp] = await writeConn.query(sql, [crmUserId, data.clientId]);
        return true
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.activeCRMUserData  = async(data, crmUserId) => {
    try {
        const sql = "UPDATE user SET deleted = 0, isActive = 1 WHERE userId = ? AND clientId = ?";
        const [resp] = await writeConn.query(sql, [crmUserId, data.clientId]);
        return true
    } catch (e) {
        util.createLog(e);
        return false;
    }
}


module.exports.getAllCompnayUsersData  = async(data) => {
    try {
        let params = [];
        let countparams = [];

        let csql = "SELECT COUNT(user.userId) AS totalData FROM user, userRoles WHERE user.roleId = userRoles.id AND user.clientId = ? AND user.userType = 1 AND user.isActive = 1 AND user.deleted = 0"
        countparams.push(data.selectedClientId)

        let sql = "SELECT user.userId AS selectedUserId, user.clientId AS selectedClientId, CONCAT(COALESCE(user.firstName,''),' ', COALESCE(user.lastName,'')) AS name, user.firstName, user.lastName, user.email, user.phone, user.address, user.roleId, userRoles.roleName FROM user, userRoles WHERE user.roleId = userRoles.id AND user.clientId = ? AND user.userType = 1 AND user.isActive = 1 AND user.deleted = 0";
        params.push(data.selectedClientId)

        if (data.searchUserName !== undefined && data.searchUserName != "") {
            sql += " AND (user.firstName LIKE ? OR user.lastName LIKE ? OR CONCAT(COALESCE(user.firstName,''),' ',COALESCE(user.lastName,'')) LIKE ? OR user.email LIKE ? OR user.phone LIKE ?) ";
            csql += " AND (user.firstName LIKE ? OR user.lastName LIKE ? OR CONCAT(COALESCE(user.firstName,''),' ',COALESCE(user.lastName,'')) LIKE ? OR user.email LIKE ? OR user.phone LIKE ?) ";
            params.push('%'+data.searchUserName+'%');
            params.push('%'+data.searchUserName+'%');
            params.push('%'+data.searchUserName+'%');
            params.push('%'+data.searchUserName+'%');
            params.push('%'+data.searchUserName+'%');

            countparams.push('%'+data.searchUserName+'%');
            countparams.push('%'+data.searchUserName+'%');
            countparams.push('%'+data.searchUserName+'%');
            countparams.push('%'+data.searchUserName+'%');
            countparams.push('%'+data.searchUserName+'%');
        }

        if ((data.limit != undefined || data.limit != '') && (data.offset != undefined || data.offset != '')) {
            sql += ` LIMIT ? OFFSET ? `
            params.push(Number(data.limit));
            params.push(Number(data.offset));
        }

        let [result] = await readConn.query(sql,params);
        let [totalData] = await readConn.query(csql, countparams);


        return {'count': totalData[0].totalData, 'data': result, 'status':true}

    } catch (e) {
        util.createLog(e);
        return {'count': 0, 'data': [], 'status':false};
    }
}


module.exports.getAllCompnayUsersRolesData  = async(data) => {
    try {
        let params = [];
        let countparams = [];

        let csql = "SELECT COUNT(id) AS totalData FROM userRoles WHERE roleType = 2 AND clientId = ? AND status = 1"
        countparams.push(data.selectedClientId)

        let sql = "SELECT id, clientId, roleName, description FROM userRoles WHERE roleType = 2 AND clientId = ? AND status = 1";
        params.push(data.selectedClientId)

        if (data.searchRoleName !== undefined && data.searchRoleName != "") {
            sql += " AND roleName LIKE ? ";
            csql += " AND roleName LIKE ? ";
            params.push('%'+data.searchRoleName+'%');
            countparams.push('%'+data.searchRoleName+'%');

        }

        if ((data.limit != undefined || data.limit != '') && (data.offset != undefined || data.offset != '')) {
            sql += ` LIMIT ? OFFSET ? `
            params.push(Number(data.limit));
            params.push(Number(data.offset));

        }

        let [result] = await readConn.query(sql,params);
        let [totalData] = await readConn.query(csql, countparams);

        return {count: totalData[0].totalData, data: result}

    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.addCompnayUsersRolesData  = async(data) => {
    try {
        let sql = "INSERT INTO userRoles (clientId, roleName, description, roleType, createdBy) VALUES (?,?, ?, ?, ?)"
        let [res,fields] = await writeConn.query(sql, [data.selectedClientId, data.roleName,data.description, '2', data.userId])
        return res.insertId;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.updateCompnayUsersRolesData  = async(data) => {
    try {
        let sql = "UPDATE userRoles SET roleName = ?, description = ?, modifiedBy = ?, modifiedAt = current_timestamp WHERE id = ? AND clientId = ?"
        let [res,fields] = await writeConn.query(sql, [data.roleName,data.description, data.userId, data.selectedRoleId, data.selectedClientId])
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.deleteCompnayUsersRolesData  = async(data) => {
    try {
        let sql = "UPDATE userRoles SET status = '2', modifiedBy = ? WHERE id = ? AND clientId = ?"
        let [res,fields] = await writeConn.query(sql, [data.userId, data.selectedRoleId, data.selectedClientId]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}
/*
module.exports.getAllCompanyZones  = async(data) => {
    try {
        let sql = "SELECT countryId, stateId, cityId, zoneId FROM zone WHERE clientId = ? AND isActive = '1' AND deleted = '0'"

        const [result] = await readConn.query(sql,[data.selectedClientId]);
        return {"status":true, "data":result};
    } catch(e){
        util.createLog(e);
        return {"status":false, "data":[]};
    }
}
*/
module.exports.getAllCompanyZones  = async(data) => {
    try {
        let sql = "SELECT hierarchyDataId, mstHierarchyTypeId FROM dlocation_mstHierarchyData WHERE clientId = ? AND hmId = 1 AND leafLevel = 0 AND status = 1 "

        const [result] = await readConn.query(sql,[data.selectedClientId]);
        return {"status":true, "data":result};
    } catch(e){
        util.createLog(e);
        return {"status":false, "data":[]};
    }
}
module.exports.getAllCompanyUsers  = async(data) => {
    try {
        let sql = "SELECT userId  FROM user WHERE clientId = ? AND userType = '2' AND isActive = 1 AND deleted = 0 ORDER BY userId  DESC"

        const [result] = await readConn.query(sql,[data.selectedClientId]);
        return {"status":true, "data":result};
    } catch(e){
        util.createLog(e);
        return {"status":false, "data":[]};
    }
}

module.exports.addNewCompnayUserData  = async(data) => {
    try {
        let sql = "INSERT INTO user (clientId, clientUserId, firstName, lastName, password,psw, username, email,phone, address, profileImgUrl, roleId , designationId, userType, createdBy, stateId, countryId, districtId, cityId, zoneId) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
        let [res,fields] = await writeConn.query(sql, [data.selectedClientId, '0',data.firstName, data.lastName, data.password,data.password, data.username, data.email, data.phone, data.address, data.profilePic, data.selectedRoleId, "0", "1", data.userId, '0', '0', '0', '0', '0'])
        return res.insertId;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.updateCompnayUserData  = async(data) => {
    try {
        let sql = "UPDATE user SET firstName = ?, lastName = ?, phone = ?,address = ?, roleId = ?, modifiedBy = ? WHERE userId = ? AND isActive = '1' AND deleted = '0' ";
        let [res,fields] = await writeConn.query(sql, [data.firstName,data.lastName,data.phone,data.address, data.selectedRoleId, data.userId, data.selectedUserId])
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.deleteCompnayUserData  = async(data) => {
    try {
        let sql = "UPDATE user SET isActive = '0', deleted = '1', modifiedBy = ? WHERE userId = ?";
        let [res,fields] = await writeConn.query(sql,[data.userId, data.selectedUserId]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}



module.exports.deleteUserLocationData = async(refId,tableName) => {
    try{
        let sql = "UPDATE clientLocationMap SET status = '2' WHERE refId = ? AND tableName = ? ";
        const [resp] = await writeConn.query(sql,[refId,tableName]);
        return true;
    }catch(e){
        util.createLog(e);
        return false; 
    }
}


module.exports.updateAllUserHierarchy  = async(data) => {
    try {
        const sql = "UPDATE clientEntityHierarchy SET status = 2 WHERE parentId = ? AND clientId = ? AND parentTable = 'user' AND childTable = 'user'";
        const [resp] = await writeConn.query(sql, [data.selectedUserId, data.selectedClientId]);
        return true
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.updateAllZoneMapping  = async(data) => {
    try {
        const sql = "UPDATE clientLocationMap SET status = 2 WHERE refId = ? AND clientId = ? AND tableName = 'user'";
        const [resp] = await writeConn.query(sql, [data.selectedUserId, data.selectedClientId]);
        return true
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.updateAllZoneMappingV2  = async(data) => {
    try {
        const sql = "DELETE FROM clientLocationMap WHERE refId = ? AND clientId = ? AND tableName = 'user'";
        const [resp] = await writeConn.query(sql, [data.selectedUserId, data.selectedClientId]);
        return true
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.addUserInHierarchy  = async(data, userCId) => {
    try {
        let sql = "INSERT INTO clientEntityHierarchy (clientId, parentId, parentTable, childId, childTable, addedBy) VALUES (?,?,?,?,?,?)"
        let [res,fields] = await writeConn.query(sql, [data.selectedClientId, data.selectedUserId, 'user', userCId, 'user', data.userId])
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}
/*
module.exports.addUserLocationData = async(data,insertId,tableName) => {
    try{
        let sql = "INSERT INTO clientLocationMap (clientId, tableName, refId, countryId, stateId , districtId, zoneId, status, assignedBy) VALUES (?,?,?,?,?,?,?,?,?)";
        
        const [resp] = await writeConn.query(sql,[data.clientId, tableName, insertId, data.countryId, data.stateId, data.districtId, data.zoneId,1, data.userId]);
        return true;
    }catch(e){
        util.createLog(e);
        return false;
    }
}
*/
module.exports.addUserLocationData = async(data,insertId,tableName) => {
    try{
        let sql = "INSERT INTO clientLocationMap (clientId, tableName, refId,mstHierarchyTypeId,hierarchyDataId, countryId, stateId , districtId, zoneId, status, assignedBy) VALUES (?,?,?,?,?,?,?,?,?,?,?)";
        
        const [resp] = await writeConn.query(sql,[data.clientId, tableName, insertId, data.mstHierarchyTypeId,data.hierarchyDataId, data.countryId, data.stateId, data.districtId, data.zoneId,"1", data.userId]);
        return true;
    }catch(e){
        util.createLog(e);
        return false;
    }
}

module.exports.insertChunkLastLevels = async(data) => {
    try{
        let sql = "INSERT INTO clientLocationMap (mstHierarchyTypeId,hierarchyDataId,clientId, tableName, refId, status, assignedBy,createDate,isApproved) VALUES ?";
        
        const [resp] = await writeConn.query(sql,[data]);
        return true;
    }catch(e){
        util.createLog(e);
        return false;
    }
}





module.exports.updatePermissionOfTheModule  = async(data) => {
    try {
        const sql = "UPDATE userRoleModule SET status = 2 WHERE specificModule = ? AND clientId = ? AND roleId = ?";
        const [resp] = await writeConn.query(sql, [data.specificModuleId, data.selectedClientId, data.selectedRoleId]);
        return true
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.getAllSpecificModule  = async(data) => {
    try {
        let sql = "SELECT id  FROM mstModules WHERE specificModule = ? AND status = 1 ORDER BY id  DESC"

        const [result] = await readConn.query(sql,[data.specificModuleId]);
        return {"status":true, "data":result};
    } catch(e){
        util.createLog(e);
        return {"status":false, "data":[]};
    }
}

module.exports.addMenuPermission = async(data) => {
    try{
        let sql = "INSERT INTO userRoleModule (clientId, specificModule, roleId, moduleId, isView, addPem, editPem, deletePem, approvePem, commercialPem, status, createdBy) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)";
        
        const [resp] = await writeConn.query(sql,[data.clientId, data.specificModule, data.roleId, data.moduleId, data.isView,data.addPem,data.editPem,data.deletePem,data.approvePem,data.commercialPem,1, data.createdBy]);
        return true;
    }catch(e){
        util.createLog(e);
        return false;
    }
}

module.exports.getAllMasterModulesData  = async(data) => {
    try {
        let params = [];
        let countparams = [];

        let csql = "SELECT COUNT(m1.id) AS totalData FROM mstModules AS m1 LEFT JOIN mstModules AS m2 ON m1.parentId = m2.id WHERE m1.status = 1 "

        let sql = `SELECT m1.id AS moduleId,m1.name AS moduleName, m2.id AS parentId,m2.name AS parentName, m1.specificModule, m1.path AS modulePath, mstMasterModules.modulesName AS specificModuleName
        FROM mstModules AS m1 
        LEFT JOIN mstModules AS m2 ON m1.parentId = m2.id
        LEFT JOIN mstMasterModules ON m1.specificModule = mstMasterModules.id AND mstMasterModules.status = '1' 
        WHERE m1.status = 1 `;

        if (data.specificModuleId !== undefined && data.specificModuleId != "") {
            sql += " AND m1.specificModule = ? ";
            csql += " AND m1.specificModule = ? ";
            params.push(data.specificModuleId);
            countparams.push(data.specificModuleId);

        }
        if (data.moduleName !== undefined && data.moduleName != "") {
            sql += " AND m1.name = ? ";
            csql += " AND m1.name = ? ";
            params.push('%'+data.moduleName+'%');
            countparams.push('%'+data.moduleName+'%');
        }
        if (data.parentModuleName !== undefined && data.parentModuleName != "") {
            sql += " AND m2.name = ? ";
            csql += " AND m2.name = ? ";
            params.push('%'+data.parentModuleName+'%');
            countparams.push('%'+data.parentModuleName+'%');
        }
        if ((data.limit != undefined && data.limit != '') && (data.offset != undefined && data.offset != '')) {
            sql += ` LIMIT ? OFFSET ? `
            params.push(Number(data.limit));
            params.push(Number(data.offset));
        }
        let [result] = await readConn.query(sql,params);
        let [totalData] = await readConn.query(csql, countparams);


        return {'count': totalData[0].totalData, 'data': result, 'status':true}

    } catch (e) {
        util.createLog(e);
        return {'count': 0, 'data': [], 'status':false};
    }
}

module.exports.getAllParentMasterModulesData  = async(data) => {
    try {
        let params = [];
        let countparams = [];

        let csql = "SELECT COUNT(m1.id) AS totalData FROM mstModules AS m1 WHERE m1.parentId = 0 AND m1.status = 1 "

        let sql = "SELECT m1.id AS moduleId,m1.name AS moduleName, m1.specificModule, m1.path AS modulePath FROM mstModules AS m1 WHERE m1.parentId = 0 AND m1.status = 1 ";

        if (data.specificModuleId !== undefined && data.specificModuleId != "") {
            sql += " AND m1.specificModule = ? ";
            csql += " AND m1.specificModule = ? ";
            params.push(data.specificModuleId);
            countparams.push(data.specificModuleId);

        }

        if (data.moduleName !== undefined && data.moduleName != "") {
            sql += " AND m1.name = ? ";
            csql += " AND m1.name = ? ";
            params.push('%'+data.moduleName+'%');
            countparams.push('%'+data.moduleName+'%');
        }

        if ((data.limit != undefined && data.limit != '') && (data.offset != undefined && data.offset != '')) {
            sql += ` LIMIT ? OFFSET ? `
            params.push(Number(data.limit));
            params.push(Number(data.offset));
        }

        let [result] = await readConn.query(sql,params);
        let [totalData] = await readConn.query(csql, countparams);


        return {'count': totalData[0].totalData, 'data': result, 'status':true}

    } catch (e) {

        util.createLog(e);
        return {'count': 0, 'data': [], 'status':false};
    }
}

module.exports.addNewModuleData  = async(data) => {
    try {
        let sql = "INSERT INTO mstModules (clientId, parentId, specificModule, name, path, sequence) VALUES (?,?, ?, ?, ?,?)"
        let [res,fields] = await writeConn.query(sql, ["0", data.parentModuleId,data.specificModuleId, data.moduleName, data.modulePath, data.sequence])
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.updateModuleData = async(data) => {
    try{
        let sql = `UPDATE mstModules SET name = ?, path = ? WHERE id = ?`;
        let [res] = await writeConn.query(sql,[data.moduleName,data.modulePath,data.moduleId]);
        return true
    }catch(e){
        util.createLog(e);
        return false;
    }
}

module.exports.deleteModule = async(data) => {
    try{
        let sql = `UPDATE mstModules SET status = '2' WHERE id = ?`;
        let [res] = await writeConn.query(sql,[data.moduleId]);
        return true;
    }catch(e){
        util.createLog(e);
        return false;
    }
}

module.exports.masterModulesList = async(data) => {
    try{
        let params = [];
        let sql = `SELECT id AS masterModuleId, modulesName FROM mstMasterModules WHERE status = 1 ORDER BY modulesName ASC`
        // params.push("0");
        // params.push("1");
        if((data.limit !== undefined && data.limit != null && data.limit != "")&&(data.offset !== undefined && data.offset != null && data.offset != "")){
            sql += ` LIMIT ?,?`
            params.push(Number(data.offset));
            params.push(Number(data.limit));
        }
        let [res] = await readConn.query(sql,params);
        return res;
    }catch(e){
        util.createLog(e);
        return false;
    }
}

module.exports.addMasterModules = async(data) => {
    try{
        let sql = `INSERT INTO mstMasterModules (clientId,modulesName,status,localCreateDate) VALUES (?,?,?,?)`;
        let[res] = await writeConn.query(sql,["0",data.modulesName,"1",data.currentTime]);
        return res.insertId;
    }catch(e){
        util.createLog(e);
        return false;
    }
}

module.exports.updateMasterModules = async (data) => {
    try{
        let sql = `UPDATE mstMasterModules SET clientId = ?, modulesName = ? WHERE id = ?`;
        let [res] = await writeConn.query(sql,["0",data.moduleName,data.masterModuleId])
        return true;
    }catch(e){
        util.createLog(e);
        return false;
    }
}

module.exports.deleteMasterModules = async (data) => {
    try{
        let sql = `UPDATE mstMasterModules SET status = '2' WHERE id = ?`;
        let [res] = await writeConn.query(sql,[data.masterModuleId])
        return true;
    }catch(e){

        util.createLog(e);
        return false;
    }
}

module.exports.getModuleSequence = async (data) => {
    try{
        let sql = `SELECT MAX(sequence) as sequenceNo FROM mstModules WHERE parentId = ? AND specificModule = ? AND status = '1' `
        let [res] = await readConn.query(sql,[data.parentModuleId, data.specificModuleId]);
        return res[0].sequenceNo;
    }catch(e){
        util.createLog(e);
        return false;
    }
}


/**
 * @author : Sourav Bhoumik
 * @date : 24/04/2023
 * @description : get list of all getAllEntityList
 * @argument : 
 * @returns
 */
module.exports.getAllEntityList = async (data) => {
    try {
        let params = [];
        let countparams = []
        let sql = `SELECT id AS entityId, clientId, entityName, description FROM sa_entity WHERE clientId = ? AND status = 1`;

        params.push(data.clientId);

        let csql = `SELECT count(id)  as totalData FROM sa_entity WHERE clientId = ? AND status = 1`;
        countparams.push(data.clientId);


        if (data.limit != undefined && data.limit != null && data.limit != '') {
            data.offset === '' ? 0 : data.offset
            sql = sql + ' LIMIT ? OFFSET ?'
            params.push(Number(data.limit), Number(data.offset));
        }
        let [resp] = await readConn.query(sql, params);
        let [totalData] = await readConn.query(csql, countparams);

        return { 'count': totalData[0].totalData, 'data': resp, 'resstatus': true }
    } catch (e) {
        util.createLog(e);
        return { 'count': 0, 'data': [], 'resstatus': false };
    }
}


/**
 * @author : Sourav Bhoumik
 * @date : 02/03/2023
 * @description : add new label into master 
 * @argument : 
 * @returns
 */
module.exports.addNewEntityData = async (data) => {
    try {
        const sql = "INSERT INTO sa_entity(clientId,entityName,description,createdAt) VALUES (?,?,?,?)";
        const [resp] = await writeConn.query(sql, [data.clientId, data.entityName,data.description, data.createdAt]);
        return resp.insertId ? resp.insertId : false;;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

/**
 * @author : Sourav Bhoumik
 * @date : 24/04/2023
 * @description : get UPDATE updateEntityData
 * @argument : 
 * @returns
 */
module.exports.updateEntityData = async (data) => {
    try {
        const sql = "UPDATE sa_entity SET entityName = ?, description = ?, modifiedAt = ? WHERE clientId = ? AND id = ?";
        const [resp] = await writeConn.query(sql, [data.entityName, data.description,data.modifiedAt,data.clientId, data.entityId]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}


/**
 * @author : Sourav Bhoumik
 * @date : 24/04/2023
 * @description : deleteEntityName
 * @argument : 
 * @returns
 */
module.exports.deleteEntityName = async (data) => {
    try {
        const sql = "UPDATE sa_entity SET status = 2, modifiedAt = ? WHERE clientId = ? AND id = ?";
        const [resp] = await writeConn.query(sql, [data.modifiedAt,data.clientId, data.entityId]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}


/**
 * @author : Sourav Bhoumik
 * @date : 27/04/2023
 * @description : insertEntityMapping
 * @argument : 
 * @returns
 */
module.exports.insertEntityMapping = async (clientId,entityId, userId, createdAt, data) => {
    try {
        const sql = "INSERT INTO entityMapValue(clientId,entityId,entityKeyName,entityKeyValue,createdAt,createdBy) VALUES (?,?,?,?,?,?)";
        const [resp] = await writeConn.query(sql, [clientId, entityId, data.entityKey,data.entityValue, createdAt, userId]);
        return resp.insertId ? resp.insertId : false;;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

/**
 * @author : Sourav Bhoumik
 * @date : 27/04/2023
 * @description : get UPDATE updateEntityData
 * @argument : 
 * @returns
 */
module.exports.updateEntityMapping = async (clientId,entityId, userId, modifiedAt, data) => {
    try {
        const sql = "UPDATE entityMapValue SET entityId = ?, entityKeyName = ?, entityKeyValue = ?, modifiedAt = ?, modifiedBy = ? WHERE clientId = ? AND id = ?";
        const [resp] = await writeConn.query(sql, [entityId, data.entityKey,data.entityValue, modifiedAt,userId, clientId, data.entityDataId]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}


/**
 * @author : Sourav Bhoumik
 * @date : 24/04/2023
 * @description : deleteEntityName
 * @argument : 
 * @returns
 */
module.exports.deleteEntityKeyValues = async (data) => {
    try {
        const sql = "UPDATE entityMapValue SET status = 2, modifiedAt = ? WHERE clientId = ? AND id = ?";
        const [resp] = await writeConn.query(sql, [data.modifiedAt,data.clientId, data.entityDataId]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}



/**
 * @author : Sourav Bhoumik
 * @date : 26/04/2023
 * @description : get all entity key-value by entity id
 * @argument : 
 * @returns
 */
module.exports.getEntityKeyValuesById = async (data) => {
    try {
        let params = [];
        let countparams = []
        let sql = `SELECT entityMapValue.id AS entityDataId, entityMapValue.entityKeyName AS entityKey, entityMapValue.entityKeyValue AS entityValue, sa_entity.entityName, entityMapValue.createdAt FROM entityMapValue, sa_entity WHERE entityMapValue.entityId = ? AND entityMapValue.clientId = ? AND entityMapValue.entityId = sa_entity.id AND entityMapValue.status = 1`;

        params.push(data.entityId);
        params.push(data.clientId);

        let csql = `SELECT COUNT(entityMapValue.id) AS totalData FROM entityMapValue, sa_entity WHERE entityMapValue.entityId = 1 AND entityMapValue.clientId = 4 AND entityMapValue.entityId = sa_entity.id AND entityMapValue.status = 1`;

        countparams.push(data.entityId);
        countparams.push(data.clientId);


        if (data.limit != undefined && data.limit != null && data.limit != '') {
            data.offset === '' ? 0 : data.offset
            sql = sql + ' LIMIT ? OFFSET ?'
            params.push(Number(data.limit), Number(data.offset));
        }
        let [resp] = await readConn.query(sql, params);
        let [totalData] = await readConn.query(csql, countparams);

        return { 'count': totalData[0].totalData, 'data': resp, 'resstatus': true }
    } catch (e) {

        util.createLog(e);
        return { 'count': 0, 'data': [], 'resstatus': false };
    }
}


module.exports.listEntityKeyValuesById = async (data) => {
	try {
        let params = [];
      
        let sql = `SELECT entityMapValue.id AS entityDataId, entityMapValue.entityKeyName AS entityKey, entityMapValue.entityKeyValue AS entityValue, sa_entity.entityName, entityMapValue.createdAt FROM entityMapValue, sa_entity WHERE entityMapValue.entityId = ? AND entityMapValue.clientId = ? AND entityMapValue.entityId = sa_entity.id AND entityMapValue.status = 1`;

        params.push(data.entityId);
        params.push(data.clientId);

        let [resp] = await readConn.query(sql, params);
      
        return resp;
    } catch (e) {

        util.createLog(e);
        return false;
    }
}


module.exports.saveFormFields = async (d) => {
	try {

        // console.log("=============>>DATA")
        // console.log(d)
        // console.log("=============>>")

        if(d.isRequired != ""){
            d.isRequired = 1
        }else{
            d.isRequired = 0
        }
        if(d.subTypeId == ""){
            d.subTypeId = "0"
        }
        
      
        let sql = `INSERT INTO formSettings(clientId, formId, name, label, fieldType, fieldSubType, fieldSubTypeId, fieldSubTypeValue, isRequired, status,formModuleSubId) VALUES (?,?,?,?,?,?,?,?,?,1,?)`;
	let params = [d.clientId,d.formId,d.name,d.label,d.type,d.subType,d.subTypeId,d.value,d.isRequired,d.formModuleSubId];
        

        let [res,fields] = await writeConn.query(sql, params);
	return res.insertId;
      
        
    } catch (e) {
        util.createLog(e);
        return false;
    }
}  

module.exports.getFormFieldsById = async (data) => {
	try {
        let params = [];
      
        let sql = `SELECT id, clientId,formId,name,label,fieldType type,fieldSubType subType,fieldSubTypeId subTypeId,fieldSubTypeValue value,isRequired,formModuleSubId FROM formSettings WHERE formId=? AND clientId=? AND status=1`;

        params.push(data.formId);
        params.push(data.clientId);

        if(data.formModuleSubId !== undefined && data.formModuleSubId != "" && data.formModuleSubId != null){

            sql += " AND formModuleSubId = ?"
            params.push(data.formModuleSubId)
        }

        let [resp,fields] = await readConn.query(sql, params);
      
        return resp;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.deleteFormFieldsById = async (data) => {
	try {
        let params = [];
      
        let sql = `UPDATE formSettings SET status=2 WHERE formId=? AND clientId=?`;

        params.push(data.formId);
        params.push(data.clientId);

        if(data.formModuleSubId !== undefined && data.formModuleSubId != null && data.formModuleSubId != ""){

            sql += " AND formModuleSubId = ?"
            params.push(data.formModuleSubId)
        }

        let [resp,fields] = await writeConn.query(sql, params);
      
        return resp;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.getFormFieldsValueById = async (data) => {
	try {
        let params = [];
      
        let sql = `SELECT formSettings.id fieldId, formSettings.clientId,formSettings.formId,formSettings.name,formSettings.label,formSettings.fieldType type,formSettings.fieldSubType subType,formSettings.fieldSubTypeId subTypeId,formSettings.fieldSubTypeValue value,formSettings.isRequired,formValues.fieldValue
			FROM formSettings
			LEFT JOIN formValues ON  formValues.formId = formSettings.formId AND formValues.status=1 AND formSettings.id=formValues.fieldId AND formValues.refId=?
			WHERE formSettings.formId=? 
				AND formSettings.clientId=? 
				AND formSettings.status=1`;
	   
        params.push(data.refId);
        params.push(data.formId);
        params.push(data.clientId);

        if(data.formModuleSubId !== undefined && data.formModuleSubId != null && data.formModuleSubId != ""){

            sql += " AND formSettings.formModuleSubId = ?"
            params.push(data.formModuleSubId)
        }

        let [resp,fields] = await readConn.query(sql, params);
      
        return resp;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.deleteFormFieldsValueById = async (data) => {
	try {
        let params = [];
      
        let sql = `UPDATE formValues SET status=2 WHERE refId=? AND formId=? AND clientId=?`;

    	params.push(data.refId);       
    	params.push(data.formId);
        params.push(data.clientId);

        if(data.formModuleSubId !== undefined && data.formModuleSubId != "" && data.formModuleSubId != ""){

            sql += " AND formModuleSubId = ?"
            params.push(data.formModuleSubId)
        }

        let [resp,fields] = await writeConn.query(sql, params);
      
        return resp;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.saveFormFieldsValue = async (d) => {
	try {

        let sql = `INSERT INTO formValues(clientId, formId, refId, fieldId, fieldName, fieldValue, status, formModuleSubId,mailBody) VALUES (?,?,?,?,?,?,1,?,?)`;
        let params = [d.clientId,d.formId,d.refId,d.fieldId,d.name,d.fieldValue, d.formModuleSubId,d.mailBody];
        

        let [res,fields] = await writeConn.query(sql, params);
	    return res.insertId;
      
        
    } catch (e) {
        util.createLog(e);
        return false;
    }
}  



module.exports.getLocationsForCompanyAdmin = async (data) => {
    try {
        let params = [];
      
        let sql = `SELECT hierarchyDataId, hmName, mstHierarchyTypeId AS hierarchyTypeId  FROM dlocation_mstHierarchyData WHERE clientId = ? AND status = 1 AND leafLevel = 0`;
        
        params.push(data.clientId);

        let [resp,fields] = await readConn.query(sql, params);
      
        return resp;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.getSettings = async (clientId) => {
    try {
        let sql = "SELECT settingsType, settingsValue FROM `clientSettings` WHERE clientId = ?"
        const [result, fields] = await writeConn.query(sql, [clientId]);
        return result
    } catch (e) {
        util.createLog(e);
        return false;
    }
}


module.exports.hihgerLevelLocationForCompany = async (data) => {
    try {
        let params = [];
      
        let sql = `SELECT MIN(SlNo), hierarchyTypeId FROM dlocation_mstHierarchyTypes WHERE clientId = ? AND hmId = 1 AND status = 1`;
        
        params.push(data.clientId);

        let [resp] = await readConn.query(sql, params);

        let hierarchyTypeId = 0;

        if(resp.length > 0){

            hierarchyTypeId = resp[0].hierarchyTypeId

        }
      
        return hierarchyTypeId;
    } catch (e) {
        
        util.createLog(e);
        return 0;
    }
}


// ===============================================================================================================================


/**
 * @author : Sourav Bhoumik
 * @date : 07/06/2024
 * @description : get lead stages
 * @argument : 
 * @returns
 */

module.exports.getLeadSatages = async (data) => {
    try {
        let params = [];
      
        let sql = `SELECT salesStageId, salesStageName  FROM mstSalesStage WHERE clientId = ? AND salesStageType = 1 AND deleted = 0 AND isActive = 1`;

        params.push(data.selectedClientId);

        let [resp,fields] = await readConn.query(sql, params);
      
        return resp;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.getUserNameById = async (userId) => {
    try {
        let params = [];
      
        let sql = `SELECT CONCAT(COALESCE(firstName,''),' ',COALESCE(lastName,'')) AS userName FROM user WHERE userId = ?`;

        params.push(userId);

        let [resp] = await readConn.query(sql, params);

        let name = ""

        if(resp.length > 0){

            if(resp[0]['userName'] != null){

                name = resp[0]['userName']
            }
        }
      
        return name;
    } catch (e) {
        util.createLog(e);
        return "";
    }
}