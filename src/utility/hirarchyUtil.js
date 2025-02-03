const redisCon                  =   require('../dbconnection').redisCon;
const readConn                  =   require('../dbconnection').readPool
const util                      =   require('./util');

async function getDistinctObjFormArray(arr, key) {
    try{
          const distinctObjects = [];
          const uniqueKeys = new Set();

          for (const obj of arr) {
            const objKey = obj[key];

            if (!uniqueKeys.has(objKey)) {
              uniqueKeys.add(objKey);
              distinctObjects.push(obj);
            }
          }
        return distinctObjects;
        
    } catch (e) {
        util.createLog(e);
        return [];
    }
}

// async function getBtyKeyNameMysql(keyName) {
//     try{
//         const sql = "SELECT valueName FROM dlocation_hierarchyRedis WHERE keyName = ? AND status = 1"
//         const [results,fields]  =   await readConn.query(sql,[keyName]);
//         return results.length > 0 ? results[0].valueName : null;
//     } catch (e) {
//         util.createLog(e);
//         return null
//     }
// }

module.exports.getCommonObjects = async (arr1, arr2) => {
    try{

        return arr1.filter(obj1 => {
            return arr2.some(obj2 => obj2.id === obj1.id);

        });

        
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.getCommonObjectsFormOneArray = async (arr, property) => {
    try{

        const seen = new Set();
        return arr.filter((obj) => {
            const value = obj[property];
            if (seen.has(value)) {
              return false;
            } else {
              seen.add(value);
              return true;
            }
          });

        
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

async function getBtyKeyNameMysql(keyName) {
    try{

        const sql = "SELECT valueName FROM dlocation_hierarchyRedis WHERE keyName = ? AND status = 1"
        const [results,fields]  =   await readConn.query(sql,[keyName]);
        return results.length > 0 ? results[0].valueName : [];
    } catch (e) {
        util.createLog(e);
        return []
    }
}


module.exports.getLastNodeId = async (hmType, clientId, hmTypeId, hmDataId) => {
    try{
        hmType = hmType == 'L'? '1' : '2';
        const keyStr = clientId + ':' + hmType + ':' + hmTypeId + ':' + hmDataId + ':' + 'UL';

        let result = await redisCon.get(keyStr);
        if(result == null) {
            result = await getBtyKeyNameMysql(keyStr)
        }
        return result.length > 0 ? JSON.parse(result.replace(/'/g, '"')).leaf : hmDataId;
    } catch (e) {

        util.createLog(e);
        return hmDataId
    }
}

module.exports.getLastNodeId_v2 = async (hmType, clientId, hmTypeId, hmDataId) => {
    try{
        hmType = hmType == 'L'? '1' : '2';
        if(Array.isArray(hmDataId)) {
            if(hmDataId.length > 0) {
                let leaf = '';
                let backupLeaf = '';
                for(const [index, obj] of hmDataId.entries()) {
                    backupLeaf += backupLeaf != '' ? ',' : '';
                    backupLeaf += obj.hierarchyDataId
                    const keyStr = clientId + ':' + hmType + ':' + obj.hierarchyTypeId + ':' + obj.hierarchyDataId + ':' + 'UL';
                    let result = await redisCon.get(keyStr);
                    if(result == null) {
                        result = await getBtyKeyNameMysql(keyStr)
                    }
                    if(result) {
                        leaf += leaf != '' ? ',' : '';
                        leaf += JSON.parse(result.replace(/'/g, '"')).leaf;
                    }
                    if(index === (hmDataId.length -1)) {
                        return leaf === '' ? backupLeaf : leaf;
                    }
                }
            } else {
                return '0'
            }
        } else {
            const keyStr = clientId + ':' + hmType + ':' + hmTypeId + ':' + hmDataId + ':' + 'UL';
            let result = await redisCon.get(keyStr);
            if(result == null) {
                result = await getBtyKeyNameMysql(keyStr)
            }
            return result ? JSON.parse(result.replace(/'/g, '"')).leaf : hmDataId;
        }
    } catch (e) {
        util.createLog(e);
        return hmDataId
    }
}


async function getHmTypeId(dataId) {
    try{
        const sql = "SELECT mstHierarchyTypeId FROM dlocation_mstHierarchyData WHERE hierarchyDataId = ?";
        const [results,fields]  =   await readConn.query(sql,[dataId]);
        return results.length > 0 ? results[0].mstHierarchyTypeId : null;
    } catch(e) {
        util.createLog(e);
        return null;
    }
}
async function getUpperNodeByLeafId(hmType, clientId, hmTypeId, hmDataId) {
    let result = ''
    let finalRes = null
    let keyStr = ''
    try{
        hmType = hmType == 'L'? '1' : '2';
        keyStr = clientId + ':' + hmType + ':' + hmTypeId + ':' + hmDataId + ':' + 'LU';
        // console.log(keyStr)
        result = await redisCon.get(keyStr);
        // console.log(result)
        if(result == null) {
            result = await getBtyKeyNameMysql(keyStr)
        }

        // return result.length>0 ? JSON.parse(result.replace(/'/g, '"')) : null;
        return result.length>0 ? JSON.parse(result) : null;
        // return result.length>0 ? eval(finalRes) : null;
    } catch (e) {
        
        result = await getBtyKeyNameMysql(keyStr)
        return result.length>0 ? JSON.parse(result) : null;
        
    }
}
async function getUpperNodeByLeafId_old(hmType, clientId, hmTypeId, hmDataId) {
    let result = ''
    let finalRes = null
    let keyStr = ''
    try{
        hmType = hmType == 'L'? '1' : '2';
        keyStr = clientId + ':' + hmType + ':' + hmTypeId + ':' + hmDataId + ':' + 'LU';
        // console.log(keyStr)
        // let result = await redisCon.get(keyStr);
        result = await redisCon.get(keyStr);
        // console.log(result)
        if(result == null) {
            result = await getBtyKeyNameMysql(keyStr)
        }

        if(result == null){

            result = []
            
        }

        // return result.length>0 ? JSON.parse(result.replace(/'/g, '"')) : null;
        return result.length>0 ? JSON.parse(result) : null;
        // return result.length>0 ? eval(finalRes) : null;
    } catch (e) {

        util.createLog(e);
        return [];
    }
}

async function groupConcatUpperLevelData(obj, leafids, hmType, clientId, hmTypeId, newObjKey='') {
    try{
        if(newObjKey==='') {
            newObjKey = 'hmUpperNodes'
        }
        obj[newObjKey] = {}
        for(let [index, id] of leafids.entries()) {
            const res = await getUpperNodeByLeafId(hmType, clientId, hmTypeId, id);

            if(res) {
                
                for(let d of res) {
                    if(obj[newObjKey][d.typeName] == undefined) {
                        obj[newObjKey][d.typeName] = '';
                    }

                    obj[newObjKey][d.typeName] += obj[newObjKey][d.typeName].indexOf(d.name) <= -1 ? obj[newObjKey][d.typeName] !== '' ? ',' + d.name : d.name : '';

                }
                if (index == (leafids.length -1)) {
                    return obj;
                }
            }
        }
        
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

async function setUpperLevelData(obj, leafid, hmType, clientId, hmTypeId, newObjKey='') {
    try{
        const res = await getUpperNodeByLeafId(hmType, clientId, hmTypeId, leafid);
        if(newObjKey==='') {

            if(hmType == 'L') {
                newObjKey = 'hmUpperNodes'
            } else {
                newObjKey = 'prodHmUpperNodes'
            }
            // newObjKey = 'hmUpperNodes'
        }
        obj[newObjKey] = {}
        
        for(const d of res) {
            obj[newObjKey][d.typeName] = d.name;
        }
        return obj;
    } catch (e) {

        return obj;
    }
}

async function setUpperLevelDataV2(obj, leafid, hmType, clientId, hmTypeId) {
    try{
        const res = await getUpperNodeByLeafId(hmType, clientId, hmTypeId, leafid);
        let newObjKey='';
        if(hmType == 'L') {
            newObjKey = 'hmUpperNodes'
        } else {
            newObjKey = 'prodHmUpperNodes'
        }
        obj[newObjKey] = {}
        if(res) {
            for(const d of res) {
                obj[newObjKey][d.typeName] = d.name;
            }
        }
        return obj;
    } catch (e) {

        return obj;
    }
}

module.exports.setUpperLevelData = async (arr, clientId, hmType, key, isGroup = false, newObjKey='') => {
    try{
        if(arr.length > 0) {
            for(let [index, obj] of arr.entries()) {
                if(isGroup) {
                    if(obj[key] != null){

                        const leafids = (obj[key]).toString().split(',');
                        if(leafids.length > 0) {
                            const hmTypeId = await getHmTypeId(leafids[0]);
                            obj = await groupConcatUpperLevelData(obj, leafids, hmType, clientId, hmTypeId, newObjKey);
                        }

                    }
                } else {
                    const hmTypeId = await getHmTypeId(obj[key]);
                    obj = await setUpperLevelData(obj, obj[key], hmType, clientId, hmTypeId, newObjKey)
                }
                if (index == (arr.length - 1)) {

                    return arr;
                }
            }
        } else {
            return arr;
        }
    } catch(e) {

        util.createLog(e);
        return arr;
    }
}

async function groupConcatUpperLevelDataV2(obj, leafids, hmType, clientId, hmTypeId, newObjKey='') {
    try{
        let newObjKey='';
        if(hmType == 'L') {
            newObjKey = 'hmUpperNodes'
        } else {
            newObjKey = 'prodHmUpperNodes'
        }
        obj[newObjKey] = {}
        for(let [index, id] of leafids.entries()) {
            const res = await getUpperNodeByLeafId(hmType, clientId, hmTypeId, id);

            if(res) {
                
                for(let d of res) {
                    if(obj[newObjKey][d.typeName] == undefined) {
                        obj[newObjKey][d.typeName] = '';
                    }

                    obj[newObjKey][d.typeName] += obj[newObjKey][d.typeName].indexOf(d.name) <= -1 ? obj[newObjKey][d.typeName] !== '' ? ',' + d.name : d.name : '';
                }
                if (index == (leafids.length -1)) {
                    return obj;
                }
            }
        }
        
    } catch (e) {

        return false;
    }
}

module.exports.setUpperLevelDataV2 = async (arr, clientId, hmType, key, isGroup = false) => {
    try{
        if(arr.length > 0) {
            for(let [index, obj] of arr.entries()) {
                if(isGroup) {
                    const leafids = obj[key].split(',');
                    if(leafids.length > 0) {
                        const hmTypeId = await getHmTypeId(leafids[0]);
                        obj = await groupConcatUpperLevelDataV2(obj, leafids, hmType, clientId, hmTypeId);
                    }
                } else {
                    const hmTypeId = await getHmTypeId(obj[key]);
                    obj = await setUpperLevelDataV2(obj, obj[key], hmType, clientId, hmTypeId)
                }
                if (index == (arr.length - 1)) {

                    return arr;
                }
            }
        } else {
            return arr;
        }
    } catch(e) {

        util.createLog(e);
        return arr;
    }
}

async function getAttributeByHmDataId(clientId, hierarchyDataId) {
    try{
        const sql = `SELECT a.attributeValue, b.attributeTyesDesc 
        FROM dlocation_hierarchyAttributes a, dlocation_hierarchyAttributeTypes b 
        WHERE a.clientId=? 
        AND a.hierarchyDataId = ? 
        AND a.hierarchyAttributeTypId=b.hierarchyAttributeTypId 
        AND a.status=1 
        AND b.status=1`;
        const [results,fields]  =   await readConn.query(sql,[clientId, hierarchyDataId]);
        return results
    } catch (e) {
        return null;
    }
}


module.exports.setHirarchyAttribute = async (arr, clientId, hmType, key) => {
    try{
        hmType = hmType == 'L'? '1' : '2';
        if(arr.length > 0) {
            for(let [index, obj] of arr.entries()) {
                obj['productAttributes'] = {};
                const data = await getAttributeByHmDataId(clientId, obj[key]);
                if(data) {

                    for(const d of data) {
                        obj.productAttributes[d['attributeTyesDesc']] = d['attributeValue'];
                    }
                }
                if (index == (arr.length - 1)) {

                    return arr;
                }
            }
        } else {
            return arr;
        }
    } catch(e) {

        return arr;
    }
}
module.exports.getValueByKey = async (keyStr) => {
    try {
        let result = await redisCon.get(keyStr);
        if (result === null) {
            const sql = "SELECT valueName FROM dlocation_hierarchyRedis WHERE keyName = ? AND status = 1"
            const [results,fields]  =   await readConn.query(sql,[keyStr]);
            return (results.length > 0 ? results[0].valueName : null);
        } else {
            return result;
        }
    } catch (e) {
        return null;
    }
}

const getAllDesignation = async (clientId) => {
    try {
        const sql = "SELECT designationName FROM mstDesignation WHERE clientId = ? AND designationName != 'Company Admin' AND isActive = 1"
        const [results,fields]  =   await readConn.query(sql,[clientId]);
        return results;
    } catch (e) {
        return [];
    }
}

module.exports.getUserLevelHirarchy = async (userId, clientId) => {
    const newObj = {};
    try{
        const designations = await getAllDesignation(clientId);
        for(desg of designations) {
            newObj[desg.designationName] = '';
        }
        const sql = `WITH RECURSIVE hierarchy AS (
            SELECT id, parentId, childId
            FROM clientEntityHierarchy
            WHERE childId = ? AND status=1
            UNION ALL
            SELECT c.id, c.parentId, c.childId
            FROM clientEntityHierarchy AS c
            INNER JOIN hierarchy AS h ON h.parentId = c.childId AND c.status=1
          )
          SELECT DISTINCT hm.parentId, CONCAT_WS(' ', u.firstName, u.lastName) userName, d.designationName
          FROM hierarchy hm, user u, mstDesignation d
          WHERE hm.parentId=u.userId AND u.designationId=d.designationId`;
          const [results,fields]  =   await readConn.query(sql,[userId]);

        for(const d of results) {
            newObj[d.designationName] = d.userName;
        }

        return newObj;
    } catch(e) {

        return newObj;
    }
}


module.exports.getUpperNodeByLeafId = getUpperNodeByLeafId;
module.exports.getDistinctObjFormArray = getDistinctObjFormArray;
module.exports.setUpperLevelDataV2 = setUpperLevelDataV2;

async function getClientHtypes(clientId, hmId) {
    try{

        const sql = "SELECT hmTypDesc, hierarchyTypeId, SlNo FROM dlocation_mstHierarchyTypes WHERE clientId = ? AND hmId = ? AND status = 1"
        const [results,fields]  =   await readConn.query(sql,[clientId, hmId]);
        return results;
    } catch (e) {
        util.createLog(e);
        return []
    }
}



async function groupConcatUpperLevelIdData(obj, leafids, hmType, clientId, hmTypeId, newObjKey='') {
    try{
        if(newObjKey==='') {
            newObjKey = 'hmUpperNodes'
        }
        let hmId = 1;
        if(hmType == 'L'){
            hmId = 1
        }else{
            hmId = 2
        }
        let companyhTypes = [];

        companyhTypes = await getClientHtypes(clientId, hmId)

        if(companyhTypes.length > 0){

            for(let q=0;q<companyhTypes.length;q++){

                companyhTypes[q]['dataArr'] = []


            }
        }
        // console.log("=========option func====>>")
        // console.log(companyhTypes)
        // console.log("=========option func====>>")
        // console.log(obj)
        // console.log("obj")
        // console.log(leafids)
        // console.log("=========option func====>>")
        obj[newObjKey] = []
        for(let [index, id] of leafids.entries()) {
            const res = await getUpperNodeByLeafId(hmType, clientId, hmTypeId, id);

            // console.log("res")
            // console.log(res)
            // console.log("res")

            if(res) {
                
                for(let d of res) {
                    if(obj[newObjKey][d.typeName] == undefined) {
                        obj[newObjKey][d.typeName] = {};
                    }
                    for(let h=0;h<companyhTypes.length;h++){

                        if(companyhTypes[h].hierarchyTypeId == d.typeId){

                            if(!companyhTypes[h].dataArr.some(item => item.hierarchyDataId === d.id)){

                                let insertObj = {"hmName":d.name, "hierarchyDataId":d.id}

                                // if(d.typeName == "Country"){

                                //     console.log("insertObj==>", insertObj)
                                // }

                                companyhTypes[h].dataArr.push(insertObj)

                            }

                        }
                    }
                    // console.log("=============================================================typeName>>>>", d.typeName)
                    // console.log("=============================================================name>>>>", d.name)
                    // console.log("=============================================================id>>>>", d.id)


                    // obj[newObjKey][d.typeName] += obj[newObjKey][d.typeName].indexOf(d.name) <= -1 ? obj[newObjKey][d.typeName] !== '' ? ',' + d.name : d.name : '';

                }
                // console.log("9999999999999999999999999999999")
                // console.log(obj)
                // console.log("9999999999999999999999999999999")
                // if (index == (leafids.length -1)) {
                //     return obj;
                // }
            }
        }

        obj[newObjKey] = companyhTypes

        // console.log("final============================>>>>")
        // console.log(companyhTypes)
        // console.log("final============================>>>>")

        return obj
        
    } catch (e) {
        util.createLog(e);
        return false;
    }
}



module.exports.setUpperLevelDataWithId = async (arr, clientId, hmType, key, isGroup = false, newObjKey='') => {
    try{
        if(arr.length > 0) {
            for(let [index, obj] of arr.entries()) {
                if(isGroup) {
                    if(obj[key] != null){

                        const leafids = (obj[key]).toString().split(',');
                        // console.log("=================================>>", leafids)
                        if(leafids.length > 0) {
                            const hmTypeId = await getHmTypeId(leafids[0]);
                            // console.log("+++++++++++++++++++++++++++++++++>>", hmTypeId)
                            // console.log("+++++++++++++++++++++++++++++++++>>", obj)
                            obj = await groupConcatUpperLevelIdData(obj, leafids, hmType, clientId, hmTypeId, newObjKey);
                            // console.log("obj")
                            // console.log(obj)
                            // console.log("obj")
                        }

                    }
                } 
                // else {
                //     const hmTypeId = await getHmTypeId(obj[key]);
                //     obj = await setUpperLevelData(obj, obj[key], hmType, clientId, hmTypeId, newObjKey)
                // }
                if (index == (arr.length - 1)) {

                    return arr;
                }
            }
        } else {
            return arr;
        }
    } catch(e) {

        util.createLog(e);
        return arr;
    }
}

