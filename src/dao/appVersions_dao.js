const readConn    = require('../dbconnection').readPool
const writeConn   = require('../dbconnection').writePool
const util        = require('../utility/util');




module.exports.getAllAppVersions  = async(data) => {
    try {
        let params = [];
        let countparams = [];

        let csql = "SELECT COUNT(id) AS totalData FROM applicationVersions WHERE status = 1"
        // countparams.push(data.selectedClientId)

        let sql = "SELECT id AS appId, packageName, appIndex, version, appLink, isUpdate, status, createdAt FROM applicationVersions WHERE status = 1";
        // params.push(data.selectedClientId)

        if (data.searchpackageName !== undefined && data.searchpackageName != "") {
            sql += " AND packageName LIKE ? ";
            csql += " AND packageName LIKE ? ";
            params.push('%'+data.searchpackageName+'%');
            countparams.push('%'+data.searchpackageName+'%');

        }

        sql += ` ORDER BY appIndex ASC`

        if ((data.limit !== undefined && data.limit !== '') && (data.offset !== undefined && data.offset !== '')) {
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


module.exports.inactiveAllPreviousVersions  = async(data) => {
    try {
        let sql = "UPDATE applicationVersions SET status = 0 WHERE packageName = ?"
        let [res,fields] = await writeConn.query(sql, [data.packageName])
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.addNewAppVersion  = async(data) => {
    try {
        let sql = "INSERT INTO applicationVersions (packageName, appIndex, version, appLink, isUpdate, createdAt) VALUES (?,?, ?, ?, ?,?)"
        let [res,fields] = await writeConn.query(sql, [data.packageName, data.appIndex,data.version,data.appLink, data.isUpdate, data.createdAt])
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}


module.exports.changeUpdateStatus  = async(data) => {
    try {
        let sql = "UPDATE applicationVersions SET isUpdate = ?, modifiedAt = ? WHERE id =?"
        let [res,fields] = await writeConn.query(sql, [data.isUpdate,data.modifiedAt, data.appId])
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.deleteAppVersion  = async(data) => {
    try {
        let sql = "UPDATE applicationVersions SET status = ? WHERE id = ?"
        let [res,fields] = await writeConn.query(sql, [data.status, data.appId])
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}



module.exports.updateNewAppVersion  = async(data) => {
    try {
        let sql = "UPDATE applicationVersions SET appIndex = ?, appLink = ?, version = ?, isUpdate = ?, modifiedAt = ? WHERE id = ? AND packageName = ?"
        let [res,fields] = await writeConn.query(sql, [data.appIndex, data.appLink, data.version,data.isUpdate, data.modifiedAt, data.appId, data.packageName])
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}