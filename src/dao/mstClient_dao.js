const readConn    = require('../dbconnection').readPool
const writeConn   = require('../dbconnection').writePool
const util        = require('../utility/util');
const transaction = require('../transaction');


module.exports.getAllClient  = async() => {
    try {
        const sql = "select clientId, clientName, createdAt from mstClient where isActive = '1' AND deleted = '0'";
        const [result] = await readConn.query(sql)
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

// module.exports.mstClientdata  = async(data) => {
//     try {
//         let where = '';
//         if (data.searchText !== '') {
//             where += " AND cl.clientName LIKE '%" + data.searchText + "%'"
//         }
//         const csql = "SELECT COUNT(clientId) as totalData FROM mstClient WHERE isActive = '1' AND deleted = '0'"
//         let [totalData] = await readConn.query(csql);

//         const sql = "SELECT cl.clientId, cl.clientName,cl.shortCode, cl.email,cl.phone,cl.createdAt,cn.countryName,s.stateName,c.cityName,cn.countryId,s.stateId,c.cityId \
// from mstClient as cl \
// LEFT JOIN countries as cn ON cl.countryId = cn.countryId \
// LEFT JOIN states as s ON cl.stateId=s.stateId \
// LEFT JOIN cities as c ON cl.cityId = c.cityId \
// where cl.isActive = '1' AND cl.deleted = '0' " + where + " LIMIT ? OFFSET ?";

//         let [result] = await readConn.query(sql,[Number(data.limit), Number(data.offset)]);
//         return {count: totalData[0].totalData, data: result}

//     } catch (e) {
//         util.createLog(e);
//         return false;
//     }
// }

module.exports.mstClientdata  = async(data) => {
    try {
        let cparams = [];
        let params = [];
        
        // if (data.searchText !== '') {
        //     where += " AND cl.clientName LIKE '%" + data.searchText + "%'"
        // }
        let csql = "SELECT COUNT(clientId) as totalData FROM mstClient WHERE isActive = '1' AND deleted = '0'"
        

        let sql = `SELECT cl.clientId, cl.clientName,cl.shortCode, cl.email,cl.phone,cl.createdAt,cl.isDefaultLocation,cl.countryCode,cl.address, DATE_FORMAT(cl.createdAt, '%Y-%m-%d') AS createdAtDate
                     FROM mstClient as cl WHERE cl.isActive = '1' AND cl.deleted = '0'  `;


        if (data.searchText !== '') {
            csql += " AND cl.clientName LIKE ?"
            sql += " AND cl.clientName LIKE ?"

            cparams.push("%" + data.searchText + "%")
            params.push("%" + data.searchText + "%")
        }

        
        if(data.limit !== undefined && data.offset !== undefined && data.limit != '' && data.offset != ''  && data.limit != null && data.offset != null){

            sql += " LIMIT ? OFFSET ?"
            params.push(Number(data.limit), Number(data.offset))
        }

        let [totalData] = await readConn.query(csql,cparams);
        let [result] = await readConn.query(sql,params);
        
        return {count: totalData[0].totalData, data: result}

    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.checkEmailExistance = async (email, flag = 0, clientId = 0) => {
    try {
        let sql = "SELECT clientId FROM mstClient WHERE isActive = '1' AND deleted = '0' AND email = ?"
        if (flag === 1) {
            sql += " AND clientId != " + clientId
        }
        let [resp] = await readConn.query(sql, email);
        return resp.length === 0;
    } catch (e) {
        const log = util.createLog(e)
        return false;
    }
}

module.exports.checkPhoneExistance = async (phone, flag = 0, clientId = 0) => {
    try {
        let sql = "SELECT clientId FROM mstClient WHERE isActive = '1' AND deleted = '0' AND phone = ?"
        if (flag === 1) {
            sql += " AND clientId != " + clientId
        }
        let [resp] = await readConn.query(sql, phone);
        return resp.length === 0;
    } catch (e) {
        const log = util.createLog(e)
        return false;
    }
}

module.exports.addClient  = async(data) => {
    try {
        const sql = "INSERT INTO mstClient (clientName,shortCode, email, phone, countryId, stateId, cityId, createdBy) VALUES (?,?, ?, ?, ?, ?, ?, ?)"
        const [res,fields] = await writeConn.query(sql, [data.clientName, data.clientSortCode,data.email, data.phone, data.countryId, data.stateId, data.cityId, data.userId])

        return res.insertId;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.getNewAddedCompanyData = async (clientId) => {
    try {
        let params = [];
        let sql = "SELECT clientId, shortCode FROM mstClient WHERE clientId = ?"
        params.push(clientId)

        let [resp] = await readConn.query(sql, params);
        return resp;
    } catch (e) {
        const log = util.createLog(e)
        return false;
    }
}

module.exports.updateCompanySecrets  = async(clientId, clientSecret, companyKey) => {
    try {
        const sql = "UPDATE mstClient SET clientSecret = ?, companyKey = ? WHERE clientId = ?"
        const [res] = await writeConn.query(sql, [clientSecret, companyKey, clientId])
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.updateClient  = async(data) => {
    try {
        const sql = "UPDATE mstClient SET clientName = ?, shortCode = ?, email = ?, phone = ?, countryCode = ?, address = ?, modifiedAt = ?, modifiedBy = ?, companyKey = ? WHERE clientId = ?"
        const [res] = await writeConn.query(sql, [data.clientName, data.clientSortCode, data.email, data.phone, data.countryCode, data.address, data.currentDateTime, data.userId, data.companyKey,data.clientId])
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.deleteClient  = async(data) => {
    try {
        const sql = "UPDATE mstClient SET deleted = '1', modifiedBy = ? WHERE clientId = ?"
        const [res] = await writeConn.query(sql, [data.userId, data.client_id])

        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.addCompanyAdminUser  = async(data) => {

    try {
        const sql = "INSERT INTO user ( clientId, firstName, lastName, password,psw, username, email, phone, stateId, countryId, districtId, cityId, roleId, profileImgUrl, designationId, userType, isActive, deleted, isApproved, createdBy, createdAt, modifiedBy) VALUES ( ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 0, 1, ?, NOW(), ?);"
        const [res,fields] = await writeConn.query(sql, [data.clientId,data.firstName,data.lastName, data.password,data.password,data.username,data.email, data.phone, data.stateId, data.countryId, data.cityId, data.cityId, data.roleId, data.profileImgUrl,data.designationId,data.userType,data.userId,data.userId])
        return res.insertId;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.updateCompanyAdmin  = async(userId) => {
    try {
        const sql = "UPDATE user SET erpCode = ? WHERE userId = ?"
        const [res] = await writeConn.query(sql, ["ERP-U-"+userId, userId]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.updateClientLocationMap  = async(data) => {
    try {
        const sql = "UPDATE clientLocationMap SET countryId = ? , stateId = ?, districtId = ? WHERE tableName = 'mstClient' AND refId = ?"
        const [res] = await writeConn.query(sql, [data.countryId,data.stateId,data.cityId,data.clientId]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.updateUser  = async(data) => {
    try {
        const sql = "UPDATE user SET firstName=?,username=?,email=?,phone=?,countryId=?,stateId=?,cityId=? WHERE clientId = ? AND userType = ?"
        const [res] = await writeConn.query(sql, [data.firstName,data.username,data.email,data.phone,data.countryId,data.stateId,data.cityId,data.clientId,data.userType]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.checkPhoneExistanceUpdate = async (data) => {
    try {
        let sql = "SELECT COUNT(clientId) AS counter FROM mstClient WHERE isActive = '1' AND deleted = '0' AND phone = ? AND clientId != ?"
        let [resp,fields] = await readConn.query(sql, [data.phone,data.clientId]);
        return resp[0].counter;
    } catch (e) {
        const log = util.createLog(e)
        return false;
    }
}

module.exports.checkEmailExistanceUpdate = async (data) => {
    try {
        let sql = "SELECT COUNT(clientId) AS counter FROM mstClient WHERE isActive = '1' AND deleted = '0' AND email = ? AND clientId != ?"
        let [resp,fields] = await readConn.query(sql, [data.email,data.clientId]);
        return resp[0].counter;
    } catch (e) {
        const log = util.createLog(e)
        return false;
    }
}

module.exports.addRole = async (data) =>{
    try{
        let sql = `INSERT INTO userRoles (clientId,roleName,description,status,createdBy,createDate, roleType) VALUES (?,?,?,'1',?,current_timestamp, ?)`;
        const [res] = await writeConn.query(sql, [data.clientId,data.roleName,data.description,data.createdBy, '2'])
        return res.insertId;

    }catch(e){
        const log = util.createLog(e)
        return false;
    }
}

module.exports.addDesignation = async (data) =>{
    try{
        let sql = `INSERT INTO mstDesignation (clientId,designationName,isActive,deleted,createdBy,createdAt) VALUES (?,?,1,0,?,current_timestamp)`;
        const [res] = await writeConn.query(sql, [data.clientId,data.designationName,data.createdBy])
        return res.insertId;

    }catch(e){
        const log = util.createLog(e)
        return false;
    }
}

module.exports.updateRoleAndDesignation = async (clientId,userId,roleId,designationId) =>{
    try{
        let sql = `UPDATE user SET roleId = ? , designationId = ? WHERE userId = ? AND clientId = ?`;
        const [res] = await writeConn.query(sql, [roleId,designationId,userId,clientId]);
        return true;
    }catch(e){
        const log = util.createLog(e)
        return false;
    }
}

module.exports.addNAzone = async (clientId,userId) =>{
    try{
        let sql = `INSERT INTO zone (clientId,countryId,stateId,cityId,zoneName,isActive,deleted,createdBy,createdAt) VALUES (?,'253','4122','840','NA','1','0',?,current_timestamp)`;
        const [res] = await writeConn.query(sql, [clientId,userId]);
        return res.insertId;
    }catch(e){
        const log = util.createLog(e)
        return false;
    }
}

module.exports.addClientSettings = async (clientId,title,settingsType,settingsValue) =>{
    try{
        let sql = `INSERT INTO clientSettings (clientId,title,settingsType,settingsValue) VALUES (?,?,?,?)`;
        const [res] = await writeConn.query(sql, [clientId,title,settingsType,settingsValue]);
        return true;
    }catch(e){
        const log = util.createLog(e)
        return false;
    }
}

/**
 * @author : Sourav Bhoumik
 * @date : 07/08/2023
 * @description : upload company's promotional banners
 * @argument : 
 * @returns
 */

module.exports.insertBannerIntoDb  = async(data) => {
    try {
        const sql = "INSERT INTO `clientPromoPosters` (clientId,fileName, orginalFileName, createdAt, createdBy) VALUES (?,?, ?, ?, ?)"

        const [res,fields] = await writeConn.query(sql, [data.clientId, data.fileName,data.orgfilename, data.currentDateTime, data.userId])
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}


/**
 * @author : Indranil
 * @date : 08/08/2023
 * @description : list promotional banners
 * @argument : 
 * @returns
 * @modifiedBy : Sourav Bhoumik
 */

module.exports.uploadPromationalBannersdata  = async(data) => {
    try {
        let params = [];

        let sql = "SELECT id, clientId, fileName, orginalFileName, orginalFileName, status, createdAt from clientPromoPosters where clientId = ?"
        params.push(data.clientId)

        if (data.status !== undefined && data.status != null && data.status != "") {
            sql += " AND status =  ? ";
            params.push(data.status)
        }else{

            sql += " AND status IN (0, 1)"
        }

        if(data.searchFrom !== undefined && data.searchTo !== undefined){
            if (data.searchFrom && data.searchTo && data.searchFrom != "" && data.searchTo != "")
            {
                sql += " AND createdAt BETWEEN ? AND ? ";
                params.push('' + data.searchFrom + ' 00:00:00');
                params.push('' + data.searchTo + ' 23:59:59');
            }
            else if (data.searchFrom && data.searchFrom != "") {
                sql += " AND DATE_FORMAT(createdAt,'%Y-%m-%d') >= ? ";
                params.push(data.searchFrom);
            }
            else if (data.searchTo && data.searchTo != "") {
                sql += " AND DATE_FORMAT(createdAt,'%Y-%m-%d') <= ? ";
                params.push(data.searchTo);
            }
        }

        if (data.limit != undefined && data.limit != null && data.limit != '') {
            data.offset === '' ? 0 : data.offset
            sql = sql + ' LIMIT ? OFFSET ?'
            params.push(Number(data.limit), Number(data.offset));
        }

        let totalDataCount = 0

        let [result] = await readConn.query(sql,params);
        return {count: totalDataCount, data: result}

    } catch (e) {
        util.createLog(e);
        return false;
    }
}

/**
 * @author : Indranil
 * @date : 08/08/2023
 * @description : delete promotional banners
 * @argument : 
 * @returns
 * @modifiedBy : Sourav Bhoumik
 */

module.exports.deleteUploadPromationalBanners  = async(data) => {
    try {
        const sql = "UPDATE clientPromoPosters SET status = '2', modifiedBy = ?, modifiedAt = ? WHERE id = ? AND clientId = ?"
        const [res] = await writeConn.query(sql, [data.userId, data.currentDateTime, data.id, data.client_id])

        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}


/**
 * @author : Indranil
 * @date : 09/08/2023
 * @description : active or inactive promotional banners
 * @argument : 
 * @returns
 */

module.exports.activeUploadPromationalBanners  = async(data) => {
    try {
        const sql = "UPDATE clientPromoPosters SET status = ?, modifiedBy = ?, modifiedAt = ? WHERE id = ? AND clientId = ?"
        const [res] = await writeConn.query(sql, [data.isActive, data.userId, data.currentDateTime, data.id,data.client_id])

        return {status:data.isActive, value:true};
    } catch (e) {
        util.createLog(e);
        return {status:"",value:false};
    }
}


/**
 * @author : Indranil
 * @date : 09/08/2023
 * @description : active or inactive promotional banners Multiple
 * @argument : 
 * @returns
 */

module.exports.activeUploadPromationalBannersMultiple  = async(dataId, data1) => {
    try {
        const sql = "UPDATE clientPromoPosters SET status = ?, modifiedBy = ?, modifiedAt = ? WHERE id = ? AND clientId = ?"
        const [res] = await writeConn.query(sql, [data1.isActive, data1.userId, data1.currentDateTime, dataId, data1.client_id])

        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}



/**
 * @author : Prosenjit Paul
 * @date : 06/10/2023
 * @description : get Client Details
 * @argument : 
 * @returns
 */


module.exports.clientDetails_dao = async(data) =>{
    try{
        let params =[]

        const sql =""
        const [resp] = await readConn.query(sql,params)
    }catch(e){
        util.createLog(e);
        return false;
    }
}


module.exports.getHierarchyTypesData = async (clientId, hmId) => {
    try {


        const sql = "SELECT hierarchyTypeId, hmTypDesc, SlNo FROM dlocation_mstHierarchyTypes WHERE clientId = ? AND hmId = ? AND status = 1 ORDER BY SlNo ASC";
        const [result] = await writeConn.query(sql, [clientId, hmId]);

        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}


module.exports.getTopHierarchyData = async (clientId, hmId) => {
    try {
 

        const sql = `SELECT dlocation_mstHierarchyData.hierarchyDataId AS id, dlocation_mstHierarchyData.hmName AS name, dlocation_mstHierarchyTypes.hierarchyTypeId AS typeId, dlocation_mstHierarchyTypes.hmTypDesc AS typeName,dlocation_mstHierarchyTypes.SlNo
                FROM dlocation_mstHierarchyData, dlocation_mstHierarchyTypes 
                WHERE dlocation_mstHierarchyData.clientId = ? 
                AND dlocation_mstHierarchyData.status = 1
                AND dlocation_mstHierarchyData.hmId = ?
                AND dlocation_mstHierarchyData.mstHierarchyTypeId = dlocation_mstHierarchyTypes.hierarchyTypeId 
                AND dlocation_mstHierarchyTypes.SlNo IN (SELECT MIN(SlNo) FROM dlocation_mstHierarchyTypes WHERE clientId = ? AND status = 1 AND hmId = ?)`;
        const [result] = await writeConn.query(sql, [clientId, hmId, clientId, hmId]);

        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

/**
 * @author : Sarbojit
 * @date : 27/11/2023
 * @description : Add New Client
 * @argument : 
 * @returns
 */

module.exports.addClientV2  = async(data) => {
    try {
        const sql = "INSERT INTO mstClient (clientName,shortCode, email, phone, countryId, stateId, cityId, createdBy) VALUES (?,?, ?, ?, ?, ?, ?, ?)"
        const [res,fields] = await writeConn.query(sql, [data.clientName, data.clientSortCode,data.email, data.phone, 0, 0, 0, 0])
        return res.insertId;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

/**
 * @author : Sarbojit
 * @date : 27/11/2023
 * @description : Update Comapany Secret keys
 * @argument : 
 * @returns
 */

module.exports.updateCompanySecretsV2  = async(clientId, clientSecret, companyKey) => {
    try {
        const sql = "UPDATE mstClient SET clientSecret = ?, companyKey = ? WHERE clientId = ?"
        const [res] = await writeConn.query(sql, [clientSecret, companyKey, clientId])
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

/**
 * @author : Sarbojit
 * @date : 27/11/2023
 * @description : Create Role For Company
 * @argument : 
 * @returns
 */

module.exports.addRoleV2 = async (data) =>{
    try{
        let sql = `INSERT INTO userRoles (clientId,roleName,description,status,createdBy,createDate, roleType) VALUES (?,?,?,'1',?,current_timestamp, ?)`;
        const [res] = await writeConn.query(sql, [data.clientId,data.roleName,data.description,data.createdBy, '2'])
        return res.insertId;

    }catch(e){
        const log = util.createLog(e)
        return false;
    }
}

/**
 * @author : Sarbojit
 * @date : 27/11/2023
 * @description : Create Designation For Company
 * @argument : 
 * @returns
 */

module.exports.addDesignationV2 = async (data) =>{
    try{
        let sql = `INSERT INTO mstDesignation (clientId,designationName,isActive,deleted,createdBy,createdAt) VALUES (?,?,1,0,?,current_timestamp)`;
        const [res] = await writeConn.query(sql, [data.clientId,data.designationName,data.createdBy])
        return res.insertId;

    }catch(e){
        const log = util.createLog(e)
        return false;
    }
}

/**
 * @author : Sarbojit
 * @date : 27/11/2023
 * @description : Update Client
 * @argument : 
 * @returns
 */

module.exports.updateClientV2  = async(data) => {
    try {
        const sql = "UPDATE mstClient SET clientName = ?, shortCode = ?, email = ?, phone = ?, countryId = ?, stateId = ?, cityId = ?, zoneId = ?, modifiedBy = ?, companyKey = ? WHERE clientId = ?"
        const [res] = await writeConn.query(sql, [data.clientName, data.clientSortCode, data.email, data.phone, data.countryId, data.stateId, data.cityId, data.zoneId, data.userId, data.companyKey,data.clientId])
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

/**
 * @author : Sarbojit
 * @date : 27/11/2023
 * @description : Update Client Location
 * @argument : 
 * @returns
 */

module.exports.updateClientLocationMapV2  = async(data) => {
    try {
        const sql = "UPDATE clientLocationMap SET countryId = ? , stateId = ?, districtId = ? WHERE tableName = 'mstClient' AND refId = ?"
        const [res] = await writeConn.query(sql, [0,0,0,data.clientId]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

/**
 * @author : Sarbojit
 * @date : 27/11/2023
 * @description : Delete Client
 * @argument : 
 * @returns
 */

module.exports.deleteClientv2  = async(data) => {
    try {
        const sql = "UPDATE mstClient SET deleted = '1', modifiedBy = ? WHERE clientId = ?"
        const [res] = await writeConn.query(sql, [data.userId, data.client_id])

        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

//created by Subham on 11/12/23

module.exports.fetchClientConfiguration  = async() => {
    try {
        const sql = "SELECT * from clientConfig where status=1"
        const [res] = await readConn.query(sql, [])
        return res;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}
module.exports.gn_addClient  = async(connection,data) => {
    try {
        const sql = "INSERT INTO mstClient (clientName,shortCode, email, phone, countryId, stateId, cityId, createdBy) VALUES (?,?, ?, ?, ?, ?, ?, ?)"
        const [res,fields] = await transaction.executeQuery(connection,sql, [data.clientName, data.clientSortCode,data.email, data.phone, 0, 0, 0, 0])
        return res.insertId;
    } catch (e) {
        util.createLog(e);
        throw new Error('Write Query Execution failed:');
    }
}
module.exports.gn_updateCompanySecrets  = async(connection,clientId, clientSecret, companyKey) => {
    try {
        const sql = "UPDATE mstClient SET clientSecret = ?, companyKey = ? WHERE clientId = ?"
        const [res] = await transaction.executeQuery(connection,sql, [clientSecret, companyKey, clientId])
        return true;
    } catch (e) {
        util.createLog(e);
        throw new Error('Write Query Execution failed:');
    }
}
module.exports.gn_addCompanyAdminUser  = async(connection,data) => {

    try {
        const sql = "INSERT INTO user ( clientId, firstName, lastName, password,psw, username, email, phone, stateId, countryId, districtId, cityId, roleId, profileImgUrl, designationId, userType, isActive, deleted, isApproved, createdBy, createdAt, modifiedBy) VALUES ( ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 0, 1, ?, NOW(), ?);"
        const [res,fields] = await transaction.executeQuery(connection,sql, [data.clientId,data.firstName,data.lastName, data.password,data.password,data.username,data.email, data.phone, data.stateId, data.countryId, data.cityId, data.cityId, data.roleId, data.profileImgUrl,data.designationId,data.userType,data.userId,data.userId])
        return res.insertId;
    } catch (e) {
        util.createLog(e);
        throw new Error('Write Query Execution failed:');
    }
}
// module.exports.gn_updateCompanyAdmin  = async(connection,userId) => {
//     try {
//         const sql = "UPDATE user SET erpCode = ? WHERE userId = ?"
//         const [res] = await transaction.executeQuery(connection,sql, ["ERP-U-"+userId, userId]);
//         return true;
//     } catch (e) {
//         util.createLog(e);
//         throw new Error('Write Query Execution failed:');
//     }
// }
module.exports.gn_addRole = async (connection,data) =>{
    try{
        let sql = `INSERT INTO userRoles (clientId,roleName,description,status,createdBy,createDate, roleType) VALUES (?,?,?,'1',?,current_timestamp, ?)`;
        const [res] = await transaction.executeQuery(connection,sql, [data.clientId,data.roleName,data.description,data.createdBy, '2'])
        return res.insertId;

    }catch(e){
        const log = util.createLog(e)
        throw new Error('Write Query Execution failed:');
    }
}
module.exports.gn_addDesignation = async (connection,data) =>{
    try{
        let sql = `INSERT INTO mstDesignation (clientId,designationName,isActive,deleted,createdBy,createdAt) VALUES (?,?,1,0,?,current_timestamp)`;
        const [res] = await transaction.executeQuery(connection,sql, [data.clientId,data.designationName,data.createdBy])
        return res.insertId;

    }catch(e){
        const log = util.createLog(e)
        throw new Error('Write Query Execution failed:');
    }
}
module.exports.gn_updateRoleAndDesignation = async (connection,clientId,userId,roleId,designationId) =>{
    try{
        let sql = `UPDATE user SET roleId = ? , designationId = ? WHERE userId = ? AND clientId = ?`;
        const [res] = await transaction.executeQuery(connection,sql, [roleId,designationId,userId,clientId]);
        return true;
    }catch(e){
        const log = util.createLog(e)
        throw new Error('Write Query Execution failed:');
    }
}
module.exports.gn_addCompanyAdminUser  = async(connection,data) => {
    try {
        const sql = "INSERT INTO user ( clientId, firstName, lastName, password,psw, username, email, phone, stateId, countryId, districtId, cityId, roleId, profileImgUrl, designationId, userType, isActive, deleted, isApproved, createdBy, createdAt, modifiedBy) VALUES ( ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 0, 1, ?, NOW(), ?);"
        const [res,fields] = await transaction.executeQuery(connection,sql, [data.clientId,data.firstName,data.lastName,data.password,data.password,data.username,data.email, data.phone, data.stateId, data.countryId, data.cityId, data.cityId, data.roleId, data.profileImgUrl,data.designationId,data.userType,data.userId,data.userId])
        return res.insertId;
    } catch (e) {
        util.createLog(e);
        throw new Error('Write Query Execution failed:');
    }
}
module.exports.gn_updateCompanyAdmin  = async(connection,userId) => {
    try {
        const sql = "UPDATE user SET erpCode = ? WHERE userId = ?"
        const [res] = await transaction.executeQuery(connection,sql, ["ERP-U-"+userId, userId]);
        return true;
    } catch (e) {
        util.createLog(e);
        throw new Error('Write Query Execution failed:');
    }
}
module.exports.gn_addClientSettings = async (connection,clientId,title,settingsType,settingsValue) =>{
    try{
        let sql = `INSERT INTO clientSettings (clientId,title,settingsType,settingsValue) VALUES (?,?,?,?)`;
        const [res] = await transaction.executeQuery(connection,sql, [clientId,title,settingsType,settingsValue]);
        return true;
    }catch(e){
        const log = util.createLog(e)
        throw new Error('Write Query Execution failed:');
    }
}
module.exports.gn_addMenuPermission = async (connection,clientId,data,roleId) =>{
    try{
        let sql = `INSERT INTO userRoleModule (clientId,specificModule,roleId,moduleId,isView,addPem,editPem,deletePem,approvePem,commercialPem,createdBy) VALUES (?,?,?,?,?,?,?,?,?,?,?)`;
        const [res] = await transaction.executeQuery(connection,sql, [clientId,data.specificModule,roleId,data.id,data.view,data.add,data.edit,data.delete,0,0,0])
        return res.insertId;

    }catch(e){
        const log = util.createLog(e)
        throw new Error('Write Query Execution failed:');
    }
}
module.exports.gn_addOrganization = async (connection,data) =>{
    try{
        let sql = `INSERT INTO organizationManagement (clientId,organizationName,ownerName,phone,email,assignTo,assignType,contactId,contactType,description,accessId,approvedStatus,approvedBy,createdBy) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
        const [res] = await transaction.executeQuery(connection,sql, [data.clientId,data.organizationName,data.ownerName,data.phone,data.email,data.assignTo,data.assignType,data.contactId,data.contactType,data.description,data.accessId,data.approvedStatus,data.approvedBy,data.createdBy])
        return res.insertId;

    }catch(e){
        const log = util.createLog(e)
        throw new Error('Write Query Execution failed:');
    }
}
module.exports.checkUserEmailExistance = async (email) => {
    try {
        let sql = "SELECT userId FROM user WHERE isActive = '1' AND deleted = '0' AND email = ?"
        
        let [resp] = await readConn.query(sql, email);
        return resp.length === 0;
    } catch (e) {
        const log = util.createLog(e)
        return false;
    }
}
module.exports.checkUserPhoneExistance = async (phone) => {
    try {
        let sql = "SELECT userId FROM user WHERE isActive = '1' AND deleted = '0' AND phone = ?"      
        let [resp] = await readConn.query(sql, phone);

        return resp.length === 0;
    } catch (e) {
        const log = util.createLog(e)
        return false;
    }
}
module.exports.deleteClientV3  = async(connection,data) => {
    try {
        const sql = "UPDATE mstClient SET deleted = '1', modifiedBy = ? WHERE clientId = ?"
        const [res] = await transaction.executeQuery(connection,sql, [data.userId, data.client_id])

        return res;
    } catch (e) {
        util.createLog(e);
        throw e
    }
}
module.exports.deleteUserV3  = async(connection,data) => {
    try {
        const sql = "UPDATE user SET deleted = '1', modifiedBy = ? WHERE clientId = ?"
        const [res] = await transaction.executeQuery(connection,sql, [data.userId, data.client_id])
        return res;
    } catch (e) {
        util.createLog(e);
        throw e
    }
}
module.exports.deleteDesignationV3  = async(connection,data) => {
    try {
        const sql = "UPDATE mstDesignation SET deleted = '1', modifiedBy = ? WHERE clientId = ?"
        const [res] = await transaction.executeQuery(connection,sql, [data.userId, data.client_id])
        return res;
    } catch (e) {
        util.createLog(e);
        throw e
    }
}

module.exports.deleteUserRoleV3  = async(connection,data) => {
    try {
        const sql = "UPDATE userRoles SET status = '2', modifiedBy = ? WHERE clientId = ?"
        const [res] = await transaction.executeQuery(connection,sql, [data.userId, data.client_id])
        return res;
    } catch (e) {
        util.createLog(e);
        throw e
    }
}
module.exports.deleteUserRoleModuleV3  = async(connection,data) => {
    try {
        const sql = "UPDATE userRoleModule SET status = '2', modifiedBy = ? WHERE clientId = ?"
        const [res] = await transaction.executeQuery(connection,sql, [data.userId, data.client_id])
        return res;
    } catch (e) {
        util.createLog(e);
        throw e
    }
}


module.exports.gn_addClientV2  = async(connection,data) => {
    try {
        const sql = "INSERT INTO mstClient (clientName,shortCode, email, phone, countryId, stateId, cityId, zoneId, createdBy,createdAt) VALUES (?,?, ?, ?, ?, ?, ?, ?,?,?)"
        const [res,fields] = await transaction.executeQuery(connection,sql, [data.clientName, data.clientSortCode,data.email, data.phone, 0, 0, 0, 0, data.userId, data.currentDateTime])
        return res.insertId;
    } catch (e) {
        util.createLog(e);
        throw new Error('Write Query Execution failed:');
    }
}




module.exports.getModulesForSpecific = async (moduleName) => {
    try {
        let sql = "SELECT id AS moduleId, specificModule, name, path  FROM mstModules WHERE "

        if(moduleName == 'hasSFA'){

            sql += " specificModule IN (2,5)"
        }

        if(moduleName == 'hasCRM'){

            sql += " specificModule IN (19,20)"

        }

        if(moduleName == 'hasDMS'){

            sql += " specificModule IN (8, 18)"
        }

        if(moduleName == 'hasMMS'){

            sql += " specificModule IN (3,6)"
        }

        if(moduleName == 'hasEMS'){

            sql += " specificModule IN (9,14)"
        }

        if(moduleName == 'hasLMS'){

            sql += " specificModule IN (15,16)"
        }

        if(moduleName == 'admin'){

            sql += " specificModule IN (7)"
        }


        sql += " AND status = 1"      
        

        let [resp] = await readConn.query(sql);

        return resp;
    } catch (e) {
        const log = util.createLog(e)
        return false;
    }
}

module.exports.addRoleForNewClient = async (connection,data) =>{
    try{
        let sql = `INSERT INTO userRoles (clientId,roleName,description,status,createdBy,createDate,roleType) VALUES (?,?,?,?,?,?,?)`;
        const [res] = await transaction.executeQuery(connection,sql, [data.clientId,data.roleName,data.description,1,data.createdBy,data.createDate,'2'])
        return res.insertId;

    }catch(e){
        const log = util.createLog(e)
        throw new Error('Write Query Execution failed:');
    }
}
module.exports.addDesignationForNewClient = async (connection,data) =>{
    try{
        let sql = `INSERT INTO mstDesignation (clientId,designationName,isActive,deleted,createdBy,createdAt) VALUES (?,?,?,?,?,?)`;
        const [res] = await transaction.executeQuery(connection,sql, [data.clientId,data.designationName,1,0,data.createdBy,data.createdAt])
        return res.insertId;

    }catch(e){
        const log = util.createLog(e)
        throw new Error('Write Query Execution failed:');
    }
}


module.exports.addCompanyAdminUserForNewClient  = async(connection,data) => {

    try {
        const sql = "INSERT INTO user(empType, clientUserId, clientId, firstName, lastName, password, psw, username, email, phone, countryCode, address, roleId, profileImgUrl, designationId, userType, isActive, deleted, isApproved, approvedBy, approvedAt, approvedRemarks, createdBy, createdAt, modifiedAt, modifiedBy) VALUES ( ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);"
        const [res,fields] = await transaction.executeQuery(connection,sql, [data.empType,data.clientUserId,data.clientId,data.firstName,data.lastName, data.password,data.password,data.username,data.email, data.phone, data.countryCode, data.address, data.roleId, data.profileImgUrl, data.designationId, data.userType,1,0,data.isApproved,data.approvedBy,data.approvedAt, data.approvedRemarks, data.createdBy,data.createdAt,data.createdAt,data.createdBy])
        return res.insertId;
    } catch (e) {
        util.createLog(e);
        throw new Error('Write Query Execution failed:');
    }
}


module.exports.addClientForNewClient  = async(connection,data) => {
    try {
        const sql = "INSERT INTO mstClient (clientName,shortCode, email, countryCode, phone, createdBy,createdAt, address) VALUES (?,?,?,?,?,?,?,?)"
        const [res,fields] = await transaction.executeQuery(connection,sql, [data.clientName, data.clientSortCode,data.email, data.countryCode, data.phone,data.userId, data.currentDateTime, data.address])
        return res.insertId;
    } catch (e) {
        util.createLog(e);
        throw new Error('Write Query Execution failed:');
    }
}


module.exports.addMenuPermissionForNewClient = async (connection, clientId,userId, roleId, moduleName, currentDateTime) => {
    try {

        let sql = "SELECT id AS moduleId, specificModule, name, path  FROM mstModules WHERE "

        if(moduleName == 'hasSFA'){

            sql += " specificModule IN (2,5)"
        }

        if(moduleName == 'hasCRM'){

            sql += " specificModule IN (19,20)"

        }

        if(moduleName == 'hasDMS'){

            sql += " specificModule IN (8, 18)"
        }

        if(moduleName == 'hasMMS'){

            sql += " specificModule IN (3,6)"
        }

        if(moduleName == 'hasEMS'){

            sql += " specificModule IN (9,14)"
        }

        if(moduleName == 'hasLMS'){

            sql += " specificModule IN (15,16)"
        }

        if(moduleName == 'admin'){

            sql += " specificModule IN (7)"
        }

        sql += " AND status = 1"      
        let [resp] = await readConn.query(sql);

        let moduleArr = []

        if(resp.length > 0){

            for(let i=0;i<resp.length;i++){

                moduleArr.push({"moduleId":resp[i].moduleId, "specificModule":resp[i].specificModule})

            }

        }
        if(moduleArr.length >0){

            let newModuleArr = []

            for(let i=0;i<moduleArr.length;i++){

                let obj = {}

                obj['clientId'] = clientId
                obj['specificModule'] = moduleArr[i]['specificModule']
                obj['accessType'] = 0
                obj['roleId'] = roleId
                obj['moduleId'] = moduleArr[i]['moduleId']
                obj['isView'] = 1
                obj['addPem'] = 1
                obj['editPem'] = 1
                obj['deletePem'] = 1
                obj['approvePem'] = 1
                obj['commercialPem'] = 1
                obj['status'] = 1
                obj['createdBy'] = userId
                obj['createDate'] = currentDateTime

                newModuleArr.push(obj)

            }

            // console.log(newModuleArr)

            let arrayOfLevels = newModuleArr.map(obj => [obj.clientId,obj.specificModule,obj.accessType, obj.roleId, obj.moduleId,obj.isView,obj.addPem,obj.editPem,obj.deletePem,obj.approvePem,obj.commercialPem,obj.status,obj.createdBy,obj.createDate]);

            let sql_in = "INSERT INTO userRoleModule (clientId,specificModule,accessType,roleId,moduleId,isView,addPem,editPem,deletePem,approvePem,commercialPem,status,createdBy,createDate) VALUES ?";
        
            const [resp_in,fields] = await transaction.executeQuery(connection,sql_in, [arrayOfLevels])

        }

        return true
    } catch (e) {
        // util.createLog(e);
        return false;
    }
}


module.exports.addNotAssignContactTypeDaoForNewClient  = async(connection,clientId,data, companyAdminId) => {

    try {
        const sql = "INSERT INTO mstContactType(clientId,mstSlNo,customerAccessType,contactTypeName,isLeaf,isActive,deleted,createdBy,createdAt) VALUES (?,?,?,?,?,?,?,?,?);"
        const [res,fields] = await transaction.executeQuery(connection,sql, [clientId,1,1,'Not Assigned',1,1,0,companyAdminId,data.currentDateTime])
        return res.insertId;
    } catch (e) {
        util.createLog(e);
        throw new Error('Write Query Execution failed:');
    }
}


module.exports.addNoOrganizationForNewClient = async (connection,data) =>{
    try{
        let sql = `INSERT INTO organizationManagement (clientId,organizationName,ownerName,phone,email,assignTo,assignType,contactId,contactType,address,description,accessId,approvedStatus,approvedBy,approvedDatetime, approvedRemarks, createdBy,createdAt) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
        const [res] = await transaction.executeQuery(connection,sql, [data.clientId,data.organizationName,data.ownerName,data.phone,data.email,data.assignTo,data.assignType,data.contactId,data.contactType,data.address,data.description,data.accessId,data.approvedStatus,data.approvedBy,data.approvedDatetime,data.approvedRemarks,data.createdBy,data.createdAt])
        return res.insertId;

    }catch(e){
        const log = util.createLog(e)
        throw new Error('Write Query Execution failed:');
    }
}


module.exports.addClientSettingsForNewClient = async (connection,clientId,data) => {
    try {

        let sql = "SELECT title, settingsType, settingsValue FROM clientConfig WHERE status = 1"     
        let [resp] = await readConn.query(sql);

        let moduleArr = []

        if(resp.length > 0){

            for(let i=0;i<resp.length;i++){

                moduleArr.push({"title":resp[i].title, "settingsType":resp[i].settingsType, "settingsValue":resp[i].settingsValue})

            }

        }
        if(moduleArr.length >0){

            let newModuleArr = []

            for(let i=0;i<moduleArr.length;i++){

                let obj = {}

                obj['clientId'] = clientId
                obj['title'] = moduleArr[i]['title']
                obj['settingsType'] = moduleArr[i]['settingsType']
                obj['settingsValue'] = moduleArr[i]['settingsValue']


                newModuleArr.push(obj)

            }

            // console.log(newModuleArr)

            let arrayOfLevels = newModuleArr.map(obj => [obj.clientId, obj.title, obj.settingsType, obj.settingsValue]);

            let sql_in = "INSERT INTO clientSettings (clientId,title,settingsType,settingsValue) VALUES ?";
        
            const [resp_in,fields] = await transaction.executeQuery(connection,sql_in, [arrayOfLevels])

        }

        return true
    } catch (e) {
        // util.createLog(e);
        return false;
    }
}


module.exports.insertDefHierarchyTypes = async (connection,clientId,currentDateTime,mstHierarchyTypes) => {
    try {

        let newModuleArr = []
        let countryHmTypId = 0
        let stateHmTypId = 0
        let districtHmTypId = 0
        let cityHmTypId = 0

        for(let i=0;i<mstHierarchyTypes.length;i++){

            let obj = {}

            obj['clientId'] = clientId
            obj['hmId'] = mstHierarchyTypes[i]['hmId']
            obj['SlNo'] = mstHierarchyTypes[i]['SlNo']
            obj['hmTypDesc'] = mstHierarchyTypes[i]['hmTypDesc']
            obj['createdAt'] = currentDateTime

            newModuleArr.push(obj)

            let sql_in = "INSERT INTO dlocation_mstHierarchyTypes (clientId,hmId,SlNo,hmTypDesc,createdAt) VALUES (?,?,?,?,?)";
            const [res] = await transaction.executeQuery(connection,sql_in, [clientId,mstHierarchyTypes[i]['hmId'],mstHierarchyTypes[i]['SlNo'],mstHierarchyTypes[i]['hmTypDesc'],currentDateTime])
            // console.log("inserted id===========>>>", res.insertId)

            if( mstHierarchyTypes[i]['hmTypDesc'] == 'Country'){

                countryHmTypId = res.insertId

            }

            if( mstHierarchyTypes[i]['hmTypDesc'] == 'State'){

                stateHmTypId = res.insertId

            }

            if( mstHierarchyTypes[i]['hmTypDesc'] == 'District'){

                districtHmTypId = res.insertId

            }

            if( mstHierarchyTypes[i]['hmTypDesc'] == 'City'){

                cityHmTypId = res.insertId

            } 
        }

        // console.log(newModuleArr)

        // let arrayOfLevels = newModuleArr.map(obj => [obj.clientId, obj.hmId, obj.SlNo, obj.hmTypDesc, obj.createdAt]);

        // let sql_in = "INSERT INTO dlocation_mstHierarchyTypes (clientId,hmId,SlNo,hmTypDesc,createdAt) VALUES ?";
    
        // const [resp_in,fields] = await transaction.executeQuery(connection,sql_in, [arrayOfLevels])

        // console.log("==============================================>>>>", resp_in.insertId)

        return {"success":true, "countryHmTypId":countryHmTypId, "stateHmTypId":stateHmTypId, "districtHmTypId":districtHmTypId, "cityHmTypId":cityHmTypId}
    } catch (e) {
        util.createLog(e);
        return {"success":false, "countryHmTypId":0, "stateHmTypId":0, "districtHmTypId":0, "cityHmTypId":0};
    }
}




module.exports.getLocHierarchyTypId = async (clientId, type) => {
    try {
        let params = [];

        let sql = "SELECT hierarchyTypeId, SlNo, hmTypDesc FROM dlocation_mstHierarchyTypes WHERE clientId = ? AND hmId = 1 AND hmTypDesc LIKE ? AND status = 1"
        params.push(clientId)
        params.push('%' + type + '%')
        
        let [resp] = await readConn.query(sql, params);

        // console.log("===>>", sql)
        // console.log("===>>", params)

        return resp;
    } catch (e) {
        const log = util.createLog(e)
        return [];
    }
}

module.exports.insertHierarchyData = async (connection,data) =>{
    try{
        let sql = `INSERT INTO dlocation_mstHierarchyData (clientId,hmId,mstHierarchyTypeId,hmName,hmDescription,parentHMtypId,parentHMId,leafLevel,status,createdAt,createdBy) VALUES (?,?,?,?,?,?,?,?,?,?,?)`;
        
        const [res] = await transaction.executeQuery(connection,sql, [data.clientId,data.hmId, data.mstHierarchyTypeId, data.hmName, data.hmDescription, data.parentHMtypId, data.parentHMId, data.leafLevel, data.status, data.createdAt, data.createdBy])
        return res.insertId;

    }catch(e){
        const log = util.createLog(e)
        throw new Error('Write Query Execution failed:');
    }
}


module.exports.insertHierarchyMapConf = async (connection,data) =>{
    try{
        let sql = `INSERT INTO dlocation_clientHierarchyMapConf (clientId,hmId,hierarchyDesc,mstHierarchyDataId,status,createdAt) VALUES (?,?,?,?,?,?)`;
        
        const [res] = await transaction.executeQuery(connection,sql, [data.clientId,data.hmId,data.hierarchyDesc,data.mstHierarchyDataId,data.status,data.createdAt])
        return res.insertId;

    }catch(e){
        const log = util.createLog(e)
        throw new Error('Write Query Execution failed:');
    }
}


module.exports.insertMYSQLredisConfig_V2 = async (connection, keyName, valueName,currentDateTime) => {
    try{
        let sql = `INSERT INTO dlocation_hierarchyRedis (keyName, valueName, createdAt) VALUES (?,?,?)`;
        
        let [result] = await transaction.executeQuery(connection, sql,[keyName,valueName,currentDateTime]);
        return true;
    }catch(e){

        let log = util.createLog(e);
        throw e;
    }
}


module.exports.getDistinctLocationsValues = async (type, name) => {
    try {
        let params = [];

        let sql = "SELECT "

        if(type == 'country'){

            sql += "DISTINCT country"
        }

        if(type == 'state'){

            sql += "DISTINCT state, country"
        }

        if(type == 'district'){

            sql += "DISTINCT district, state, country"
        }

        if(type == 'city'){

            sql += "DISTINCT city, district, state, country"
        }

        if(type == 'all'){

            sql += "DISTINCT city, district, state, country"
        }

        sql += " FROM defaultLocationMaster WHERE status = 1" 

        if(name != ''){

            if(type == 'state'){

                sql += " AND country = ?"
                params.push(name)

            }

            if(type == 'district'){

                sql += " AND state = ?"
                params.push(name)

            }

            if(type == 'city'){

                sql += " AND district = ?"
                params.push(name)

            }

        }   
        
        let [resp] = await readConn.query(sql,params);

        return resp;
    } catch (e) {
        console.log("error==> default locations", e)
        const log = util.createLog(e)
        return false;
    }
}

module.exports.updatDftLocations  = async(clientId) => {
    try {
        const sql = "UPDATE mstClient SET isDefaultLocation = 1 WHERE clientId = ?"
        const [res] = await writeConn.query(sql, [clientId])
        return true;
    } catch (e) {
        util.createLog(e);
        throw new Error('Write Query Execution failed:');
    }
}


module.exports.getLocHierarchyTypDataetc = async (data) => {
    try {

        let sql = "SELECT DISTINCT clientId AS clientId FROM dlocation_mstHierarchyData WHERE hmId = 1 AND status = 1"
        
        let [resp] = await readConn.query(sql);

        // console.log("===>>", sql)
        // console.log("===>>", params)

        return resp;
    } catch (e) {
        const log = util.createLog(e)
        return [];
    }
}