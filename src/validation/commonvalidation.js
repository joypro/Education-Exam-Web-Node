const util = require('../utility/util');

module.exports.getTokenReq = (data) => {
    let errcounter = 0;
    if (data.userId === undefined || data.userId == null) {
        util.createLog("userId is missing");
        errcounter++;
    }
    if (data.userTypeId === undefined || data.userTypeId == null) {
        util.createLog("userTypeId is missing");
        errcounter++;
    }
    return errcounter <= 0;
};


module.exports.pickUserCurrentLocation = (data) => {
    let errcounter = 0;
    if (data.userId === undefined || data.userId == null) {
        util.createLog("userId is missing");
        errcounter++;
    }
    if (data.lattitude === undefined || data.lattitude == null) {
        util.createLog("lattitude is missing");
        errcounter++;
    }
    if (data.longitude === undefined || data.longitude == null) {
        util.createLog("longitude is missing");
        errcounter++;
    }
    return errcounter <= 0;
};

module.exports.pickCustomerCurrentLocation = (data) => {
    let errcounter = 0;
    if (data.customerId === undefined || data.customerId == null) {
        util.createLog("customerId is missing");
        errcounter++;
    }
    if (data.lattitude === undefined || data.lattitude == null) {
        util.createLog("lattitude is missing");
        errcounter++;
    }
    if (data.longitude === undefined || data.longitude == null) {
        util.createLog("longitude is missing");
        errcounter++;
    }
    return errcounter <= 0;
};


module.exports.takenLatLongDataReq = (data) => {
    let errcounter = 0;
    // if (data.userId === undefined || data.userId == null) {
    //     util.createLog("userId is missing");
    //     errcounter++;
    // }
    // if (data.lattitude === undefined || data.lattitude == null) {
    //     util.createLog("lattitude is missing");
    //     errcounter++;
    // }
    // if (data.longitude === undefined || data.longitude == null) {
    //     util.createLog("longitude is missing");
    //     errcounter++;
    // }
    return errcounter <= 0;
};

module.exports.getHierarchyTypesSlNo = (data) => {
    let errcounter = 0;
    // if (data.userId === undefined || data.userId == null) {
    //     util.createLog("userId is missing");
    //     errcounter++;
    // }
    if (data.clientId === undefined || data.clientId == null) {
        util.createLog("clientId is missing");
        errcounter++;
    }
    return errcounter <= 0;
};

module.exports.getUserImmediateChildData = (data) => {
    let errcounter = 0;
    // if (data.userId === undefined || data.userId == null) {
    //     util.createLog("userId is missing");
    //     errcounter++;
    // }
    if (data.clientId === undefined || data.clientId == null) {
        util.createLog("clientId is missing");
        errcounter++;
    }
    if (data.hierarchyTypeId === undefined || data.hierarchyTypeId == null) {
        util.createLog("hierarchyTypeId is missing");
        errcounter++;
    }
    if (data.hierarchyChildTypeId === undefined || data.hierarchyChildTypeId == null) {
        util.createLog("hierarchyChildTypeId is missing");
        errcounter++;
    }
    if (data.hierarchyDataIdArr === undefined || data.hierarchyDataIdArr == null || data.hierarchyDataIdArr == '') {
        util.createLog("hierarchyDataIdArr is missing");
        errcounter++;
    } else {

        if (Array.isArray(data.hierarchyDataIdArr) === false) {
            util.createLog("hierarchyDataIdArr is not array");
            errcounter++;
        } else {

            if (data.hierarchyDataIdArr.length === 0) {

                util.createLog("hierarchyDataIdArr is blank");
                errcounter++;


            }


        }



    }
    return errcounter <= 0;
};


/**
 * @author : Sukanta Samanta
 * @date : 24/06/2023
 * @description : get Daily Activity list validation
 * @argument : 
 * @returns
 */

module.exports.getDailyActivities = (data) => {
    let errcounter = 0;
    // if (data.userId === undefined || data.userId == null) {
    //     util.createLog("userId is missing");
    //     errcounter++;
    // }
    if (data.clientId === undefined || data.clientId == null) {
        util.createLog("clientId is missing");
        errcounter++;
    }
    return errcounter <= 0;
};


/**
 * @author : SKH
 * @date : 11/07/2023
 * @description : get All Measurements units list
 * @argument : type (	1=branding, 2=items,3=expenses)
 * @returns : ListData
 */

module.exports.getAllMeasurementUnitList = (data) => {
    let errcounter = 0;
    if (data.userId === undefined || data.userId == null) {
        util.createLog("userId is missing");
        errcounter++;
    }
    if (data.clientId === undefined || data.clientId == null) {
        util.createLog("clientId is missing");
        errcounter++;
    }
    if (data.type === undefined || data.type == null) {
        util.createLog("type is missing");
        errcounter++;
    }
    return errcounter <= 0;
};


/**
 * @author : sourav bhoumik
 * @date : 19/07/2023
 * @description : get All download list
 * @argument : clientId, userId
 * @returns : ListData
 */

module.exports.getAllDownloadList = (data) => {
    let errcounter = 0;
    if (data.userId === undefined || data.userId == null) {
        util.createLog("userId is missing");
        errcounter++;
    }
    if (data.clientId === undefined || data.clientId == null) {
        util.createLog("clientId is missing");
        errcounter++;
    }
    return errcounter <= 0;
};


/**
 * @author : Sourav Bhoumik
 * @date : 05/09/2023
 * @description : get token for external users
 * @argument : clientId, roleId, userId
 * @returns : token
 */

module.exports.getToken = (data) =>{
    let errcounter = 0;
    if (data.clientId === undefined || data.clientId == null || data.clientId == "") {
        util.createLog("clientId is missing");
        errcounter++;
    }
    if (data.userId === undefined || data.userId == null || data.userId == "") {
        util.createLog("userId is missing");
        errcounter++;
    }
    if (data.roleId === undefined || data.roleId == null || data.roleId == "") {
        util.createLog("roleId is missing");
        errcounter++;
    }
    return errcounter <= 0;
}


module.exports.getAddressByLatLng = (data) => {
    let errcounter = 0;
    if (data.lattitude === undefined || data.lattitude == null) {
        util.createLog("lattitude is missing");
        errcounter++;
    }
    if (data.longitude === undefined || data.longitude == null) {
        util.createLog("longitude is missing");
        errcounter++;
    }
    return errcounter <= 0;
};

/**
 * @author : Sourav Bhoumik
 * @date : 28/04/2024
 * @description : delete data master
 * @argument : data
 * @returns : message
 */

module.exports.deleteMasterData = (data) => {
    let errcounter = 0;
    if (data.clientId === undefined || data.clientId == null) {
        util.createLog("clientId is missing");
        errcounter++;
    }
    if (data.userId === undefined || data.userId == null) {
        util.createLog("userId is missing");
        errcounter++;
    }
    if (data.type === undefined || data.type == null) {
        util.createLog("type is missing");
        errcounter++;
    }
    if (data.typeIdArr === undefined || data.typeIdArr == null || data.typeIdArr == '') {
        util.createLog("typeIdArr is missing");
        errcounter++;

    } else {

        if (Array.isArray(data.typeIdArr) === false) {
            util.createLog("typeIdArr is not array");
            errcounter++;
        } else {

            if (data.typeIdArr.length === 0) {

                util.createLog("typeIdArr is blank");
                errcounter++;


            }


        }



    }
    return errcounter <= 0;
};