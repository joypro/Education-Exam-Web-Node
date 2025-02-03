const readConn          = require('../dbconnection').readPool
const writeConn         = require('../dbconnection').writePool
const util              = require('../utility/util');
//
const transaction = require('../transaction');

// ========================= Master Hierarchy ================================
// Dropdown Master Hierarchy
module.exports.getMstHierarchyDao = async (data) => {
    try{
        let params = []
        let sql = `SELECT hmId AS mstHierarchyId , hmName AS mstHierarchyName, slNo 
                        FROM dlocation_mstHierarchy
                        WHERE status = 1`;

        if(data.searchText !== undefined && data.searchText != null && data.searchText != ''){
            sql+=" AND hmName Like ?"
            params.push('%'+data.searchText+'%')
        }                

        let [result] = await readConn.query(sql,params);
        return result;
    }catch(e){

        let log = util.createLog(e);
        return false
    }
}

// ========================= Master Hierarchy Ends ================================

// ========================= Hierarchy Type ================================
// Dropdown Hierarchy Type
module.exports.getHierarchyTypeDropdownDao = async (data) => {
    try{
        let sql = `SELECT hierarchyTypeId, hmTypDesc AS hierarchyTypeName
                        FROM dlocation_mstHierarchyTypes
                        WHERE hmId = ? 
                        AND clientId = ?
                        AND status = 1`;
        
        let [result] = await readConn.query(sql,[data.mstHierarchyId,data.clientId]);
        return result;

    }catch(e){

        let log = util.createLog(e);
        return false

    }
}

// List Hierarchy Type
module.exports.getHierarchyTypeDao = async (data) => {
    try{
        let params = [];
        let sql = `SELECT hierarchyType.hierarchyTypeId, hierarchyType.hmTypDesc AS hierarchyTypeName, hierarchyType.SlNo,  mstHierarchy.hmName AS mstHierarchyName, mstHierarchy.hmId AS mstHierarchyId
                        FROM dlocation_mstHierarchyTypes AS hierarchyType, dlocation_mstHierarchy AS mstHierarchy
                        WHERE hierarchyType.clientId = ? 
                        AND hierarchyType.status = 1
                        AND hierarchyType.hmId = mstHierarchy.hmId`;
        
        params.push(data.clientId);

        if(data.searchText != undefined && data.searchText != null && data.searchText != ''){
            sql += " AND  (hierarchyType.hmTypDesc LIKE ? OR mstHierarchy.hmName Like ?) "
            params.push('%'+data.searchText+'%')
            params.push('%'+data.searchText+'%')
        }
        
        if(data.mstHierarchyId != ""){
            sql += ` AND hierarchyType.hmId = ?`;
            params.push(data.mstHierarchyId);
        }

        sql += ` LIMIT ?,?`;
        params.push(Number(data.offset));
        params.push(Number(data.limit));

        let [result] = await readConn.query(sql,params);
        return result;

    }catch(e){

        let log = util.createLog(e);
        return false

    }
}

// Check Before Adding
module.exports.checkNameHierarchyTypeDao = async (data) => {
    try{
        let sql = `SELECT hierarchyTypeId 
                        FROM dlocation_mstHierarchyTypes
                        WHERE hmTypDesc = ? AND hmId = ? AND clientId = ? AND status = 1`;
        
        let [result] = await readConn.query(sql,[data.hierarchyTypeName,data.mstHierarchyId,data.clientId]);
        return result.length > 0 ? result[0].hierarchyTypeId : 0;
    }catch(e){

        let log = util.createLog(e);
        return false
    }
}

// Check Before Adding
module.exports.checkSlHierarchyTypeDao = async (data) => {
    try{
        let sql = `SELECT hierarchyTypeId 
                        FROM dlocation_mstHierarchyTypes
                        WHERE slNo = ? AND hmId = ? AND clientId = ? AND status = 1`;
        
        let [result] = await readConn.query(sql,[data.slNo,data.mstHierarchyId,data.clientId]);
        return result.length > 0 ? result[0].hierarchyTypeId : 0;
    }catch(e){

        let log = util.createLog(e);
        return false
    }
}

// Check Before Update
module.exports.checkSlUpdateHierarchyTypeDao = async (data) => {
    try{
        let sql = `SELECT hierarchyTypeId 
                        FROM dlocation_mstHierarchyTypes
                        WHERE hierarchyTypeId != ? AND slNo = ? AND hmId = ? AND clientId = ? AND status = 1`;
        
        let [result] = await readConn.query(sql,[data.hierarchyTypeId,data.slNo,data.mstHierarchyId,data.clientId]);
        return result.length > 0 ? result[0].hierarchyTypeId : 0;
    }catch(e){

        let log = util.createLog(e);
        return false
    }
}

// Check Before Update
module.exports.checkUpdateHierarchyDataDao = async (data) => {
    try{
        let sql = `SELECT hierarchyDataId 
                        FROM dlocation_mstHierarchyData
                        WHERE hierarchyDataId != ? AND hmName = ? AND hmId = ? AND mstHierarchyTypeId = ? AND clientId = ? AND status = 1 AND parentHMtypId = ? AND parentHMId = ?`;
        
        let [result] = await readConn.query(sql,[data.hierarchyDataId,data.hierarchyDataName,data.mstHierarchyId,data.hierarchyTypeId,data.clientId,data.parentHMtypId,data.parentHMId]);

        // console.log(sql)
        // console.log(data)
        // console.log(result)

        let hierarchyDataId = 0;

        if(result.length > 0){

            if(result[0].hierarchyDataId != null){

                hierarchyDataId = result[0].hierarchyDataId;
            }
        }
        
        return hierarchyDataId;
    }catch(e){
        util.createLog(e);
        return false
    }
}

// Add Hierarchy Type
module.exports.addHierarchyTypeDao = async (data) => {
    try{
        let sql = `INSERT INTO dlocation_mstHierarchyTypes (clientId, hmId, hmTypDesc, SlNo) VALUES (?,?,?,?)`;
        
        let [result] = await writeConn.query(sql,[data.clientId,data.mstHierarchyId,data.hierarchyTypeName,data.slNo]);
        return result.insertId;
    }catch(e){

        let log = util.createLog(e);
        return false
    }
}

// Update Hierarchy Type
module.exports.updateHierarchyTypeDao = async (data) => {
    try{
        let sql = `UPDATE dlocation_mstHierarchyTypes SET hmId = ?, hmTypDesc = ?, SlNo = ? WHERE hierarchyTypeId = ?`;
        
        let [result] = await writeConn.query(sql,[data.mstHierarchyId,data.hierarchyTypeName,data.slNo,data.hierarchyTypeId]);
        return result;
    }catch(e){

        let log = util.createLog(e);
        return false
    }
}

// Delete Hierarchy Type
module.exports.deleteHierarchyTypeDao = async (data) => {
    try{
        let sql = `UPDATE dlocation_mstHierarchyTypes SET status = 2 WHERE hierarchyTypeId = ?`;
        let [result] = await writeConn.query(sql,[data.hierarchyTypeId]);
        return result;
    }catch(e){

        let log = util.createLog(e);
        return false
    }
}
// ========================= Hierarchy Type Ends ================================

// ========================= Hierarchy Data ================================
// Dropdown Hierarchy Data
module.exports.getHierarchyDataDropdownDao = async (data) => {
    try{
        let sql = `SELECT hierarchyDataId, hmName AS hierarchyDataName, hmDescription AS hierarchyDataDesc
                        FROM dlocation_mstHierarchyData
                        WHERE hmId = ? 
                        AND mstHierarchyTypeId = ?
                        AND clientId = ?
                        AND status = 1`;
        
        let [result] = await readConn.query(sql,[data.mstHierarchyId,data.hierarchyTypeId,,data.clientId]);
        return result;

    }catch(e){


        let log = util.createLog(e);
        return false

    }
}

// List Hierarchy Data
module.exports.getHierarchyDataDao = async (data) => {
    try{
        let params = [];
        let sql = `SELECT   hierarchyData.hierarchyDataId, 
                            hierarchyData.hmName AS hierarchyDataName, 
                            hierarchyData.hmDescription AS hierarchyDataDesc, 

                            hierarchyType.hmTypDesc AS hierarchyTypeName, 
                            hierarchyType.hierarchyTypeId, 
                            
                            mstHierarchy.hmName AS mstHierarchyName, 
                            mstHierarchy.hmId AS mstHierarchyId,

                            hierarchyData1.hmName AS parentHmName,
                            hierarchyData.parentHMId,
                            
                            hierarchyData.parentHMtypId AS parentHmTypeId,
                            hierarchyData.leafLevel,
                            hierarchyType.SlNo

                        FROM dlocation_mstHierarchyData AS hierarchyData
                        
                        LEFT JOIN dlocation_mstHierarchyData AS hierarchyData1 ON hierarchyData.parentHMId = hierarchyData1.hierarchyDataId AND hierarchyData.parentHMtypId = hierarchyData1.mstHierarchyTypeId
                        
                        JOIN dlocation_mstHierarchyTypes AS hierarchyType ON hierarchyData.mstHierarchyTypeId = hierarchyType.hierarchyTypeId

                        JOIN dlocation_mstHierarchy AS mstHierarchy ON hierarchyData.hmId = mstHierarchy.hmId

                        WHERE hierarchyData.clientId = ? 
                        AND hierarchyData.status = 1`;

        params.push(data.clientId);

        if(data.mstHierarchyId !== undefined && data.mstHierarchyId != ""){
            sql += ` AND hierarchyData.hmId = ?`;
            params.push(data.mstHierarchyId)
        }
        if(data.hierarchyTypeId !== undefined && data.hierarchyTypeId != ""){
            sql += ` AND hierarchyData.mstHierarchyTypeId = ?`;
            params.push(data.hierarchyTypeId)
        }
        if(data.hierarchyDataId !== undefined && data.hierarchyDataId != ""){
            sql += ` AND hierarchyData.hierarchyDataId = ?`;
            params.push(data.hierarchyDataId)
        }

        if(data.hierarchyDataIdArr !== undefined && data.hierarchyDataIdArr != ""){
            sql += ` AND hierarchyData.hierarchyDataId IN (`+ data.hierarchyDataIdArr.join(",") +`)`;
        }


        if(data.leafLevel !== undefined && data.leafLevel != "" && data.leafLevel != ''){
            sql += ` AND hierarchyData.leafLevel = ?`;
            params.push(data.leafLevel)
        }
        if(data.searchText != undefined && data.searchText != null && data.searchText != ''){
            sql += " AND (hierarchyData.hmName LIKE ? OR hierarchyData.hmDescription LIKE ? OR mstHierarchy.hmName LIKE ? ) "
            params.push('%'+data.searchText+'%');
            params.push('%'+data.searchText+'%');
            params.push('%'+data.searchText+'%');

        }

        sql += " ORDER BY hierarchyData.hierarchyDataId DESC"
        
        if(data.isDropdown !== undefined && data.isDropdown != '1'){
            sql += ` LIMIT ?,?`
            params.push(Number(data.offset));
            params.push(Number(data.limit));
        }

        // console.log(sql)
        // console.log(params)

        let [result] = await readConn.query(sql,params);
        return result;

    }catch(e){

        let log = util.createLog(e);
        return false

    }
}

// Check Before Adding
module.exports.checkHierarchyDataDao = async (data) => {
    try{
        let sql = `SELECT hierarchyDataId 
                        FROM dlocation_mstHierarchyData
                        WHERE hmName = ? AND hmId = ? AND mstHierarchyTypeId = ? AND clientId = ? AND status = 1`;
        
        let [result] = await readConn.query(sql,[data.hierarchyDataName,data.mstHierarchyId,data.hierarchyTypeId,data.clientId]);
        return result.length > 0 ? result[0].hierarchyDataId : 0;
    }catch(e){

        let log = util.createLog(e);
        return false
    }
}

// Add Hierarchy Data
module.exports.addHierarchyDataDao = async (data) => {
    try{
        let sql = `INSERT INTO dlocation_mstHierarchyData (clientId, hmId, mstHierarchyTypeId, hmName, hmDescription, parentHMtypId, parentHMId, leafLevel, createdBy,createdAt) VALUES (?,?,?,?,?,?,?,?,?,?)`;
        
        let [result] = await writeConn.query(sql,[data.clientId,data.mstHierarchyId,data.hierarchyTypeId,data.hierarchyDataName,data.hierarchyDataDesc,data.parentHMtypId,data.parentHMId,data.leafLevel,data.userId, data.currentDateTime]);
        return result.insertId;
    }catch(e){

        let log = util.createLog(e);
        return false
    }
}

module.exports.addHierarchyDataDao_V2 = async (connection,data) => {
    try{
        let sql = `INSERT INTO dlocation_mstHierarchyData (clientId, hmId, mstHierarchyTypeId, hmName, hmDescription, parentHMtypId, parentHMId, leafLevel, createdBy,createdAt) VALUES (?,?,?,?,?,?,?,?,?,?)`;
        
        let [result] = await transaction.executeQuery(connection,sql,[data.clientId,data.mstHierarchyId,data.hierarchyTypeId,data.hierarchyDataName,data.hierarchyDataDesc,data.parentHMtypId,data.parentHMId,data.leafLevel,data.userId, data.currentDateTime]);
        return result.insertId;
    }catch(e){

        let log = util.createLog(e);
        throw e
    }
}

// Check Before Update
module.exports.checkNameUpdateHierarchyTypeDao = async (data) => {
    try{
        let sql = `SELECT hierarchyTypeId 
                        FROM dlocation_mstHierarchyTypes
                        WHERE hierarchyTypeId != ? AND hmTypDesc = ? AND hmId = ? AND clientId = ? AND status = 1`;
        
        let [result] = await readConn.query(sql,[data.hierarchyTypeId,data.hierarchyTypeName,data.mstHierarchyId,data.clientId]);
        return result.length > 0 ? result[0].hierarchyTypeId : 0;
    }catch(e){

        let log = util.createLog(e);
        return false
    }
}


module.exports.getHMtypenameData = async (data) => {
    try{
        let sql = `SELECT LOWER(hmTypDesc) hmTypDescLower, SlNo, hmTypDesc  FROM dlocation_mstHierarchyTypes WHERE hierarchyTypeId = ? AND clientId = ? AND hmId = ? AND status = 1`;
        
        let [result] = await readConn.query(sql,[data.hierarchyTypeId,data.clientId,data.mstHierarchyId]);
        return result;
    }catch(e){

        let log = util.createLog(e);
        return false
    }
}


module.exports.insertIntoMapConf = async (nameOfTheTyp, hierarchyDataId, data) => {
    try{
        let sql = `INSERT INTO dlocation_clientHierarchyMapConf (clientId, hmId, hierarchyDesc, mstHierarchyDataId, createdAt) VALUES (?,?,?,?,?)`;
        
        let [result] = await writeConn.query(sql,[data.clientId,data.mstHierarchyId,nameOfTheTyp,hierarchyDataId,data.currentDateTime]);
        return result.insertId;
    }catch(e){

        let log = util.createLog(e);
        return false
    }
}

module.exports.insertIntoMapConf_V2 = async (connection, nameOfTheTyp, hierarchyDataId, data) => {
    try{
        let sql = `INSERT INTO dlocation_clientHierarchyMapConf (clientId, hmId, hierarchyDesc, mstHierarchyDataId, createdAt) VALUES (?,?,?,?,?)`;
        
        let [result] = await transaction.executeQuery(connection, sql,[data.clientId,data.mstHierarchyId,nameOfTheTyp,hierarchyDataId,data.currentDateTime]);
        return result.insertId;
    }catch(e){

        let log = util.createLog(e);
        throw e;
    }
}


module.exports.getParentDataByLeaf = async (data,dataMain) => {
    try{
        let sql = `SELECT mapId, leafHMdataId, leafNodeListLength, parentSlNo  FROM dlocation_parentLeafMap WHERE clientId = ? AND hmId = ? AND parentHMtypId = ? AND parentHMId = ? AND parentSlNo = ? AND leafHMtypId = ? AND status = 1`;
        
        let [result] = await readConn.query(sql,[dataMain.clientId,dataMain.mstHierarchyId, data.typeId, data.id, data.slNo, dataMain.hierarchyTypeId]);
        return result;
    }catch(e){

        let log = util.createLog(e);
        return false
    }
}

module.exports.updateOldMappingConf = async (mapId) => {
    try{
        let sql = `UPDATE dlocation_parentLeafMap SET status = 2 WHERE mapId = ?`;
        
        let [result] = await writeConn.query(sql,[mapId]);
        return true;
    }catch(e){

        let log = util.createLog(e);
        return false
    }
}

module.exports.updateOldMappingConf_V2 = async (connection, mapId) => {
    try{
        let sql = `UPDATE dlocation_parentLeafMap SET status = 2 WHERE mapId = ?`;
        
        let [result] = await transaction.executeQuery(connection,sql,[mapId]);
        return true;
    }catch(e){

        let log = util.createLog(e);
        throw e;
    }
}

module.exports.updateOldMappingConfForRedis = async (keyName) => {
    try{
        let sql = `UPDATE dlocation_hierarchyRedis SET status = 2 WHERE keyName = ?`;
        
        let [result] = await writeConn.query(sql,[keyName]);
        return true;
    }catch(e){

        let log = util.createLog(e);
        return false
    }
}

module.exports.updateOldMappingConfForRedis_V2 = async (connection, keyName) => {
    try{
        let sql = `UPDATE dlocation_hierarchyRedis SET status = 2 WHERE keyName = ?`;
        
        let [result] = await transaction.executeQuery(connection, sql,[keyName]);
        return true;
    }catch(e){

        let log = util.createLog(e);
        throw e;
    }
}



module.exports.insertNewMappingConf = async (dataMain, data, newMapString, finalLengthOfParentNode) => {
    try{
        let sql = `INSERT INTO dlocation_parentLeafMap (clientId, hmId, parentHMtypId, parentHMId,parentSlNo,leafHMtypId,leafHMdataId,leafNodeListLength,createdAt) VALUES (?,?,?,?,?,?,?,?,?)`;
        
        let [result] = await writeConn.query(sql,[dataMain.clientId,dataMain.mstHierarchyId,data.typeId, data.id,data.slNo,dataMain.hierarchyTypeId,newMapString,finalLengthOfParentNode,dataMain.currentDateTime]);
        return true;
    }catch(e){

        let log = util.createLog(e);
        return false
    }
}

module.exports.insertNewMappingConf_V2 = async (connection, dataMain, data, newMapString, finalLengthOfParentNode) => {
    try{
        let sql = `INSERT INTO dlocation_parentLeafMap (clientId, hmId, parentHMtypId, parentHMId,parentSlNo,leafHMtypId,leafHMdataId,leafNodeListLength,createdAt) VALUES (?,?,?,?,?,?,?,?,?)`;
        
        let [result] = await transaction.executeQuery(connection, sql,[dataMain.clientId,dataMain.mstHierarchyId,data.typeId, data.id,data.slNo,dataMain.hierarchyTypeId,newMapString,finalLengthOfParentNode,dataMain.currentDateTime]);
        return true;
    }catch(e){

        let log = util.createLog(e);
        throw e;
    }
}


module.exports.insertIntoRedisConfigMysql = async (data, ulKeyString, ulKeyStringValue) => {
    try{
        let sql = `INSERT INTO dlocation_hierarchyRedis (keyName,valueName,createdAt) VALUES (?,?,?)`;
        
        let [result] = await writeConn.query(sql,[ulKeyString,ulKeyStringValue, data.currentDateTime]);
        return true;
    }catch(e){

        let log = util.createLog(e);
        return false
    }
}

module.exports.insertIntoRedisConfigMysql_V2 = async (connection, data, ulKeyString, ulKeyStringValue) => {
    try{
        let sql = `INSERT INTO dlocation_hierarchyRedis (keyName,valueName,createdAt) VALUES (?,?,?)`;
        
        let [result] = await transaction.executeQuery(connection, sql,[ulKeyString,ulKeyStringValue, data.currentDateTime]);
        return true;
    }catch(e){

        let log = util.createLog(e);
        throw e;
    }
}



module.exports.getSeqNoFORhyprId = async (data, hierarchyTypeId) => {
    try{
        let sql = `SELECT SlNo FROM dlocation_mstHierarchyTypes WHERE clientId = ? AND hierarchyTypeId = ? AND status = 1`;
        
        let [result] = await readConn.query(sql,[data.clientId,hierarchyTypeId]);
        let slNo = 0;

        if(result.length > 0 && result[0].SlNo != null){

            slNo = result[0].SlNo
        }

        return slNo;
    }catch(e){

        let log = util.createLog(e);
        return 0
    }
}









module.exports.insertMYSQLredisConfig = async (keyName, valueName,data) => {
    try{
        let sql = `INSERT INTO dlocation_hierarchyRedis (keyName, valueName, createdAt) VALUES (?,?,?)`;
        
        let [result] = await writeConn.query(sql,[keyName,valueName,data.currentDateTime]);
        return true;
    }catch(e){

        let log = util.createLog(e);
        return false
    }
}

module.exports.insertMYSQLredisConfig_V2 = async (connection, keyName, valueName,data) => {
    try{
        let sql = `INSERT INTO dlocation_hierarchyRedis (keyName, valueName, createdAt) VALUES (?,?,?)`;
        
        let [result] = await transaction.executeQuery(connection, sql,[keyName,valueName,data.currentDateTime]);
        return true;
    }catch(e){

        let log = util.createLog(e);
        throw e;
    }
}


module.exports.updateMYSQLredisConfig = async (keyName) => {
    try{
        // console.log(keyName)
        let sql = `UPDATE dlocation_hierarchyRedis SET status = 2 WHERE keyName = ?`;
        
        let [result] = await writeConn.query(sql,[keyName]);
        // console.log(sql)
        return true;
    }catch(e){

        util.createLog(e);
        return false
    }
}

module.exports.updateMYSQLredisConfig_V2 = async (connection, keyName) => {
    try{
        // console.log(keyName)
        let sql = `UPDATE dlocation_hierarchyRedis SET status = 2 WHERE keyName = ?`;
        
        let [result] = await transaction.executeQuery(connection, sql,[keyName]);
        // console.log(sql)
        return true;
    }catch(e){

        util.createLog(e);
        throw e;
    }
}





// Update Hierarchy Data
module.exports.updateHierarchyDataDao = async (data) => {
    try{
        let sql = `UPDATE dlocation_mstHierarchyData SET hmId = ?, mstHierarchyTypeId = ?, hmName = ? , hmDescription = ?, parentHMtypId = ?, parentHMId = ?, leafLevel = ?, createdBy = ? WHERE hierarchyDataId = ?`;
        
        let [result] = await writeConn.query(sql,[data.mstHierarchyId,data.hierarchyTypeId,data.hierarchyDataName,data.hierarchyDataDesc,data.parentHMtypId,data.parentHMId,data.leafLevel,data.userId,data.hierarchyDataId]);
        return result;
    }catch(e){

        let log = util.createLog(e);
        return false
    }
}


// Delete Hierarchy Data
module.exports.deleteHierarchyDataDao = async (data) => {
    try{
        let sql = ` UPDATE dlocation_mstHierarchyData SET status = 2 WHERE hierarchyDataId = ? `;
        let [result] = await writeConn.query(sql,[data.hierarchyDataId]);
        return true;
    }catch(e){

        let log = util.createLog(e);
        return false
    }
}

// ========================= Hierarchy Data Ends ================================

// ========================= Hierarchy Attribute Types ================================
// List Hierarchy Attribute Types
module.exports.listHierarchyAttributeTypesDao = async (data) => {
    try{
        let params = [];
        let sql = `SELECT attributeTypes.hierarchyAttributeTypId AS hierarchyAttributeTypeId, 
        attributeTypes.attributeTyesDesc AS hierarchyAttributeTypeName, 
        hierarchyType.hmTypDesc AS hierarchyTypeName, 
        hierarchyType.hierarchyTypeId, 
        mstHierarchy.hmName AS mstHierarchyName, 
        mstHierarchy.hmId AS mstHierarchyId
                        FROM dlocation_hierarchyAttributeTypes AS attributeTypes, dlocation_mstHierarchy AS mstHierarchy, dlocation_mstHierarchyTypes AS hierarchyType
                        WHERE attributeTypes.clientId = ?
                        AND attributeTypes.hmId = mstHierarchy.hmId
                        AND attributeTypes.mstmstHierarchyTypeId = hierarchyType.hierarchyTypeId 
                        AND attributeTypes.status = 1`;

        params.push(data.clientId);

        if(data.mstHierarchyId != ""){
            sql += ` AND attributeTypes.hmId = ?`;
            params.push(data.mstHierarchyId)
        }

        if(data.hierarchyTypeId != ""){
            sql += ` AND attributeTypes.mstmstHierarchyTypeId = ?`;
            params.push(data.hierarchyTypeId)
        }

        if(data.isDropdown != 1){
            sql += ` LIMIT ?,?`
            params.push(Number(data.offset));
            params.push(Number(data.limit));
        }
        
        let [result] = await readConn.query(sql,params);
        return result;

    }catch(e){

        let log = util.createLog(e);
        return false

    }
}

// Check Before Adding
module.exports.checkHierarchyAttributeTypesDao = async (data) => {
    try{
        let sql = `SELECT hierarchyAttributeTypId 
                        FROM dlocation_hierarchyAttributeTypes
                        WHERE attributeTyesDesc = ? AND hmId = ? AND mstmstHierarchyTypeId = ? AND clientId = ? AND status = 1`;
        
        let [result] = await readConn.query(sql,[data.hierarchyAttributeTypeName,data.mstHierarchyId,data.hierarchyTypeId,data.clientId]);
        return result.length > 0 ? result[0].hierarchyAttributeTypId : 0;
    }catch(e){

        let log = util.createLog(e);
        return false
    }
}

// Add Hierarchy Attribute Types
module.exports.addHierarchyAttributeTypesDao = async (data) => {
    try{
        let sql = `INSERT INTO dlocation_hierarchyAttributeTypes (clientId, hmId, mstmstHierarchyTypeId, attributeTyesDesc, slNo) VALUES (?,?,?,?,?)`;
        
        let [result] = await writeConn.query(sql,[data.clientId,data.mstHierarchyId,data.hierarchyTypeId,data.hierarchyAttributeTypeName,0]);
        return result.insertId;
    }catch(e){

        let log = util.createLog(e);
        return false
    }
}

// Check Before Update
module.exports.checkUpdateHierarchyAttributeTypesDao = async (data) => {
    try{
        let sql = `SELECT hierarchyAttributeTypId 
                        FROM dlocation_hierarchyAttributeTypes
                        WHERE hierarchyAttributeTypId != ? AND attributeTyesDesc = ? AND hmId = ? AND mstmstHierarchyTypeId = ? AND clientId = ? AND status = 1 `;
        
        let [result] = await readConn.query(sql,[data.hierarchyAttributeTypeId,data.hierarchyAttributeTypeName,data.mstHierarchyId,data.hierarchyTypeId,data.clientId]);
        return result.length > 0 ? result[0].hierarchyAttributeTypId : 0;
    }catch(e){

        let log = util.createLog(e);
        return false
    }
}


module.exports.getHierarchyMasterAttributes = async (hmId) => {
    try{
        let params = [];
        let sql = `SELECT id, attributeTyesDesc, hmId FROM dlocation_hierarchyMasterAttributeTypes WHERE status = 1 `;

        if(hmId != '0'){

            sql += " AND hmId = ?"
            params.push(hmId)
        }
        
        let [result] = await readConn.query(sql,params);
        return result;
    }catch(e){

        let log = util.createLog(e);
        return false
    }
}








// Update Hierarchy Attribute Types
module.exports.updateHierarchyAttributeTypesDao = async (data) => {
    try{
        let sql = `UPDATE dlocation_hierarchyAttributeTypes SET hmId = ?, mstmstHierarchyTypeId = ?, attributeTyesDesc = ? WHERE hierarchyAttributeTypId = ?`;
        
        let [result] = await writeConn.query(sql,[data.mstHierarchyId,data.hierarchyTypeId,data.hierarchyAttributeTypeName,data.hierarchyAttributeTypeId]);
        return result;
    }catch(e){

        let log = util.createLog(e);
        return false
    }
}

// Delete Hierarchy Attribute Types
module.exports.deleteHierarchyAttributeTypesDao = async (data) => {
    try{
        let sql = `UPDATE dlocation_hierarchyAttributeTypes SET status = 2 WHERE hierarchyAttributeTypId = ?`;
        let [result] = await writeConn.query(sql,[data.hierarchyAttributeTypeId]);
        return result;
    }catch(e){

        let log = util.createLog(e);
        return false
    }
}
// ========================= Hierarchy Attribute Types Ends ================================

// ========================= Hierarchy Attributes ================================
// List Hierarchy Attributes
module.exports.listHierarchyAttributesDao = async (data) => {
    try{
        let params = [];
        let sql = `SELECT hierarchyAttribute.id AS hierarchyAttributeId, 
                        hierarchyAttribute.attributeValue, 
                        hierarchyAttribute.attributeDataValueId,

                        hierarchyData.hierarchyDataId, 
                        hierarchyData.hmName AS hierarchyDataName, 
                        hierarchyData.hmDescription AS hierarchyDataDesc,
                        hierarchyData.hmId AS mstHierarchyId,
                        dlocation_mstHierarchyTypes.hmTypDesc AS HierarchyType,
                        IF(dlocation_mstHierarchyTypes.hmId = 1, "Location", "Product") AS HierarchyName,
                        hierarchyData.mstHierarchyTypeId AS hierarchyTypeId,
                        
                        
                        hierarchyAttributeType.hierarchyAttributeTypId AS hierarchyAttributeTypeId, 
                        hierarchyAttributeType.attributeTyesDesc

                        FROM dlocation_hierarchyAttributes AS hierarchyAttribute, dlocation_mstHierarchyData AS hierarchyData, dlocation_hierarchyAttributeTypes AS hierarchyAttributeType, dlocation_mstHierarchyTypes
                        WHERE hierarchyAttribute.clientId = ?
                        AND hierarchyAttribute.status = 1
                        AND hierarchyAttribute.hierarchyDataId = hierarchyData.hierarchyDataId
                        AND hierarchyAttribute.hierarchyAttributeTypId = hierarchyAttributeType.hierarchyAttributeTypId
                        AND hierarchyData.mstHierarchyTypeId = dlocation_mstHierarchyTypes.hierarchyTypeId`;

        params.push(data.clientId);

        if(data.searchText != undefined && data.searchText != null && data.searchText != ""){
            sql += " AND ( hierarchyData.hmName LIKE ? OR  hierarchyData.hmDescription LIKE ?  OR hierarchyAttribute.attributeValue LIKE ? OR hierarchyAttributeType.attributeTyesDesc LIKE  ? )"
            params.push("%"+data.searchText+"%");
            params.push("%"+data.searchText+"%");
            params.push("%"+data.searchText+"%");
            params.push("%"+data.searchText+"%");
        }

        if(data.hierarchyDataId != ""){
            sql += ` AND hierarchyAttribute.hierarchyDataId = ?`;
            params.push(data.hierarchyDataId)
        }

        if(data.hierarchyAttributeTypeId != ""){
            sql += ` AND hierarchyAttribute.hierarchyAttributeTypId = ?`;
            params.push(data.hierarchyAttributeTypeId)
        }

        sql += ` LIMIT ?,?`
        params.push(Number(data.offset));
        params.push(Number(data.limit));

        let [result] = await readConn.query(sql,params);
        return result;

    }catch(e){

        let log = util.createLog(e);
        return false
    }
}

// Add Hierarchy Attributes
module.exports.addHierarchyAttributeDao = async (data) => {
    try{
        let sql = `INSERT INTO dlocation_hierarchyAttributes (clientId, hierarchyDataId, hierarchyAttributeTypId, attributeValue, attributeDataValueId) VALUES (?,?,?,?,?)`;
        let [result] = await writeConn.query(sql,[data.clientId, data.hierarchyDataId, data.hierarchyAttributeTypeId, data.attributeValue, data.attributeDataValueId]);
        return result.insertId;

    }catch(e){

        let log = util.createLog(e);
        return false
    }
}

// Update Hierarchy Attributes
module.exports.updateHierarchyAttributesDao = async (data) => {
    try{
        let sql = `UPDATE dlocation_hierarchyAttributes SET clientId = ?, hierarchyDataId = ?, hierarchyAttributeTypId = ?, attributeValue = ?, attributeDataValueId = ? WHERE id = ?`;
        let [result] = await writeConn.query(sql,[data.clientId, data.hierarchyDataId, data.hierarchyAttributeTypeId, data.attributeValue, data.attributeDataValueId, data.hierarchyAttributeId]);
        return result;

    }catch(e){

        let log = util.createLog(e);
        return false
    }
}

// Delete Hierarchy Attributes
module.exports.deleteHierarchyAttributesDao = async (data) => {
    try{
        let sql = `UPDATE dlocation_hierarchyAttributes SET status = 2 WHERE id = ?`;
        let [result] = await writeConn.query(sql,[data.hierarchyAttributeId]);
        return result;

    }catch(e){

        let log = util.createLog(e);
        return false
    }
}
// ========================= Hierarchy Attributes Ends ================================


module.exports.getLastLevelAttributes = async (data) => {
    try{
        let params = [];
        let sql = `SELECT dlocation_hierarchyAttributes.id, dlocation_hierarchyAttributes.attributeValue, dlocation_hierarchyAttributes.attributeDataValueId, dlocation_hierarchyAttributeTypes.attributeTyesDesc  
                    FROM dlocation_hierarchyAttributes, dlocation_hierarchyAttributeTypes 
                    WHERE dlocation_hierarchyAttributes.hierarchyDataId = ?
                    AND dlocation_hierarchyAttributes.clientId = ? 
                    AND dlocation_hierarchyAttributes.status = 1 
                    AND dlocation_hierarchyAttributes.hierarchyAttributeTypId = dlocation_hierarchyAttributeTypes.hierarchyAttributeTypId
                    AND dlocation_hierarchyAttributeTypes.mstmstHierarchyTypeId = ?
                    AND dlocation_hierarchyAttributeTypes.status = 1`;

        params.push(data.hierarchyDataId);
        params.push(data.clientId);
        params.push(data.hierarchyTypeId);

        if(data.attrType !== undefined && data.attrType != '' && data.attrType != null && data.attrType == 'Unit'){

            sql += " AND dlocation_hierarchyAttributeTypes.attributeTyesDesc = ?"
            params.push(data.attrType)
        }

        let [result] = await readConn.query(sql,params);

        return result;

    }catch(e){

        let log = util.createLog(e);
        return false
    }
}



module.exports.checkAttributeMasterType = async (data, type) => {
    try{
        let params = [];

        let sql = `SELECT id FROM dlocation_hierarchyMasterAttributeTypes WHERE hmId = ? AND attributeTyesDesc = ? AND status = 1 `;

        params.push(data.hmId)
        params.push(data.attributeTyesDesc)

        if(type == 'EXSISTING'){

            sql += " AND id != ? "
            params.push(data.attributeTyesMasterId)
        }

        
        let [result] = await readConn.query(sql,params);

        let check = 0;

        if(result.length > 0){
            if(result[0].id != null){

                check = result[0].id;
            }
        }

        return check;

    }catch(e){

        let log = util.createLog(e);
        return false;
    }
}


module.exports.addNewMasterAttributeType = async (data) => {
    try{
        let sql = `INSERT INTO dlocation_hierarchyMasterAttributeTypes (attributeTyesDesc,hmId) VALUES (?,?)`;
        let [result] = await writeConn.query(sql,[data.attributeTyesDesc, data.hmId]);
        return result.insertId;

    }catch(e){

        let log = util.createLog(e);
        return false
    }
}


module.exports.updateNewMasterAttributeType = async (data) => {
    try{
        let sql = `UPDATE dlocation_hierarchyMasterAttributeTypes SET attributeTyesDesc = ? WHERE id = ? AND hmId = ?`;

        let [result] = await writeConn.query(sql,[data.attributeTyesDesc, data.attributeTyesMasterId , data.hmId]);
        return true;

    }catch(e){

        let log = util.createLog(e);
        return false
    }
}


module.exports.deleteNewMasterAttribute = async (data) => {
    try{
        let sql = `UPDATE dlocation_hierarchyMasterAttributeTypes SET status = 2 WHERE id = ?`;

        let [result] = await writeConn.query(sql,[data.attributeTyesMasterId]);
        return true;

    }catch(e){

        let log = util.createLog(e);
        return false
    }
}


module.exports.updateHierarchyDatav2 = async (data) => {
    try{
        let sql = `UPDATE dlocation_mstHierarchyData SET hmName = ?, hmDescription = ? WHERE hierarchyDataId = ?`;
        
        let [result] = await writeConn.query(sql,[data.hierarchyDataName,data.hierarchyDataDesc,data.hierarchyDataId]);
        return true;
    }catch(e){

        util.createLog(e);
        return false
    }
}

module.exports.updateHierarchyData_V3 = async (connection, data) => {
    try{
        let sql = `UPDATE dlocation_mstHierarchyData SET hmName = ?, hmDescription = ? WHERE hierarchyDataId = ?`;
        
        let [result] = await transaction.executeQuery(connection, sql,[data.hierarchyDataName,data.hierarchyDataDesc,data.hierarchyDataId]);
        return true;
    }catch(e){

        util.createLog(e);
        throw e;
    }
}

module.exports.updateHierarchyDataWithParentv2 = async (data) => {
    try{
        let sql = `UPDATE dlocation_mstHierarchyData SET hmName = ?, hmDescription = ?, parentHMId = ? WHERE hierarchyDataId = ?`;
        
        let [result] = await writeConn.query(sql,[data.hierarchyDataName,data.hierarchyDataDesc,data.parentHMId,data.hierarchyDataId]);
        return true;
    }catch(e){

        util.createLog(e);
        return false
    }
}

module.exports.updateHierarchyDataWithParent_V3 = async (connection, data) => {
    try{
        let sql = `UPDATE dlocation_mstHierarchyData SET hmName = ?, hmDescription = ?, parentHMId = ? WHERE hierarchyDataId = ?`;
        
        let [result] = await transaction.executeQuery(connection, sql,[data.hierarchyDataName,data.hierarchyDataDesc,data.parentHMId,data.hierarchyDataId]);
        return true;
    }catch(e){

        util.createLog(e);
        throw e;
    }
}



module.exports.getHierarchyDataDetails = async (data) => {
    try{
        let params = [];

        let sql = `SELECT hierarchyDataId, clientId, hmId, mstHierarchyTypeId, hmName, hmDescription, previousId, parentHMtypId, parentHMId, leafLevel, status, DATE_FORMAT(createdAt, '%Y-%m-%d %H:%m:%s') AS createdAt, createdBy FROM dlocation_mstHierarchyData WHERE hierarchyDataId = ?`;

        params.push(data.hierarchyDataId);


        let [result] = await readConn.query(sql,params);

        return result;

    }catch(e){
        util.createLog(e);
        return false
    }
}

module.exports.checkAnyChildNode = async (data) => {
    try{
        let params = [];

        let sql = `SELECT hierarchyDataId FROM dlocation_mstHierarchyData WHERE parentHMId = ?`;

        params.push(data.hierarchyDataId);

        // console.log(sql)
        // console.log(params)


        let [result] = await readConn.query(sql,params);

        // console.log(result)

        return result;

    }catch(e){
        util.createLog(e);
        return []
    }
}

module.exports.addIntoLogTablePrimary = async (data) => {
    try{
        let sql = `INSERT INTO dlocation_mstHierarchyDataLogs (clientId,hmId,hierarchyTypeId,hierarchyDataId,previousData,requestedBy,requestedAt) VALUES (?,?,?,?,?,?,?)`;
        let [result] = await writeConn.query(sql,[data.clientId, data.mstHierarchyId,data.hierarchyTypeId,data.hierarchyDataId,data.previousData, data.userId, data.currentDateTime]);
        return result.insertId;

    }catch(e){
        util.createLog(e);
        return false
    }
}

module.exports.addIntoLogTablePrimary_V2 = async (connection, data) => {
    try{
        let sql = `INSERT INTO dlocation_mstHierarchyDataLogs (clientId,hmId,hierarchyTypeId,hierarchyDataId,previousData,requestedBy,requestedAt) VALUES (?,?,?,?,?,?,?)`;
        let [result] = await transaction.executeQuery(connection, sql,[data.clientId, data.mstHierarchyId,data.hierarchyTypeId,data.hierarchyDataId,data.previousData, data.userId, data.currentDateTime]);
        return result.insertId;

    }catch(e){
        util.createLog(e);
        throw e;
    }
}

module.exports.updateIntoLogTableSecondary = async (data) => {
    try{
        let sql = `UPDATE dlocation_mstHierarchyDataLogs SET newData = ?, modifiedBy = ?, modifiedAt = ? WHERE transactionId = ?`;
        
        let [result] = await writeConn.query(sql,[data.newData, data.userId,data.currentDateTime,data.transactionId]);
        return true;
    }catch(e){
        util.createLog(e);
        return false
    }
}

module.exports.updateIntoLogTableSecondary_V2 = async (connection, data) => {
    try{
        let sql = `UPDATE dlocation_mstHierarchyDataLogs SET newData = ?, modifiedBy = ?, modifiedAt = ? WHERE transactionId = ?`;
        
        let [result] = await transaction.executeQuery(connection, sql,[data.newData, data.userId,data.currentDateTime,data.transactionId]);
        return true;
    }catch(e){
        util.createLog(e);
        throw e;
    }
}

module.exports.getAllChildsNodeIds = async (data) => {
    try{
        let params = [];

        let sql = `SELECT dlocation_mstHierarchyData.hierarchyDataId AS childHierarchyDataId, 
                    dlocation_mstHierarchyData.clientId, 
                    dlocation_mstHierarchyData.hmId,
                    dlocation_mstHierarchyData.hmName AS childHmName, 
                    dlocation_mstHierarchyData.mstHierarchyTypeId AS childHierarchyTypeId,
                    dlocation_mstHierarchyTypes.hmTypDesc AS childHmTypeName,
                    dlocation_mstHierarchyTypes.SlNo AS childSlNo


                    FROM dlocation_mstHierarchyData, dlocation_mstHierarchyTypes 
                    WHERE dlocation_mstHierarchyData.parentHMtypId = ?
                    AND dlocation_mstHierarchyData.parentHMId = ?
                    AND dlocation_mstHierarchyData.mstHierarchyTypeId = dlocation_mstHierarchyTypes.hierarchyTypeId`;

        params.push(data.hierarchyTypeId);
        params.push(data.hierarchyDataId);


        let [result] = await readConn.query(sql,params);

        return result;

    }catch(e){
        util.createLog(e);
        return false
    }
}






//===========================================================================================

/**
 * @author : Josimoddin Shaikh
 * @date : 12/03/202
 * @description : download sample excel for product/location upload
 * @argument : 
 * @returns
 */
module.exports.getHierarchyLevelByClient = async (data) => {
    try {
        let sql = `SELECT hierarchyTypeId,LOWER(hmTypDesc) hmTypDescLower, SlNo, hmTypDesc  FROM dlocation_mstHierarchyTypes WHERE clientId = ? AND hmId = ? AND status = 1 ORDER BY SlNo ASC`;
        let [result] = await readConn.query(sql, [data.clientId, data.mstHierarchyId]);
        return result;
    } catch (e) {

        let log = util.createLog(e);
        // return false
        throw e
    }
}

module.exports.getAttributesType = async (data) => {
    try {
        let sql = `SELECT hierarchyAttributeTypId,attributeTyesDesc FROM dlocation_hierarchyAttributeTypes WHERE clientId = ? AND hmId=? AND mstmstHierarchyTypeId=? AND status=1  `;
        let [result] = await readConn.query(sql, [data.clientId, data.mstHierarchyId, data.lastlevel]);
        return result;
    } catch (e) {

        let log = util.createLog(e);
        // return false
        throw e

    }
}
module.exports.getSpecificAttributesType = async (data) => {
    try {
        let sql = `SELECT hierarchyAttributeTypId,attributeTyesDesc FROM dlocation_hierarchyAttributeTypes WHERE clientId = ? AND hmId=? AND mstmstHierarchyTypeId=? AND attributeTyesDesc=? AND status=1  `;
        let [result] = await readConn.query(sql, [data.clientId, data.mstHierarchyId, data.lastlevel, data.attributeTyesDesc]);
        return result;
    } catch (e) {

        let log = util.createLog(e);
        return false
    }
}

// Check Before Adding
module.exports.checkDuplicateHierarchyData = async (data) => {
    try {
        let sql = `SELECT hierarchyDataId 
                        FROM dlocation_mstHierarchyData 
                        WHERE Lower(hmName) = ? AND hmId = ? AND mstHierarchyTypeId = ? AND parentHMId=? AND clientId = ? AND status = 1`;

        let [result] = await readConn.query(sql, [data.hierarchyDataName.toLowerCase(), data.mstHierarchyId, data.hierarchyTypeId, data.parentHMId, data.clientId]);
        return result //.length > 0 ? result[0].hierarchyDataId : 0;
    } catch (e) {
        let log = util.createLog(e);
        // return false
        throw e

    }
}

module.exports.getSkuImage = async (clientId) => {
    try {
        let sql = `SELECT settingsValue FROM clientSettings WHERE clientId = 11 AND settingsType LIKE 'companyLogo'`;

        let [result] = await readConn.query(sql, [clientId]);
        return result.length > 0 ? result[0].settingsValue : "";
    } catch (e) {
        let log = util.createLog(e);
        // return false
        throw e

    }
}




module.exports.getDataParentLeafs = async (data, allPrentsArr) => {
    try {
        let sql = `SELECT mapId, leafHMdataId, leafHMtypId, parentHMtypId, parentHMId, parentSlNo FROM dlocation_parentLeafMap WHERE status = 1 AND clientId = ? AND leafHMtypId = ? AND parentHMId IN (`+allPrentsArr+`)`;

        let [result] = await readConn.query(sql, [data.clientId, data.hierarchyTypeId]);
        return result;
    } catch (e) {

        let log = util.createLog(e);
        // return false
        throw e

    }
}


module.exports.insertParentsNewLeafs = async (data) => {
    try{
        let sql = `INSERT INTO dlocation_parentLeafMap(clientId, hmId, parentHMtypId, parentHMId, parentSlNo, leafHMtypId, leafHMdataId, leafNodeListLength, createdAt) VALUES(?,?,?,?,?,?,?,?,?)`;
        
        let [result] = await writeConn.query(sql,[data.clientId, data.hmId, data.parentHMtypId, data.parentHMId, data.parentSlNo,data.leafHMtypId, data.leafHMdataId, data.leafNodeListLength,data.createdAt]);
        return true;
    }catch(e){
        util.createLog(e);
        return false
    }
}

module.exports.insertParentsNewLeafs_V2 = async (connection, data) => {
    try{
        let sql = `INSERT INTO dlocation_parentLeafMap(clientId, hmId, parentHMtypId, parentHMId, parentSlNo, leafHMtypId, leafHMdataId, leafNodeListLength, createdAt) VALUES(?,?,?,?,?,?,?,?,?)`;
        
        let [result] = await transaction.executeQuery(connection, sql,[data.clientId, data.hmId, data.parentHMtypId, data.parentHMId, data.parentSlNo,data.leafHMtypId, data.leafHMdataId, data.leafNodeListLength,data.createdAt]);
        return true;
    }catch(e){
        util.createLog(e);
        throw e;
    }
}



module.exports.updateDeletePrevious = async (mapId) => {
    try{
        let sql = `UPDATE dlocation_parentLeafMap SET status = 2 WHERE mapId = ?`;
        
        let [result] = await writeConn.query(sql,[mapId]);
        return true;
    }catch(e){
        util.createLog(e);
        return false
    }
}

module.exports.updateDeletePrevious_V2 = async (connection, mapId) => {
    try{
        let sql = `UPDATE dlocation_parentLeafMap SET status = 2 WHERE mapId = ?`;
        
        let [result] = await transaction.executeQuery(connection, sql,[mapId]);
        return true;
    }catch(e){
        util.createLog(e);
        throw e;
    }
}






// Add Hierarchy Attributes
module.exports.addHierarchyAttributeWithTransctn = async (connection, data) => {
    try {
        let sql = `SELECT id 
        FROM dlocation_hierarchyAttributes 
        WHERE hierarchyDataId = ? AND hierarchyAttributeTypId = ? AND clientId = ? AND status = 1`;

        let [result1] = await readConn.query(sql, [data.hierarchyDataId, data.hierarchyAttributeTypId, data.clientId]);
        if (result1.length == 0) {
            let sql = `INSERT INTO dlocation_hierarchyAttributes (clientId, hierarchyDataId, hierarchyAttributeTypId, attributeValue, attributeDataValueId) VALUES (?,?,?,?,?)`;
            // let [result] = await writeConn.query(sql, [data.clientId, data.hierarchyDataId, data.hierarchyAttributeTypId, data.attributeValue, '0']);
            const result = await transaction.executeQuery(connection, sql, [data.clientId, data.hierarchyDataId, data.hierarchyAttributeTypId, data.attributeValue, '0'])
            return result[0].insertId;
        }

        return '0';

    } catch (e) {

        let log = util.createLog(e);
        // return false
        throw e
    }
}
//==
module.exports.checkHierarchyDataDaoUpload = async (data) => {
    try {
        // let sql = `SELECT hierarchyDataId 
        //                 FROM dlocation_mstHierarchyData 
        //                 WHERE hmName = ? AND hmId = ? AND mstHierarchyTypeId = ? AND clientId = ? AND status = 1`;

        // let [result] = await readConn.query(sql, [data.hierarchyDataName, data.mstHierarchyId, data.hierarchyTypeId, data.clientId]);
        let sql = `SELECT hierarchyDataId 
                        FROM dlocation_mstHierarchyData 
                        WHERE Lower(hmName) = ? AND hmId = ? AND mstHierarchyTypeId = ? AND parentHMId=? AND clientId = ? AND status = 1`;

        let [result] = await readConn.query(sql, [data.hierarchyDataName.toLowerCase(), data.mstHierarchyId, data.hierarchyTypeId, data.parentHMId, data.clientId]);
        return result.length > 0 ? result[0].hierarchyDataId : 0;
    } catch (e) {
        let log = util.createLog(e);
        // return false
        throw e

    }
}
module.exports.addHierarchyDataDaoUpload = async (connection, data) => {
    try {
        let sql = `INSERT INTO dlocation_mstHierarchyData (clientId, hmId, mstHierarchyTypeId, hmName, hmDescription, parentHMtypId, parentHMId, leafLevel, createdBy,createdAt) VALUES (?,?,?,?,?,?,?,?,?,?)`;

        // let [result] = await writeConn.query(sql, [data.clientId, data.mstHierarchyId, data.hierarchyTypeId, data.hierarchyDataName, data.hierarchyDataDesc, data.parentHMtypId, data.parentHMId, data.leafLevel, data.userId, data.currentDateTime]);
        const result = await transaction.executeQuery(connection, sql, [data.clientId, data.mstHierarchyId, data.hierarchyTypeId, data.hierarchyDataName, data.hierarchyDataDesc, data.parentHMtypId, data.parentHMId, data.leafLevel, data.userId, data.currentDateTime])

        return result[0].insertId;
    } catch (e) {

        let log = util.createLog(e);
        // return false
        throw e

    }
}
module.exports.getHMtypenameDataUpload = async (data) => {
    try {
        let sql = `SELECT LOWER(hmTypDesc) hmTypDescLower, SlNo, hmTypDesc  FROM dlocation_mstHierarchyTypes WHERE hierarchyTypeId = ? AND clientId = ? AND hmId = ? AND status = 1`;

        let [result] = await readConn.query(sql, [data.hierarchyTypeId, data.clientId, data.mstHierarchyId]);
        return result;
    } catch (e) {

        let log = util.createLog(e);
        // return false
        throw e

    }
}
module.exports.insertIntoMapConfUpload = async (connection, nameOfTheTyp, hierarchyDataId, data) => {
    try {
        let sql = `INSERT INTO dlocation_clientHierarchyMapConf (clientId, hmId, hierarchyDesc, mstHierarchyDataId, createdAt) VALUES (?,?,?,?,?)`;

        // let [result] = await writeConn.query(sql, [data.clientId, data.mstHierarchyId, nameOfTheTyp, hierarchyDataId, data.currentDateTime]);
        const result = await transaction.executeQuery(connection, sql, [data.clientId, data.mstHierarchyId, nameOfTheTyp, hierarchyDataId, data.currentDateTime])

        return result[0].insertId;
    } catch (e) {

        let log = util.createLog(e);
        // return false
        throw e

    }
}
module.exports.getParentDataByLeafUpload = async (data, dataMain) => {
    try {
        let sql = `SELECT mapId, leafHMdataId, leafNodeListLength, parentSlNo  FROM dlocation_parentLeafMap WHERE clientId = ? AND hmId = ? AND parentHMtypId = ? AND parentHMId = ? AND parentSlNo = ? AND leafHMtypId = ? AND status = 1`;

        let [result] = await readConn.query(sql, [dataMain.clientId, dataMain.mstHierarchyId, data.typeId, data.id, data.slNo, dataMain.hierarchyTypeId]);
        return result;
    } catch (e) {

        let log = util.createLog(e);
        // return false
        throw e

    }
}
module.exports.updateOldMappingConfUpload = async (connection, mapId) => {
    try {
        let sql = `UPDATE dlocation_parentLeafMap SET status = 2 WHERE mapId = ?`;

        // let [result] = await writeConn.query(sql, [mapId]);
        const result = await transaction.executeQuery(connection, sql, [mapId])

        return true;
    } catch (e) {

        let log = util.createLog(e);
        // return false
        throw e

    }
}

module.exports.insertNewMappingConfUpload = async (connection, dataMain, data, newMapString, finalLengthOfParentNode) => {
    try {
        let sql = `INSERT INTO dlocation_parentLeafMap (clientId, hmId, parentHMtypId, parentHMId,parentSlNo,leafHMtypId,leafHMdataId,leafNodeListLength,createdAt) VALUES (?,?,?,?,?,?,?,?,?)`;

        // let [result] = await writeConn.query(sql, [dataMain.clientId, dataMain.mstHierarchyId, data.typeId, data.id, data.slNo, dataMain.hierarchyTypeId, newMapString, finalLengthOfParentNode, dataMain.currentDateTime]);
        const result = await transaction.executeQuery(connection, sql, [dataMain.clientId, dataMain.mstHierarchyId, data.typeId, data.id, data.slNo, dataMain.hierarchyTypeId, newMapString, finalLengthOfParentNode, dataMain.currentDateTime])

        return true;
    } catch (e) {

        let log = util.createLog(e);
        // return false
        throw e

    }
}
module.exports.updateOldMappingConfForRedisUpload = async (connection, keyName) => {
    try {
        let sql = `UPDATE dlocation_hierarchyRedis SET status = 2 WHERE keyName = ?`;

        // let [result] = await writeConn.query(sql, [keyName]);
        const result = await transaction.executeQuery(connection, sql, [keyName])

        return true;
    } catch (e) {

        let log = util.createLog(e);
        // return false
        throw e

    }
}
module.exports.insertIntoRedisConfigMysqlUpload = async (connection, data, ulKeyString, ulKeyStringValue) => {
    try {
        let sql = `INSERT INTO dlocation_hierarchyRedis (keyName,valueName,createdAt) VALUES (?,?,?)`;

        // let [result] = await writeConn.query(sql, [ulKeyString, ulKeyStringValue, data.currentDateTime]);
        const result = await transaction.executeQuery(connection, sql, [ulKeyString, ulKeyStringValue, data.currentDateTime])

        return true;
    } catch (e) {

        let log = util.createLog(e);
        // return false
        throw e

    }
}
module.exports.getSeqNoFORhyprIdUpload = async (data, hierarchyTypeId) => {
    try {
        let sql = `SELECT SlNo FROM dlocation_mstHierarchyTypes WHERE clientId = ? AND hierarchyTypeId = ? AND status = 1`;

        let [result] = await readConn.query(sql, [data.clientId, hierarchyTypeId]);
        let slNo = 0;

        if (result.length > 0 && result[0].SlNo != null) {

            slNo = result[0].SlNo
        }

        return slNo;
    } catch (e) {

        let log = util.createLog(e);
        // return 0
        throw e

    }
}
//============================================================================================


module.exports.InsertIntolocationHierarchyMapping = async (connection, data, levelName, levelId) => {
    try{
        let sql = `INSERT INTO dlocation_hierarchyMapping (clientId, hmId, levelName, hierarchyTypeId, createdBy, createdAt) VALUES (?,?,?,?,?,?)`;
        let values = [data.clientId, data.hmId, levelName, levelId, data.userId, data.currentDateTime];
        let [result] = await transaction.executeQuery(connection, sql, values);
        return true;

    }catch(e){
        util.createLog(e);
        throw e;
    }
}

module.exports.deleteFromlocationHierarchyMapping = async (connection, data) => {
    try{
        let sql = `UPDATE dlocation_hierarchyMapping SET status = 2 WHERE clientId = ? AND hmId = ? AND status = 1`;
        let values = [data.clientId, data.hmId];
        let [result] = await transaction.executeQuery(connection, sql, values);
        return true;

    }catch(e){
        util.createLog(e);
        throw e;
    }
}

module.exports.fetchlocationHierarchyMapping = async (data) => {
    try{
        let sql = `SELECT a.id, a.clientId, a.hmId, a.levelName, a.hierarchyTypeId, b.hmTypDesc

        FROM dlocation_hierarchyMapping a, dlocation_mstHierarchyTypes b 
        
        WHERE a.clientId = ? 
        AND a.hmId = ? 
        AND a.status = 1 
        AND a.hierarchyTypeId = b.hierarchyTypeId
        AND b.status = 1
        AND b.hmId = ?`;

        let values = [data.clientId, data.hmId, data.hmId];
        let [result] = await readConn.query(sql, values);
        return result;

    }catch(e){
        util.createLog(e);
        return false
    }
}

module.exports.getAllDataByHiearchyType = async (data) => {
    try{
        let params = [];
        let sql = `SELECT hierarchyDataId, mstHierarchyTypeId AS hierarchyTypeId, hmName, hmDescription 
                FROM dlocation_mstHierarchyData 
                WHERE clientId = ? 
                AND hmId = ? 
                AND mstHierarchyTypeId = ? 
                AND status = 1 `;

        params.push(data.clientId)
        params.push(data.hmId)
        params.push(data.hierarchyTypeId)

        if(data.searchText != undefined && data.searchText != null && data.searchText != ""){

            sql += " AND hmName LIKE ?"
            params.push("%"+data.searchText+"%");

        }

        sql += " ORDER BY hmName ASC"

        let [result] = await readConn.query(sql, params);
        return result;

    }catch(e){
        util.createLog(e);
        return false
    }
}