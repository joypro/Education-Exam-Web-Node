const util = require('../utility/util');

module.exports.addRoleReq = (data) => {
    let errcounter = 0;
    if (data.roleName === undefined || data.roleName == null || data.roleName == '') {
        util.createLog("roleName is missing");
        errcounter++;
    }
    if (data.roleDescription === undefined || data.roleDescription == null || data.roleDescription == '') {
        util.createLog("roleDescription is missing");
        errcounter++;
    }
    if (data.userId === undefined || data.userId == null || data.userId == '') {
        util.createLog("userId is missing");
        errcounter++;
    }
    if (data.clientId === undefined || data.clientId == null || data.clientId == '') {
        util.createLog("clientId is missing");
        errcounter++;
    }
    if (data.roleType === undefined || data.roleType == null || data.roleType == '') {
        util.createLog("roleType is missing");
        errcounter++;
    }
    return errcounter <= 0;
}

module.exports.updateRoleReq = (data) => {
    let errcounter = 0;
    if (data.roleId === undefined || data.roleId == null || data.roleId == '') {
        util.createLog("roleId is missing");
        errcounter++;
    }
    if (data.roleName === undefined || data.roleName == null || data.roleName == '') {
        util.createLog("roleName is missing");
        errcounter++;
    }
    if (data.roleDescription === undefined || data.roleDescription == null || data.roleDescription == '') {
        util.createLog("roleDescription is missing");
        errcounter++;
    }
    if (data.userId === undefined || data.userId == null || data.userId == '') {
        util.createLog("userId is missing");
        errcounter++;
    }
    if (data.clientId === undefined || data.clientId == null || data.clientId == '') {
        util.createLog("clientId is missing");
        errcounter++;
    }
    if (data.roleType === undefined || data.roleType == null || data.roleType == '') {
        util.createLog("roleType is missing");
        errcounter++;
    }
    return errcounter <= 0;
}


module.exports.getRoleListingReq = (data) => {
    let errcounter = 0;
    // if (data.searchRoleName === undefined || data.searchRoleName == null) {
    //     util.createLog("searchRoleName is missing");
    //     errcounter++;
    // }
    // if (data.searchRoleDescription === undefined || data.searchRoleDescription == null) {
    //     util.createLog("searchRoleDescription is missing");
    //     errcounter++;
    // }
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
    if (data.limit === undefined || data.limit == null || data.limit == "") {
        util.createLog("Limit is missing");
        errcounter++;
    }
    if (data.offset === undefined || data.offset == null || data.offset == "") {
        util.createLog("Offset is missing");
        errcounter++;
    }
    return errcounter <= 0;
}

module.exports.deleteRoleReq = (data) => {
    let errcounter = 0;
    if (data.roleId === undefined || data.roleId == null || data.roleId == '') {
        util.createLog("roleId is missing");
        errcounter++;
    }
    if (data.userId === undefined || data.userId == null || data.userId == '') {
        util.createLog("userId is missing");
        errcounter++;
    }
    return errcounter <= 0;
}

module.exports.basicAuthCheck = (data)=>{

    let errcounter = 0;
    if (data.clientId === undefined || data.clientId == null || data.clientId == '') {
        util.createLog("clientId is missing");
        errcounter++;
    }
    return errcounter <= 0;
}

module.exports.getPermissionForRolesDetails = (data)=>{

    let errcounter = 0;
    if (data.clientId === undefined || data.clientId == null || data.clientId == '') {
        util.createLog("clientId is missing");
        errcounter++;
    }
    if (data.roleId === undefined || data.roleId == null) {
        util.createLog("roleId is missing");
        errcounter++;
    }
    return errcounter <= 0;
}


module.exports.getPermissionForRolesChildsReq = (data)=>{

    let errcounter = 0;
    if (data.clientId === undefined || data.clientId == null || data.clientId == '') {
        util.createLog("clientId is missing");
        errcounter++;
    }
    if (data.roleId === undefined || data.roleId == null) {
        util.createLog("roleId is missing");
        errcounter++;
    }
    if (data.moduleId === undefined || data.moduleId == null) {
        util.createLog("moduleId is missing");
        errcounter++;
    }
    if (data.specificModule === undefined || data.specificModule == null) {
        util.createLog("specificModule is missing");
        errcounter++;
    }
    return errcounter <= 0;
}

module.exports.updatePermissionForRolesDetails = (data) =>{
    let errcounter = 0;
    if (data.clientId === undefined || data.clientId == null || data.clientId == '') {
        util.createLog("clientId is missing");
        errcounter++;
    }
    if (data.roleId === undefined || data.roleId == null || data.roleId == '') {
        util.createLog("roleId is missing");
        errcounter++;
    }
    if (data.userId === undefined || data.userId == null || data.userId == '') {
        util.createLog("userId is missing");
        errcounter++;
    }
    if(data.permissions === undefined || data.permissions == null || data.permissions.length == 0){
        util.createLog("permission array is missing");
        errcounter++;
    }
    return errcounter <= 0;
}

// module.exports.updatePermissionForRolesDetails = (data) =>{
//     let errcounter = 0;
//     if (data.clientId === undefined || data.clientId == null || data.clientId == '') {
//         util.createLog("clientId is missing");
//         errcounter++;
//     }
//     if (data.roleId === undefined || data.roleId == null || data.roleId == '') {
//         util.createLog("roleId is missing");
//         errcounter++;
//     }
//     if (data.userId === undefined || data.userId == null || data.userId == '') {
//         util.createLog("userId is missing");
//         errcounter++;
//     }
//     if(data.permissions === undefined || data.permissions == null || data.permissions.length == 0){
//         util.createLog("permission array is missing");
//         errcounter++;
//     }
//     return errcounter <= 0;
// }

module.exports.ifPhoneExist = (data) => {
    let errcounter = 0;
    if (data.phoneNumber === undefined || data.phoneNumber == null || data.phoneNumber == '') {
        util.createLog("phoneNumber is missing");
        errcounter++;
    }
    if (data.clientId === undefined || data.clientId == null || data.clientId == '') {
        util.createLog("clientId is missing");
        errcounter++;
    }
    if (data.userEmpPermit === undefined || data.userEmpPermit == null || data.userEmpPermit == '') {
        util.createLog("userEmpPermit is missing");
        errcounter++;
    }
    return errcounter <= 0;
}

module.exports.ifPhoneExistCustomer = (data) => {
    let errcounter = 0;
    if (data.phoneNumber === undefined || data.phoneNumber == null || data.phoneNumber == '') {
        util.createLog("phoneNumber is missing");
        errcounter++;
    }
    if (data.clientId === undefined || data.clientId == null || data.clientId == '') {
        util.createLog("clientId is missing");
        errcounter++;
    }
    return errcounter <= 0;
}

module.exports.ifEmailExist = (data) => {
    let errcounter = 0;
    if (data.email === undefined || data.email == null || data.email == '') {
        util.createLog("email is missing");
        errcounter++;
    }
    if (data.clientId === undefined || data.clientId == null || data.clientId == '') {
        util.createLog("clientId is missing");
        errcounter++;
    }
    if (data.userEmpPermit === undefined || data.userEmpPermit == null || data.userEmpPermit == '') {
        util.createLog("userEmpPermit is missing");
        errcounter++;
    }
    return errcounter <= 0;
}

module.exports.addEmpUsrReq = (data) => {
    let errcounter = 0;
    if (data.clientId === undefined || data.clientId == null || data.clientId == '') {
        util.createLog("clientId is missing");
        errcounter++;
    }
    if (data.firstName === undefined || data.firstName == null || data.firstName == '') {
        util.createLog("firstName is missing");
        errcounter++;
    }
    // if (data.lastName === undefined || data.lastName == null || data.lastName == '') {
    //     util.createLog("lastName is missing");
    //     errcounter++;
    // }
    if (data.phoneNumber === undefined || data.phoneNumber == null || data.phoneNumber.length < 1) {
        util.createLog("phoneNumber is missing");
        errcounter++;
    }
    if (data.email === undefined || data.email == null || data.email == '') {
        util.createLog("email is missing");
        errcounter++;
    }
    // if (data.address === undefined || data.address == null || data.address == '') {
    //     util.createLog("address is missing");
    //     errcounter++;
    // }
    if (data.designationId === undefined || data.designationId == null || data.designationId == '') {
        util.createLog("designationId is missing");
        errcounter++;
    }
    if (data.countryId === undefined || data.countryId == null || data.countryId == '') {
        util.createLog("countryId is missing");
        errcounter++;
    }
    if (data.stateId === undefined || data.stateId == null || data.stateId == '') {
        util.createLog("stateId is missing");
        errcounter++;
    }
    if (data.districtId === undefined || data.districtId == null || data.districtId == '') {
        util.createLog("districtId is missing");
        errcounter++;
    }
    if (data.zoneId === undefined || data.zoneId == null || data.zoneId == '') {
        util.createLog("zoneId is missing");
        errcounter++;
    }
    // if (data.profileImgUrl === undefined || data.profileImgUrl == null || data.profileImgUrl == '') {
    //     util.createLog("profileImgUrl is missing");
    //     errcounter++;
    // }
    if (data.userId === undefined || data.userId == null || data.userId == '') {
        util.createLog("userId is missing");
        errcounter++;
    }
    if (data.userEmpPermit === undefined || data.userEmpPermit == null || data.userEmpPermit == '') {
        util.createLog("userEmpPermit is missing");
        errcounter++;
    }
    // if (data.dob === undefined || data.dob == null || data.dob == '') {
    //     util.createLog("dob is missing");
    //     errcounter++;
    // }
    // if (data.gender === undefined || data.gender == null || data.gender == '') {
    //     util.createLog("gender is missing");
    //     errcounter++;
    // }
    // if (data.dateOfJoin === undefined || data.dateOfJoin == null || data.dateOfJoin == '') {
    //     util.createLog("dateOfJoin is missing");
    //     errcounter++;
    // }
    // if (data.geoLocation === undefined || data.geoLocation == null || data.geoLocation == '') {
    //     util.createLog("geoLocation is missing");
    //     errcounter++;
    // }
    // if (data.lattitude === undefined || data.lattitude == null || data.lattitude == '') {
    //     util.createLog("lattitude is missing");
    //     errcounter++;
    // }
    // if (data.longitude === undefined || data.longitude == null || data.longitude == '') {
    //     util.createLog("longitude is missing");
    //     errcounter++;
    // }
    // if (data.remark === undefined) {
    //     util.createLog("remark is missing");
    //     errcounter++;
    // }
    if (data.userEmpPermit == '1'){
        if (data.password === undefined || data.password == null || data.password == '') {
            util.createLog("password is missing");
            errcounter++;
        }
        if (data.roleId === undefined || data.roleId == null || data.roleId == '') {
            util.createLog("roleId is missing");
            errcounter++;
        }

    }

    return errcounter <= 0;
}


module.exports.addEmpUsrReqV2 = (data) => {
    let errcounter = 0;
    if (data.clientId === undefined || data.clientId == null || data.clientId == '') {
        util.createLog("clientId is missing");
        errcounter++;
    }
    if (data.firstName === undefined || data.firstName == null || data.firstName == '') {
        util.createLog("firstName is missing");
        errcounter++;
    }
    // if (data.lastName === undefined || data.lastName == null || data.lastName == '') {
    //     util.createLog("lastName is missing");
    //     errcounter++;
    // }
    if (data.phoneNumber === undefined || data.phoneNumber == null || data.phoneNumber.length < 1) {
        util.createLog("phoneNumber is missing");
        errcounter++;
    }
    if (data.email === undefined || data.email == null || data.email == '') {
        util.createLog("email is missing");
        errcounter++;
    }
    // if (data.address === undefined || data.address == null || data.address == '') {
    //     util.createLog("address is missing");
    //     errcounter++;
    // }
    if (data.designationId === undefined || data.designationId == null || data.designationId == '') {
        util.createLog("designationId is missing");
        errcounter++;
    }
    // if (data.countryId === undefined || data.countryId == null || data.countryId == '') {
    //     util.createLog("countryId is missing");
    //     errcounter++;
    // }
    // if (data.stateId === undefined || data.stateId == null || data.stateId == '') {
    //     util.createLog("stateId is missing");
    //     errcounter++;
    // }
    // if (data.districtId === undefined || data.districtId == null || data.districtId == '') {
    //     util.createLog("districtId is missing");
    //     errcounter++;
    // }
    // if (data.zoneId === undefined || data.zoneId == null || data.zoneId == '') {
    //     util.createLog("zoneId is missing");
    //     errcounter++;
    // }
    // if (data.profileImgUrl === undefined || data.profileImgUrl == null || data.profileImgUrl == '') {
    //     util.createLog("profileImgUrl is missing");
    //     errcounter++;
    // }
    if (data.userId === undefined || data.userId == null || data.userId == '') {
        util.createLog("userId is missing");
        errcounter++;
    }
    if (data.userEmpPermit === undefined || data.userEmpPermit == null || data.userEmpPermit == '') {
        util.createLog("userEmpPermit is missing");
        errcounter++;
    }
    if (data.hierarchyDataIdArr === undefined || data.hierarchyDataIdArr == null || data.hierarchyDataIdArr.length == 0) {
        util.createLog("hierarchyDataIdArr is missing");
        errcounter++;
    }else{
        for(let i = 0; i < data.hierarchyDataIdArr.length; i++){
            if (data.hierarchyDataIdArr[i] === undefined || data.hierarchyDataIdArr[i]  == null || data.hierarchyDataIdArr[i] == 0) {
                util.createLog("hierarchyDataIdArr is missing");
                errcounter++;
            }else if (data.hierarchyDataIdArr[i].hierarchyTypeId === undefined || data.hierarchyDataIdArr[i].hierarchyTypeId  == null || data.hierarchyDataIdArr[i].hierarchyTypeId == "") {
                util.createLog("hierarchyTypeId is missing");
                errcounter++;
            }else if (data.hierarchyDataIdArr[i].hierarchyDataId === undefined || data.hierarchyDataIdArr[i].hierarchyDataId  == null || data.hierarchyDataIdArr[i].hierarchyDataId == "") {
                util.createLog("hierarchyDataId is missing");
                errcounter++;
            }
        }
    }
    // if (data.gender === undefined || data.gender == null || data.gender == '') {
    //     util.createLog("gender is missing");
    //     errcounter++;
    // }
    // if (data.dateOfJoin === undefined || data.dateOfJoin == null || data.dateOfJoin == '') {
    //     util.createLog("dateOfJoin is missing");
    //     errcounter++;
    // }
    // if (data.geoLocation === undefined || data.geoLocation == null || data.geoLocation == '') {
    //     util.createLog("geoLocation is missing");
    //     errcounter++;
    // }
    // if (data.lattitude === undefined || data.lattitude == null || data.lattitude == '') {
    //     util.createLog("lattitude is missing");
    //     errcounter++;
    // }
    // if (data.longitude === undefined || data.longitude == null || data.longitude == '') {
    //     util.createLog("longitude is missing");
    //     errcounter++;
    // }
    // if (data.remark === undefined) {
    //     util.createLog("remark is missing");
    //     errcounter++;
    // }
    if (data.userEmpPermit == '1'){
        // if (data.password === undefined || data.password == null || data.password == '') {
        //     util.createLog("password is missing");
        //     errcounter++;
        // }
        if (data.roleId === undefined || data.roleId == null || data.roleId == '') {
            util.createLog("roleId is missing");
            errcounter++;
        }

    }

    return errcounter <= 0;
}

module.exports.getReqUserListCheck = (data) =>{
    let errcounter = 0;
    if (data.clientId === undefined || data.clientId == null || data.clientId == '') {
        util.createLog("clientId is missing");
        errcounter++;
    }
    // if (data.searchUserName === undefined) {
    //     util.createLog("searchUserName is missing");
    //     errcounter++;
    // }
    // if (data.searchUserPhone === undefined) {
    //     util.createLog("searchUserPhone is missing");
    //     errcounter++;
    // }
    // if (data.searchUserRole === undefined) {
    //     util.createLog("searchUserRole is missing");
    //     errcounter++;
    // }
    // if (data.searchUserDesig === undefined) {
    //     util.createLog("searchUserDesig is missing");
    //     errcounter++;
    // }
    // if (data.searchUserEmail === undefined) {
    //     util.createLog("searchUserEmail is missing");
    //     errcounter++;
    // }
    // if (data.limit === undefined || data.limit == null) {
    //     util.createLog("Limit is missing");
    //     errcounter++;
    // }
    // if (data.offset === undefined || data.offset == null) {
    //     util.createLog("Offset is missing");
    //     errcounter++;
    // }
    return errcounter <= 0;
}

module.exports.getReqUserListCheckDownload = (data) =>{
    let errcounter = 0;
    if (data.clientId === undefined || data.clientId == null || data.clientId == '') {
        util.createLog("clientId is missing");
        errcounter++;
    }
    if (data.searchUserName === undefined) {
        util.createLog("searchUserName is missing");
        errcounter++;
    }
    if (data.searchUserPhone === undefined) {
        util.createLog("searchUserPhone is missing");
        errcounter++;
    }
    if (data.searchUserRole === undefined) {
        util.createLog("searchUserRole is missing");
        errcounter++;
    }
    if (data.searchUserDesig === undefined) {
        util.createLog("searchUserDesig is missing");
        errcounter++;
    }
    if (data.searchUserEmail === undefined) {
        util.createLog("searchUserEmail is missing");
        errcounter++;
    }
    return errcounter <= 0;
}


module.exports.getReqUserList = (data) =>{
    let errcounter = 0;
    if (data.clientId === undefined || data.clientId == null) {
        util.createLog("clientId is missing");
        errcounter++;
    }
    return errcounter <= 0;
}



module.exports.getReqUserDetails = (data) =>{
    let errcounter = 0;
    if (data.clientId === undefined || data.clientId == null) {
        util.createLog("clientId is missing");
        errcounter++;
    }
    if (data.userCId === undefined || data.userCId == null) {
        util.createLog("userCId is missing");
        errcounter++;
    }
    return errcounter <= 0;
}

module.exports.updateEmpUserPasswordReq = (data) =>{
    let errcounter = 0;
    if (data.clientId === undefined || data.clientId == null || data.clientId == "") {
        util.createLog("clientId is missing");
        errcounter++;
    }
    if (data.userCId === undefined || data.userCId == null || data.userCId == "") {
        util.createLog("userCId is missing");
        errcounter++;
    }
    if (data.password === undefined || data.password == null || data.password == "") {
        util.createLog("password is missing");
        errcounter++;
    }
    return errcounter <= 0;
}


// #############################################      USER activity log ==========================================================================================
// #############################################      USER activity log ==========================================================================================

module.exports.addUserActivityReq = (data) => {
    let errcounter = 0;
    if (data.userId === undefined || data.userId == null || data.userId == '') {
        util.createLog("userId is missing");
        errcounter++;
    }
    if (data.userCId === undefined || data.userCId == null || data.userCId == '') {
        util.createLog("CREATEDuserId is missing");
        errcounter++;
    }
    if (data.clientId === undefined || data.clientId == null) {
        util.createLog("clientId is missing");
        errcounter++;
    }
    if (data.activityTypeId === undefined || data.activityTypeId == null) {
        util.createLog("activityTypeId is missing");
        errcounter++;
    }
    if (data.dueDate === undefined || data.dueDate == null) {
        util.createLog("dueDate is missing");
        errcounter++;
    }
    if (data.assignTo === undefined || data.assignTo == null) {
        util.createLog("assignTo is missing");
        errcounter++;
    }
    if (data.description === undefined || data.description == null) {
        util.createLog("description is missing");
        errcounter++;
    }
    // if (data.remark === undefined) {
    //     util.createLog("remark is missing");
    //     errcounter++;
    // }
    return errcounter <= 0;
}


module.exports.getUserActivitiesReq = (data) => {
    let errcounter = 0;
    if (data.userCId === undefined || data.userCId == null) {
        util.createLog("CREATEDuserId is missing");
        errcounter++;
    }
    if (data.clientId === undefined || data.clientId == null) {
        util.createLog("clientId is missing");
        errcounter++;
    }
    if (data.limit === undefined || data.limit == null) {
        util.createLog("Limit is missing");
        errcounter++;
    }
    if (data.offset === undefined || data.offset == null) {
        util.createLog("Offset is missing");
        errcounter++;
    }
    if (data.type === undefined || data.type == null) {
        util.createLog("type is missing");
        errcounter++;
    }
    if (data.searchTypeText === undefined) {
        util.createLog("searchTypeText is missing");
        errcounter++;
    }
    if (data.searchDateText === undefined) {
        util.createLog("searchDateText is missing");
        errcounter++;
    }
    if (data.searchAssignUserText === undefined) {
        util.createLog("searchAssignUserText is missing");
        errcounter++;
    }
    return errcounter <= 0;
}


module.exports.getDetailUserActivityReq = (data) => {
    let errcounter = 0;
    if (data.userCId === undefined || data.userCId == null) {
        util.createLog("userCId is missing");
        errcounter++;
    }
    if (data.clientId === undefined || data.clientId == null) {
        util.createLog("clientId is missing");
        errcounter++;
    }
    if (data.activityId === undefined || data.activityId == null) {
        util.createLog("activityId is missing");
        errcounter++;
    }
    return errcounter <= 0;
}


module.exports.updateUserActivityStatusReq = (data) => {

    let errcounter = 0;
    if (data.userCId === undefined || data.userCId == null) {
        util.createLog("userCId is missing");
        errcounter++;
    }
    if (data.clientId === undefined || data.clientId == null) {
        util.createLog("clientId is missing");
        errcounter++;
    }
    if (data.activityId === undefined || data.activityId == null) {
        util.createLog("activityId is missing");
        errcounter++;
    }
    if (data.activityStatus === undefined) {
        util.createLog("activityStatus is missing");
        errcounter++;
    }
    if (data.completeStatus === undefined) {
        util.createLog("completeStatus is missing");
        errcounter++;
    }
    if (data.remark === undefined) {
        util.createLog("remark is missing");
        errcounter++;
    }
    if (data.userId === undefined || data.userId == null) {
        util.createLog("userId is missing");
        errcounter++;
    }
    return errcounter <= 0;
}



module.exports.changeUserStatus = (data) => {
    let errcounter = 0;
    if (data.userCId === undefined || data.userCId == null) {
        util.createLog("userCId is missing");
        errcounter++;
    }
    if (data.userId === undefined || data.userId == null) {
        util.createLog("userId is missing");
        errcounter++;
    }
    if (data.activeStatus === undefined || data.activeStatus == null) {
        util.createLog("activeStatus is missing");
        errcounter++;
    }
    if (data.clientId === undefined || data.clientId == null) {
        util.createLog("clientId is missing");
        errcounter++;
    }
    return errcounter <= 0;
}


module.exports.deleteUserStatus = (data) => {
    let errcounter = 0;
    if (data.userCId === undefined || data.userCId == null) {
        util.createLog("userCId is missing");
        errcounter++;
    }
    if (data.userId === undefined || data.userId == null) {
        util.createLog("userId is missing");
        errcounter++;
    }
    if (data.clientId === undefined || data.clientId == null) {
        util.createLog("clientId is missing");
        errcounter++;
    }
    return errcounter <= 0;
}


module.exports.updateEmpUsrReq = (data) => {
    let errcounter = 0;
    if (data.clientId === undefined || data.clientId == null || data.clientId == '') {
        util.createLog("clientId is missing");
        errcounter++;
    }
    if (data.firstName === undefined || data.firstName == null || data.firstName == '') {
        util.createLog("firstName is missing");
        errcounter++;
    }
    if (data.lastName === undefined || data.lastName == null || data.lastName == '') {
        util.createLog("lastName is missing");
        errcounter++;
    }
    if (data.phoneNumber === undefined || data.phoneNumber == null || data.phoneNumber.length < 1) {
        util.createLog("phoneNumber is missing");
        errcounter++;
    }
    if (data.email === undefined || data.email == null || data.email == '') {
        util.createLog("email is missing");
        errcounter++;
    }
    if (data.address === undefined || data.address == null || data.address == '') {
        util.createLog("address is missing");
        errcounter++;
    }
    if (data.designationId === undefined || data.designationId == null || data.designationId == '') {
        util.createLog("designationId is missing");
        errcounter++;
    }
    if (data.countryId === undefined || data.countryId == null || data.countryId == '') {
        util.createLog("countryId is missing");
        errcounter++;
    }
    if (data.stateId === undefined || data.stateId == null || data.stateId == '') {
        util.createLog("stateId is missing");
        errcounter++;
    }
    if (data.districtId === undefined || data.districtId == null || data.districtId == '') {
        util.createLog("districtId is missing");
        errcounter++;
    }
    if (data.zoneId === undefined || data.zoneId == null || data.zoneId == '') {
        util.createLog("designationId is missing");
        errcounter++;
    }
    if (data.profileImgUrl === undefined || data.profileImgUrl == null || data.profileImgUrl == '') {
        util.createLog("profileImgUrl is missing");
        errcounter++;
    }
    if (data.userId === undefined || data.userId == null || data.userId == '') {
        util.createLog("userId is missing");
        errcounter++;
    }
    if (data.userEmpPermit === undefined || data.userEmpPermit == null || data.userEmpPermit == '') {
        util.createLog("userEmpPermit is missing");
        errcounter++;
    }
    if (data.dob === undefined || data.dob == null || data.dob == '') {
        util.createLog("dob is missing");
        errcounter++;
    }
    if (data.gender === undefined || data.gender == null || data.gender == '') {
        util.createLog("gender is missing");
        errcounter++;
    }
    if (data.dateOfJoin === undefined || data.dateOfJoin == null || data.dateOfJoin == '') {
        util.createLog("dateOfJoin is missing");
        errcounter++;
    }
    // if (data.geoLocation === undefined || data.geoLocation == null || data.geoLocation == '') {
    //     util.createLog("geoLocation is missing");
    //     errcounter++;
    // }
    // if (data.lattitude === undefined || data.lattitude == null || data.lattitude == '') {
    //     util.createLog("lattitude is missing");
    //     errcounter++;
    // }
    // if (data.longitude === undefined || data.longitude == null || data.longitude == '') {
    //     util.createLog("longitude is missing");
    //     errcounter++;
    // }
    if (data.remark === undefined) {
        util.createLog("remark is missing");
        errcounter++;
    }
    if (data.userEmpPermit == '1'){
        if (data.password === undefined || data.password == null || data.password == '') {
            util.createLog("password is missing");
            errcounter++;
        }
        if (data.roleId === undefined || data.roleId == null || data.roleId == '') {
            util.createLog("roleId is missing");
            errcounter++;
        }

    }
    if (data.userCId === undefined || data.userCId == null || data.userCId == '') {
        util.createLog("userCId is missing");
        errcounter++;
    }

    return errcounter <= 0;
}


module.exports.updateEmpUsrReqV2 = (data) => {
    let errcounter = 0;
    if (data.clientId === undefined || data.clientId == null || data.clientId == '') {
        util.createLog("clientId is missing");
        errcounter++;
    }
    if (data.firstName === undefined || data.firstName == null || data.firstName == '') {
        util.createLog("firstName is missing");
        errcounter++;
    }
    // if (data.lastName === undefined || data.lastName == null || data.lastName == '') {
    //     util.createLog("lastName is missing");
    //     errcounter++;
    // }
    if (data.phoneNumber === undefined || data.phoneNumber == null || data.phoneNumber.length < 1) {
        util.createLog("phoneNumber is missing");
        errcounter++;
    }
    if (data.email === undefined || data.email == null || data.email == '') {
        util.createLog("email is missing");
        errcounter++;
    }
    if (data.address === undefined || data.address == null || data.address == '') {
        util.createLog("address is missing");
        errcounter++;
    }
    if (data.designationId === undefined || data.designationId == null || data.designationId == '') {
        util.createLog("designationId is missing");
        errcounter++;
    }
    // if (data.countryId === undefined || data.countryId == null || data.countryId == '') {
    //     util.createLog("countryId is missing");
    //     errcounter++;
    // }
    // if (data.stateId === undefined || data.stateId == null || data.stateId == '') {
    //     util.createLog("stateId is missing");
    //     errcounter++;
    // }
    // if (data.districtId === undefined || data.districtId == null || data.districtId == '') {
    //     util.createLog("districtId is missing");
    //     errcounter++;
    // }
    // if (data.zoneId === undefined || data.zoneId == null || data.zoneId == '') {
    //     util.createLog("designationId is missing");
    //     errcounter++;
    // }
    if (data.profileImgUrl === undefined || data.profileImgUrl == null || data.profileImgUrl == '') {
        util.createLog("profileImgUrl is missing");
        errcounter++;
    }
    if (data.userId === undefined || data.userId == null || data.userId == '') {
        util.createLog("userId is missing");
        errcounter++;
    }
    if (data.userEmpPermit === undefined || data.userEmpPermit == null || data.userEmpPermit == '') {
        util.createLog("userEmpPermit is missing");
        errcounter++;
    }
    // if (data.dob === undefined || data.dob == null || data.dob == '') {
    //     util.createLog("dob is missing");
    //     errcounter++;
    // }
    // if (data.gender === undefined || data.gender == null || data.gender == '') {
    //     util.createLog("gender is missing");
    //     errcounter++;
    // }
    // if (data.dateOfJoin === undefined || data.dateOfJoin == null || data.dateOfJoin == '') {
    //     util.createLog("dateOfJoin is missing");
    //     errcounter++;
    // }
    if (data.locationData === undefined || data.locationData == null || data.locationData.length == 0) {
        util.createLog("locationData is missing");
        errcounter++;
    }else{
        for(let i = 0; i < data.locationData.length; i++){
            if (data.locationData[i] === undefined || data.locationData[i] == null || data.locationData[i].length == 0) {
                util.createLog("locationData is missing");
                errcounter++;
            }else if (data.locationData[i].country === undefined || data.locationData[i].country  == null || data.locationData[i].country == "") {
                util.createLog("country is missing");
                errcounter++;
            }else if (data.locationData[i].state === undefined || data.locationData[i].state  == null || data.locationData[i].state == "") {
                util.createLog("state is missing");
                errcounter++;
            }else if (data.locationData[i].city === undefined || data.locationData[i].city  == null || data.locationData[i].city == "") {
                util.createLog("city is missing");
                errcounter++;
            }else if (data.locationData[i].zone === undefined || data.locationData[i].zone  == null || data.locationData[i].zone == "") {
                util.createLog("zone is missing");
                errcounter++;
            }
        }
    }
    // if (data.geoLocation === undefined || data.geoLocation == null || data.geoLocation == '') {
    //     util.createLog("geoLocation is missing");
    //     errcounter++;
    // }
    // if (data.lattitude === undefined || data.lattitude == null || data.lattitude == '') {
    //     util.createLog("lattitude is missing");
    //     errcounter++;
    // }
    // if (data.longitude === undefined || data.longitude == null || data.longitude == '') {
    //     util.createLog("longitude is missing");
    //     errcounter++;
    // }
    if (data.remark === undefined) {
        util.createLog("remark is missing");
        errcounter++;
    }
    if (data.userEmpPermit == '1'){
        if (data.password === undefined || data.password == null || data.password == '') {
            util.createLog("password is missing");
            errcounter++;
        }
        if (data.roleId === undefined || data.roleId == null || data.roleId == '') {
            util.createLog("roleId is missing");
            errcounter++;
        }

    }
    if (data.userCId === undefined || data.userCId == null || data.userCId == '') {
        util.createLog("userCId is missing");
        errcounter++;
    }

    return errcounter <= 0;
}

module.exports.updateEmpUsrReqV3 = (data) => {
    let errcounter = 0;
    if (data.clientId === undefined || data.clientId == null || data.clientId == '') {
        util.createLog("clientId is missing");
        errcounter++;
    }
    if (data.firstName === undefined || data.firstName == null || data.firstName == '') {
        util.createLog("firstName is missing");
        errcounter++;
    }
    if (data.phoneNumber === undefined || data.phoneNumber == null || data.phoneNumber.length < 1) {
        util.createLog("phoneNumber is missing");
        errcounter++;
    }
    if (data.email === undefined || data.email == null || data.email == '') {
        util.createLog("email is missing");
        errcounter++;
    }
    if (data.address === undefined || data.address == null || data.address == '') {
        util.createLog("address is missing");
        errcounter++;
    }
    if (data.designationId === undefined || data.designationId == null || data.designationId == '') {
        util.createLog("designationId is missing");
        errcounter++;
    }
    if (data.profileImgUrl === undefined || data.profileImgUrl == null || data.profileImgUrl == '') {
        util.createLog("profileImgUrl is missing");
        errcounter++;
    }
    if (data.userId === undefined || data.userId == null || data.userId == '') {
        util.createLog("userId is missing");
        errcounter++;
    }
    if (data.userEmpPermit === undefined || data.userEmpPermit == null || data.userEmpPermit == '') {
        util.createLog("userEmpPermit is missing");
        errcounter++;
    }
    // if (data.hierarchyDataIdArr === undefined || data.hierarchyDataIdArr == null || data.hierarchyDataIdArr.length == 0) {
    //     util.createLog("hierarchyDataIdArr is missing");
    //     errcounter++;
    // }else{
    //     for(let i = 0; i < data.hierarchyDataIdArr.length; i++){
    //         if (data.hierarchyDataIdArr[i] === undefined || data.hierarchyDataIdArr[i]  == null || data.hierarchyDataIdArr[i] == 0) {
    //             util.createLog("hierarchyDataIdArr is missing");
    //             errcounter++;
    //         }else if (data.hierarchyDataIdArr[i].hierarchyTypeId === undefined || data.hierarchyDataIdArr[i].hierarchyTypeId  == null || data.hierarchyDataIdArr[i].hierarchyTypeId == "") {
    //             util.createLog("hierarchyTypeId is missing");
    //             errcounter++;
    //         }else if (data.hierarchyDataIdArr[i].hierarchyDataId === undefined || data.hierarchyDataIdArr[i].hierarchyDataId  == null || data.hierarchyDataIdArr[i].hierarchyDataId == "") {
    //             util.createLog("hierarchyDataId is missing");
    //             errcounter++;
    //         }
    //     }
    // }
    if (data.remark === undefined) {
        util.createLog("remark is missing");
        errcounter++;
    }
    if (data.userEmpPermit == '1'){
        // if (data.password === undefined || data.password == null || data.password == '') {
        //     util.createLog("password is missing");
        //     errcounter++;
        // }
        if (data.roleId === undefined || data.roleId == null || data.roleId == '') {
            util.createLog("roleId is missing");
            errcounter++;
        }

    }
    if (data.userCId === undefined || data.userCId == null || data.userCId == '') {
        util.createLog("userCId is missing");
        errcounter++;
    }

    return errcounter <= 0;
}


module.exports.getlinsensedUserReq = (data) => {
    let errcounter = 0;
    if (data.userEmpPermit === undefined || data.userEmpPermit == null) {
        util.createLog("userEmpPermit is missing");
        errcounter++;
    }
    if (data.userId === undefined || data.userId == null) {
        util.createLog("userId is missing");
        errcounter++;
    }
    if (data.clientId === undefined || data.clientId == null) {
        util.createLog("clientId is missing");
        errcounter++;
    }
    return errcounter <= 0;
}


module.exports.getModuleWiseConfigReq = (data) => {
    let errcounter = 0;
    if (data.userId === undefined || data.userId == null) {
        util.createLog("userId is missing");
        errcounter++;
    }
    if (data.clientId === undefined || data.clientId == null) {
        util.createLog("clientId is missing");
        errcounter++;
    }
    if (data.specificModuleId === undefined || data.specificModuleId == null) {
        util.createLog("specificModuleId is missing");
        errcounter++;
    }
    if (data.selectedRoleId === undefined || data.selectedRoleId == null || data.selectedRoleId == "") {
        util.createLog("selectedRoleId is missing");
        errcounter++;
    }
    if (data.selectedClientId === undefined || data.selectedClientId == null || data.selectedClientId == "") {
        util.createLog("selectedClientId is missing");
        errcounter++;
    }
    return errcounter <= 0;
}

module.exports.saveModuleWiseConfigReq = (data) => {
    let errcounter = 0;
    if (data.userId === undefined || data.userId == null || data.userId == "") {
        util.createLog("userId is missing");
        errcounter++;
    }
    if (data.clientId === undefined || data.clientId == null || data.clientId == "") {
        util.createLog("clientId is missing");
        errcounter++;
    }
    if (data.selectedRoleId === undefined || data.selectedRoleId == null || data.selectedRoleId == "") {
        util.createLog("selectedRoleId is missing");
        errcounter++;
    }
    if (data.specificModuleId === undefined || data.specificModuleId == null || data.specificModuleId == "") {
        util.createLog("specificModuleId is missing");
        errcounter++;
    }
    if (data.moduleArr === undefined || data.moduleArr == null || data.moduleArr.length == 0) {
        util.createLog("moduleArr is missing");
        errcounter++;
    }
    if (data.selectedClientId === undefined || data.selectedClientId == null || data.selectedClientId == "") {
        util.createLog("selectedClientId is missing");
        errcounter++;
    }
    return errcounter <= 0;
}


/**
 * @author : Sukanta Samanta
 * @date : 23/06/2023
 * @description : add NEW EMPLOYEE
 * @argument : {}
 * @returns : token
 */

module.exports.gn_addEmpUser = (data) => {
    let errcounter = 0;
    if (data.clientId === undefined || data.clientId === null || data.clientId === '') {
        util.createLog("clientId is missing");
        errcounter++;
    }
    if (data.firstName === undefined || data.firstName === null || data.firstName === '') {
        util.createLog("firstName is missing");
        errcounter++;
    }
    // if (data.lastName === undefined || data.lastName == null || data.lastName == '') {
    //     util.createLog("lastName is missing");
    //     errcounter++;
    // }
    if (data.phoneNumber === undefined || data.phoneNumber === null || data.phoneNumber.length < 1) {
        util.createLog("phoneNumber is missing");
        errcounter++;
    }
    if (data.email === undefined || data.email === null || data.email === '') {
        util.createLog("email is missing");
        errcounter++;
    }
    // if (data.address === undefined || data.address == null || data.address == '') {
    //     util.createLog("address is missing");
    //     errcounter++;
    // }
    if (data.designationId === undefined || data.designationId === null || data.designationId === '') {
        util.createLog("designationId is missing");
        errcounter++;
    }
    // if (data.profileImgUrl === undefined || data.profileImgUrl == null || data.profileImgUrl == '') {
    //     util.createLog("profileImgUrl is missing");
    //     errcounter++;
    // }
    if (data.userId === undefined || data.userId === null || data.userId === '') {
        util.createLog("userId is missing");
        errcounter++;
    }
    if (data.userEmpPermit === undefined || data.userEmpPermit === null || data.userEmpPermit === '') {
        util.createLog("userEmpPermit is missing");
        errcounter++;
    }
    if (data.locationData === undefined || data.locationData === null || data.locationData.length === 0) {
        util.createLog("locationData is missing");
        errcounter++;
    }else{
        for(let i = 0; i < data.locationData.length; i++){
            if (data.locationData[i] === undefined || data.locationData[i] === null || Object.keys(data.locationData[i]).length === 0) {
                util.createLog("locationData is missing");
                errcounter++;
            }else if (data.locationData[i].hierarchyTypeId === undefined || data.locationData[i].hierarchyTypeId  === null || data.locationData[i].hierarchyTypeId === "") {
                util.createLog("hierarchyTypeId is missing");
                errcounter++;
            }else if (data.locationData[i].hierarchyDataId === undefined || data.locationData[i].hierarchyDataId  === null || data.locationData[i].hierarchyDataId === "") {
                util.createLog("hierarchyDataId is missing");
                errcounter++;
            }
        }
    }
    // if (data.gender === undefined || data.gender == null || data.gender == '') {
    //     util.createLog("gender is missing");
    //     errcounter++;
    // }
    // if (data.dateOfJoin === undefined || data.dateOfJoin == null || data.dateOfJoin == '') {
    //     util.createLog("dateOfJoin is missing");
    //     errcounter++;
    // }
    // if (data.geoLocation === undefined || data.geoLocation == null || data.geoLocation == '') {
    //     util.createLog("geoLocation is missing");
    //     errcounter++;
    // }
    // if (data.lattitude === undefined || data.lattitude == null || data.lattitude == '') {
    //     util.createLog("lattitude is missing");
    //     errcounter++;
    // }
    // if (data.longitude === undefined || data.longitude == null || data.longitude == '') {
    //     util.createLog("longitude is missing");
    //     errcounter++;
    // }
    // if (data.remark === undefined) {
    //     util.createLog("remark is missing");
    //     errcounter++;
    // }
    if (data.userEmpPermit == '1'){
        if (data.roleId === undefined || data.roleId === null || data.roleId === '') {
            util.createLog("roleId is missing");
            errcounter++;
        }
    }
    return errcounter <= 0;
}


/**
 * @author : Sukanta Samanta
 * @date : 23/06/2023
 * @description : Update EMPLOYEE
 * @argument : {}
 * @returns : token
 */

module.exports.gn_updateEmpUser = (data) => {
    let errcounter = 0;
    if (data.clientId === undefined || data.clientId === null || data.clientId === '') {
        util.createLog("clientId is missing");
        errcounter++;
    }
    if (data.firstName === undefined || data.firstName === null || data.firstName === '') {
        util.createLog("firstName is missing");
        errcounter++;
    }
    if (data.phoneNumber === undefined || data.phoneNumber === null || data.phoneNumber.length < 1) {
        util.createLog("phoneNumber is missing");
        errcounter++;
    }
    if (data.email === undefined || data.email === null || data.email === '') {
        util.createLog("email is missing");
        errcounter++;
    }
    // if (data.address === undefined || data.address == null || data.address == '') {
    //     util.createLog("address is missing");
    //     errcounter++;
    // }
    if (data.designationId === undefined || data.designationId === null || data.designationId === '') {
        util.createLog("designationId is missing");
        errcounter++;
    }
    // if (data.profileImgUrl === undefined || data.profileImgUrl == null || data.profileImgUrl == '') {
    //     util.createLog("profileImgUrl is missing");
    //     errcounter++;
    // }
    if (data.userId === undefined || data.userId === null || data.userId === '') {
        util.createLog("userId is missing");
        errcounter++;
    }
    if (data.userEmpPermit === undefined || data.userEmpPermit === null || data.userEmpPermit === '') {
        util.createLog("userEmpPermit is missing");
        errcounter++;
    }
    if (data.locationData === undefined || data.locationData === null || data.locationData.length === 0) {
        util.createLog("locationData is missing");
        errcounter++;
    }else{
        for(let i = 0; i < data.locationData.length; i++){
            if (data.locationData[i] === undefined || data.locationData[i] === null || Object.keys(data.locationData[i]).length === 0) {
                util.createLog("locationData is missing");
                errcounter++;
            }else if (data.locationData[i].hierarchyTypeId === undefined || data.locationData[i].hierarchyTypeId  === null || data.locationData[i].hierarchyTypeId === "") {
                util.createLog("hierarchyTypeId is missing");
                errcounter++;
            }else if (data.locationData[i].hierarchyDataId === undefined || data.locationData[i].hierarchyDataId  === null || data.locationData[i].hierarchyDataId === "") {
                util.createLog("hierarchyDataId is missing");
                errcounter++;
            }
        }
    }
    if (data.remark === undefined) {
        util.createLog("remark is missing");
        errcounter++;
    }
    if (data.userEmpPermit == '1'){
        if (data.roleId === undefined || data.roleId === null || data.roleId === '') {
            util.createLog("roleId is missing");
            errcounter++;
        }
    }
    if (data.userCId === undefined || data.userCId === null || data.userCId === '') {
        util.createLog("userCId is missing");
        errcounter++;
    }
    return errcounter <= 0;
}






/**
 * @author : Prosenjit Paul
 * @date : 28/11/2023
 * @description : add NEW User
 * @argument : {}
 * @returns : 
 */

module.exports.addUserValidation = (data) => {
    let errcounter = 0;
    if (data.clientId === undefined || data.clientId === null || data.clientId === '') {
        util.createLog("clientId is missing");
        errcounter++;
    }
    if (data.firstName === undefined || data.firstName === null || data.firstName === '') {
        util.createLog("firstName is missing");
        errcounter++;
    }
    if (data.lastName === undefined || data.lastName == null || data.lastName == '') {
        util.createLog("lastName is missing");
        errcounter++;
    }
    if (data.phoneNumber === undefined || data.phoneNumber === null || data.phoneNumber.length < 1) {
        util.createLog("phoneNumber is missing");
        errcounter++;
    }
    if (data.email === undefined || data.email === null || data.email === '') {
        util.createLog("email is missing");
        errcounter++;
    }
    
    return errcounter <= 0;
}


/**
 * @author : Prosenjit Paul
 * @date : 05/02/2024
 * @description : generate simple excel 
 * @argument : 
 * @returns
 */

module.exports.simpleExcel_req = (data) => {
    let errcounter = 0;
    if (data.userId === undefined || data.userId == null|| data.userId =='' ) {
        util.createLog("userId is missing");
        errcounter++;
    }
    if (data.clientId === undefined || data.clientId == null || data.clientid == '') {
        util.createLog("clientId is missing");
        errcounter++;
    }
    return errcounter <= 0;
}