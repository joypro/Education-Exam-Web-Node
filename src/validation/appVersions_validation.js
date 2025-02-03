const util = require('../utility/util');



module.exports.getAllAppVersions = (data) => {
    let errcounter = 0;
    if (data.userId === undefined || data.userId == null || data.userId == "") {
        util.createLog("userId is missing");
        errcounter++;
    }
    if (data.clientId === undefined || data.clientId == null || data.clientId == "") {
        util.createLog("clientId is missing");
        errcounter++;
    }
    return errcounter <= 0;
}


module.exports.addNewAppVersion = (data) => {
    let errcounter = 0;
    if (data.userId === undefined || data.userId == null || data.userId == "") {
        util.createLog("userId is missing");
        errcounter++;
    }
    if (data.clientId === undefined || data.clientId == null || data.clientId == "") {
        util.createLog("clientId is missing");
        errcounter++;
    }
    if (data.packageName === undefined || data.packageName == null || data.packageName == "") {
        util.createLog("packageName is missing");
        errcounter++;
    }
    if (data.appIndex === undefined || data.appIndex == null || data.appIndex == "") {
        util.createLog("appIndex is missing");
        errcounter++;
    }
    if (data.version === undefined || data.version == null || data.version == "") {
        util.createLog("version is missing");
        errcounter++;
    }
    if (data.appLink === undefined || data.appLink == null || data.appLink == "") {
        util.createLog("appLink is missing");
        errcounter++;
    }
    if (data.isUpdate === undefined || data.isUpdate == null || data.isUpdate == "") {
        util.createLog("isUpdate is missing");
        errcounter++;
    }
    if (data.createdAt === undefined || data.createdAt == null || data.createdAt == "") {
        util.createLog("createdAt is missing");
        errcounter++;
    }
    if (data.insertType === undefined || data.insertType == null || data.insertType == "") {
        util.createLog("insertType is missing");
        errcounter++;
    }
    return errcounter <= 0;
}


module.exports.changeUpdateStatus = (data) => {
    let errcounter = 0;
    if (data.userId === undefined || data.userId == null || data.userId == "") {
        util.createLog("userId is missing");
        errcounter++;
    }
    if (data.clientId === undefined || data.clientId == null || data.clientId == "") {
        util.createLog("clientId is missing");
        errcounter++;
    }
    if (data.appId === undefined || data.appId == null || data.appId == "") {
        util.createLog("appId is missing");
        errcounter++;
    }
    if (data.isUpdate === undefined || data.isUpdate == null || data.isUpdate == "") {
        util.createLog("isUpdate is missing");
        errcounter++;
    }
    if (data.modifiedAt === undefined || data.modifiedAt == null || data.modifiedAt == "") {
        util.createLog("modifiedAt is missing");
        errcounter++;
    }
    return errcounter <= 0;
}


module.exports.deleteAppVersion = (data) => {
    let errcounter = 0;
    if (data.userId === undefined || data.userId == null || data.userId == "") {
        util.createLog("userId is missing");
        errcounter++;
    }
    if (data.clientId === undefined || data.clientId == null || data.clientId == "") {
        util.createLog("clientId is missing");
        errcounter++;
    }
    if (data.appId === undefined || data.appId == null || data.appId == "") {
        util.createLog("appId is missing");
        errcounter++;
    }
    if (data.status === undefined || data.status == null || data.status == "") {
        util.createLog("status is missing");
        errcounter++;
    }
    return errcounter <= 0;
}


module.exports.updateNewAppVersion = (data) => {
    let errcounter = 0;
    if (data.userId === undefined || data.userId == null || data.userId == "") {
        util.createLog("userId is missing");
        errcounter++;
    }
    if (data.clientId === undefined || data.clientId == null || data.clientId == "") {
        util.createLog("clientId is missing");
        errcounter++;
    }
    if (data.packageName === undefined || data.packageName == null || data.packageName == "") {
        util.createLog("packageName is missing");
        errcounter++;
    }
    if (data.appIndex === undefined || data.appIndex == null || data.appIndex == "") {
        util.createLog("appIndex is missing");
        errcounter++;
    }
    if (data.version === undefined || data.version == null || data.version == "") {
        util.createLog("version is missing");
        errcounter++;
    }
    if (data.appLink === undefined || data.appLink == null || data.appLink == "") {
        util.createLog("appLink is missing");
        errcounter++;
    }
    if (data.isUpdate === undefined || data.isUpdate == null || data.isUpdate == "") {
        util.createLog("isUpdate is missing");
        errcounter++;
    }
    if (data.modifiedAt === undefined || data.modifiedAt == null || data.modifiedAt == "") {
        util.createLog("modifiedAt is missing");
        errcounter++;
    }
    if (data.appId === undefined || data.appId == null || data.appId == "") {
        util.createLog("appId is missing");
        errcounter++;
    }
    return errcounter <= 0;
}