const readConn = require('../dbconnection').readPool
const writeConn = require('../dbconnection').writePool
const util = require('../utility/util');


module.exports.addRole = async (data) => {
    try {
        const sql = "INSERT INTO userRoles (clientId, roleName, description, createdBy, roleType, createDate) VALUES (?, ?, ?, ?, ?, ?)";
        const [result, fields] = await writeConn.query(sql, [data.clientId, data.roleName, data.roleDescription, data.userId, data.roleType, data.currentDateTime]);
        return true
    } catch (e) {
        util.createLog(e);
        return false;
    }
}
module.exports.checkExistingRole = async (data) => {
    try {
        let params = [];
        let sql = `SELECT roleName FROM userRoles WHERE clientId = ? AND roleName LIKE ? AND status = '1' AND roleType = ?`;
        params.push(data.clientId);
        params.push('%' + data.roleName + '%');
        params.push(data.roleType)

        if(data.selectedRoleId !== undefined && data.selectedRoleId != '' && data.selectedRoleId != '0' && data.selectedRoleId != null){

            sql += " AND id != ? "
            params.push(data.selectedRoleId)
        }

        let [res] = await readConn.query(sql, params);
        return res.length > 0 ? true : false;
    } catch (e) {

        util.createLog(e);
        return false
    }
}

module.exports.updateRole = async (data) => {
    try {

        const sql = "UPDATE userRoles SET roleName = ?, description = ?, modifiedBy = ?, modifiedAt = ? WHERE id = ? AND roleType = ?";
        const [result, fields] = await writeConn.query(sql, [data.roleName, data.roleDescription, data.userId, data.currentDateTime, data.selectedRoleId, data.roleType]);

        return true
    } catch (e) {
        util.createLog(e);

        return false;
    }
}


module.exports.deleteRole = async (data) => {
    try {

        const sql = "UPDATE userRoles SET status = 2, modifiedBy = ?, modifiedAt = ? WHERE id = ?";

        // const sql = "UPDATE userRoles SET status = 2, modifiedBy = ?, modifiedAt = current_timestamp WHERE id = ?";
        // const [result, fields] = await writeConn.query(sql, [data.userId, data.roleId]);

        const [result, fields] = await writeConn.query(sql, [data.userId, data.currentDateTime, data.selectedRoleId]);
        return true
    } catch (e) {

        util.createLog(e);
        return false;
    }
}


module.exports.getRoles = async (data) => {

    try {
        let where = '';
        let queryparams = [];
        let countParams = [];
        // let csql = "SELECT COUNT(id) as totalData FROM userRoles WHERE status = 1 AND roleType IN (1, 3) AND clientId = ?"
        // countParams.push(data.clientId);
        let sql = "SELECT id as roleId, roleName, description, status, createDate, roleType FROM userRoles WHERE status = 1 AND roleType IN (1, 3) AND clientId = ? ";
        queryparams.push(data.clientId);

        if (data.serachRoleById !== undefined && data.serachRoleById != null && data.serachRoleById != "") {
            where += " AND id = ? ";
            queryparams.push(data.serachRoleById);
            // countParams.push(data.serachRoleById);
        }
        if (data.serachRoleByType !== undefined && data.serachRoleByType != null && data.serachRoleByType != "") {
            where += " AND roleType = ? ";
            queryparams.push(data.serachRoleByType);
            // countParams.push(data.serachRoleById);
        }
        if (data.searchRoleName !== undefined && data.searchRoleName != null && data.searchRoleName != "") {
            where += " AND roleName LIKE ? ";
            queryparams.push('%' + data.searchRoleName + '%');
            // countParams.push('%' + data.searchRoleName + '%');
        }
        if (data.searchRoleDescription !== undefined && data.searchRoleDescription != null && data.searchRoleDescription != "") {
            where += " AND description LIKE ? ";
            queryparams.push('%' + data.searchRoleDescription + '%');
            // countParams.push('%' + data.searchRoleDescription + '%');
        }
        if (data.searchText !== undefined && data.searchText != null && data.searchText != "") { 
            where += " AND roleName LIKE ? "
            queryparams.push('%' + data.searchText + '%');
            // countParams.push('%' + data.searchText + '%');
        }

        if (data.searchFrom != undefined && data.searchTo != undefined) {
            if (data.searchFrom && data.searchTo && data.searchFrom != "" && data.searchTo != "") {
                where += " AND  DATE_FORMAT(createDate,'%Y-%m-%d') BETWEEN  ? AND ? ";
                queryparams.push(data.searchFrom, data.searchTo);
                // countParams.push(data.searchFrom, data.searchTo);

            } else if (data.searchFrom && data.searchFrom != "") {
                where += " AND  DATE_FORMAT(createDate,'%Y-%m-%d') >= ? ";
                queryparams.push(data.searchFrom);
                // countParams.push(data.searchFrom);

            } else if (data.searchTo && data.searchTo != "") {
                where += " AND  DATE_FORMAT(createDate,'%Y-%m-%d') <= ? ";
                queryparams.push(data.searchTo);
                // countParams.push(data.searchTo);
            }
        }
        where += " ORDER BY id DESC "

        sql += where + " LIMIT ? OFFSET ?"
        queryparams.push(Number(data.limit), Number(data.offset));
        // csql += where;

        let [result] = await readConn.query(sql, queryparams);
        // let [totalData] = await readConn.query(csql, countParams);
        // return { count: totalData[0].totalData, data: result }
        return { count: 0, data: result }
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

//fetch all the active user roles from database

module.exports.getRolesDropdown = async (data) => {
    try {
        let rolesSql = "SELECT id as roleId , roleName FROM userRoles WHERE clientId=? AND status=1 AND roleType = 1 ORDER BY roleName ASC"
        let [result, fields] = await readConn.query(rolesSql, [data.clientId])
        return { "data": result }
    } catch (e) {
        util.createLog(e)
        return false
    }
}

//get list of aactive modulemaster
module.exports.getMasterData = async (data) => {
    // data.moduleId = '1';
    try {
        let query = "SELECT id as moduleId,name as moduleName FROM mstModules WHERE status=1 AND specificModule = ?  AND parentId = 0 ORDER BY name  ASC";
        let [result, fields] = await readConn.query(query, [data.moduleId]);
        return result;
    } catch (e) {
        util.createLog(e)
        return false
    }
}

//get permission of modulewise
module.exports.getModulePermission = async (data) => {
    try {
        let query = "SELECT isView,addPem,editPem,deletePem,approvePem FROM userRoleModule WHERE clientId=? AND roleId = ? AND moduleId = ?"
        let [results, fields] = await readConn.query(query, [data.clientId, data.roleId, data.moduleId])
        return results;
    } catch (e) {
        util.createLog(e);
        return false
    }
}

//get permission of modulewise
module.exports.getModulePermissionModified = async (data) => {
    try {
        let query = "SELECT isView,addPem,editPem,deletePem,approvePem FROM userRoleModule WHERE clientId=? AND roleId = ? AND moduleId = ? AND specificModule = ?"
        let [results, fields] = await readConn.query(query, [data.clientId, data.roleId, data.moduleId, data.specificModule])
        return results;
    } catch (e) {
        util.createLog(e);
        return false
    }
}

//get list of aactive modulemaster
module.exports.getPermissionForRolesChildsData = async (data) => {
    // data.moduleId = '1';
    try {
        let query = "SELECT id as moduleId,name as moduleName FROM mstModules WHERE status=1 AND specificModule = ? AND parentId = ? ORDER BY name  ASC";
        let [result, fields] = await readConn.query(query, [data.specificModule, data.moduleId]);

        return result;
    } catch (e) {
        util.createLog(e)
        return false
    }
}

module.exports.updatePermissionForRolesDetails = async (data) => {
    try {

        let query = "UPDATE userRoleModule SET specificModule = ?, isView = ?, addPem=? , editPem = ? , deletePem = ?, approvePem = ?, modifiedBy=? WHERE clientId=? AND roleId=? AND moduleId=? AND status=1"

        let [results, fields] = await writeConn.query(query, [data.specificModuleId, data.permission[0].viewPem, data.permission[0].addPem, data.permission[0].editPem, data.permission[0].deletePem, data.permission[0].approvePem, data.userId, data.clientId, data.roleId, data.moduleId])

        if (results.changedRows > 0) {
            return true;
        } else {
            return false;
        }
    } catch (e) {

        util.createLog(e)
        return false;
    }
}

module.exports.delModulePermission = async (data) => {
    try {

        let query = "DELETE FROM  userRoleModule WHERE clientId = ? AND roleId = ? AND specificModule = ?"

        let [results, fields] = await writeConn.query(query, [data.clientId, data.roleId, data.specificModuleId])

        // if(results.changedRows>0){
        //     return true;
        // }else{
        //     return false;
        // }
        return true;
    } catch (e) {

        util.createLog(e)
        return false;
    }
}

module.exports.insertpermissionForRoles = async (data) => {
    try {

        let query = "INSERT INTO `userRoleModule`(`clientId`, `specificModule` , `roleId`, `moduleId`, `isView`,`addPem`, `editPem`, `deletePem`, `approvePem`, `status`, `createdBy`) VALUES (?,?,?,?,?,?,?,?,?,?,?)"
        let params = [data.clientId, data.specificModuleId, data.roleId, data.moduleId, data.permission[0].viewPem, data.permission[0].addPem, data.permission[0].editPem, data.permission[0].deletePem, data.permission[0].approvePem, 1, data.userId]
        let [result, fields] = await readConn.query(query, params)
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.getDesignationDropdown = async (data) => {
    try {
        let query = "SELECT designationId, designationName FROM mstDesignation WHERE clientId=? AND isActive=1 AND deleted=0 ORDER BY designationName ASC";
        let [result, field] = await readConn.query(query, [data.clientId])
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.addUsers = async (data, clientUserId) => {
    try {
        const sql = "INSERT INTO user (clientId, clientUserId, firstName, lastName, username, email, phone, address, password,countryId, stateId, districtId, cityId,zoneId, roleId, profileImgUrl, designationId, userType, createdBy) VALUES (?, ?, ?, ?,?, ?, ?, ?,?, ?, ?, ?,?, ?, ?, ?,?,?,?)";
        const [result, fields] = await writeConn.query(sql, [data.clientId, clientUserId, data.firstName, data.lastName, data.firstName, data.email, data.phoneNumber, data.address, data.password, data.countryId, data.stateId, data.districtId, data.districtId, data.zoneId, data.roleId, data.profileImgUrl, data.designationId, '2', data.userId]);
        return result.insertId
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.addUsersV2 = async (data, clientUserId) => {
    try {

        const sql = "INSERT INTO user (clientId, clientUserId, firstName, lastName, username, email, phone, address, password,psw,countryId, stateId, districtId, cityId,zoneId, roleId, profileImgUrl, designationId, userType, createdBy, tcsERPcode, cmpERPcode, parentUserId,empType,createdAt,userRoleType) VALUES (?, ?, ?, ?,?, ?, ?, ?,?, ?, ?, ?,?, ?, ?, ?,?,?,?,?,?,?,?,?,?,?)";
        const [result, fields] = await writeConn.query(sql, [data.clientId, clientUserId, data.firstName, data.lastName, data.username, data.email, data.phoneNumber, data.address, data.password,data.password, data.countryId, data.stateId, data.districtId, data.districtId, data.zoneId, data.role_id, data.profileImgUrl, data.designationId, '2', data.userId, data.erpCode, data.erpCode, data.parentUserId,data.empType,data.currentDateTime,data.allowEmpAsAdminValue]);

        return result.insertId
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.minlevelid = async (data) => {
    try {

        const sql = "SELECT levelId,MIN(slNo) as minslNo FROM gamification_levelMaster WHERE clientId= ? AND status=1;";
        const [result] = await readConn.query(sql, [data.clientId]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.getfinancialyearDetail = async (data, finalDate) => {
    try {
        const sql = "SELECT financialyearId FROM mstFinancialYear WHERE clientId= ? AND ? BETWEEN financialYearStartDate AND financialYearEndDate";
        const [result] = await readConn.query(sql, [data.clientId, finalDate]);
        return result.length > 0 ? result[0].financialyearId : 0;
    } catch (e) {
        util.createLog(e);
        return 0;
    }
}

module.exports.adduseringamificationuserconfig = async (data, UserId, financialYearId, levelId) => {
    try {
        const sql = "INSERT INTO gamification_userConfig (clientId,userId,designationId,levelId,achievePercentage,pointsEarned,progressPercentage,processStatus,financialYearId,createdBy) VALUES (?,?,?,?,?,?,?,?,?,?)"
        const [result] = await writeConn.query(sql, [data.clientId, UserId, data.designationId, levelId, 0, 0, 0, 1, financialYearId, data.userId]);
        return result.insertId;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.dataAddIntoPointsLog = async (data, UserId) => {
    try {
        const sql = "INSERT INTO gamification_userPointEarnedLog (clientId,userId,description,type,unitId) VALUES (?,?,?,?,?)"
        const [result] = await writeConn.query(sql, [data.clientId, UserId, 'Intial starting points', 'initial', 1]);
        return result.insertId;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}



module.exports.updateUsers = async (data, UserId) => {
    try {
        const sql = "UPDATE user SET firstName=?, lastName=?, username=?, email=?, phone=?, address=?, password=?,psw =?,countryId=?, stateId=?, districtId = ?,cityId=?, zoneId = ?,roleId=?, profileImgUrl=?, designationId=?, userType=?, modifiedBy=?, modifiedAt = current_timestamp WHERE clientId=? AND userId=?";
        const [result, fields] = await writeConn.query(sql, [data.firstName, data.lastName, data.firstName, data.email, data.phoneNumber, data.address, data.password,data.password, data.countryId, data.stateId, data.districtId, data.districtId, data.zoneId, data.roleId, data.profileImgUrl, data.designationId, '2', data.userId, data.clientId, UserId]);
        return true
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.updateUsersV2 = async (data, UserId) => {
    try {
        const sql = "UPDATE user SET tcsERPcode = ?, cmpERPcode = ?, firstName=?, lastName=?, username=?, email=?, phone=?, address=?,countryId=?, stateId=?, districtId = ?,cityId=?, zoneId = ?,roleId=?, profileImgUrl=?, designationId=?,empType=?, userType=?, modifiedBy=?, modifiedAt = ?, isActive = '1',deleted = '0', parentUserId = ?, userRoleType = ? WHERE clientId=? AND userId=?";
        const [result, fields] = await writeConn.query(sql, [data.erpCode, data.erpCode, data.firstName, data.lastName, data.username, data.email, data.phoneNumber, data.address, data.countryId, data.stateId, data.districtId, data.districtId, data.zoneId, data.role_id, data.profileImgUrl, data.designationId,data.empType, '2', data.userId, data.currentDateTime, data.parentUserId, data.allowEmpAsAdminValue, data.clientId, UserId]);
        return true
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.chkExistingUserinGamificationuserConfig = async (UserId, clientId, curFinYrId) => {
    try {
        const sql = "SELECT id FROM gamification_userConfig WHERE userId=? AND clientId = ? AND status = 1 AND financialYearId = ?";
        const [result] = await readConn.query(sql, [UserId, clientId, curFinYrId]);

        return result.length > 0 ? result[0].id : 0
    } catch (e) {
        util.createLog(e);
        return 0;
    }
}

module.exports.getdesignationId = async (existingUserId) => {
    try {
        const sql = "SELECT designationId FROM user WHERE userId=?";
        const [result] = await readConn.query(sql, [existingUserId]);
        return result;
    }
    catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.updatedesignationId = async (getdesignationId, finalDate, userId, gamificationuserconfigId) => {
    try {
        const sql = "UPDATE gamification_userConfig SET designationId=?, modifiedAt=?, modifiedBy=? WHERE id=?";
        const [result] = await writeConn.query(sql, [getdesignationId, finalDate, userId, gamificationuserconfigId]);
        return result;
    }
    catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.updatedesignationIdForGamificationConfig = async (data, finalDate, getCurrentFinYrId, empId, chkExistingUserinGamificationuserConfigId) => {
    try {
        const sql = "UPDATE gamification_userConfig SET designationId = ?, modifiedAt = ?, modifiedBy = ? WHERE id = ?";
        const [result] = await writeConn.query(sql, [data.designationId, finalDate, data.userId, chkExistingUserinGamificationuserConfigId]);
        return true;
    }
    catch (e) {
        util.createLog(e);
        return false;
    }
}


module.exports.ifPasswordExistUser = async (data, UserId) => {
    try {
        const sql = `SELECT password FROM user WHERE password = ? AND clientId=? AND userId=? `;
        const [result, fields] = await writeConn.query(sql, [data.password, data.clientId, UserId]);
        return result.length > 0 ? true : false;
    } catch (e) {

        util.createLog(e);
        return false;
    }
}

module.exports.updateUsersPassword = async (data, UserId) => {
    try {
        const sql = "UPDATE user SET password=?,psw=? WHERE clientId=? AND userId=?";
        const [result, fields] = await writeConn.query(sql, [data.password, data.password ,data.clientId, UserId]);
        return true
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.ifPhoneExist = async (data, table) => {
    try {
        const sql = "SELECT phone FROM " + table + " WHERE phone = ? AND clientId = ? ";
        const [result, fields] = await writeConn.query(sql, [data.phoneNumber, data.clientId]);
        return result
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.ifPhoneExistClientUser = async (data) => {
    try {
        const sql = "SELECT phone FROM clientUser WHERE isActive = '1' AND deleted = 0 AND phone LIKE ? ";
        const [result, fields] = await writeConn.query(sql, ['%' +data.phoneNumber+ '%']);
        return result
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.ifPhoneExistUser = async (data) => {
    try {
        const sql = "SELECT phone FROM user WHERE isActive = 1 AND deleted = 0 AND phone LIKE ? ";
        const [result, fields] = await writeConn.query(sql, ['%' + data.phoneNumber + '%']);
        return result
    } catch (e) {
        util.createLog(e);
        return false;
    }
}






module.exports.ifPhoneExistCustomer = async (data) => {
    try {
        const sql = "SELECT phoneNumber FROM clientCustomer WHERE phoneNumber LIKE ? AND clientId = ? ";
        const [result, fields] = await writeConn.query(sql, ['%' + data.phoneNumber + '%', data.clientId]);
        return result
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.ifEmailExist = async (data, table) => {
    try {
        const sql = "SELECT email FROM " + table + " WHERE deleted = 0 AND isActive = 1 AND email = ? AND clientId = ? ";
        const [result, fields] = await writeConn.query(sql, [data.email, data.clientId]);
        return result
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.addClientUsers = async (data) => {
    try {
        const sql = "INSERT INTO clientUser (clientId, firstName, lastName, email, phone, address, countryId, stateId, cityId, zoneId,profileImgUrl, designationId, createdBy, dob, gender, dateOfJoining, remark) VALUES (?, ?, ?, ?,?, ?, ?, ?,?, ?, ?, ?,?,?,?,?,?)";
        const [result, fields] = await writeConn.query(sql, [data.clientId, data.firstName, data.lastName, data.email, data.phoneNumber, data.address, data.countryId, data.stateId, data.districtId, data.zoneId, data.profileImgUrl, data.designationId, data.userId, data.dob, data.gender, data.dateOfJoin, data.remark]);
        return result.insertId
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.addClientUsersV2 = async (data) => {
    try {
        const sql = "INSERT INTO clientUser (clientId, firstName, lastName, email, phone, address, countryId, stateId, cityId, zoneId,profileImgUrl, designationId, createdBy, dob, gender, dateOfJoining, remark, erpCode, parentUserId) VALUES (?, ?, ?, ?,?, ?, ?, ?,?, ?, ?, ?,?,?,?,?,?,?,?)";
        const [result, fields] = await writeConn.query(sql, [data.clientId, data.firstName, data.lastName, data.email, data.phoneNumber, data.address, data.countryId, data.stateId, data.districtId, data.zoneId, data.profileImgUrl, data.designationId, data.userId, data.dob, data.gender, data.dateOfJoin, data.remark, data.erpCode, data.parentUserId]);
        return result.insertId
    } catch (e) {
        util.createLog(e);
        return false;
    }
}


module.exports.deleteEmployeeLocationData = async (refId, tableName, data) => {
    try {
        let sql = "UPDATE clientLocationMap SET status=2 WHERE refId = ? AND tableName = ? AND clientId = ?"
        const [resp] = await writeConn.query(sql, [refId, tableName, data.clientId]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.getEmpLocationData = async (data, table) => {
    try {
        const sql = "SELECT countryId AS country, stateId AS state, districtId AS city, zoneId AS zone  FROM clientLocationMap WHERE tableName = ? AND refId = ? AND clientId = ?";
        const [result, fields] = await writeConn.query(sql, [table, data.userCId, data.clientId]);
        return result
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.addEmployeelocation = async (data1, data, insertId, tableName) => {
    try {
        if (data.zone === undefined || data.zone == null || data.zone == "") {
            data.zone = "0"
        }
        if (data.country === undefined || data.country == null || data.country == "") {
            data.country = "0"
        }
        if (data.state === undefined || data.state == null || data.state == "") {
            data.state = "0"
        }
        if (data.city === undefined || data.city == null || data.city == "") {
            data.city = "0"
        }
        // if(data.cityId === undefined || data.cityId ==null || data.cityId ==""){
        //     data.cityId = "0"
        // }

        // if(data.cityId === undefined){
        //     data.districtId = data.districtId
        // }else{
        //     data.districtId = data.cityId
        // }


        // let updateSql   =   "UPDATE clientLocationMap SET status=2 WHERE refId = ? AND tableName = ?"
        // const [updateResp] = await readConn.query(updateSql,[insertId, tableName]);


        let sql = "INSERT INTO clientLocationMap (clientId, tableName, refId, countryId, stateId , districtId, zoneId, status, assignedBy) VALUES (?,?,?,?,?,?,?,?,?)";

        const [resp] = await writeConn.query(sql, [data1.clientId, tableName, insertId, data.country, data.state, data.city, data.zone, 1, data1.userId]);
        return resp.insertId;

    } catch (err) {

        util.createLog(err);
        return false;
    }
}



module.exports.gn_addEmployeelocation = async (data1, data, insertId, tableName) => {
    try {

        let sql = "INSERT INTO clientLocationMap (clientId, tableName, refId, countryId, stateId , districtId, zoneId, status, assignedBy, mstHierarchyTypeId, hierarchyDataId, createDate) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)";

        const [resp] = await writeConn.query(sql, [data1.clientId, tableName, insertId, 0, 0, 0, 0, 1, data1.userId, data.hierarchyTypeId, data.hierarchyDataId, data1.currentDateTime]);
        return resp.insertId;

    } catch (err) {

        util.createLog(err);
        return false;
    }
}

module.exports.updateClientUsers = async (data) => {
    try {
        const sql = "UPDATE clientUser SET clientId=?, firstName=?, lastName=?, email=?, phone=?, address=?, countryId=?, stateId=?, cityId=?, profileImgUrl=?, designationId=?, modifiedBy=?, dob=?, gender=?, dateOfJoining=?, remark=?, modifiedAt = current_timestamp WHERE id=?";
        const [result, fields] = await writeConn.query(sql, [data.clientId, data.firstName, data.lastName, data.email, data.phoneNumber, data.address, data.countryId, data.stateId, data.districtId, data.profileImgUrl, data.designationId, data.userId, data.dob, data.gender, data.dateOfJoin, data.remark, data.userCId]);
        return true
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.updateClientUsersV2 = async (data) => {
    try {
        const sql = "UPDATE clientUser SET clientId=?, firstName=?, lastName=?, email=?, phone=?, address=?, countryId=?, stateId=?, cityId=?, profileImgUrl=?, designationId=?, modifiedBy=?, dob=?, gender=?, dateOfJoining=?, remark=?, erpCode = ?, modifiedAt = ? WHERE id=?";
        const [result, fields] = await writeConn.query(sql, [data.clientId, data.firstName, data.lastName, data.email, data.phoneNumber, data.address, data.countryId, data.stateId, data.districtId, data.profileImgUrl, data.designationId, data.userId, data.dob, data.gender, data.dateOfJoin, data.remark, data.erpCode, data.currentDateTime, data.userCId]);
        return true
    } catch (e) {
        util.createLog(e);
        return false;
    }
}


module.exports.updateUserMap = async (data, UserId, respCilentUserId) => {
    try {
        let query = "UPDATE clientUser SET userId = ?, modifiedBy = ?, modifiedAt = ? WHERE id = ?";
        let [result, field] = await readConn.query(query, [UserId, data.userId, data.currentDateTime, respCilentUserId])
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}


module.exports.getusersDataListData = async (data) => {
    try {

        let where = '';
        let queryparams = [];
        let countParams = [];

        let csql = `SELECT COUNT(cu.id) as totalData 
        FROM clientUser AS cu 
        LEFT JOIN mstDesignation AS mstDesig ON cu.designationId = mstDesig.designationId 
        LEFT JOIN user AS u ON cu.userId = u.userId 
        LEFT JOIN userRoles AS ur ON ur.id = u.roleId 
        WHERE cu.deleted = 0 
        AND cu.clientId = ? `;

        countParams.push(data.clientId);

        let sql = `SELECT CONCAT(COALESCE(cu.firstName,''),' ', COALESCE(cu.lastName,'')) AS userName, 
            cu.id AS userCId, 
            cu.phone, 
            cu.email,
            cu.designationId, 
            mstDesig.designationName, 
            ur.roleName AS roleName,
            cu.profileImgUrl AS profilePic, 
            cu.createdAt,
            DATE_FORMAT(cu.createdAt,'%Y-%m-%d') AS createDate, 
            cu.isActive, 
            cu.erpCode, 
            u.cmpERPcode, 
            u.userId,
            u.username AS loginUsername,
            u.parentUserId,
            u.userRoleType AS allowEmpAsAdminValue,
            u.address,
            u.empType,
            u.isActive,
            DATE_FORMAT(cu.modifiedAt,'%Y-%m-%d')  AS modifiedAt,
            DATE_FORMAT(cu.dateOfJoining,'%Y-%m-%d') AS dateOfJoining,
            CONCAT(COALESCE(uCreate.firstName,''),' ', COALESCE(uCreate.lastName,'')) AS createdByUserName,cu.createdBy
        FROM clientUser AS cu 
        LEFT JOIN mstDesignation AS mstDesig ON cu.designationId = mstDesig.designationId `

        if(data.isActive !== undefined && data.isActive !=null && data.isActive != ''){
            if(data.isActive =='0'){

                sql += " LEFT JOIN user AS u ON cu.id = u.clientUserId"

            }else{

                sql += " LEFT JOIN user AS u ON cu.userId = u.userId"

            }
        }else{

            sql += " LEFT JOIN user AS u ON cu.userId = u.userId"


        }

        sql += " LEFT JOIN userRoles AS ur ON u.roleId = ur.id"

        sql += " LEFT JOIN user AS uCreate ON cu.createdBy = uCreate.userId"

        sql+=" WHERE cu.clientId = ? ";

        queryparams.push(data.clientId);

        if(data.isActive !== undefined && data.isActive !=null && data.isActive != ''){
            if(data.isActive =='0'){
                sql+=`  AND cu.deleted = 1 
                    AND cu.isActive = 0 `
            }else{
                sql+=" AND cu.deleted = 0 " 

            }
        }

        if(data.getUsersOfTheLocations && data.getUsersOfTheLocations.length > 0) {

            sql += " AND u.userId IN ("+data.getUsersOfTheLocations.join(',')+") "
        }

        if (data.searchUserName !== undefined && data.searchUserName != "") {
            sql += " AND (cu.firstName LIKE ? OR cu.lastName LIKE ? OR CONCAT(COALESCE(cu.firstName,''),' ',COALESCE(cu.lastName,'')) LIKE ? OR u.firstName LIKE ? OR u.lastName LIKE ? OR CONCAT(COALESCE(u.firstName,''),' ',COALESCE(u.lastName,'')) LIKE ?) ";
            csql += " AND (cu.firstName LIKE ? OR cu.lastName LIKE ? OR CONCAT(COALESCE(cu.firstName,''),' ',COALESCE(cu.lastName,'')) LIKE ? OR u.firstName LIKE ? OR u.lastName LIKE ? OR CONCAT(COALESCE(u.firstName,''),' ',COALESCE(u.lastName,'')) LIKE ?) ";
            queryparams.push('%' + data.searchUserName + '%', '%' + data.searchUserName + '%', '%' + data.searchUserName + '%');
            queryparams.push('%' + data.searchUserName + '%', '%' + data.searchUserName + '%', '%' + data.searchUserName + '%');
            countParams.push('%' + data.searchUserName + '%', '%' + data.searchUserName + '%', '%' + data.searchUserName + '%');
            countParams.push('%' + data.searchUserName + '%', '%' + data.searchUserName + '%', '%' + data.searchUserName + '%');
        }
        if (data.searchUserPhone !== undefined && data.searchUserPhone != '') {
            sql += " AND cu.phone LIKE ? ";
            csql += " AND cu.phone LIKE ? ";
            queryparams.push('%' + data.searchUserPhone + '%');
            countParams.push('%' + data.searchUserPhone + '%');
        }
        if (data.searchUserEmail !== undefined && data.searchUserEmail != '') {
            sql += " AND cu.email LIKE ? ";
            csql += " AND cu.email LIKE ? ";
            queryparams.push('%' + data.data.searchUserEmail + '%');
            countParams.push('%' + data.data.searchUserEmail + '%');
        }
        if (data.searchUserRole !== undefined && data.searchUserRole != '') {
            sql += " AND u.roleId = ? ";
            csql += " AND u.roleId = ? ";
            queryparams.push(data.searchUserRole);
            countParams.push(data.searchUserRole);
        }
        if (data.searchUserDesig !== undefined && data.searchUserDesig != '') {
            sql += " AND cu.designationId = ? ";
            csql += " AND cu.designationId = ? ";
            queryparams.push(data.searchUserDesig);
            countParams.push(data.searchUserDesig);
        }
        if(data.empType !== undefined && data.empType != null && data.empType != ''){

            if(data.empType =='MT'){

                sql+=" AND u.empType  LIKE ? "
                queryparams.push('%'+data.empType+'%');

            }else{
                 sql+=" AND u.empType  NOT LIKE '%MT%' "
            }
        }
        if (data.searchFrom != undefined && data.searchTo != undefined) {
            if (data.searchFrom && data.searchTo && data.searchFrom != "" && data.searchTo != "") {
                // where += " AND  DATE_FORMAT(cu.createdAt,'%Y-%m-%d') BETWEEN  ? AND ? ";
                sql += " AND cu.createdAt BETWEEN  ? AND ? ";
                csql += " AND cu.createdAt BETWEEN  ? AND ? ";
                queryparams.push('' + data.searchFrom + ' 00:00:00');
                queryparams.push('' + data.searchTo + ' 23:59:59');
                countParams.push('' + data.searchFrom + ' 00:00:00');
                countParams.push('' + data.searchTo + ' 23:59:59');
            } else if (data.searchFrom && data.searchFrom != "") {
                sql += " AND  DATE_FORMAT(cu.createdAt,'%Y-%m-%d') >= ? ";
                csql += " AND  DATE_FORMAT(cu.createdAt,'%Y-%m-%d') >= ? ";
                queryparams.push(data.searchFrom);
                countParams.push(data.searchFrom);
            } else if (data.searchTo && data.searchTo != "") {
                sql += " AND  DATE_FORMAT(cu.createdAt,'%Y-%m-%d') <= ? ";
                csql += " AND  DATE_FORMAT(cu.createdAt,'%Y-%m-%d') <= ? ";
                queryparams.push(data.searchTo);
                countParams.push(data.searchTo);
            }
        }
        if (data.searchName !== undefined && data.searchName != "") {
            sql += " AND (cu.firstName LIKE ? OR cu.lastName LIKE ? OR cu.phone LIKE ? OR CONCAT(COALESCE(cu.firstName,''),' ',COALESCE(cu.lastName,'')) LIKE ? OR cu.email LIKE ?) ";
            csql += " AND (cu.firstName LIKE ? OR cu.lastName LIKE ? OR cu.phone LIKE ? OR CONCAT(COALESCE(cu.firstName,''),' ',COALESCE(cu.lastName,'')) LIKE ? OR cu.email LIKE ?) ";
            queryparams.push('%' + data.searchName + '%', '%' + data.searchName + '%', '%' + data.searchName + '%', '%' + data.searchName + '%', '%' + data.searchName + '%');
            countParams.push('%' + data.searchName + '%', '%' + data.searchName + '%', '%' + data.searchName + '%', '%' + data.searchName + '%', '%' + data.searchName + '%');
        }
        if (data.isDownload == '0') {
            sql += " ORDER BY userName ASC ";
            // queryparams.push(Number(data.limit))
            // queryparams.push(Number(data.offset))

            if (data.limit != undefined && data.limit != null && data.limit != '') {
                data.offset === '' ? 0 : data.offset
                sql = sql + ' LIMIT ? OFFSET ? '
                queryparams.push(Number(data.limit), Number(data.offset));
            }

            let [result] = await readConn.query(sql, queryparams);
            // let [totalData] = await readConn.query(csql, countParams);

            return result
        } else {
            sql += " ORDER BY cu.id DESC"


            let [result] = await readConn.query(sql, queryparams);
            return result;
        }
  
    } catch (e) {
        util.createLog(e);
        return false;

    }
}


module.exports.getAllParentsOfUser = async (distinctParentUserIds) => {
    try {
        let query = "SELECT CONCAT(COALESCE(user.firstName,''),' ', COALESCE(user.lastName,'')) AS parentUserName, user.userId AS parentUserId  FROM user WHERE userId IN (" + distinctParentUserIds.join(',') + ")";

        let [result] = await readConn.query(query)
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}


module.exports.getusersDataListV2 = async (data) => {
    try {
        let where = '';
        // if (data.searchUserName !== '') {
        //     where += " AND CONCAT(cu.firstName, ' ', cu.lastName) LIKE '%" + data.searchUserName + "%'";
        // }

        if (data.searchUserName !== undefined && data.searchUserName != "") {
            where += " AND (cu.firstName LIKE '%" + data.searchUserName + "%' OR cu.lastName LIKE '%" + data.searchUserName + "%' OR CONCAT(COALESCE(cu.firstName,''),' ',COALESCE(cu.lastName,'')) LIKE '%" + data.searchUserName + "%') ";
        }
        if (data.searchUserPhone !== '') {
            where += " AND cu.phone LIKE '%" + data.searchUserPhone + "%'";
        }
        if (data.searchUserEmail !== '') {
            where += " AND cu.email LIKE '%" + data.searchUserEmail + "%'";
        }
        if (data.searchUserRole !== '') {
            where += " AND u.roleId =" + data.searchUserRole + "";
        }
        if (data.searchUserDesig !== '') {
            where += " AND cu.designationId = " + data.searchUserDesig + "";
        }
        // if (data.searchContactStatus !== '') {
        //     where += " AND c.status = " + data.searchContactStatus;
        // }

        // if (data.searchName !== undefined && data.searchName !== '') {
        //     where += " AND (CONCAT(cu.firstName, ' ', cu.lastName) LIKE '%" + data.searchName + "%' OR cu.phone LIKE '%"+data.searchName+"%' ) ";
        // }
        if (data.searchFrom != undefined && data.searchTo != undefined) {
            if (data.searchFrom && data.searchTo && data.searchFrom != "" && data.searchTo != "") {
                where += " AND  DATE_FORMAT(cu.createdAt,'%Y-%m-%d') BETWEEN  " + data.searchFrom + " AND " + data.searchTo + " ";

            } else if (data.searchFrom && data.searchFrom != "") {
                where += " AND  DATE_FORMAT(cu.createdAt,'%Y-%m-%d') <= " + data.searchFrom + " ";

            } else if (data.searchTo && data.searchTo != "") {
                where += " AND  DATE_FORMAT(cu.createdAt,'%Y-%m-%d') >= " + data.searchTo + " ";
            }
        }

        if (data.searchName !== undefined && data.searchName != "") {
            where += " AND (cu.firstName LIKE '%" + data.searchName + "%' OR cu.lastName LIKE '%" + data.searchName + "%' OR cu.phone LIKE '%" + data.searchName + "%' OR CONCAT(COALESCE(cu.firstName,''),' ',COALESCE(cu.lastName,'')) LIKE '%" + data.searchName + "%' OR cu.email LIKE '%" + data.searchName + "%') ";
        }
        // const csql = "SELECT COUNT(cu.id) as totalData FROM clientUser AS cu WHERE cu.deleted = '0' AND cu.clientId = ? " + where + " "
        const csql = "SELECT COUNT(cu.id) as totalData FROM clientUser AS cu LEFT JOIN mstDesignation AS mstDesig ON mstDesig.designationId = cu.designationId LEFT JOIN user AS u ON u.clientUserId = cu.id LEFT JOIN userRoles AS ur ON ur.id = u.roleId WHERE cu.deleted = 0 AND cu.clientId = ? " + where + " "
        let [totalData] = await readConn.query(csql, [data.clientId])

        const sql = "SELECT CONCAT(COALESCE(cu.firstName,''),' ', COALESCE(cu.lastName,'')) AS userName, cu.id AS userCId, cu.phone, cu.email,cu.designationId, mstDesig.designationName, IFNULL(ur.roleName,'N/A') AS roleName,cu.profileImgUrl AS profilePic FROM clientUser AS cu LEFT JOIN mstDesignation AS mstDesig ON mstDesig.designationId = cu.designationId LEFT JOIN user AS u ON u.clientUserId = cu.id LEFT JOIN userRoles AS ur ON ur.id = u.roleId WHERE cu.deleted = 0 AND cu.clientId = ? " + where + " ORDER BY cu.id DESC LIMIT ? OFFSET ?";


        let [result] = await readConn.query(sql, [data.clientId, Number(data.limit), Number(data.offset)]);
        return { count: totalData[0].totalData, data: result }
    } catch (e) {
        util.createLog(e);
        return false;

    }
}


module.exports.getReqUserDetails = async (data) => {
    try {
        let query = `SELECT cu.id AS userCId, IF(cu.userId = 0, 0, 1) AS userPermission,cu.firstName, cu.lastName,CONCAT(cu.firstName, ' ', cu.lastName) AS userName, cu.email, cu.phone, cu.address, cu.dob, cu.gender, clm.countryId, countries.countryName,clm.stateId, states.stateName,clm.districtId AS cityId, cities.cityName,clm.zoneId, zone.zoneName,cu.geoLocation, cu.lattitude, cu.longitude,cu.userType,cu.profileImgUrl, cu.designationId, mstd.designationName,cu.dateOfJoining, cu.remark, cu.isActive ,u.roleId, ur.roleName, u.password
                        FROM clientUser AS cu 
                        LEFT JOIN user AS u ON u.clientUserId = cu.id 
                        LEFT JOIN mstDesignation AS mstd ON mstd.designationId = cu.designationId 
                        LEFT JOIN clientLocationMap clm ON clm.refId = cu.id AND clm.tableName = 'clientUser'
                        LEFT JOIN countries ON countries.countryId = clm.countryId 
                        LEFT JOIN states ON states.stateId = clm.stateId 
                        LEFT JOIN cities ON cities.cityId = clm.districtId 
                        LEFT JOIN zone ON zone.zoneId = clm.zoneId 
                        LEFT JOIN userRoles AS ur ON ur.id = u.roleId WHERE cu.id = ?`;

        let [result, field] = await readConn.query(query, [data.userCId])
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.getReqUserDetailsV2 = async (data) => {
    try {
        // let query = `SELECT cu.id AS userCId, IF(cu.userId = 0, 0, 1) AS userPermission,cu.firstName, cu.lastName,CONCAT(cu.firstName, ' ', cu.lastName) AS userName, cu.email, cu.phone, cu.address, cu.dob, cu.gender, clm.countryId, countries.countryName,clm.stateId, states.stateName,clm.districtId AS cityId, cities.cityName,clm.zoneId, zone.zoneName,cu.geoLocation, cu.lattitude, cu.longitude,cu.userType,cu.profileImgUrl, cu.designationId, mstd.designationName,cu.dateOfJoining, cu.remark, cu.isActive ,u.roleId, ur.roleName, u.password 
        //                 FROM clientUser AS cu 
        //                 LEFT JOIN user AS u ON u.clientUserId = cu.id 
        //                 LEFT JOIN mstDesignation AS mstd ON mstd.designationId = cu.designationId 
        //                 LEFT JOIN clientLocationMap clm ON clm.refId = cu.id AND clm.tableName = 'clientUser'
        //                 LEFT JOIN countries ON countries.countryId = clm.countryId 
        //                 LEFT JOIN states ON states.stateId = clm.stateId 
        //                 LEFT JOIN cities ON cities.cityId = clm.districtId 
        //                 LEFT JOIN zone ON zone.zoneId = clm.zoneId 
        //                 LEFT JOIN userRoles AS ur ON ur.id = u.roleId WHERE cu.id = ?`;

        let query = `SELECT DISTINCT cu.id AS userCId, IF(cu.userId = 0, 0, 1) AS userPermission,cu.userId,cu.firstName,cu.lastName,CONCAT(cu.firstName, ' ', cu.lastName) AS userName,cu.email,cu.phone,cu.address, cu.dob, cu.gender, cu.geoLocation, cu.lattitude, cu.longitude,cu.userType,cu.profileImgUrl, cu.designationId,cu.dateOfJoining, cu.remark, cu.isActive,u.roleId, ur.roleName, u.password
            FROM clientUser AS cu 
            LEFT JOIN user AS u ON u.clientUserId = cu.id
            LEFT JOIN mstDesignation AS mstd ON mstd.designationId = cu.designationId
            LEFT JOIN clientLocationMap clm ON clm.refId = cu.id AND clm.tableName = 'clientUser'
            LEFT JOIN userRoles AS ur ON ur.id = u.roleId WHERE cu.id = ?`;

        let [result, field] = await readConn.query(query, [data.userCId])
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.getReqUserDetailsV3 = async (data) => {
    try {
        let query = `SELECT cu.id AS userCId, IF(cu.userId = 0, 0, 1) AS userPermission,cu.userId,cu.firstName,cu.lastName,CONCAT(COALESCE(cu.firstName,''),' ',COALESCE(cu.lastName,'')) AS userName,cu.email,cu.phone,cu.address, cu.dob, cu.gender, cu.geoLocation, cu.lattitude, cu.longitude,cu.userType,cu.profileImgUrl, cu.designationId,cu.dateOfJoining, cu.remark, cu.erpCode, cu.isActive,u.roleId As role_id, ur.roleName, u.password, mstd.designationName, u.parentUserId, u.empType, u.userRoleType AS allowEmpAsAdminValue 
            FROM clientUser AS cu 
            LEFT JOIN user AS u ON cu.userId = u.userId
            LEFT JOIN mstDesignation AS mstd ON cu.designationId = mstd.designationId
            LEFT JOIN userRoles AS ur ON u.roleId = ur.id WHERE cu.id = ? `;

        let [result, field] = await readConn.query(query, [data.userCId])
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.getLocationData = async (userCId, clientId, tableName) => {
    try {

        let sql = `SELECT clm.countryId, clm.stateId, clm.districtId AS cityId, clm.zoneId, countries.countryName,states.stateName, cities.cityName, zone.zoneName FROM clientLocationMap AS clm
                   LEFT JOIN countries ON clm.countryId = countries.countryId
                   LEFT JOIN states ON clm.stateId = states.stateId 
                   LEFT JOIN cities ON clm.districtId = cities.cityId 
                   LEFT JOIN zone ON clm.zoneId = zone.zoneId 
                   WHERE clm.refId = ? AND clm.clientId = ? AND clm.tableName = ? AND clm.status = '1'`

        const [resp] = await readConn.query(sql, [userCId, clientId, tableName]);

        return resp;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.getLocationData_gn = async (userCId, clientId, tableName) => {
    try {

        let sql = `SELECT dlocation_mstHierarchyData.hierarchyDataId, dlocation_mstHierarchyData.mstHierarchyTypeId AS hierarchyTypeId, dlocation_mstHierarchyData.hmName, dlocation_mstHierarchyTypes.hmTypDesc 
        FROM clientLocationMap, dlocation_mstHierarchyData, dlocation_mstHierarchyTypes 
        WHERE clientLocationMap.clientId = ? 
        AND clientLocationMap.tableName = ? 
        AND clientLocationMap.refId = ? 
        AND clientLocationMap.status = 1 
        AND clientLocationMap.hierarchyDataId = dlocation_mstHierarchyData.hierarchyDataId 
        AND clientLocationMap.mstHierarchyTypeId = dlocation_mstHierarchyData.mstHierarchyTypeId 
        AND dlocation_mstHierarchyData.hmId = 1 
        AND clientLocationMap.mstHierarchyTypeId = dlocation_mstHierarchyTypes.hierarchyTypeId`

        const [resp] = await readConn.query(sql, [clientId, tableName, userCId]);

        return resp;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.addUserActivityList = async (data) => {
    try {
        const sql = "INSERT INTO userActivityLog (clientId, userId, activityTypeId, dueDate, assignTo, description, remarks,createdBy) VALUES (?, ?,?,?, ?,?,?,?)";
        const [resp] = await writeConn.query(sql, [data.clientId, data.userCId, data.activityTypeId, data.dueDate, data.assignTo, data.description, data.remark, data.userId]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}



module.exports.getUserActivitiesListData_upcoming = async (data) => {
    try {
        let where = '';
        if (data.searchTypeText !== '') {
            where += " AND tc.categoryName LIKE '%" + data.searchTypeText + "%'";
        }
        if (data.searchDateText !== '') {
            where += " AND a.dueDate LIKE '%" + data.searchDateText + "%'";
        }
        if (data.searchAssignUserText !== '') {
            where += " AND CONCAT(u.firstName, ' ', u.lastName) LIKE '%" + data.searchAssignUserText + "%'";
        }


        // const csql = "SELECT COUNT(id) as totalData FROM userActivityLog WHERE deleted = '0' AND dueDate > CURRENT_TIMESTAMP"
        const csql = "SELECT count(a.id) AS totalData FROM userActivityLog a LEFT JOIN taskCategory tc ON a.activityTypeId = tc.categoryId LEFT JOIN user u ON a.assignTo = u.userId WHERE a.deleted = '0' AND a.dueDate > CURRENT_TIMESTAMP AND a.userId = ? AND a.clientId =? " + where
        let [totalData] = await readConn.query(csql, [data.userCId, data.clientId])

        // const sql = "SELECT a.id AS activityId, a.activityTypeId, ac.activiryName AS activityName, a.dueDate AS dueDate, a.assignTo AS assigntoId, CONCAT(u.firstName, ' ', u.lastName) AS assigntoName FROM userActivityLog AS a, mstActivity AS ac, user AS u WHERE a.deleted = '0' AND a.dueDate > CURRENT_TIMESTAMP AND a.activityTypeId = ac.activityId AND a.assignTo = u.userId AND a.userId = ? AND a.clientId = ? " + where + " LIMIT ? OFFSET ?";
        const sql = "SELECT a.id AS activityId, a.activityTypeId, tc.categoryName AS activityName, a.dueDate AS dueDate, a.assignTo AS assigntoId, CONCAT(u.firstName, ' ', u.lastName) AS assigntoName FROM userActivityLog a LEFT JOIN taskCategory tc ON a.activityTypeId = tc.categoryId LEFT JOIN user u ON a.assignTo = u.userId WHERE a.deleted = '0' AND a.dueDate > CURRENT_TIMESTAMP AND a.userId = ? AND a.clientId =? " + where + "  LIMIT ? OFFSET ?"

        let [result] = await readConn.query(sql, [data.userCId, data.clientId, Number(data.limit), Number(data.offset)]);

        return { count: totalData[0].totalData, data: result }
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.getUserActivitiesListData_past = async (data) => {
    try {
        let where = '';
        if (data.searchTypeText !== '') {
            where += " AND tc.categoryName LIKE '%" + data.searchTypeText + "%'";
        }
        if (data.searchDateText !== '') {
            where += " AND a.dueDate LIKE '%" + data.searchDateText + "%'";
        }
        if (data.searchAssignUserText !== '') {
            where += " AND CONCAT(u.firstName, ' ', u.lastName) LIKE '%" + data.searchAssignUserText + "%'";
        }


        // const csql = "SELECT COUNT(id) as totalData FROM userActivityLog WHERE deleted = '0' AND dueDate <= CURRENT_TIMESTAMP"
        const csql = "SELECT count(a.id) AS totalData FROM userActivityLog a LEFT JOIN taskCategory tc ON a.activityTypeId = tc.categoryId LEFT JOIN user u ON a.assignTo = u.userId WHERE a.deleted = '0' AND a.dueDate <= CURRENT_TIMESTAMP AND a.userId = ? AND a.clientId =? " + where
        let [totalData] = await readConn.query(csql, [data.userCId, data.clientId])

        // const sql = "SELECT a.id AS activityId, a.activityTypeId, ac.activiryName AS activityName, a.dueDate AS dueDate, a.assignTo AS assigntoId, CONCAT(u.firstName, ' ', u.lastName) AS assigntoName FROM userActivityLog AS a, mstActivity AS ac, user AS u WHERE a.deleted = '0' AND a.dueDate <= CURRENT_TIMESTAMP AND a.activityTypeId = ac.activityId AND a.assignTo = u.userId AND a.userId = ? AND a.clientId = ? " + where + "  LIMIT ? OFFSET ?";

        const sql = "SELECT a.id AS activityId, a.activityTypeId, tc.categoryName AS activityName, a.dueDate AS dueDate, a.assignTo AS assigntoId, CONCAT(u.firstName, ' ', u.lastName) AS assigntoName FROM userActivityLog a LEFT JOIN taskCategory tc ON a.activityTypeId = tc.categoryId LEFT JOIN user u ON a.assignTo = u.userId WHERE a.deleted = '0' AND a.dueDate <= CURRENT_TIMESTAMP AND a.userId = ? AND a.clientId =? " + where + "  LIMIT ? OFFSET ?"

        let [result] = await readConn.query(sql, [data.userCId, data.clientId, Number(data.limit), Number(data.offset)]);

        return { count: totalData[0].totalData, data: result }
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.getDetailUserActivityListData = async (data) => {
    try {
        const sql = "SELECT a.id AS activityId, a.activityTypeId, ac.activiryName AS activityName, a.dueDate, a.assignTo AS assigntoId, CONCAT(u.firstName, ' ', u.lastName) AS assigntoName FROM userActivityLog AS a, mstActivity AS ac, user AS u WHERE a.deleted = '0' AND a.activityTypeId = ac.activityId AND a.assignTo = u.userId AND a.userId = ? AND a.id = ?"
        const [resp] = await readConn.query(sql, [data.userCId, data.activityId]);
        return resp;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}



module.exports.deleteUserActivity = async (data) => {
    try {
        const sql = "UPDATE userActivityLog SET modifiedAt = current_timestamp, deleted = '1', modifiedBy = ? WHERE userId = ? AND id = ?"
        const [resp] = await writeConn.query(sql, [data.userId, data.userCId, data.activityId]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.updateUserActivity = async (data) => {
    try {
        const sql = "UPDATE userActivityLog SET modifiedAt = current_timestamp, isComplete = ?, remarks = ?, modifiedBy = ? WHERE userId = ? AND id = ?"
        const [resp] = await writeConn.query(sql, [data.completeStatus, data.remark, data.userId, data.userCId, data.activityId]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}


module.exports.changeUserStatus = async (data) => {
    try {
        const sql = "UPDATE clientUser SET modifiedAt = current_timestamp, isActive = ?, modifiedBy = ? WHERE id = ?"
        const [resp] = await writeConn.query(sql, [data.activeStatus, data.userId, data.userCId]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}


module.exports.changeUserEmpStatus = async (data) => {
    try {
        const sql = "UPDATE user SET modifiedAt = current_timestamp, isActive = ?, modifiedBy = ? WHERE clientUserId = ?"
        const [resp] = await writeConn.query(sql, [data.activeStatus, data.userId, data.userCId]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}



module.exports.getIfeMPExsist = async (data) => {
    try {
        const sql = "SELECT userId as empId, clientUserId, CONCAT(COALESCE(firstName,''),' ',COALESCE(lastName,'')) AS empName, username, email, phone, password,psw, deleted FROM user WHERE clientUserId = ? AND clientId = ?"
        const [resp] = await readConn.query(sql, [data.userCId, data.clientId]);
        return resp;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}



module.exports.deleteUser = async (data) => {
    try {
        const sql = "UPDATE clientUser SET modifiedAt = current_timestamp, deleted=1, isActive = 0,modifiedBy = ? WHERE id = ?"
        const [resp] = await writeConn.query(sql, [data.userId, data.userCId]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.deleteUserMod = async (data) => {
    try {
        const sql = "UPDATE clientUser SET userId = 0, modifiedAt = current_timestamp, isActive = 0, deleted = 1, modifiedBy = ? WHERE id = ?"
        const [resp] = await writeConn.query(sql, [data.userId, data.userCId]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}


module.exports.deleteUserEmp = async (data) => {
    try {
        const sql = "UPDATE user SET modifiedAt = ?, deleted = 1, isActive = 0, modifiedBy = ? WHERE clientUserId = ?"
        const [resp] = await writeConn.query(sql, [data.currentDateTime, data.userId, data.userCId]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

// module.exports.deletegamificationid = async(UserId,clientId,userId, curFinYrId, modifiedAt)=>{
//     try{
//         const sql = "UPDATE gamification_userConfig SET modifiedAt = ?, status = 2, modifiedBy = ? WHERE userId = ? AND clientId = ? AND financialYearId = ?";
//         const [result] = await writeConn.query(sql,[modifiedAt,userId, UserId, clientId, curFinYrId]);
//         return true;
//     } catch (e) {
//         util.createLog(e);
//         return false;
//     }
// }

module.exports.deletegamificationid = async (data, chkExistingUserinGamificationuserConfigId, finalDate) => {
    try {
        const sql = "UPDATE gamification_userConfig SET modifiedAt = ?, status = 2, modifiedBy = ? WHERE id = ?";
        const [result] = await writeConn.query(sql, [finalDate, data.userId, chkExistingUserinGamificationuserConfigId]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.getUserCountForLisense = async (data) => {
    try {
        const sql = "SELECT COUNT(userId) AS userCount FROM user WHERE isActive = 1 AND deleted = 0 AND userType = '2' AND clientId = ?"
        const [resp] = await readConn.query(sql, [data.clientId]);
        return resp;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.getUserLimitCompany = async (data) => {
    try {
        const sql = "SELECT settingsValue FROM clientSettings WHERE clientId = ? AND settingsType LIKE 'userLimit'"
        const [resp] = await readConn.query(sql, [data.clientId]);
        return resp;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

// module.exports.serachUserOnEmp  = async(data) => {
//     try {
//         const sql = "SELECT * FROM user WHERE isActive = 1 AND deleted = 0 AND clientId = ? AND clientUserId = ?"
//         const [resp] = await readConn.query(sql,[data.clientId, data.userCId]);
//         return resp;
//     } catch (e) {
//         util.createLog(e);
//         return false;
//     }
// }


module.exports.getusersDataDownload = async (data) => {
    try {
        let sql = `SELECT CONCAT(cu.firstName, ' ', cu.lastName) AS userName, cu.email, cu.phone, mstDesig.designationName, IFNULL(ur.roleName,'N/A') AS roleName , ct.cityName,states.stateName,zone.zoneName
                        FROM clientUser AS cu 
                        LEFT JOIN mstDesignation AS mstDesig ON mstDesig.designationId = cu.designationId 
                        LEFT JOIN user AS u ON u.clientUserId = cu.id 
                        LEFT JOIN userRoles AS ur ON ur.id = u.roleId 
                        LEFT JOIN cities AS ct ON ct.cityId = cu.cityId 
                        LEFT JOIN countries AS countrs ON countrs.countryId = cu.countryId 
                        LEFT JOIN states on states.stateId = cu.stateId 
                        LEFT JOIN zone ON zone.zoneId = cu.zoneId 
                        LEFT JOIN mstDesignation AS mstd ON mstd.designationId = cu.designationId 
                        WHERE cu.deleted = 0 AND cu.clientId = ?`;

        if (data.searchUserName !== undefined && data.searchUserName !== '') {
            sql += " AND CONCAT(cu.firstName, ' ', cu.lastName) LIKE '%" + data.searchUserName + "%'";
        }
        if (data.searchUserPhone !== undefined && data.searchUserPhone !== '') {
            sql += " AND cu.phone LIKE '%" + data.searchUserPhone + "%'";
        }
        if (data.searchUserEmail !== undefined && data.searchUserEmail !== '') {
            sql += " AND cu.email LIKE '%" + data.searchUserEmail + "%'";
        }
        if (data.searchUserRole !== undefined && data.searchUserRole !== '') {
            sql += " AND ur.roleName LIKE '%" + data.searchUserRole + "%'";
        }
        if (data.searchUserDesig !== undefined && data.searchUserDesig !== '') {
            sql += " AND mstDesig.designationName LIKE '%" + data.searchUserDesig + "%'";
        }
        sql += " LIMIT ? OFFSET ? ";
        const [resp] = await readConn.query(sql, [data.clientId, Number(data.limit), Number(data.offset)]);
        return resp;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.deleteUserId = async (data) => {
    try {
        const sql = "UPDATE clientUser SET userId = 0 WHERE id = ?"
        const [resp] = await readConn.query(sql, [data.userCId]);
        return resp;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.updateClientUserId = async (data) => {
    try {
        const sql = "UPDATE clientUser SET userId = ? WHERE id = ?"
        const [resp] = await readConn.query(sql, [data.existingEmpUserId, data.userCId]);
        return resp;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}


module.exports.getAllModuleWiseData = async (data) => {
    try {
        let sql = "SELECT id AS moduleId, name, path, parentId FROM mstModules WHERE status = 1 AND parentId = 0 AND specificModule = ?"

        let [result, fields] = await readConn.query(sql, [data.specificModuleId])

        return result
    } catch (e) {
        util.createLog(e)
        return false
    }
}


module.exports.getAllModuleWiseChildData = async (data, parentId) => {
    try {
        let sql = "SELECT id AS moduleId, name, path, parentId FROM mstModules WHERE status = 1 AND specificModule = ? AND parentId = ?"

        let [result, fields] = await readConn.query(sql, [data.specificModuleId, parentId])

        return result
    } catch (e) {
        util.createLog(e)
        return false
    }
}

module.exports.getModulePremissions = async (data, moduleId) => {
    try {
        let query = "SELECT isView,addPem,editPem,deletePem,approvePem,commercialPem FROM userRoleModule WHERE clientId=? AND roleId = ? AND moduleId = ? AND specificModule = ? AND status = 1"
        let [results, fields] = await readConn.query(query, [data.selectedClientId, data.selectedRoleId, moduleId, data.specificModuleId])
        return results;
    } catch (e) {
        util.createLog(e);
        return false
    }
}


module.exports.delUpdateModulePermission = async (data) => {
    try {

        let query = "UPDATE  userRoleModule SET status = 2, modifiedBy = ?, modifiedDate = CURRENT_TIMESTAMP WHERE clientId = ? AND roleId = ? AND specificModule = ?"

        let [results, fields] = await writeConn.query(query, [data.userId, data.selectedClientId, data.selectedRoleId, data.specificModuleId])

        return true;
    } catch (e) {

        util.createLog(e)
        return false;
    }
}

module.exports.insertModulePermission = async (selectedRoleId, clientId, userId, specificModuleId, isCustomer, data) => {
    try {

        if (data.isView) {
            data.isViewVal = 1;
        } else {
            data.isViewVal = 0;
        }

        if (data.addPem) {
            data.addPemVal = 1;
        } else {
            data.addPemVal = 0;
        }

        if (data.editPem) {
            data.editPemVal = 1;
        } else {
            data.editPemVal = 0;
        }

        if (data.deletePem) {
            data.deletePemVal = 1;
        } else {
            data.deletePemVal = 0;
        }

        if (data.approvePem) {
            data.approvePemVal = 1;
        } else {
            data.approvePemVal = 0;
        }

        if (data.commercialPem) {
            data.commercialPemVal = 1;
        } else {
            data.commercialPemVal = 0;
        }

        let query = "INSERT INTO userRoleModule(clientId, specificModule, roleId, moduleId, isView,addPem, editPem, deletePem, approvePem,commercialPem, createdBy, accessType) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)"

        let params = [clientId, specificModuleId, selectedRoleId, data.moduleId, data.isViewVal, data.addPemVal, data.editPemVal, data.deletePemVal, data.approvePemVal, data.commercialPemVal, userId, isCustomer]

        let [result, fields] = await readConn.query(query, params)
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}




/**
 * @author : Sukanta Samanta
 * @date : 23/06/2023
 * @description : add NEW EMPLOYEE
 * @argument : {}
 * @returns : token
 */

module.exports.gn_addClientUsers = async (data) => {
    try {
        const sql = "INSERT INTO clientUser (clientId, firstName, lastName, email, phone, address, countryId, stateId, cityId, zoneId,profileImgUrl, designationId, createdBy, dob, gender, dateOfJoining, remark, erpCode) VALUES (?, ?, ?, ?,?, ?, ?, ?,?, ?, ?, ?,?,?,?,?,?,?)";
        const [result, fields] = await writeConn.query(sql, [data.clientId, data.firstName, data.lastName, data.email, data.phoneNumber, data.address, data.countryId, data.stateId, data.districtId, data.zoneId, data.profileImgUrl, data.designationId, data.userId, data.dob, data.gender, data.dateOfJoin, data.remark, data.erpCode]);
        return result.insertId
    } catch (e) {
        util.createLog(e);
        return false;
    }
}


/**
 * @author : Sourav Bhoumik
 * @date : 10/07/2023
 * @description : add product Employee mapping
 * @argument : {}
 * @returns : token
 */

module.exports.insertProductEmpMapping = async (rawData, UserId, finalDate, data) => {
    try {
        const sql = "INSERT INTO clientProductMap (clientId, tableName, refId, hmId, hierarchyTypeId, hierarchyDataId, createdAt, assignedBy) VALUES (?, ?, ?, ?,?, ?, ?, ?)";
        const [result, fields] = await writeConn.query(sql, [rawData.clientId, 'user', UserId, 2, data.hierarchyTypeId, data.hierarchyDataId, finalDate, rawData.userId]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}


module.exports.getUserNameById = async (userId, clientId) => {
    try {
        let query = `SELECT CONCAT(COALESCE(user.firstName,''),' ',COALESCE(user.lastName,'')) AS parentUserName, user.userId AS parentUserId, mstDesignation.designationName, user.designationId 
        FROM user, mstDesignation 
        WHERE user.clientId = ?
        AND user.userId = ? 
        AND user.designationId = mstDesignation.designationId `;

        let [result] = await readConn.query(query, [clientId, userId])
        return result.length > 0 ? result[0] : {"parentUserName":"NA", "parentUserId":0, "designationName":"NA", "designationId":0};
    } catch (e) {
        util.createLog(e);
        return {"parentUserName":"NA", "parentUserId":0, "designationName":"NA", "designationId":0};
    }
}

module.exports.getMappedProductDivisions = async (userId, clientId, tableName) => {
    try {
        let query = `SELECT dlocation_mstHierarchyData.hierarchyDataId, dlocation_mstHierarchyData.hmName, dlocation_mstHierarchyTypes.hierarchyTypeId, dlocation_mstHierarchyTypes.hmTypDesc 
                    FROM clientProductMap, dlocation_mstHierarchyData, dlocation_mstHierarchyTypes 
                    WHERE clientProductMap.clientId = ? 
                    AND clientProductMap.refId = ? 
                    AND clientProductMap.tableName = ? 
                    AND clientProductMap.hierarchyDataId = dlocation_mstHierarchyData.hierarchyDataId 
                    AND clientProductMap.hierarchyTypeId = dlocation_mstHierarchyTypes.hierarchyTypeId 
                    AND clientProductMap.status = 1 `;

        let [result] = await readConn.query(query, [clientId, userId, tableName])
        return result.length > 0 ? result : [];
    } catch (e) {
        util.createLog(e);
        return [];
    }
}



/**
 * @author : Prosenjit Paul
 * @date : 28/11/2023
 * @description : add user
 * @argument : {}
 * @returns : token
 */

module.exports.addUser_dao = async (data)=>{
    try{
        let sql = " INSERT INTO clientUser (parentUserId,clientId,firstName,lastName,profileImgUrl,email,phone,address,dob,gender,userType,countryId,stateId,districtId,cityId,zoneId,designationId,dateOfJoining,remark,erpCode,deleted,createdBy) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) "
        let [result] = await writeConn.query(sql,["0",data.clientId,data.firstName,data.lastName,data.profileImgUrl,data.email,data.phoneNumber,data.address,data.dob,data.gender,"2","0","0","0","0","0",data.designationId,data.dateOfJoin,data.remark,data.erpCode,"0",data.createdBy])
        return true
    }catch(ex){

        return false;
    }
}

module.exports.getUserType = async(data) =>{
    try{
        let sql = "SELECT userId FROM `user`  WHERE clientId = ? AND userType = ? AND isActive = ? AND deleted = ? AND isApproved =  ?";
        let [result] = await readConn.query(sql,[ data.clientId,"1","1","0","1"]);
        return result.length > 0 ? result[0]: 0;

    }catch(ex){

        util.createLog(ex);
    }
}


module.exports.ifUserPhoneExist = async (data)=>{
    try{
        let sql ="SELECT phone FROM  clientUser WHERE isActive = '1' AND deleted = 0 AND clientId = ? AND phone = ?   "
        const [result] = await readConn.query(sql, [data.clientId,data.phoneNumber]);
        return result.length > 0 ? true: false; 
    }catch(ex){
        util.createLog(ex);
    }
}

module.exports.ifUserEmailExist = async (data)=>{
    try{
        let sql ="SELECT email FROM  clientUser WHERE isActive = '1' AND deleted = 0  AND clientId = ? AND email = ? "
        const [result] = await readConn.query(sql, [data.clientId,data.email]);
        return result.length > 0 ? true: false; 
    }catch(ex){
        util.createLog(ex);
    }
}

module.exports.getModuleWiseDataByAdmin = async (data,parentId) => {
    try {
        let sql = "SELECT a.id AS moduleId, a.name, a.path, a.parentId FROM mstModules a,userRoleModule b WHERE  b.clientId=? and b.roleId=? AND b.specificModule = ? and b.moduleId=a.id and b.status=1 and a.status = 1 AND a.parentId = ? "

        let [result, fields] = await readConn.query(sql, [data.selectedClientId,data.selectedRoleId,data.specificModuleId,parentId])

        return result
    } catch (e) {
        util.createLog(e)
        return false
    }
}

module.exports.getChildModuleWiseDataByAdmin = async (data,parentId) => {
    try {
        let sql = "SELECT a.id AS moduleId, a.name, a.path, a.parentId FROM mstModules a WHERE a.status = 1 AND a.parentId = ? "

        let [result, fields] = await readConn.query(sql, [parentId])

        return result
    } catch (e) {
        util.createLog(e)
        return false
    }
}

module.exports.getMainModulesDataByAdmin = async (data,parentId) => {
    try {
        let sql = "SELECT a.id AS moduleId, a.name, a.path, a.parentId FROM mstModules a WHERE  a.specificModule = ? AND a.status = 1 AND a.parentId = ? "

        let [result, fields] = await readConn.query(sql, [data.specificModuleId,parentId])

        return result
    } catch (e) {
        util.createLog(e)
        return false
    }
}

//  generate sample excel for employee
/**
 * @author : Prosenjit Paul
 * @date : 05/02/2024
 * @description : get location level
 * @argument : 
 * @returns
 */

module.exports.EmployeeLocation = async (data)=>{
    try{
        let param = [];
        let sql =`SELECT hmTypDesc FROM dlocation_mstHierarchyTypes WHERE clientId = ? AND hmId =1 AND status =1`
        param.push(data.clientId)
        const [result]=await readConn.query(sql,param)
        return result;

    }catch(e){
        util.createLog(e);
        return false;
    }
}
//  upload excel dao
/**
 * @author : Prosenjit Paul
 * @date : 05/02/2024
 * @description : get location lavel for Checking
 * @argument : 
 * @returns
 */

module.exports.getRoleId = async (clientId,role) => {
    try {
        let params = [];
        let sql = `SELECT id as roleId FROM userRoles 
                   WHERE clientId=? 
                   AND status=1 
                   AND roleType = 1`
        params.push(clientId);           
        if(role !== undefined && role != null && role != ''){
            sql+=" AND roleName LIKE ? "
            params.push('%'+role+'%');
        }           

        let [result] = await readConn.query(sql,params)
        return result.length  > 0 ? result[0].roleId : 0;
    } catch (e) {
        util.createLog(e)
        return false
    }
}

/**
 * @author : Prosenjit Paul
 * @date : 05/02/2024
 * @description : get location lavel for Checking
 * @argument : 
 * @returns
 */
// module.exports.phoneExist_for_ClientUser = async (clientId,phoneNumber)=>{
//     try{
//         let sql =`SELECT phone FROM clientUser WHERE isActive = '1' AND userId = 0 AND deleted = 0 AND phone = ? AND clientId = ? `
//         const [result] = await readConn.query(sql,[phoneNumber,clientId])
//         return result
//     }catch(e){

//         return false;
//     }
// }


module.exports.phoneExist_for_ClientUser = async (clientId,phoneNumber)=>{
    try{
        let params=[];
        let sql =`SELECT id FROM clientUser 
        WHERE isActive = '1' 
        AND deleted = 0  
        AND clientId = ? `
        params.push(clientId);
        if(phoneNumber !== undefined && phoneNumber !== null && phoneNumber != ''){
            sql+=" AND phone LIKE ? ";
            params.push('%'+phoneNumber+'%')
        }

        const [result] = await readConn.query(sql,params)
        return result.length !=0 ? result[0].id : 0;
    }catch(e){

        return false;
    }
}
/**
 * @author : Prosenjit Paul
 * @date : 05/02/2024
 * @description : get location lavel for Checking
 * @argument : 
 * @returns
 */
// module.exports.phoneExist_for_User = async (clientId,phoneNumber) => {
//     try {
//         const sql = "SELECT phone FROM user WHERE isActive = 1 AND deleted = 0 AND phone = ? AND clientId = ? ";
//         const [result, fields] = await writeConn.query(sql, [phoneNumber,clientId]);
//         return result
//     } catch (e) {
//         util.createLog(e);
//         return false;
//     }
// }

module.exports.phoneExist_for_User = async (clientId,phoneNumber) => {
    try {
        let params=[];
        let sql = `SELECT userId FROM user 
        WHERE isActive = 1 
        AND deleted = 0 
        AND clientId = ? `;
        params.push(clientId);
        if(phoneNumber !== undefined && phoneNumber !== null && phoneNumber != ''){
            sql+=" AND phone LIKE ? ";
            params.push('%'+phoneNumber+'%')
        }

        const [result, fields] = await readConn.query(sql, params);
        return result.length !=0 ? result[0].userId : 0;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}
/**
 * @author : Prosenjit Paul
 * @date : 05/02/2024
 * @description : get location lavel for Checking
 * @argument : 
 * @returns
 */
module.exports.checkEmailExist = async (clientId,data, table) => {
    try {
        const sql = "SELECT email FROM " + table + " WHERE deleted = 0 AND isActive = 1 AND email = ? AND clientId = ? ";
        const [result, fields] = await writeConn.query(sql, [data.Email,clientId]);
        return result
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

/**
 * @author : Prosenjit Paul
 * @date : 05/02/2024
 * @description : get location lavel for Checking
 * @argument : 
 * @returns
 */

module.exports.get_locationLavels = async (clientId)=> {
    try{
        let params =[];
        let sql =`SELECT hierarchyTypeId,hmTypDesc,SlNo FROM dlocation_mstHierarchyTypes
                  Where clientId= ? 
                  And hmId=1 
                  AND status =1 `
        params.push(clientId);
        const[result]=await readConn.query(sql,params);
        return result;
    }catch(e){
        util.createLog(e);
        return false;
    }
}

/**
 * @author : Prosenjit Paul
 * @date : 05/02/2024
 * @description : get location lavel 
 * @argument : 
 * @returns
 */

module.exports.locationLavels = async (clientId)=>{
    try{
        let params =[];
        let sql =`SELECT hierarchyTypeId,hmTypDesc,SlNo FROM dlocation_mstHierarchyTypes
                  Where clientId= ? 
                  And hmId=1 
                  AND status =1 `
        params.push(clientId);
        sql+=" ORDER BY SlNo DESC";
        const[result]=await readConn.query(sql,params);
        return result;
    }catch(e){
        util.createLog(e);
        return false;
    }
}

/**
 * @author : Prosenjit Paul
 * @date : 28/12/2023
 * @description : get location location hierarchy 
 * @argument : 
 * @returns
 */
module.exports.getLastLevelLocation =async (clientId,hierarchyTypeId,hmName)=>{
    try{
        let params =[];
        let sql =`SELECT hierarchyDataId,mstHierarchyTypeId AS hierarchyTypeId 
                  FROM dlocation_mstHierarchyData
                  WHERE clientId =? 
                  And hmId=1
                  AND mstHierarchyTypeId= ? `
        params.push(clientId);
        params.push(hierarchyTypeId);
        if(hmName !== undefined && hmName!= null && hmName != ''){
            sql+=" AND hmName LIKE ?"
            params.push('%'+hmName+'%')
        }
        const[result]=await readConn.query(sql,params);
        return result;
    }catch(e){
        util.createLog(e);
        return false;
    }
}

/**
 * @author : Prosenjit Paul
 * @date : 05/02/2024
 * @description : get location lavel for Checking
 * @argument : 
 * @returns
 */

module.exports.uploasData_getUserLimitCompany = async (data) => {
    try {
        const sql = "SELECT settingsValue FROM clientSettings WHERE clientId = ? AND settingsType LIKE 'userLimit'"
        const [resp] = await readConn.query(sql, [data.clientId]);
        return resp;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

/**
 * @author : Prosenjit Paul
 * @date : 05/02/2024
 * @description : get location lavel for Checking
 * @argument : 
 * @returns
 */
module.exports.UploadData_getUserCountForLisense = async (data) => {
    try {
        const sql = "SELECT COUNT(userId) AS userCount FROM user WHERE isActive = 1 AND deleted = 0 AND userType = '2' AND clientId = ?"
        const [resp] = await readConn.query(sql, [data.clientId]);
        return resp;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}
/**
 * @author : Prosenjit Paul
 * @date : 05/02/2024
 * @description : get location lavel for Checking
 * @argument : 
 * @returns
 */
module.exports.UploadData_addClientUsers = async (data) => {
    try {
        const sql = "INSERT INTO clientUser (clientId, firstName, lastName, email, phone,countryCode, address, countryId, stateId, cityId, zoneId,profileImgUrl, designationId, createdBy, dob, gender, dateOfJoining, remark, erpCode, parentUserId) VALUES (?, ?, ?, ?,?, ?, ?, ?,?, ?, ?, ?,?,?,?,?,?,?,?,?)";
        const [result, fields] = await writeConn.query(sql, [data.clientId, data.firstName, data.lastName, data.email, data.phoneNumber,data.countryCode, data.address, data.countryId, data.stateId, data.districtId, data.zoneId, data.profileImgUrl, data.designationId, data.userId, data.dob, data.gender, data.dateOfJoin, data.remark, data.erpCode, data.parentUserId]);
        return result.insertId
    } catch (e) {
        util.createLog(e);
        return false;
    }
}
/**
 * @author : Prosenjit Paul
 * @date : 05/02/2024
 * @description : add cient and user location in client Location Map
 * @argument : 
 * @returns
 */
module.exports.UploadData_addEmployeelocation = async (data1, data, insertId, tableName) => {
    try {

        let sql = "INSERT INTO clientLocationMap (clientId, tableName, refId, countryId, stateId , districtId, zoneId, status, assignedBy, mstHierarchyTypeId, hierarchyDataId) VALUES (?,?,?,?,?,?,?,?,?,?,?)";

        const [resp] = await writeConn.query(sql, [data1.clientId, tableName, insertId, 0, 0, 0, 0, 1, data1.userId, data.hierarchyTypeId, data.hierarchyDataId]);
        return resp.insertId;

    } catch (err) {

        util.createLog(err);
        return false;
    }
}
/**
 * @author : Prosenjit Paul
 * @date : 05/02/2024
 * @description : insert user data
 * @argument : 
 * @returns
 */
module.exports.UploadData_addUsers = async (data, clientUserId) => {
    try {

        const sql = "INSERT INTO user (clientId, clientUserId, firstName, lastName, username, email, phone,countryCode, address, password,psw,countryId, stateId, districtId, cityId,zoneId, roleId, profileImgUrl, designationId, userType, createdBy, tcsERPcode, cmpERPcode, parentUserId,empType) VALUES (?, ?, ?, ?,?, ?, ?, ?,?, ?, ?, ?,?, ?, ?, ?,?,?,?,?,?,?,?,?,?)";
        const [result, fields] = await writeConn.query(sql, [data.clientId, clientUserId, data.firstName, data.lastName, data.username, data.email, data.phoneNumber,data.countryCode, data.address, data.password,data.password, data.countryId, data.stateId, data.districtId, data.districtId, data.zoneId, data.role_id, data.profileImgUrl, data.designationId, '2', data.userId, data.erpCode, data.erpCode, data.parentUserId,data.empType]);
        return result.insertId
    } catch (e) {
        util.createLog(e);
        return false;
    }
}


/**
 * @author : Prosenjit Paul
 * @date : 05/02/2024
 * @description : add product Employee mapping upload Data
 * @argument :
 * @returns : 
 */

module.exports.UploadData_insertProductEmpMapping = async (rawData, UserId, finalDate, data) => {
    try {
        const sql = "INSERT INTO clientProductMap (clientId, tableName, refId, hmId, hierarchyTypeId, hierarchyDataId, createdAt, assignedBy) VALUES (?, ?, ?, ?,?, ?, ?, ?)";
        const [result, fields] = await writeConn.query(sql, [rawData.clientId, 'user', UserId, 2, data.hierarchyTypeId, data.hierarchyDataId, finalDate, rawData.userId]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}
/**
 * @author : Prosenjit Paul
 * @date : 05/02/2024
 * @description : get Product lavel 
 * @argument : 
 * @returns
 */

module.exports.productLavels = async (clientId)=>{
    try{
        let params =[];
        let sql =`SELECT hierarchyTypeId,hmTypDesc,SlNo FROM dlocation_mstHierarchyTypes
                  Where clientId= ? 
                  And hmId=2
                  AND status =1 `
        params.push(clientId);
        const[result]=await readConn.query(sql,params);
        return result;
    }catch(e){
        util.createLog(e);
        return false;
    }
}

/**
 * @author : Prosenjit Paul
 * @date : 05/02/2024
 * @description : get location hierarchy 
 * @argument : 
 * @returns
 */
module.exports.getLastLevelProduct=async (clientId,hierarchyTypeId,hmName)=>{
    try{
        let params =[];
        let sql =`SELECT hierarchyDataId,mstHierarchyTypeId AS hierarchyTypeId 
                  FROM dlocation_mstHierarchyData
                  WHERE clientId =? 
                  And hmId=2
                  AND mstHierarchyTypeId= ? `
        params.push(clientId);
        params.push(hierarchyTypeId);
        if(hmName !== undefined && hmName!= null && hmName != ''){
            sql+=" AND hmName = ?"
            params.push(hmName)
        }
        const[result]=await readConn.query(sql,params);
        return result;
    }catch(e){
        util.createLog(e);
        return false;
    }
}

/**
 * @author : Prosenjit Paul
 * @date : 05/02/2024
 * @description : get designationId
 * @argument : 
 * @returns
 */

module.exports.UploadData_getdesignationId = async (clientId, data) => {
    try {
        let params= [];
        let query = "SELECT designationId, designationName FROM mstDesignation WHERE clientId=? AND isActive=1 AND deleted=0 ";
        params.push(clientId);

        if(data.Designation !== undefined && data.Designation != null && data.Designation != ""){
            query+=" AND designationName = ? "
            params.push(data.Designation)
        }
        let [result, field] = await readConn.query(query, params)
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}
/**
 * @author : Prosenjit Paul
 * @date : 05/02/2024
 * @description : update clientUser
 * @argument : 
 * @returns
 */
module.exports.updateUserData_Map = async (data, UserId, respCilentUserId) => {
    try {
        let query = "UPDATE clientUser SET userId = ?, modifiedBy = ?, modifiedAt = ? WHERE id = ?";
        let [result, field] = await readConn.query(query, [UserId, data.userId, data.currentDateTime, respCilentUserId])
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

/**
 * @author : Prosenjit Paul
 * @date : 05/02/2024
 * @description : get FinancialYear
 * @argument : 
 * @returns
 */

module.exports.financialyearDetail_user = async (data, finalDate) => {
    try {
        const sql = "SELECT financialyearId FROM mstFinancialYear WHERE clientId= ? AND ? BETWEEN financialYearStartDate AND financialYearEndDate";
        const [result] = await readConn.query(sql, [data.clientId, finalDate]);
        return result.length > 0 ? result[0].financialyearId : 0;
    } catch (e) {
        util.createLog(e);
        return 0;
    }
}

/**
 * @author : Prosenjit Paul
 * @date : 05/02/2024
 * @description : get gamification levelMaster
 * @argument : 
 * @returns
 */
module.exports.minlevelid_user = async (clientId) => {
    try {
        const sql = "SELECT levelId,MIN(slNo) as minslNo FROM gamification_levelMaster WHERE clientId= ? AND status=1;";
        const [result] = await readConn.query(sql, [clientId]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

/**
 * @author : Prosenjit Paul
 * @date : 05/02/2024
 * @description : insert gamification userConfig data
 * @argument : 
 * @returns
 */
module.exports.addingamificationuserconfig_user = async (data, UserId, financialYearId, levelId) => {
    try {
        const sql = "INSERT INTO gamification_userConfig (clientId,userId,designationId,levelId,achievePercentage,pointsEarned,progressPercentage,processStatus,financialYearId,createdBy) VALUES (?,?,?,?,?,?,?,?,?,?)"
        const [result] = await writeConn.query(sql, [data.clientId, UserId, data.designationId, levelId, 0, 0, 0, 1, financialYearId, data.userId]);
        return result.insertId;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

/**
 * @author : Prosenjit Paul
 * @date : 05/02/2024
 * @description : insert gamification userPointEarnedLog  Data
 * @argument : 
 * @returns
 */
module.exports.dataAddIntoPointsLog_user = async (data, UserId) => {
    try {
        const sql = "INSERT INTO gamification_userPointEarnedLog (clientId,userId,description,type,unitId) VALUES (?,?,?,?,?)"
        const [result] = await writeConn.query(sql, [data.clientId, UserId, 'Intial starting points', 'initial', 1]);
        return result.insertId;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}


// ----------------------------------------------------------------------------------


/**
 * @author : Prosenjit Paul
 * @date : 17/03/2024
 * @description : multiple number update for clientUser
 * @argument : 
 * @returns
 */
module.exports.registerCientUserUpdate = async (clientId, id,registerPhone,notregisterPhone) =>{
    try{
        let sql=`UPDATE clientUser SET phone = ? WHERE clientId = ?  AND id = ?  `
        const[result]= await writeConn.query(sql,[notregisterPhone.join(','),clientId,id]);
        return true; 
    }catch(e){
        util.createLog(e);
        return false;
    }
}


/**
 * @author : Prosenjit Paul
 * @date : 17/03/2024
 * @description : multiple number update for User
 * @argument : 
 * @returns
 */

module.exports.registeredUserUpdate = async (clientId, id,registerPhone,notregisterPhone) =>{
    try{
        let sql=`UPDATE user SET phone = ? WHERE clientId = ?  AND userId = ?  `
        const[result]= await writeConn.query(sql,[notregisterPhone.join(','),clientId,id]);
        return true; 
    }catch(e){
        util.createLog(e);
        return false;
    }
}




module.exports.getAllUserListOfCompany = async (data) => {
    try {

        let where = '';
        let queryparams = [];

        let sql = `SELECT user.userId, CONCAT(COALESCE(user.firstName,''),' ', COALESCE(user.lastName,'')) AS userName, user.phone, mstDesignation.designationName, mstDesignation.designationId,
                    GROUP_CONCAT(DISTINCT dlocation_mstHierarchyData.hierarchyDataId) AS hierarchyDataId
                    FROM user, mstDesignation, clientLocationMap, dlocation_mstHierarchyData
                    WHERE user.clientId = ?
                    AND user.isActive = 1
                    AND user.isApproved = 1
                    AND user.userType IN (1, 2)
                    AND user.designationId = mstDesignation.designationId
                    AND user.userId = clientLocationMap.refId
                    AND clientLocationMap.clientId = ?
                    AND clientLocationMap.tableName = 'user'
                    AND clientLocationMap.status = 1
                    AND clientLocationMap.hierarchyDataId = dlocation_mstHierarchyData.hierarchyDataId`


        queryparams.push(data.clientId);
        queryparams.push(data.clientId);


        
        if (data.searchUserId !== undefined && data.searchUserId != "" && data.searchUserId != null) {
            sql += " AND user.userId = ?"
            queryparams.push(data.searchUserId);
        }

        if (data.searchName !== undefined && data.searchName != "") {
            sql += " AND (user.firstName LIKE ? OR user.lastName LIKE ? OR user.phone LIKE ? OR CONCAT(COALESCE(user.firstName,''),' ',COALESCE(user.lastName,'')) LIKE ? OR user.email LIKE ? OR mstDesignation.designationName LIKE ?) ";

            queryparams.push('%' + data.searchName + '%');
            queryparams.push('%' + data.searchName + '%');
            queryparams.push('%' + data.searchName + '%');

            queryparams.push('%' + data.searchName + '%');
            queryparams.push('%' + data.searchName + '%');
            queryparams.push('%' + data.searchName + '%');
        }

        if (data.designationId !== undefined && data.designationId !== '') {
            sql += " AND user.designationId LIKE ?";
            queryparams.push(data.designationId)
        }

        if(data.allZones && data.allZones.length > 0) {

            sql += " AND clientLocationMap.hierarchyDataId IN ("+data.allZones.join(',')+") "
        }

        sql += " GROUP BY user.userId ORDER BY userName ASC"

        if (data.limit != undefined && data.limit != null && data.limit != '') {
            data.offset === '' ? 0 : data.offset
            sql = sql + ' LIMIT ? OFFSET ? '
            queryparams.push(Number(data.limit), Number(data.offset));
        }

        let [result] = await readConn.query(sql, queryparams);
        return result;
  
    } catch (e) {
        util.createLog(e);
        return false;

    }
}



module.exports.getAllUserListOfCompanyAndExapenseRate = async (data, reqData) => {
    try {

        let queryparams = [];

        let sql = `SELECT hierarchyTypeId, hierarchyDataId, rate, HQmark
                    FROM mst_expenseRatesRules
                    WHERE clientId = ?
                    AND userId = ?
                    AND designationId = ?
                    AND expenseType = ?
                    AND expenseCatagoryId = ?
                    AND applicableFor = ?
                    AND applicableMode = ?
                    AND status = 1`


        queryparams.push(reqData.clientId);
        queryparams.push(data.userId);
        queryparams.push(data.designationId);
        queryparams.push(reqData.expenseTypeId);
        queryparams.push(reqData.expenseCategoryId);
        queryparams.push(reqData.expenseSubCategoryId);
        queryparams.push(reqData.expenseCategoryModeId);



        let [result] = await readConn.query(sql, queryparams);
        return result;
  
    } catch (e) {
        util.createLog(e);
        return false;

    }
}

module.exports.getLocationDataConcatenate_gnUsers = async (userIds,clientId) => {
    try {
        let sql = `SELECT GROUP_CONCAT(DISTINCT clm.hierarchyDataId) AS hierarchyDataId, clm.refId AS userId  

            FROM clientLocationMap AS clm 
            WHERE clm.clientId = ?
            AND clm.refId IN (`+ userIds.join(',') +`)
            AND clm.tableName = 'user' 
            AND clm.status = '1'
            GROUP BY clm.refId`;

        const [resp] = await readConn.query(sql, [clientId]);
        return resp;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}


module.exports.getUsersOfTheLocations = async (data) => {
    try {
        let params = [];
        let sql = `SELECT DISTINCT clm.refId AS userId  

            FROM clientLocationMap AS clm 
            WHERE clm.clientId = ? `

        params.push(data.clientId)
        
        sql += ` AND clm.tableName = 'user' AND clm.status = '1' `

        if(data.allZones !== undefined && data.allZones != '' && data.allZones.length > 0){

            sql += " AND clm.hierarchyDataId IN ("+ data.allZones.join(',') +")"
        }

        // sql += ` GROUP BY clm.refId`;

        const [resp] = await readConn.query(sql, params);
        return resp;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}