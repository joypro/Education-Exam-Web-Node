const util = require('../utility/util');

module.exports.mstClientReq = (data) => {
    let errcounter = 0;
    if (data.limit === undefined || data.limit == null) {
        util.createLog("Limit is missing");
        errcounter++;
    }
    if (data.offset === undefined || data.offset == null) {
        util.createLog("Offset is missing");
        errcounter++;
    }
    if (data.searchText === undefined) {
        util.createLog("searchText is missing");
        errcounter++;
    }
    return errcounter <= 0;
}
module.exports.addClientReq = (data) => {
    let errcounter = 0;
    if (data.userId === undefined || data.userId == null) {
        util.createLog("userId is missing");
        errcounter++;
    }
    if (data.clientName === undefined || data.clientName == null) {
        util.createLog("clientName is missing");
        errcounter++;
    }
    if (data.email === undefined || data.email == null) {
        util.createLog("email is missing");
        errcounter++;
    }
    if (data.phone === undefined || data.phone == null) {
        util.createLog("phone is missing");
        errcounter++;
    }
    // if (data.countryId === undefined || data.countryId == null) {
    //     util.createLog("countryId is missing");
    //     errcounter++;
    // }
    // if (data.stateId === undefined || data.stateId == null) {
    //     util.createLog("stateId is missing");
    //     errcounter++;
    // }
    // if (data.cityId === undefined || data.cityId == null) {
    //     util.createLog("cityId is missing");
    //     errcounter++;
    // }
    return errcounter <= 0;
}




module.exports.updateClientReq = (data) => {
    let errcounter = 0;
    if (data.userId === undefined || data.userId == null) {
        util.createLog("userId is missing");
        errcounter++;
    }
    if (data.clientId === undefined || data.clientId == null) {
        util.createLog("clientId is missing");
        errcounter++;
    }
    if (data.clientName === undefined || data.clientName == null) {
        util.createLog("clientName is missing");
        errcounter++;
    }
    if (data.email === undefined || data.email == null) {
        util.createLog("email is missing");
        errcounter++;
    }
    if (data.phone === undefined || data.phone == null) {
        util.createLog("phone is missing");
        errcounter++;
    }
    if (data.countryCode === undefined || data.countryCode == null || data.countryCode == "") {
        util.createLog("countryCode is missing");
        errcounter++;
    }
    // if (data.countryId === undefined || data.countryId == null) {
    //     util.createLog("countryId is missing");
    //     errcounter++;
    // }
    // if (data.stateId === undefined || data.stateId == null) {
    //     util.createLog("stateId is missing");
    //     errcounter++;
    // }
    // if (data.cityId === undefined || data.cityId == null) {
    //     util.createLog("cityId is missing");
    //     errcounter++;
    // }
    // if (data.zoneId === undefined || data.zoneId == null) {
    //     util.createLog("zoneId is missing");
    //     errcounter++;
    // }
    return errcounter <= 0;
}
module.exports.deleteClientReq = (data) => {

    let errcounter = 0;
    if (data.userId === undefined || data.userId == null) {
        util.createLog("userId is missing");
        errcounter++;
    }
    if (data.client_id === undefined || data.client_id == null) {
        util.createLog("clientId is missing");
        errcounter++;
    }
    return errcounter <= 0;
}


/**
 * @author : Indranil
 * @date : 08/08/2023
 * @description : list promotional banners
 * @argument : 
 * @returns
 */


module.exports.uploadPromationalBannersReq = (data) => {
    let errcounter = 0;
    if (data.limit === undefined || data.limit == null) {
        util.createLog("Limit is missing");
        errcounter++;
    }
    if (data.offset === undefined || data.offset == null) {
        util.createLog("Offset is missing");
        errcounter++;
    }
    if (data.searchText === undefined) {
        util.createLog("searchText is missing");
        errcounter++;
    }
    return errcounter <= 0;
}


/**
 * @author : Indranil
 * @date : 08/08/2023
 * @description : delete promotional banners
 * @argument : 
 * @returns
 */

module.exports.deleteUploadPromationalBannersReq = (data) => {

    let errcounter = 0;
    if (data.userId === undefined || data.userId == null) {
        util.createLog("userId is missing");
        errcounter++;
    }
    if (data.client_id === undefined || data.client_id == null) {
        util.createLog("clientId is missing");
        errcounter++;
    }
    return errcounter <= 0;
}


/**
 * @author : Indranil
 * @date : 09/08/2023
 * @description : active or inactive promotional banners
 * @argument : 
 * @returns
 */

module.exports.activeUploadPromationalBannersReq = (data) => {
    let errcounter = 0;
    if (data.userId === undefined || data.userId == null) {
        util.createLog("userId is missing");
        errcounter++;
    }
    if (data.client_id === undefined || data.client_id == null) {
        util.createLog("clientId is missing");
        errcounter++;
    }
    if (data.isActive === undefined || data.isActive == null) {
        util.createLog("isActive is missing");
        errcounter++;
    }
    return errcounter <= 0;
}


/**
 * @author : Prosenjit Paul
 * @date : 09/08/2023
 * @description : get Client Hierarchy Details
 * @argument : 
 * @returns
 */


module.exports.getClientHierarchyValidation = (data) => {

    let errcounter = 0;
    if (data.userId === undefined || data.userId == null) {
        util.createLog("userId is missing");
        errcounter++;
    }
    // if (data.client_id === undefined || data.client_id == null) {
    //     util.createLog("clientId is missing");
    //     errcounter++;
    // }
    if (data.selectedClientId === undefined || data.selectedClientId == null) {
        util.createLog("selectedClientId is missing");
        errcounter++;
    }

    return errcounter <= 0;
}

/**
 * @author : Sarbojit
 * @date : 27/11/2023
 * @description : Add New Client
 * @argument : 
 * @returns
 */

module.exports.addClientReqV2 = (data) => {
    let errcounter = 0;
    // if (data.userId === undefined || data.userId == null) {
    //     util.createLog("userId is missing");
    //     errcounter++;
    // }
    if (data.clientName === undefined || data.clientName == null) {
        util.createLog("clientName is missing");
        errcounter++;
    }
    if (data.email === undefined || data.email == null) {
        util.createLog("email is missing");
        errcounter++;
    }
    if (data.phone === undefined || data.phone == null) {
        util.createLog("phone is missing");
        errcounter++;
    }
    return errcounter <= 0;
}

/**
 * @author : Sarbojit
 * @date : 27/11/2023
 * @description : Update Client
 * @argument : 
 * @returns
 */

module.exports.updateClientReqV2 = (data) => {
    let errcounter = 0;
   
    if (data.clientId === undefined || data.clientId == null) {
        util.createLog("clientId is missing");
        errcounter++;
    }
    if (data.clientName === undefined || data.clientName == null) {
        util.createLog("clientName is missing");
        errcounter++;
    }
    if (data.email === undefined || data.email == null) {
        util.createLog("email is missing");
        errcounter++;
    }
    if (data.phone === undefined || data.phone == null) {
        util.createLog("phone is missing");
        errcounter++;
    }
    return errcounter <= 0;
}

/**
 * @author : Sarbojit
 * @date : 27/11/2023
 * @description : Delete Client
 * @argument : 
 * @returns
 */

module.exports.deleteClientReqV2 = (data) => {
    let errcounter = 0;
   if (data.client_id === undefined || data.client_id == null) {
        util.createLog("clientId is missing");
        errcounter++;
    }
    return errcounter <= 0;
}

/**
 * @author : Sourav Bhoumik
 * @date : 15/07/2024
 * @description : Add New Client with new feature
 * @argument : 
 * @returns
 */

module.exports.addNewClient = (data) => {
    let errcounter = 0;
    if (data.userId === undefined || data.userId == null || data.userId == "") {
        util.createLog("userId is missing");
        errcounter++;
    }
    if (data.clientName === undefined || data.clientName == null || data.clientName == "") {
        util.createLog("clientName is missing");
        errcounter++;
    }
    if (data.email === undefined || data.email == null || data.email == "") {
        util.createLog("email is missing");
        errcounter++;
    }
    if (data.countryCode === undefined || data.countryCode == null || data.countryCode == "") {
        util.createLog("countryCode is missing");
        errcounter++;
    }
    if (data.phone === undefined || data.phone == null || data.phone == "") {
        util.createLog("phone is missing");
        errcounter++;
    }
    if (data.clientSortCode === undefined || data.clientSortCode == null || data.clientSortCode == "") {
        util.createLog("clientSortCode is missing");
        errcounter++;
    }
    if (data.deafultLocation === undefined || data.deafultLocation == null || data.deafultLocation == "") {
        util.createLog("deafultLocation is missing");
        errcounter++;
    }
    // if (data.modules === undefined || data.modules == null || data.modules == '') {
    //     util.createLog("modules is missing");
    //     errcounter++;

    // }else{

    //     if(Array.isArray(data.modules) === true){

    //         if(data.modules.length > 0){

    //             for(let i = 0; i < data.modules.length; i++){

    //                 if(data.modules[i].moduleName === undefined || data.modules[i].moduleName == null || data.modules[i].moduleName == ""){
    //                     util.createLog("moduleName is missing in "+i+" index of the array");
    //                     errcounter++
    //                 }
    //                 if(data.modules[i].permission === undefined || data.modules[i].permission == null || data.modules[i].permission == ""){
    //                     util.createLog("permission value is missing in "+i+" index of the array");
    //                     errcounter++
    //                 }
    //             }


    //         }else{

    //             util.createLog("modules is empty");
    //             errcounter++; 
    //         }


    //     }else{

    //         util.createLog("modules is missing");
    //         errcounter++;

    //     }
    // }





    return errcounter <= 0;
}