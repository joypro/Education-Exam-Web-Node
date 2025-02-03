const dao = require('../dao/userRolePermission_dao');
const token = require('../utility/token');
const util = require('../utility/util');
var sha1 = require('sha1');
const commondao = require('../dao/commondao');
const hierearchyUtil 					=	require('../utility/hirarchyUtil.js');
const config = require('../config');
const filePath = process.env.FILEPATH || config.FILEPATH;
var parser = require('simple-excel-to-json');
const commonmodel = require('../model/commonmodel');

function searchIdData(jsonArray, idToSearch, key) {
    for (let obj of jsonArray) {
        if (obj[key] === idToSearch) {
            return obj; // Return the object if ID of the specific key is found
        }
    }
    return null; // Return null if ID is not found
}



// Function to get distinct IDs FOR a particular Key of object
function getDistinctIdsAllTypes(jsonArray, key) {
    const idSet = new Set();
    jsonArray.forEach(obj => {
        if (obj[key] !== null && obj[key] !== 0) { // Check for null and 0
            idSet.add(obj[key]);
        }
    });
    return Array.from(idSet);
}


module.exports.addRole = async (data) => {
    try {
        
        let date_ob = ''; 

        if (data.currentDateTime === undefined || data.currentDateTime == "" || data.currentDateTime == null) {
            
            date_ob = new Date();
        
        }else{
            date_ob = new Date(data.currentDateTime)
        }

        // let date_ob = new Date();

        let date = ("0" + date_ob.getDate()).slice(-2);
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        let year = date_ob.getFullYear();
        let hours = date_ob.getHours();
        let minutes = date_ob.getMinutes();
        let seconds = date_ob.getSeconds();

        let currentDateTime = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;

        data.currentDateTime = currentDateTime;


        let ifRoleExist = await dao.checkExistingRole(data);

        if (ifRoleExist) {

            return { success: false, status: util.statusCode.SUCCESS, message: 'Role Already Exist', response: false }
        } else {

            let respData = await dao.addRole(data);
            if (respData) {
                return { success: true, status: util.statusCode.SUCCESS, message: 'Role Added ', response: await util.encryptResponse(respData) }
            } else {
                return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null }
            }
        }
    } catch (e) {
        return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null }
    }
}

module.exports.updateRole = async (data) => {
    try {

        let date_ob = '';

        if (data.currentDateTime === undefined || data.currentDateTime == "" || data.currentDateTime == null) {
            
            date_ob = new Date();
        
        }else{
            date_ob = new Date(data.currentDateTime)
        }

        // let date_ob = new Date();

        let date = ("0" + date_ob.getDate()).slice(-2);
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        let year = date_ob.getFullYear();
        let hours = date_ob.getHours();
        let minutes = date_ob.getMinutes();
        let seconds = date_ob.getSeconds();

        let currentDateTime = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;

        data.currentDateTime = currentDateTime;

        let ifRoleExist = await dao.checkExistingRole(data);

        if (ifRoleExist) {
            return { success: false, status: util.statusCode.SUCCESS, message: 'Role Already Exist', response: false }
        } else {
            let respData = await dao.updateRole(data);

            // console.log("========>>", respData)

            if (respData) {
                return { success: true, status: util.statusCode.SUCCESS, message: 'Role Updated', response: await util.encryptResponse(respData) }
            } else {
                return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null }
            }
        }
    } catch (e) {

        return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null }
    }
}

module.exports.deleteRole = async (data) => {
    try {
        
        let date_ob = '';

        if (data.currentDateTime === undefined || data.currentDateTime == "" || data.currentDateTime == null) {
            
            date_ob = new Date();
        
        }else{
            date_ob = new Date(data.currentDateTime)
        }

        // let date_ob = new Date();

        let date = ("0" + date_ob.getDate()).slice(-2);
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        let year = date_ob.getFullYear();
        let hours = date_ob.getHours();
        let minutes = date_ob.getMinutes();
        let seconds = date_ob.getSeconds();

        let currentDateTime = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;

        data.currentDateTime = currentDateTime;

        let respData = await dao.deleteRole(data);
        if (respData) {
            return { success: true, status: util.statusCode.SUCCESS, message: '', response: await util.encryptResponse(respData) }
        } else {
            return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null }
        }
    } catch (e) {
        return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null }
    }
}

module.exports.getRoles = async (data) => {
    try {

        // if(data.searchText === undefined || data.searchText == null || data.searchText == ""){
        //     data.searchText = data.searchRoleName;
        // }
        let roleListData = await dao.getRoles(data);

        if (roleListData) {
            return { success: true, status: util.statusCode.SUCCESS, message: '', response: await util.encryptResponse(roleListData) }
        } else {
            return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null }
        }
    } catch (e) {
        return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null }
    }
}

//fetch all the active user roles for dropdown in user/role/permission section permission

module.exports.getRolesDropdown = async (data) => {
    try {
        let roleListData = await dao.getRolesDropdown(data)
        if (roleListData) {
            return { success: true, status: util.statusCode.SUCCESS, message: '', response: await util.encryptResponse(roleListData) }
        } else {
            return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null }
        }
    } catch (e) {
        return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null }
    }
}

//get premissions list of modules accessability for user specific roles

module.exports.getPermissionForRolesDetails = async (data) => {
    try {

        if (data.businessType !== undefined && data.businessType != "") {
            data.moduleId = data.businessType;
        }
        let moduleList = await dao.getMasterData(data)

        if (moduleList) {
            let respArr = []
            if (moduleList.length > 0) {
                for (let i = 0; i < moduleList.length; i++) {
                    if (data.roleId == "") {
                        moduleList[i].permission = [{
                            "isView": 0,
                            "addPem": 0,
                            "editPem": 0,
                            "deletePem": 0,
                            "approvePem": 0
                        }]
                    } else {

                        moduleList[i].clientId = data.clientId;
                        moduleList[i].roleId = data.roleId
                        let permissionInfo = await dao.getModulePermission(moduleList[i]);

                        delete moduleList[i].clientId;
                        delete moduleList[i].roleId;
                        if (permissionInfo.length == 0) {
                            moduleList[i].permission = [{
                                "isView": 0,
                                "addPem": 0,
                                "editPem": 0,
                                "deletePem": 0,
                                "approvePem": 0
                            }]
                        } else {
                            moduleList[i].permission = permissionInfo[0]
                        }
                    }
                }
                return { success: true, status: util.statusCode.SUCCESS, message: '', response: await util.encryptResponse(moduleList) }
            } else {
                return { success: true, status: util.statusCode.SUCCESS, message: '', response: await util.encryptResponse(permiisionOfRoles) }
            }
        } else {
            return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null }
        }
    } catch (e) {
        return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null }
    }
}



module.exports.getPermissionForRolesChildsData = async (data) => {
    try {
        if (data.businessType !== undefined && data.businessType != "") {
            data.moduleId = data.businessType;
        }
        let moduleList = await dao.getPermissionForRolesChildsData(data)
        if (moduleList) {

            let respArr = []

            if (moduleList.length > 0) {
                for (let i = 0; i < moduleList.length; i++) {

                    if (data.roleId == "") {
                        moduleList[i].permission = [{
                            "isView": 0,
                            "addPem": 0,
                            "editPem": 0,
                            "deletePem": 0,
                            "approvePem": 0
                        }]
                    } else {
                        moduleList[i].clientId = data.clientId;
                        moduleList[i].roleId = data.roleId;
                        moduleList[i].specificModule = data.specificModule;

                        // let permissionInfo = await dao.getModulePermission(moduleList[i]);
                        let permissionInfo = await dao.getModulePermissionModified(moduleList[i]);

                        delete moduleList[i].clientId;
                        delete moduleList[i].roleId;

                        if (permissionInfo.length == 0) {
                            moduleList[i].permission = [{
                                "isView": 0,
                                "addPem": 0,
                                "editPem": 0,
                                "deletePem": 0,
                                "approvePem": 0
                            }]
                        } else {

                            moduleList[i].permission = permissionInfo[0]
                        }
                    }
                }

                return { success: true, status: util.statusCode.SUCCESS, message: '', response: await util.encryptResponse(moduleList) }
            } else {
                return { success: true, status: util.statusCode.SUCCESS, message: 'There are no child configured for this module', response: [] }
            }
        } else {
            return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null }
        }
    } catch (e) {
        return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null }
    }
}













// module.exports.getPermissionForRolesChildsData = async(data)=>{
//     try{
//         let childList = await dao.getPermissionForRolesChildsData(data);

//         if(childList.length > 0){
//             return {success: true, status: util.statusCode.SUCCESS, message: 'All module child are here', response: await util.encryptResponse(childList)}

//         }else{
//             return {success: true, status: util.statusCode.SUCCESS, message: 'There are no child configured for this module', response: null}
//         }

//     }catch(e){
//         return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null}
//     }
// }


module.exports.updatePermissionForRolesDetails = async (data) => {
    try {

        let insertCout = 0;

        let delStatus = await dao.delModulePermission(data)

        if (delStatus) {

            for (let i = 0; i < data.permissions.length; i++) {

                data.permissions[i].roleId = data.roleId
                data.permissions[i].clientId = data.clientId
                data.permissions[i].userId = data.userId

                data.permissions[i].specificModuleId = data.specificModuleId;


                let insertRolePermission = await dao.insertpermissionForRoles(data.permissions[i]);

                insertCout++;

            }

        }

        if (insertCout == data.permissions.length) {

            return { success: true, status: util.statusCode.SUCCESS, message: 'Permission mapped successfully', response: null }


        } else {
            return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null }

        }


    } catch (e) {

        return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null }
    }
}

module.exports.getDesignationDropdown = async (data) => {
    try {
        let designationList = await dao.getDesignationDropdown(data);
        return { success: true, status: util.statusCode.SUCCESS, message: '', response: await util.encryptResponse(designationList) }
    } catch (e) {
        return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null }
    }
}

module.exports.addEmpUsrReq = async (data) => {
    try {

        if (data.lastName == undefined || data.lastName == null || data.lastName.length == 0) {
            data.lastName = null;
        }

        if (data.address == undefined || data.address == null || data.address.length == 0) {
            data.address = "N/A";
        }

        if (data.profileImgUrl == undefined || data.profileImgUrl == null || data.profileImgUrl.length == 0) {
            data.profileImgUrl = "/images/profileImage.png";
        }

        if (data.dob == undefined || data.dob == null || data.dob.length == 0) {
            data.dob = null;
        }

        if (data.gender == undefined || data.gender == null || data.gender.length == 0) {
            data.gender = null;
        }

        if (data.dateOfJoin == undefined || data.dateOfJoin == null || data.dateOfJoin.length == 0) {
            data.dateOfJoin = null;
        }

        if (data.remark == undefined || data.remark == null || data.remark.length == 0) {
            data.remark = "N/A";
        }

        let linsenseLimit0 = await dao.getUserLimitCompany(data)
        let linsensedUser0 = await dao.getUserCountForLisense(data)

        let linsenseLimit = linsenseLimit0[0].settingsValue
        let linsensedUser = linsensedUser0[0].userCount


        let phoneNumber = data.phoneNumber.join(",")
        data.phoneNumber = phoneNumber

        let respCilentUserId = await dao.addClientUsers(data);
        let updateClientLocationMapStatus = await commondao.addclientlocation(data, respCilentUserId, 'clientUser')

        if (linsenseLimit > linsensedUser) {

            if (respCilentUserId) {
                if (data.userEmpPermit == '1') {
                    data['password'] = util.passwordHash(data['password'])

                    let UserId = await dao.addUsers(data, respCilentUserId)
                    if (data.lattitude !== undefined && data.longitude !== undefined) {
                        let updateActivityLocationStatus = await commondao.addLocationActivity(data, UserId, 'user')
                    }
                    let updateClientLocationMapStatus = await commondao.addclientlocation(data, UserId, 'user')

                    let updateMainUserTable = await dao.updateUserMap(data, UserId, respCilentUserId)

                    if (updateMainUserTable) {
                        return { success: true, status: util.statusCode.SUCCESS, message: 'User added successfully', response: null }
                    } else {
                        return { success: false, status: util.statusCode.INTERNAL, message: 'Error during adding client user map', response: null }
                    }

                } else {
                    return { success: true, status: util.statusCode.SUCCESS, message: 'User added successfully', response: null }

                }

            } else {
                return { success: false, status: util.statusCode.INTERNAL, message: 'Error during adding client user map', response: null }

            }

        } else {
            return { success: false, status: util.statusCode.LICENCED_EXCEED, message: 'User linsense exceed for this company', response: null }
        }

    } catch (e) {
        return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null }
    }
}

module.exports.ifPhoneExist = async (data) => {
    try {

        let phoneNumber = [];
        if (data.userEmpPermit == 0) {
            // phoneNumber = await dao.ifPhoneExist(data,"clientUser");    
            phoneNumber = await dao.ifPhoneExistClientUser(data);
        } else {
            // phoneNumber = await dao.ifPhoneExist(data,"user");    
            phoneNumber = await dao.ifPhoneExistUser(data);
        }

        if (phoneNumber.length != 0) {

            return { success: true, status: util.statusCode.SUCCESS, message: 'Phone Number Already Exist', response: true }

        } else {
            return { success: true, status: util.statusCode.SUCCESS, message: 'Validation Successfull ', response: false }

        }
    } catch (e) {
        return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null }
    }
}

module.exports.ifPhoneExistCustomer = async (data) => {
    try {
        let phoneNumber = [];
        phoneNumber = await dao.ifPhoneExistCustomer(data);

        if (phoneNumber.length != 0) {

            return { success: true, status: util.statusCode.SUCCESS, message: 'Phone Number Already Exist', response: true }

        } else {
            return { success: true, status: util.statusCode.NOTACCESSED, message: 'Phone Number Not Exist', response: false }

        }
    } catch (e) {
        return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null }
    }
}

module.exports.ifEmailExist = async (data) => {
    try {
        let email = [];
        if (data.userEmpPermit == 0) {
            email = await dao.ifEmailExist(data, "clientUser");
        } else {
            email = await dao.ifEmailExist(data, "user");
        }

        if (email.length != 0) {

            return { success: true, status: util.statusCode.SUCCESS, message: 'Email Already Exist', response: true }

        } else {
            return { success: true, status: util.statusCode.SUCCESS, message: '', response: false }

        }
    } catch (e) {
        return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null }
    }
}

module.exports.addEmpUsrReqV2 = async (data) => {
    try {

        if (data.lastName == undefined || data.lastName == null || data.lastName.length == 0) {
            data.lastName = null;
        }

        if (data.address == undefined || data.address == null || data.address.length == 0) {
            data.address = "N/A";
        }

        if (data.profileImgUrl == undefined || data.profileImgUrl == null || data.profileImgUrl.length == 0) {
            data.profileImgUrl = "/images/profileImage.png";
        }

        if (data.dob == undefined || data.dob == null || data.dob.length == 0) {
            data.dob = null;
        }

        if (data.gender == undefined || data.gender == null || data.gender.length == 0) {
            data.gender = null;
        }

        if (data.dateOfJoin == undefined || data.dateOfJoin == null || data.dateOfJoin.length == 0) {
            data.dateOfJoin = null;
        }

        if (data.remark == undefined || data.remark == null || data.remark.length == 0) {
            data.remark = "N/A";
        }
        if (data.erpCode == undefined || data.erpCode == null || data.erpCode == "") {
            data.erpCode = null;
        }
        if (data.parentUserId == undefined || data.parentUserId == null || data.parentUserId == "") {
            data.parentUserId = "0";
        }

        if (data.empType == undefined || data.empType == null || data.empType == "") {
            data.empType = "GT";
        }

        if (data.allowEmpAsAdminValue == undefined || data.allowEmpAsAdminValue == null || data.allowEmpAsAdminValue == "") {
            data.allowEmpAsAdminValue = "0";
        }

        data.countryId = 0;
        data.stateId = 0;
        data.cityId = 0;
        data.districtId = 0;
        data.zoneId = 0;

        let finalDate = '';
        // let date = new Date();
        let date = '';

        if (data.currentDateTime === undefined || data.currentDateTime == "" || data.currentDateTime == null) {
            data.currentDateTime = new Date();
            date = new Date()
        }else{
            date = new Date(data.currentDateTime)
        }

        let year = date.getFullYear();
        let month = ("0" + (date.getMonth() + 1)).slice(-2);
        let day = ("0" + date.getDate()).slice(-2);

        let timeHours = ("0" + date.getHours()).slice(-2);
        let timeMinutes = ("0" + date.getMinutes()).slice(-2);
        let seconds = ("0" + date.getSeconds()).slice(-2);

        // if (seconds < 10) {
        //     finalDate = year + '-' + month + '-' + day + ' ' + timeHours + ':' + timeMinutes + ':0' + seconds
        // }
        // else {
        //     finalDate = year + '-' + month + '-' + day + ' ' + timeHours + ':' + timeMinutes + ':' + seconds
        // }

        finalDate = year + '-' + month + '-' + day + ' ' + timeHours + ':' + timeMinutes + ':' + seconds

        let companyGamificationSetting = await commondao.checkCompanyGamificationSettings(data.clientId)


        // let companyGamificationSetting = 1;

        let linsenseLimit0 = await dao.getUserLimitCompany(data);
        let linsensedUser0 = await dao.getUserCountForLisense(data);


        let linsenseLimit = linsenseLimit0[0].settingsValue
        let linsensedUser = linsensedUser0[0].userCount

        let getUserLoginSettingsValue = await commondao.checkCompanyLoginSettings(data.clientId)

        if(getUserLoginSettingsValue != "0"){

            if(getUserLoginSettingsValue == "1"){

                data['username'] = data.phoneNumber[0];

            }else if(getUserLoginSettingsValue == "2"){

                data['username'] = data.email;

            }
        }else{

            data['username'] = data.email;
        }

        let phoneNumber = data.phoneNumber.join(",")
        data.phoneNumber = phoneNumber

        let respCilentUserId = await dao.addClientUsersV2(data);


        // for (let i = 0; i < data.locationData.length; i++) {

        //     let locationId = await dao.addEmployeelocation(data, data.locationData[i], respCilentUserId, 'clientUser')

        // }
        for (let i = 0; i < data.hierarchyDataIdArr.length; i++) {

            let locationId = await dao.gn_addEmployeelocation(data, data.hierarchyDataIdArr[i], respCilentUserId, 'clientUser')

        }

        if (linsenseLimit > linsensedUser) {

            if (respCilentUserId) {
                if (data.userEmpPermit == '1') {
                    data['password'] = "password";   // set default password
                    data['password'] = util.passwordHash(data['password']);

                    let UserId = await dao.addUsersV2(data, respCilentUserId)

                    if (data.lattitude !== undefined && data.longitude !== undefined) {

                        let updateActivityLocationStatus = await commondao.addLocationActivity(data, UserId, 'user')
                    }
                    // for (let i = 0; i < data.locationData.length; i++) {

                    //     let locationId = await dao.addEmployeelocation(data, data.locationData[i], UserId, 'user')


                    // }

                    for (let i = 0; i < data.hierarchyDataIdArr.length; i++) {

                        let locationId = await dao.gn_addEmployeelocation(data, data.hierarchyDataIdArr[i], UserId, 'user')

                    }

                    if(data.productHierarchyDataIdArr !== undefined && Array.isArray(data.productHierarchyDataIdArr) == true && data.productHierarchyDataIdArr.length > 0){

                        for(let p = 0; p < data.productHierarchyDataIdArr.length ; p++){

                            let productMappedStatus = await dao.insertProductEmpMapping(data, UserId, finalDate, data.productHierarchyDataIdArr[p]);
                        }
                    }

                    let updateMainUserTable = await dao.updateUserMap(data, UserId, respCilentUserId)

                    if (updateMainUserTable) {

                        // Souadeep
                        if (companyGamificationSetting == 1) {
                            let minlevelid = await dao.minlevelid(data);

                            let financialyearId = await dao.getfinancialyearDetail(data, finalDate);

                            let adduseringamificationuserconfig = await dao.adduseringamificationuserconfig(data, UserId, financialyearId, minlevelid[0].levelId);
                            let addIntoPointsLog = await dao.dataAddIntoPointsLog(data, UserId)

                        }
                        return { success: true, status: util.statusCode.SUCCESS, message: 'User added successfully', response: { "clientUserId": respCilentUserId } }
                    } else {
                        return { success: false, status: util.statusCode.INTERNAL, message: 'Error during adding client user map', response: null }
                    }

                } else {
                    return { success: true, status: util.statusCode.SUCCESS, message: 'User added successfully', response: { "clientUserId": respCilentUserId } }

                }

            } else {
                return { success: false, status: util.statusCode.INTERNAL, message: 'Error during adding client user map', response: null }

            }

        } else {
            return { success: true, status: util.statusCode.LICENCED_EXCEED, message: 'User linsense exceed for this company', response: { "clientUserId": respCilentUserId } }
        }

    } catch (e) {
        return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null }
    }
}



module.exports.updateEmpUsrReq = async (data) => {
    try {

        let linsenseLimit0 = await dao.getUserLimitCompany(data)
        let linsensedUser0 = await dao.getUserCountForLisense(data)

        let linsenseLimit = linsenseLimit0[0].settingsValue
        let linsensedUser = linsensedUser0[0].userCount


        let phoneNumber = data.phoneNumber.join(",")
        data.phoneNumber = phoneNumber

        let respCilentUserResp = await dao.updateClientUsers(data);

        if (respCilentUserResp) {
            if (data.userEmpPermit == '1') {

                if (linsenseLimit > linsensedUser) {

                    data['password'] = util.passwordHash(data['password'])

                    let empTableStatus = await dao.getIfeMPExsist(data)


                    if (empTableStatus.length > 0) {

                        data.existingEmpUserId = empTableStatus[0].empId;

                        let newUserAddResp = await dao.updateUsers(data, empTableStatus[0].empId)
                        let updateClientLocationMapStatus = await commondao.addclientlocation(data, empTableStatus[0].empId, 'user')
                        if (newUserAddResp) {
                            return { success: true, status: util.statusCode.SUCCESS, message: 'User updated successfully', response: null }
                        } else {
                            return { success: false, status: util.statusCode.INTERNAL, message: 'Error during adding client user map1', response: null }
                        }

                    } else {

                        let userAddId = await dao.addUsers(data, data.userCId)

                        let updateClientLocationMapStatus = await commondao.addclientlocation(data, userAddId, 'user')

                        let updateMainUserTable = await dao.updateUserMap(data, userAddId, data.userCId)

                        if (updateMainUserTable) {
                            return { success: true, status: util.statusCode.SUCCESS, message: 'User updated successfully', response: null }
                        } else {
                            return { success: false, status: util.statusCode.INTERNAL, message: 'Error during adding client user map2', response: null }
                        }

                    }

                } else {
                    return { success: false, status: util.statusCode.LICENCED_EXCEED, message: 'User linsense exceed for this company', response: null }
                }
            } else {
                await dao.deleteUserEmp(data);    // for modify emp as not user
                await dao.deleteUserId(data);
                return { success: true, status: util.statusCode.SUCCESS, message: 'User updated successfully', response: null }
            }


        } else {
            return { success: false, status: util.statusCode.INTERNAL, message: 'Error during updating client user map3', response: null }
        }

    } catch (e) {
        return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null }
    }
}

module.exports.updateEmpUsrReqV2 = async (data) => {
    try {

        if (data.erpCode == undefined || data.erpCode == null || data.erpCode == "") {
            data.erpCode = null;
        }

        let linsenseLimit0 = await dao.getUserLimitCompany(data)
        let linsensedUser0 = await dao.getUserCountForLisense(data)

        let linsenseLimit = linsenseLimit0[0].settingsValue
        let linsensedUser = linsensedUser0[0].userCount


        let phoneNumber = data.phoneNumber.join(",")
        data.phoneNumber = phoneNumber

        data.countryId = 0;
        data.stateId = 0;
        data.cityId = 0;
        data.districtId = 0;
        data.zoneId = 0;

        let respCilentUserResp = await dao.updateClientUsers(data);

        if (respCilentUserResp) {
            if (data.userEmpPermit == '1') {

                if (linsenseLimit > linsensedUser) {

                    let empTableStatus = await dao.getIfeMPExsist(data)

                    if (empTableStatus.length > 0) {

                        data.existingEmpUserId = empTableStatus[0].empId;

                        let newUserAddResp = await dao.updateUsersV2(data, empTableStatus[0].empId);


                        await dao.deleteEmployeeLocationData(data.existingEmpUserId, 'user', data);

                        for (let i = 0; i < data.locationData.length; i++) {

                            let updateClientLocationMapStatus = await dao.addEmployeelocation(data, data.locationData[i], empTableStatus[0].empId, 'user')

                        }
                        if (newUserAddResp) {
                            return { success: true, status: util.statusCode.SUCCESS, message: 'User updated successfully', response: null }
                        } else {
                            return { success: false, status: util.statusCode.INTERNAL, message: 'Error during adding client user map1', response: null }
                        }

                    } else {

                        data['password'] = util.passwordHash(data['password'])
                        let userAddId = await dao.addUsersV2(data, data.userCId)


                        await dao.deleteEmployeeLocationData(userAddId, 'user', data);
                        for (let i = 0; i < data.locationData.length; i++) {

                            let updateClientLocationMapStatus = await dao.addEmployeelocation(data, data.locationData[i], userAddId, 'user')

                        }

                        let updateMainUserTable = await dao.updateUserMap(data, userAddId, data.userCId)

                        if (updateMainUserTable) {
                            return { success: true, status: util.statusCode.SUCCESS, message: 'User updated successfully', response: null }
                        } else {
                            return { success: false, status: util.statusCode.INTERNAL, message: 'Error during adding client user map2', response: null }
                        }

                    }

                } else {
                    return { success: false, status: util.statusCode.LICENCED_EXCEED, message: 'User linsense exceed for this company', response: null }
                }
            } else {

                await dao.deleteEmployeeLocationData(data.userCId, 'clientUser', data);

                for (let i = 0; i < data.locationData.length; i++) {

                    let updateClientLocationMapStatus = await dao.addEmployeelocation(data, data.locationData[i], data.userCId, 'clientUser')

                }
                let empTableStatus = await dao.getIfeMPExsist(data)
                await dao.deleteUserEmp(data);    // for modify emp as not user
                await dao.deleteEmployeeLocationData(empTableStatus[0].empId, 'user', data); // delete user location
                await dao.deleteUserId(data);
                return { success: true, status: util.statusCode.SUCCESS, message: 'User updated successfully', response: null }
            }


        } else {
            return { success: false, status: util.statusCode.INTERNAL, message: 'Error during updating client user map3', response: null }
        }

    } catch (e) {

        return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null }
    }
}

// module.exports.updateEmpUsrReqV4 = async(data)=>{
//     try{

//         if(data.erpCode == undefined || data.erpCode == null || data.erpCode == ""){
//             data.erpCode = null;
//         }

//         let linsenseLimit0 = await dao.getUserLimitCompany(data)
//         let linsensedUser0 = await dao.getUserCountForLisense(data)

//         let linsenseLimit = linsenseLimit0[0].settingsValue
//         let linsensedUser = linsensedUser0[0].userCount


//         let phoneNumber = data.phoneNumber.join(",")
//         data.phoneNumber = phoneNumber

//         data.countryId = 0;
//         data.stateId = 0;
//         data.cityId = 0;
//         data.districtId = 0;
//         data.zoneId = 0;

//         if (data.userEmpPermit == '1'){ // permission to user granted

//             if(linsenseLimit > linsensedUser){   // if user limit not exceeded

//                 let empTableStatus = await dao.getIfeMPExsist(data) // if userId != '0' in clientUser

//                 if(empTableStatus.length > 0){

//                     let newUserAddResp = await dao.updateUsersV2(data, empTableStatus[0].empId); // update user
//                     await dao.deleteEmployeeLocationData(empTableStatus[0].empId,'user', data); // delete user location
//                     await dao.deleteEmployeeLocationData(data.userCId,'clientUser', data);

//                     for(let i=0; i<data.locationData.length; i++){

//                     let updateClientLocationMapStatus = await dao.addEmployeelocation(data,data.locationData[i],data.userCId, 'clientUser');

//                     }
//                     for(let i=0; i<data.locationData.length; i++){

//                     let updateClientLocationMapStatus = await dao.addEmployeelocation(data,data.locationData[i],data.userCId, 'user');

//                     }

//                     return {success: true, status: util.statusCode.SUCCESS, message: 'User updated successfully', response: null}

//                 }else{  // new user permission

//                     data['password'] = sha1(data['password'])
//                     let userAddId = await dao.addUsersV2(data, data.userCId)
//                     for(let i=0; i<data.locationData.length; i++){

//                     let updateClientLocationMapStatus = await dao.addEmployeelocation(data,data.locationData[i],data.userCId, 'user');

//                     }
//                     await dao.deleteEmployeeLocationData(data.userCId,'clientUser', data);
//                     for(let i=0; i<data.locationData.length; i++){

//                     let updateClientLocationMapStatus = await dao.addEmployeelocation(data,data.locationData[i],data.userCId, 'clientUser');

//                     }

//                     let updateMainUserTable = await dao.updateUserMap(data, userAddId, data.userCId)

//                     return {success: true, status: util.statusCode.SUCCESS, message: 'User updated successfully', response: null}


//                 }



//             }else{
//                 return {success: false, status: util.statusCode.LICENCED_EXCEED, message: 'User linsense exceed for this company', response: null}
//             }


//         } else {  // permission to user Not granted or revoked

//             let empTableStatus = await dao.getIfeMPExsist(data) // if userId != '0' in clientUser

//             if(empTableStatus.length > 0){   // permission to user revoked

//                 await dao.deleteUserEmp(data);    // for modify emp as not user
//                 await dao.deleteEmployeeLocationData(empTableStatus[0].empId,'user', data); // delete user location
//                 await dao.deleteUserId(data); // set userId of client user as '0'

//                 let respCilentUserResp = await dao.updateClientUsers(data);
//                 await dao.deleteEmployeeLocationData(data.userCId,'clientUser', data);
//                 for(let i=0; i<data.locationData.length; i++){

//                     let updateClientLocationMapStatus = await dao.addEmployeelocation(data,data.locationData[i],data.userCId, 'clientUser');

//                 }
//                 return {success: true, status: util.statusCode.SUCCESS, message: 'User updated successfully', response: null}

//             }else{  // permission to user Not granted 

//                 let respCilentUserResp = await dao.updateClientUsers(data);
//                 await dao.deleteEmployeeLocationData(data.userCId,'clientUser', data);
//                 for(let i=0; i<data.locationData.length; i++){

//                     let updateClientLocationMapStatus = await dao.addEmployeelocation(data,data.locationData[i],data.userCId, 'clientUser');

//                 }
//                 return {success: true, status: util.statusCode.SUCCESS, message: 'User updated successfully', response: null}

//             }

//         }


//     }catch(e){
//         return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null}
//     }
// }

module.exports.updateEmpUsrReqV3 = async (data) => {
    try {
        if (data.lastName == undefined || data.lastName == null || data.lastName == "") {
            data.lastName = null;
        }
        if (data.dob == undefined || data.dob == null || data.dob == "") {
            data.dob = null;
        }
        if (data.gender == undefined || data.gender == null || data.gender == "") {
            data.gender = null;
        }
        if (data.dateOfJoin == undefined || data.dateOfJoin == null || data.dateOfJoin == "") {
            data.dateOfJoin = null;
        }
        if (data.erpCode == undefined || data.erpCode == null || data.erpCode == "") {
            data.erpCode = null;
        }
        if (data.parentUserId == undefined || data.parentUserId == null || data.parentUserId == "") {
            data.parentUserId = "0";
        }
        if (data.allowEmpAsAdminValue == undefined || data.allowEmpAsAdminValue == null || data.allowEmpAsAdminValue == "") {
            data.allowEmpAsAdminValue = "0";
        }
        
        let finalDate = '';
        // let date = new Date();
        let date = '';

        if (data.currentDateTime === undefined || data.currentDateTime == "" || data.currentDateTime == null) {
            data.currentDateTime = new Date();
            date = new Date()
        }else{
            date = new Date(data.currentDateTime)
        }

        let year = date.getFullYear();
        let month = ("0" + (date.getMonth() + 1)).slice(-2);
        let day = ("0" + date.getDate()).slice(-2);

        let timeHours = ("0" + date.getHours()).slice(-2);
        let timeMinutes = ("0" + date.getMinutes()).slice(-2);
        let seconds = ("0" + date.getSeconds()).slice(-2);

        // if (seconds < 10) {
        //     finalDate = year + '-' + month + '-' + day + ' ' + timeHours + ':' + timeMinutes + ':0' + seconds
        // }
        // else {
        //     finalDate = year + '-' + month + '-' + day + ' ' + timeHours + ':' + timeMinutes + ':' + seconds
        // }

        finalDate = year + '-' + month + '-' + day + ' ' + timeHours + ':' + timeMinutes + ':' + seconds

        data.currentDateTime = finalDate;

        // let companyGamificationSetting = 1;

        let companyGamificationSetting = await commondao.checkCompanyGamificationSettings(data.clientId)


        let getUserLoginSettingsValue = await commondao.checkCompanyLoginSettings(data.clientId)

        if(getUserLoginSettingsValue != "0"){

            if(getUserLoginSettingsValue == "1"){

                data['username'] = data.phoneNumber[0];

            }else if(getUserLoginSettingsValue == "2"){

                data['username'] = data.email;

            }
        }

        let getCurrentFinYrId = await dao.getfinancialyearDetail(data, finalDate)

        let minlevelid = await dao.minlevelid(data);

        let linsenseLimit0 = await dao.getUserLimitCompany(data);
        let linsensedUser0 = await dao.getUserCountForLisense(data);
        let linsenseLimit = linsenseLimit0[0].settingsValue;
        let linsensedUser = linsensedUser0[0].userCount;
        let phoneNumber = data.phoneNumber.join(",");
        data.phoneNumber = phoneNumber;
        data.countryId = 0;
        data.stateId = 0;
        data.cityId = 0;
        data.districtId = 0;
        data.zoneId = 0;
        if (data.userEmpPermit == '1') {
            if (linsenseLimit > linsensedUser) {
                let empTableStatus = await dao.getIfeMPExsist(data);
                if (empTableStatus.length > 0) {

                    try {
                        let respCilentUserResp = await dao.updateClientUsersV2(data);

                        // //==========================================location updates off now =============================================== 

                        // await dao.deleteEmployeeLocationData(data.userCId, 'clientUser', data);

                        // for (let i = 0; i < data.hierarchyDataIdArr.length; i++) {

                        //     let updateClientLocationMapStatus = await dao.gn_addEmployeelocation(data, data.hierarchyDataIdArr[i], data.userCId, 'clientUser');
                        // }

                        // //==========================================location updates off now =============================================== 


                        let newUserAddResp = await dao.updateUsersV2(data, empTableStatus[0].empId);

                        // ================================for gamification config ===================================


                        if (companyGamificationSetting == 1) {


                            let chkExistingUserinGamificationuserConfigId = await dao.chkExistingUserinGamificationuserConfig(empTableStatus[0].empId, data.clientId, getCurrentFinYrId);


                            if (chkExistingUserinGamificationuserConfigId != 0) {

                                // let updatedesignationId=await dao.updatedesignationId(getdesignationId[0].designationId,finalDate,data.userId,chkExistingUserinGamificationuserConfig[0].id);

                                let updatedesignationId = await dao.updatedesignationIdForGamificationConfig(data, finalDate, getCurrentFinYrId, empTableStatus[0].empId, chkExistingUserinGamificationuserConfigId);
                            } else {

                                // let minlevelid=await dao.minlevelid(data);

                                let adduseringamificationuserconfig = await dao.adduseringamificationuserconfig(data, empTableStatus[0].empId, getCurrentFinYrId, minlevelid[0].levelId);
                                let addIntoPointsLog = await dao.dataAddIntoPointsLog(data, empTableStatus[0].empId)

                            }
                        }
                        // ================================for gamification config ===================================

                        // //==========================================location updates off now =============================================== 

                        // await dao.deleteEmployeeLocationData(empTableStatus[0].empId, 'user', data);

                        // for (let i = 0; i < data.hierarchyDataIdArr.length; i++) {

                        //     let updateClientLocationMapStatus = await dao.gn_addEmployeelocation(data, data.hierarchyDataIdArr[i], empTableStatus[0].empId, 'user');
                        // }

                        // //==========================================location updates off now =============================================== 

                        let updateMainUserTable = await dao.updateUserMap(data, empTableStatus[0].empId, data.userCId);
                        return { success: true, status: util.statusCode.SUCCESS, message: 'User updated successfully', response: null }
                    } catch (e) {

                        console.log(e)

                        return { success: false, status: util.statusCode.INTERNAL, message: 'Error occured while updating or re-adding existing user', response: null }
                    }

                } else {

                    try {

                        data['password'] = "password"; // set default password
                        data['password'] = util.passwordHash(data['password']);
                        let respCilentUserResp = await dao.updateClientUsersV2(data);

                        // //==========================================location updates off now ===============================================

                        // await dao.deleteEmployeeLocationData(data.userCId, 'clientUser', data);

                        // for (let i = 0; i < data.hierarchyDataIdArr.length; i++) {

                        //     let updateClientLocationMapStatus = await dao.gn_addEmployeelocation(data, data.hierarchyDataIdArr[i], data.userCId, 'clientUser');
                        // }

                        // //==========================================location updates off now ===============================================

                        let userAddId = await dao.addUsersV2(data, data.userCId);

                        if (companyGamificationSetting == 1) {

                            // let minlevelid=await dao.minlevelid(data);

                            // let getfinancialyearDetail=await dao.getfinancialyearDetail(data,finalDate);

                            let adduseringamificationuserconfig = await dao.adduseringamificationuserconfig(data, userAddId, getCurrentFinYrId, minlevelid[0].levelId);
                            // let addIntoPointsLog = await dao.dataAddIntoPointsLog(data, empTableStatus[0].empId)

                        }

                        // //==========================================location updates off now ===============================================

                        // for (let i = 0; i < data.hierarchyDataIdArr.length; i++) {

                        //     let updateClientLocationMapStatus = await dao.gn_addEmployeelocation(data, data.hierarchyDataIdArr[i], userAddId, 'user');
                        // }

                        // //==========================================location updates off now ===============================================



                        let updateMainUserTable = await dao.updateUserMap(data, userAddId, data.userCId);
                        return { success: true, status: util.statusCode.SUCCESS, message: 'User updated successfully', response: null };
                    } catch (e) {

                        console.log(e)

                        return { success: false, status: util.statusCode.INTERNAL, message: 'Error occured while adding new user', response: null }
                    }

                }
            } else {
                return { success: false, status: util.statusCode.LICENCED_EXCEED, message: 'User linsense exceed for this company', response: null }
            }
        } else {
            let empTableStatus = await dao.getIfeMPExsist(data);

            if (empTableStatus.length > 0) {
                try {

                    await dao.deleteUserEmp(data);

                    if (companyGamificationSetting == 1) {

                        // let getCurrentFinYrId = await dao.getfinancialyearDetail(data, finalDate)

                        let chkExistingUserinGamificationuserConfigId = await dao.chkExistingUserinGamificationuserConfig(empTableStatus[0].empId, data.clientId, getCurrentFinYrId);

                        if (chkExistingUserinGamificationuserConfigId != 0) {

                            // let delgamificationid=await dao.deletegamificationid(empTableStatus[0].empId,data.clientId,data.userId, getCurrentFinYrId, finalDate);
                            let delgamificationid = await dao.deletegamificationid(data, chkExistingUserinGamificationuserConfigId, finalDate);

                        }

                    }

                    //==========================================location updates off now ===============================================

                    await dao.deleteEmployeeLocationData(empTableStatus[0].empId, 'user', data);

                    let respCilentUserResp = await dao.updateClientUsersV2(data);

                    // await dao.deleteEmployeeLocationData(data.userCId, 'clientUser', data);

                    // for (let m = 0; m < data.hierarchyDataIdArr.length; m++) {
                    //     let updateClientLocationMapStatus = await dao.gn_addEmployeelocation(data, data.hierarchyDataIdArr[m], data.userCId, 'clientUser');
                    // }

                    //==========================================location updates off now ===============================================


                    await dao.deleteUserId(data);
                    return { success: true, status: util.statusCode.SUCCESS, message: 'User updated successfully', response: null }
                } catch (e) {
                    return { success: false, status: util.statusCode.INTERNAL, message: 'Error occured while revoking user linsense', response: null }
                }

            } else {
                try {
                    let respCilentUserResp = await dao.updateClientUsersV2(data);

                    //==========================================location updates off now ===============================================
                    // await dao.deleteEmployeeLocationData(data.userCId, 'clientUser', data);
                    // for (let m = 0; m < data.hierarchyDataIdArr.length; m++) {
                    //     let updateClientLocationMapStatus = await dao.gn_addEmployeelocation(data, data.hierarchyDataIdArr[m], data.userCId, 'clientUser');
                    // }
                    
                    //==========================================location updates off now ===============================================


                    return { success: true, status: util.statusCode.SUCCESS, message: 'User updated successfully', response: null }
                } catch (e) {

                    return { success: false, status: util.statusCode.INTERNAL, message: 'Error occured while updating client user', response: null }
                }

            }
        }
    } catch (e) {

        return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null }
    }
}




module.exports.getlinsensedUserMod = async (data) => {
    try {

        let linsenseLimit0 = await dao.getUserLimitCompany(data)
        let linsensedUser0 = await dao.getUserCountForLisense(data)

        let linsenseLimit = linsenseLimit0[0].settingsValue
        let linsensedUser = linsensedUser0[0].userCount




        if (linsenseLimit > linsensedUser) {


            return { success: true, status: util.statusCode.SUCCESS, message: '', response: null }

        } else {
            return { success: false, status: util.statusCode.LICENCED_EXCEED, message: 'User linsense exceed for this company', response: null }

        }
    } catch (e) {
        return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null }
    }
}


module.exports.updateEmpUserPassword = async (data) => {
    try {

        data.password = util.passwordHash(data.password);

        let empTableStatus = await dao.getIfeMPExsist(data);

        if ((empTableStatus.length > 0) && (empTableStatus[0].deleted == 0)) {

            let passUpdated = await dao.updateUsersPassword(data, empTableStatus[0].empId);

            if (passUpdated == true) {
                return { success: true, status: util.statusCode.SUCCESS, message: 'Password Updated', response: null }
            } else {
                return { success: false, status: util.statusCode.INTERNAL, message: 'Internal Server Error', response: null }
            }
        } else {
            return { success: false, status: null, message: 'Not a user', response: null }
        }
    } catch (e) {
        return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null }
    }
}
































module.exports.getusersList = async (data) => {
    try {
        let designationData = await dao.getDesignationDropdown(data)

        let rolesData = await dao.getRolesDropdown(data)


        if (designationData && rolesData) {
            return { success: true, status: util.statusCode.SUCCESS, message: '', response: await util.encryptResponse({ "designationData": designationData, "rolesData": rolesData }) }
        } else {
            return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null }
        }
    } catch (e) {
        return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null }
    }
}

function getDistinctIds(jsonArray) {
    const idSet = new Set();
    jsonArray.forEach(obj => {
        if (obj.parentUserId !== null && obj.parentUserId !== 0) { // Check for null and 0
            idSet.add(obj.parentUserId);
        }
    });
    return Array.from(idSet);
}

function searchId(jsonArray, idToSearch) {
    for (let obj of jsonArray) {
        if (obj.parentUserId === idToSearch) {
            return obj; // Return the object if ID is found
        }
    }
    return null; // Return null if ID is not found
}

module.exports.getusersDataList = async (data) => {
    try {
        data.isDownload = '0';
        let getUsersOfTheLocations = []

        if (data.hierarchyDataIdArr !== undefined && data.hierarchyDataIdArr !== "") {
            let uniqueIdArr = [];
            if (Array.isArray(data.hierarchyDataIdArr) === true) {
                if (data.hierarchyDataIdArr.length > 0) {
                    uniqueIdArr = await commonmodel.getAllNodeByLeafId(data)

                    for (let i = 0; i < data.hierarchyDataIdArr.length; i++) {
                        uniqueIdArr.push(data.hierarchyDataIdArr[i].hierarchyDataId)
                    }
                }
            }

            data.allZones = uniqueIdArr;

            if(data.allZones !== undefined && data.allZones.length > 0){

               let getUsersOfTheLocationsData = await dao.getUsersOfTheLocations(data);

               if(getUsersOfTheLocationsData && getUsersOfTheLocationsData.length > 0){

                    for(let u =0; u<getUsersOfTheLocationsData.length;u++){

                        getUsersOfTheLocations.push(getUsersOfTheLocationsData[u].userId)
                    }
               }
            }
        }

        data.getUsersOfTheLocations = getUsersOfTheLocations

        let allEmployeeArr = await dao.getusersDataListData(data);

        if(allEmployeeArr){

            if(allEmployeeArr.length > 0){

                let distinctParentUserIds = getDistinctIdsAllTypes(allEmployeeArr, 'parentUserId')

                let allParents = []

                if(distinctParentUserIds.length > 0){

                    allParents = await dao.getAllParentsOfUser(distinctParentUserIds)
                }

                for(let i = 0;i<allEmployeeArr.length;i++){

                    if(allEmployeeArr[i].parentUserId != null || allEmployeeArr[i].parentUserId != 0 || allEmployeeArr[i].parentUserId != "0"){

                        let manager = ''

                        if(allParents.length > 0){

                            manager = searchIdData(allParents, allEmployeeArr[i].parentUserId, 'parentUserId')

                            if(manager != null){

                               allEmployeeArr[i]['ReportingManager'] =  manager['parentUserName']

                            }else{

                                allEmployeeArr[i]['ReportingManager'] = ""
                            }
                        }else{

                            allEmployeeArr[i]['ReportingManager'] = ""
                        }

                    }else{

                        allEmployeeArr[i]['ReportingManager'] = ""
                    }

                }

            }

            return { success: true, status: util.statusCode.SUCCESS, message: '', response: await util.encryptResponse(allEmployeeArr) }

        }else{

            return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null }
        }

    } catch (e) {
        return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null }
    }
}



// const userDataDownloadProcess = async (partyCode, clientId, accountCode) => {
//     try {

//         return true

//     } catch (e) {
//         util.createLog(e);
//         return false;
//     }
// }

async function userDataDownloadProcess(data, respDwnldPrcessId) {
// const userDataDownloadProcess = async (data, respDwnldPrcessId) => {
    try{

        let getUsersOfTheLocations = []
        let finalDownloadList = []

        if (data.hierarchyDataIdArr !== undefined && data.hierarchyDataIdArr !== "") {
            let uniqueIdArr = [];
            if (Array.isArray(data.hierarchyDataIdArr) === true) {
                if (data.hierarchyDataIdArr.length > 0) {
                    uniqueIdArr = await commonmodel.getAllNodeByLeafId(data)

                    for (let i = 0; i < data.hierarchyDataIdArr.length; i++) {
                        uniqueIdArr.push(data.hierarchyDataIdArr[i].hierarchyDataId)
                    }
                }
            }

            data.allZones = uniqueIdArr;

            if(data.allZones !== undefined && data.allZones.length > 0){

               let getUsersOfTheLocationsData = await dao.getUsersOfTheLocations(data);

               if(getUsersOfTheLocationsData && getUsersOfTheLocationsData.length > 0){

                    for(let u =0; u<getUsersOfTheLocationsData.length;u++){

                        getUsersOfTheLocations.push(getUsersOfTheLocationsData[u].userId)
                    }
               }
            }
        }

        data.getUsersOfTheLocations = getUsersOfTheLocations;

        let allEmployeeArr = await dao.getusersDataListData(data);

        if(allEmployeeArr && allEmployeeArr.length > 0){

            let distinctParentUserIds = getDistinctIdsAllTypes(allEmployeeArr, 'parentUserId')

            let distinctUserIds = getDistinctIdsAllTypes(allEmployeeArr, 'userId')

            let allParents = []

            if(distinctParentUserIds.length > 0){

                allParents = await dao.getAllParentsOfUser(distinctParentUserIds)
            }

            let allUserLOcations = []

            if(distinctUserIds.length > 0){

                allUserLOcations = await dao.getLocationDataConcatenate_gnUsers(distinctUserIds,data.clientId)
            }

            for (let i = 0; i < allEmployeeArr.length; i++) {
                let obj = {};
                obj['Employee Name'] = allEmployeeArr[i].userName;
                obj['ERP Id'] = allEmployeeArr[i].cmpERPcode;
                obj['Phone'] = allEmployeeArr[i].phone;
                obj['Email'] = allEmployeeArr[i].email;
                obj['Username'] = allEmployeeArr[i].loginUsername;

                if(data.clientId == "7" || data.clientId == "11"){

                    if(allEmployeeArr[i].empType != null || allEmployeeArr[i].empType != ""){

                        if(allEmployeeArr[i].empType != "MT"){

                           obj['Employee Type'] = "GT"

                        }else{

                            obj['Employee Type'] = allEmployeeArr[i].empType;
                        }
                    }else{

                        obj['Employee Type'] = allEmployeeArr[i].empType;
                    }


                }
                // else{

                //     obj['Employee Type'] = allEmployeeArr[i].empType;
                // }

                obj['Designation'] = allEmployeeArr[i].designationName;
                obj['Date of joining'] = allEmployeeArr[i].dateOfJoining;
                obj['Registered On(Cliky)'] = allEmployeeArr[i].createDate;
                obj['Registered By'] = allEmployeeArr[i].createdByUserName;

                if(allEmployeeArr[i].parentUserId != null || allEmployeeArr[i].parentUserId != 0 || allEmployeeArr[i].parentUserId != "0"){

                    let manager = ''

                    if(allParents.length > 0){

                        manager = searchIdData(allParents, allEmployeeArr[i].parentUserId, 'parentUserId')

                        if(manager != null){

                           obj['Reporting Manager'] =  manager['parentUserName']

                        }else{

                            obj['Reporting Manager'] = ""
                        }
                    }else{

                        obj['Reporting Manager'] = ""
                    }

                }else{

                    obj['Reporting Manager'] = ""
                }



                if(data.clientId == "7" || data.clientId == "11"){

                    obj['HQ'] = allEmployeeArr[i].address;

                }else{

                    obj['Address'] = allEmployeeArr[i].address;
                }

                if(allEmployeeArr[i].isActive == 1){

                   obj['Role'] = allEmployeeArr[i].roleName;
                   obj['Status'] = "Active";

                }else{

                    obj['Date of leaving'] = allEmployeeArr[i].modifiedAt;
                    obj['Status'] = "Inactive";  
                }

                let hmUpperNodesObj = {};

                if(allUserLOcations.length > 0){

                    let userLocations = searchIdData(allUserLOcations, allEmployeeArr[i].userId, 'userId')

                    if(userLocations != null){

                        let usrLocArr = []

                        usrLocArr.push({"hierarchyDataId":userLocations['hierarchyDataId']})

                        let userEmpLocs = await hierearchyUtil.setUpperLevelData(usrLocArr, data.clientId, "L", "hierarchyDataId", true)

                        hmUpperNodesObj = userEmpLocs[0].hmUpperNodes
                    }
                }


                if (hmUpperNodesObj !== undefined) {

                    if (Object.keys(hmUpperNodesObj).length > 0) {

                        let hmUpperNodesObjKeys = Object.keys(hmUpperNodesObj)

                        for (let h = 0; h < hmUpperNodesObjKeys.length; h++) {

                            obj["" + hmUpperNodesObjKeys[h] + ""] = hmUpperNodesObj["" + hmUpperNodesObjKeys[h] + ""]

                        }

                    }

                }

                finalDownloadList.push(obj);
            }
        }

        let downloadPath = await util.generateExcel_v2(finalDownloadList);

        if(downloadPath){

            let updateDownloadedFile = await commondao.updateIntoClientDownloadProcessListV4(downloadPath, respDwnldPrcessId)
        }

        return true;

    } catch (e){

        return false;
    }

}

module.exports.getusersDataList_download = async (data) => {
    try {
        data.isDownload = '1';
        let respDwnldPrcessId = 0

        let currentDate = '';

        if (data.currentDateTime === undefined || data.currentDateTime == "" || data.currentDateTime == null) {
            currentDate = new Date();
        
        }else{
            currentDate = new Date(data.currentDateTime)
        }

        let currentYear = currentDate.getFullYear();
        let currentMonth = ("0" + (currentDate.getMonth() + 1)).slice(-2);
        let day = ("0" + currentDate.getDate()).slice(-2);

        let timeHours = ("0" + currentDate.getHours()).slice(-2);
        let timeMinutes = ("0" + currentDate.getMinutes()).slice(-2);
        let seconds = ("0" + currentDate.getSeconds()).slice(-2);

        data.todayDateTime = currentYear + '-' + currentMonth + '-' + day + ' ' + timeHours + ':' + timeMinutes + ':' + seconds;
        data.todayDate = currentYear + '-' + currentMonth + '-' + day;


        respDwnldPrcessId = await commondao.addIntoClientDownloadProcessListV4(data.clientId, data.userId, "Employee Master", data.todayDateTime, data.moduleType, data);

        // let donwResp = await userDataDownloadProcess(data, respDwnldPrcessId);
        let donwResp = userDataDownloadProcess(data, respDwnldPrcessId);

        return { success: true, status: util.statusCode.SUCCESS, message: 'Download Processing..', response: null }
    } catch (e) {
        return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null }
    }
}


module.exports.OLDgetusersDataList_download = async (data) => {
    try {
        // console.log("======================================================>>>>")
        data.isDownload = '1';
        let allEmployeeArr = await dao.getusersDataListData(data);

        let distinctParentUserIds = getDistinctIds(allEmployeeArr)



        let allParents = []

        if(distinctParentUserIds.length > 0){

            allParents = await dao.getAllParentsOfUser(distinctParentUserIds)
        }

        let finalArray = [];
        for (let i = 0; i < allEmployeeArr.length; i++) {
            let obj = {};
            obj['Employee Name'] = allEmployeeArr[i].userName;
            obj['ERP Id'] = allEmployeeArr[i].cmpERPcode;
            obj['Phone'] = allEmployeeArr[i].phone;
            obj['Email'] = allEmployeeArr[i].email;
            obj['Username'] = allEmployeeArr[i].loginUsername;

            if(data.clientId == "7" || data.clientId == "11"){

                if(allEmployeeArr[i].empType != null || allEmployeeArr[i].empType != ""){

                    if(allEmployeeArr[i].empType != "MT"){

                       obj['Employee Type'] = "GT"

                    }else{

                        obj['Employee Type'] = allEmployeeArr[i].empType;
                    }
                }else{

                    obj['Employee Type'] = allEmployeeArr[i].empType;
                }


            }else{

                obj['Employee Type'] = allEmployeeArr[i].empType;
            }

            obj['Designation'] = allEmployeeArr[i].designationName;
            obj['Date of joining'] = allEmployeeArr[i].dateOfJoining;
            obj['Registered On(Cliky)'] = allEmployeeArr[i].createDate;
            obj['Registered By'] = allEmployeeArr[i].createdByUserName;

            if(allEmployeeArr[i].parentUserId != null || allEmployeeArr[i].parentUserId != 0 || allEmployeeArr[i].parentUserId != "0"){

                let manager = ''

                if(allParents.length > 0){

                    manager = searchId(allParents, allEmployeeArr[i].parentUserId)

                    if(manager != null){

                       obj['Reporting Manager'] =  manager['parentUserName']

                    }else{

                        obj['Reporting Manager'] = ""
                    }
                }else{

                    obj['Reporting Manager'] = ""
                }

            }else{

                obj['Reporting Manager'] = ""
            }



            if(data.clientId == "7" || data.clientId == "11"){

                obj['HQ'] = allEmployeeArr[i].address;

            }else{

                obj['Address'] = allEmployeeArr[i].address;
            }

            if(allEmployeeArr[i].isActive == 1){

               obj['Role'] = allEmployeeArr[i].roleName;
               obj['Status'] = "Active";

            }else{

                obj['Date of leaving'] = allEmployeeArr[i].modifiedAt;
                obj['Status'] = "Inactive";  
            }

            // if(data.isActive !== undefined && data.isActive !=null && data.isActive != ''){

            //     if(data.isActive =='1'){

            //         obj['Role'] = allEmployeeArr[i].roleName;  
            //     }else{

            //         obj['Date of leaving'] = allEmployeeArr[i].modifiedAt
            //     }

            // }else{

            //     obj['Role'] = allEmployeeArr[i].roleName;
            // }

            // if(data.tableHeader !== undefined && data.tableHeader != null && data.tableHeader != '' && data.tableHeader.length > 0 && Array.isArray(data.tableHeader)){
            //     let mod_respObj = {};

            //     for(let k=0;k<data.tableHeader.length;k++){

            //         for(const keyM of Object.keys(obj)){

            //             if(data.tableHeader[k] == keyM){

            //                 mod_respObj[keyM] = obj[keyM];
            //             }

            //         }
            //     }
            //     finalArray.push(mod_respObj);
                
            // }else{

            //     finalArray.push(obj);
                
            // }

            finalArray.push(obj);
        }

        let path = await util.generateExcel_v2(finalArray);

        if(path){
            commondao.addIntoClientDownloadListV2(data.clientId,data.userId,path,'Employee Master',data.currentDateTime,data.moduleType);
        }
        return { success: true, status: util.statusCode.SUCCESS, message: '', response: '' }
    } catch (e) {

        return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null }
    }
}

module.exports.getusersDataListV2 = async (data) => {
    try {

        let designationList = await dao.getusersDataList(data);
        return { success: true, status: util.statusCode.SUCCESS, message: '', response: await util.encryptResponse(designationList) }
    } catch (e) {
        return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null }
    }
}


module.exports.getReqUserDetails = async (data) => {
    try {
        let designationList = await dao.getReqUserDetails(data);
        return { success: true, status: util.statusCode.SUCCESS, message: '', response: await util.encryptResponse(designationList) }
    } catch (e) {
        return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null }
    }
}

module.exports.getReqUserDetailsV2 = async (data) => {
    try {

        let empData = await dao.getReqUserDetailsV3(data);



        let locationData = [];

        if (empData[0].userPermission == 1) {

            // locationData = await dao.getLocationData(empData[0].userId, data.clientId, "user");
            locationData = await dao.getLocationData_gn(empData[0].userId, data.clientId, "user");

            if(empData[0].parentUserId != null && empData[0].parentUserId != '' && empData[0].parentUserId != 0 && empData[0].parentUserId != "0"){

                parentUserNameData = await dao.getUserNameById(empData[0].parentUserId, data.clientId);

                empData[0].parentUserName = parentUserNameData.parentUserName;
                empData[0].parentUserId = parentUserNameData.parentUserId;
                empData[0].parentDesignationName = parentUserNameData.designationName;
                empData[0].parentDesignationId = parentUserNameData.designationId;
            }else{

                empData[0].parentUserName = "NA";
                empData[0].parentUserId = "0";
                empData[0].parentDesignationName = "NA";
                empData[0].parentDesignationId = "0";
            }

            empData[0].mappedProductDivisions = await dao.getMappedProductDivisions(empData[0].userId, data.clientId, "user")



        } else {

            // locationData = await dao.getLocationData(data.userCId, data.clientId, "clientUser");
            locationData = await dao.getLocationData_gn(data.userCId, data.clientId, "clientUser");

            empData[0].parentUserName = "NA";
            empData[0].parentUserId = "0";
            empData[0].parentDesignationName = "NA";
            empData[0].parentDesignationId = "0";

            empData[0].mappedProductDivisions = [];

        }
        empData[0].locationData = locationData;

        return { success: true, status: util.statusCode.SUCCESS, message: '', response: await util.encryptResponse(empData) }
    } catch (e) {

        return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null }
    }
}

module.exports.addUserActivityList = async (data) => {
    try {

        let resp = await dao.addUserActivityList(data)

        if (resp) {

            return { success: true, status: util.statusCode.SUCCESS, message: 'User Activity added successfully', response: null }
        }
        else {
            return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null }

        }

    } catch (e) {
        return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null }
    }
}

module.exports.getUserActivitiesList = async (data) => {
    try {

        if (data.type == 'up') {

            let activityListData_up = await dao.getUserActivitiesListData_upcoming(data)
            if (activityListData_up) {
                return { success: true, status: util.statusCode.SUCCESS, message: '', response: await util.encryptResponse({ "activityListData": activityListData_up }) }

            } else {
                return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null }
            }

        } else if (data.type == 'past') {

            let activityListData_past = await dao.getUserActivitiesListData_past(data)
            if (activityListData_past) {
                return { success: true, status: util.statusCode.SUCCESS, message: '', response: await util.encryptResponse({ "activityListData": activityListData_past }) }

            } else {
                return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null }
            }

        } else {
            return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null }
        }

    } catch (e) {
        return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null }
    }
}


module.exports.getDetailUserActivityList = async (data) => {
    try {
        let activityListData = await dao.getDetailUserActivityListData(data)
        if (activityListData) {
            return { success: true, status: util.statusCode.SUCCESS, message: '', response: await util.encryptResponse(activityListData) }
        } else {
            return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null }
        }
    } catch (e) {
        return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null }
    }
}


module.exports.updateUserActivityStatusList = async (data) => {
    try {
        let deleted = ''
        let completed = ''



        if (data.activityStatus == '') {
            let updateActivityStatus = await dao.updateUserActivity(data)

            if (updateActivityStatus) {
                return { success: true, status: util.statusCode.SUCCESS, message: 'Activity status Updated', response: null }

            } else {
                return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null }

            }

        } else if (data.completeStatus == '') {

            let deleteActivityStatus = await dao.deleteUserActivity(data)

            if (deleteActivityStatus) {
                return { success: true, status: util.statusCode.SUCCESS, message: 'Activity Deleted', response: null }

            } else {
                return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null }
            }

        } else {
            return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null }

        }

    } catch (e) {
        return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null }
    }
}


module.exports.changeUserStatus = async (data) => {
    try {
        let delStatusData = await dao.changeUserStatus(data)

        if (delStatusData) {

            let empTableStatus = await dao.getIfeMPExsist(data)

            if (empTableStatus.length > 0) {

                let empTableUpdateStatus = await dao.changeUserEmpStatus(data)

                if (empTableUpdateStatus) {
                    return { success: true, status: util.statusCode.SUCCESS, message: 'User Updated', response: null }
                }

            } else {
                return { success: true, status: util.statusCode.SUCCESS, message: 'User Updated', response: null }

            }

        } else {
            return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null }
        }
    } catch (e) {
        return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null }
    }
}





module.exports.deleteUserStatus = async (data) => {
    try {
        let delStatusData = await dao.deleteUserMod(data)

        let finalDate = '';
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth();
        let day = date.getDate();

        let timeHours = date.getHours();
        let timeMinutes = date.getMinutes();
        let seconds = date.getSeconds();
        if (seconds < 10) {
            finalDate = year + '-' + month + '-' + day + ' ' + timeHours + ':' + timeMinutes + ':0' + seconds
        }
        else {
            finalDate = year + '-' + month + '-' + day + ' ' + timeHours + ':' + timeMinutes + ':' + seconds
        }

        // let delStatusData = true;
        let getCurrentFinYrId = await dao.getfinancialyearDetail(data, finalDate)
        let companyGamificationSetting = 1;




        if (delStatusData) {

            let empTableStatus = await dao.getIfeMPExsist(data)

            if (empTableStatus.length > 0) {

                let empTableUpdateStatus = await dao.deleteUserEmp(data)

                if (empTableUpdateStatus) {

                    if (companyGamificationSetting == 1) {

                        let chkExistingUserinGamificationuserConfigId = await dao.chkExistingUserinGamificationuserConfig(empTableStatus[0].empId, data.clientId, getCurrentFinYrId);

                        if (chkExistingUserinGamificationuserConfigId != 0) {

                            let delgamificationid = await dao.deletegamificationid(data, chkExistingUserinGamificationuserConfigId, finalDate);

                            // let deletePointsLogData = await dao.deletePointsLogData

                        }
                    }

                    return { success: true, status: util.statusCode.SUCCESS, message: 'Employee Deleted', response: null }
                }

            } else {
                return { success: true, status: util.statusCode.SUCCESS, message: 'Employee Deleted', response: null }

            }

        } else {
            return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null }
        }
    } catch (e) {

        return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null }
    }
}


module.exports.download = async (data) => {
    try {
        let userList = await dao.getusersDataDownload(data);
        let path = await util.generateCsv(userList);
        let excelPath = await util.generateExcel(userList);
        if (path) {
            return { success: true, status: util.statusCode.SUCCESS, message: 'File Generated', response: await util.encryptResponse({ "path": path, "excelPath": excelPath }) }
        } else {
            return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null }
        }
    } catch (e) {
        return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null }
    }
}


module.exports.getModuleWiseConfigData = async (data) => {
    try {
        let respModulesP = [];

        respModulesP = await dao.getAllModuleWiseData(data);

        let childArray = [];

        if (respModulesP.length > 0) {
            if (respModulesP.length > 0) {

                for (let i = 0; i < respModulesP.length; i++) {

                    if (data.roleId == '0' || data.roleId == '') {



                        respModulesP[i]['isView'] = false;
                        respModulesP[i]['addPem'] = false;
                        respModulesP[i]['editPem'] = false;
                        respModulesP[i]['deletePem'] = false;
                        respModulesP[i]['approvePem'] = false;
                        respModulesP[i]['commercialPem'] = false;

                    } else {

                        let getModulesPermissions = await dao.getModulePremissions(data, respModulesP[i]['moduleId']);


                        if (getModulesPermissions.length > 0) {


                            respModulesP[i]['isView'] = getModulesPermissions[0]['isView'] == 1 ? true : false;
                            respModulesP[i]['addPem'] = getModulesPermissions[0]['addPem'] == 1 ? true : false;
                            respModulesP[i]['editPem'] = getModulesPermissions[0]['editPem'] == 1 ? true : false;
                            respModulesP[i]['deletePem'] = getModulesPermissions[0]['deletePem'] == 1 ? true : false;
                            respModulesP[i]['approvePem'] = getModulesPermissions[0]['approvePem'] == 1 ? true : false;
                            respModulesP[i]['commercialPem'] = getModulesPermissions[0]['commercialPem'] == 1 ? true : false;

                        } else {

                            respModulesP[i]['isView'] = false;
                            respModulesP[i]['addPem'] = false;
                            respModulesP[i]['editPem'] = false;
                            respModulesP[i]['deletePem'] = false;
                            respModulesP[i]['approvePem'] = false;
                            respModulesP[i]['commercialPem'] = false;

                        }

                    }


                    childArray = await dao.getAllModuleWiseChildData(data, respModulesP[i]['moduleId'])

                    if (childArray.length > 0) {

                        for (let j = 0; j < childArray.length; j++) {

                            if (data.roleId == '0' || data.roleId == '') {

                                childArray[j]['isView'] = false;
                                childArray[j]['addPem'] = false;
                                childArray[j]['editPem'] = false;
                                childArray[j]['deletePem'] = false;
                                childArray[j]['approvePem'] = false;
                                childArray[j]['commercialPem'] = false;

                            } else {

                                let getModulesPermissionsChilds = await dao.getModulePremissions(data, childArray[j]['moduleId'])

                                if (getModulesPermissionsChilds.length > 0) {

                                    childArray[j]['isView'] = getModulesPermissionsChilds[0]['isView'] == 1 ? true : false;
                                    childArray[j]['addPem'] = getModulesPermissionsChilds[0]['addPem'] == 1 ? true : false;
                                    childArray[j]['editPem'] = getModulesPermissionsChilds[0]['editPem'] == 1 ? true : false;
                                    childArray[j]['deletePem'] = getModulesPermissionsChilds[0]['deletePem'] == 1 ? true : false;
                                    childArray[j]['approvePem'] = getModulesPermissionsChilds[0]['approvePem'] == 1 ? true : false;
                                    childArray[j]['commercialPem'] = getModulesPermissionsChilds[0]['commercialPem'] == 1 ? true : false;

                                } else {
                                    childArray[j]['isView'] = false;
                                    childArray[j]['addPem'] = false;
                                    childArray[j]['editPem'] = false;
                                    childArray[j]['deletePem'] = false;
                                    childArray[j]['approvePem'] = false;
                                    childArray[j]['commercialPem'] = false;

                                }


                            }

                        }

                    }

                    respModulesP[i]['childArray'] = childArray;

                }

            }


        }

        let respData = []

        respData.push({ "roleId": data.roleId, "clientId": data.clientId, "specificModuleId": data.specificModuleId, "moduleArr": respModulesP })

        // let respData = true;

        if (respModulesP.length > 0) {
            return { success: true, status: util.statusCode.SUCCESS, message: '', response: respData }
        } else {
            return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null }
        }
    } catch (e) {
        return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null }
    }
}



module.exports.saveModuleWiseConfig = async (data) => {
    try {
        let insertCout = 0;
        let isCustomer = '0';

        if(data.isCustomer !== undefined && data.isCustomer != null && data.isCustomer != '' && data.isCustomer == '1'){

            isCustomer = '1'
        }

        data.isCustomer = isCustomer;

        let delStatus = await dao.delUpdateModulePermission(data)

        if (delStatus) {

            for (let i = 0; i < data.moduleArr.length; i++) {


                let insertStatus = await dao.insertModulePermission(data.selectedRoleId, data.selectedClientId, data.userId, data.specificModuleId, data.isCustomer, data.moduleArr[i]);

                let childInsertCount = 0;

                if (insertStatus) {

                    if (data.moduleArr[i].childArray != []) {

                        for (let j = 0; j < data.moduleArr[i].childArray.length; j++) {

                            let insertChildStatus = await dao.insertModulePermission(data.selectedRoleId, data.selectedClientId, data.userId, data.specificModuleId, data.isCustomer, data.moduleArr[i].childArray[j]);

                            if (insertChildStatus) {

                                childInsertCount++;

                            }

                        }

                    }

                    if (childInsertCount == data.moduleArr[i].childArray.length) {

                        insertCout++;

                    }

                }

            }

        }

        if (insertCout == data.moduleArr.length) {

            return { success: true, status: util.statusCode.SUCCESS, message: 'Permission mapped successfully', response: null }


        } else {

            return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null }

        }


    } catch (e) {

        return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null }
    }
}



/**
 * @author : Sukanta Samanta
 * @date : 23/06/2023
 * @description : add NEW EMPLOYEE
 * @argument : clientId, roleId, userId
 * @returns : token
 */

module.exports.gn_addEmpUser = async (data) => {
    try {

        let date_ob = '';

        if (data.currentDateTime === undefined || data.currentDateTime == "" || data.currentDateTime == null) {
            
            date_ob = new Date();
        
        }else{
            date_ob = new Date(data.currentDateTime)
        }

        // let date_ob = new Date();

        let dateNow = ("0" + date_ob.getDate()).slice(-2);
        let monthNow = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        let yearNow = date_ob.getFullYear();
        let hoursNow = date_ob.getHours();
        let minutesNow = date_ob.getMinutes();
        let secondsNow = date_ob.getSeconds();

        let currentDateTime = yearNow + "-" + monthNow + "-" + dateNow + " " + hoursNow + ":" + minutesNow + ":" + secondsNow;

        data.currentDateTime = currentDateTime;

        if (data.lastName === undefined || data.lastName === null || data.lastName.length === 0) {
            data.lastName = null;
        }

        if (data.address === undefined || data.address === null || data.address.length === 0) {
            data.address = "N/A";
        }

        if (data.profileImgUrl === undefined || data.profileImgUrl === null || data.profileImgUrl.length === 0) {
            data.profileImgUrl = "/images/profileImage.png";
        }

        if (data.dob === undefined || data.dob === null || data.dob.length === 0) {
            data.dob = null;
        }

        if (data.gender === undefined || data.gender === null || data.gender.length === 0) {
            data.gender = null;
        }

        if (data.dateOfJoin === undefined || data.dateOfJoin === null || data.dateOfJoin.length === 0) {
            data.dateOfJoin = null;
        }

        if (data.remark === undefined || data.remark === null || data.remark.length === 0) {
            data.remark = "N/A";
        }
        if (data.erpCode === undefined || data.erpCode === null || data.erpCode === "") {
            data.erpCode = null;
        }

        data.countryId = 0;
        data.stateId = 0;
        data.cityId = 0;
        data.districtId = 0;
        data.zoneId = 0;

        let finalDate = '';
        let date = new Date();
        let year = date.getFullYear();

        let month = date.getMonth();

        let day = date.getDate();

        let timeHours = date.getHours();

        let timeMinutes = date.getMinutes();

        let seconds = date.getSeconds();

        if (seconds < 10) {
            finalDate = year + '-' + month + '-' + day + ' ' + timeHours + ':' + timeMinutes + ':0' + seconds;
        } else {
            finalDate = year + '-' + month + '-' + day + ' ' + timeHours + ':' + timeMinutes + ':' + seconds;
        }

        let companyGamificationSetting = 1;

        let linsenseLimit0 = await dao.getUserLimitCompany(data);
        let linsensedUser0 = await dao.getUserCountForLisense(data);

        let linsenseLimit = linsenseLimit0.length > 0 ? linsenseLimit0[0].settingsValue : '0';
        let linsensedUser = linsensedUser0.length > 0 ? linsensedUser0[0].userCount : '0';

        let phoneNumber = data.phoneNumber.join(",");
        data.phoneNumber = phoneNumber;

        let respCilentUserId = await dao.gn_addClientUsers(data);
        for (let i = 0; i < data.locationData.length; i++) {
            await commondao.addGenericClientLocationNotUpdateClieniSepcs(data, data.locationData[i], respCilentUserId, 'clientUser');
        }

        if (linsenseLimit > linsensedUser) {
            if (respCilentUserId) {
                if (data.userEmpPermit == '1') {
                    data['password'] = "password";   // set default password
                    data['password'] = util.passwordHash(data['password']);
                    let UserId = await dao.addUsersV2(data, respCilentUserId);
                    if (data.lattitude !== undefined && data.longitude !== undefined) {
                        await commondao.addLocationActivity(data, UserId, 'user');
                    }
                    for (let i = 0; i < data.locationData.length; i++) {
                        await commondao.addGenericClientLocationNotUpdateClieniSepcs(data, data.locationData[i], UserId, 'user');
                    }
                    let updateMainUserTable = await dao.updateUserMap(data, UserId, respCilentUserId);

                    if (updateMainUserTable) {
                        if (companyGamificationSetting == 1) {
                            let minlevelid = await dao.minlevelid(data);
                            let financialyearId = await dao.getfinancialyearDetail(data, finalDate);
                            await dao.adduseringamificationuserconfig(data, UserId, financialyearId, minlevelid[0].levelId);
                            await dao.dataAddIntoPointsLog(data, UserId);
                        }
                        return { success: true, status: util.statusCode.SUCCESS, message: 'User added successfully', response: { "clientUserId": respCilentUserId } };
                    } else {
                        return { success: false, status: util.statusCode.INTERNAL, message: 'Error during adding client user map', response: null };
                    }
                } else {
                    return { success: true, status: util.statusCode.SUCCESS, message: 'User added successfully', response: { "clientUserId": respCilentUserId } };
                }
            } else {
                return { success: false, status: util.statusCode.INTERNAL, message: 'Error during adding client user map', response: null };
            }
        } else {
            return { success: true, status: util.statusCode.LICENCED_EXCEED, message: 'User linsense exceed for this company', response: { "clientUserId": respCilentUserId } };
        }
    } catch (e) {
        return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null };
    }
}


/**
 * @author : Sukanta Samanta
 * @date : 23/06/2023
 * @description : update EMPLOYEE
 * @argument : {}
 * @returns : token
 */
module.exports.gn_updateEmpUser = async (data) => {
    try {
        if (data.lastName == undefined || data.lastName == null || data.lastName == "") {
            data.lastName = null;
        }
        if (data.dob == undefined || data.dob == null || data.dob == "") {
            data.dob = null;
        }
        if (data.gender == undefined || data.gender == null || data.gender == "") {
            data.gender = null;
        }
        if (data.dateOfJoin == undefined || data.dateOfJoin == null || data.dateOfJoin == "") {
            data.dateOfJoin = null;
        }
        if (data.erpCode == undefined || data.erpCode == null || data.erpCode == "") {
            data.erpCode = null;
        }
        let finalDate = '';
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth();
        let day = date.getDate();

        let timeHours = date.getHours();
        let timeMinutes = date.getMinutes();
        let seconds = date.getSeconds();
        if (seconds < 10) {
            finalDate = year + '-' + month + '-' + day + ' ' + timeHours + ':' + timeMinutes + ':0' + seconds;
        } else {
            finalDate = year + '-' + month + '-' + day + ' ' + timeHours + ':' + timeMinutes + ':' + seconds;
        }
        let companyGamificationSetting = 1;
        let getCurrentFinYrId = await dao.getfinancialyearDetail(data, finalDate);
        let minlevelid = await dao.minlevelid(data);
        let linsenseLimit0 = await dao.getUserLimitCompany(data);
        let linsensedUser0 = await dao.getUserCountForLisense(data);
        let linsenseLimit = linsenseLimit0[0].settingsValue;
        let linsensedUser = linsensedUser0[0].userCount;
        let phoneNumber = data.phoneNumber.join(",");
        data.phoneNumber = phoneNumber;
        data.countryId = 0;
        data.stateId = 0;
        data.cityId = 0;
        data.districtId = 0;
        data.zoneId = 0;
        if (data.userEmpPermit == '1') {
            if (linsenseLimit > linsensedUser) {
                let empTableStatus = await dao.getIfeMPExsist(data);
                if (empTableStatus.length > 0) {
                    try {
                        await dao.updateClientUsersV2(data);
                        await dao.deleteEmployeeLocationData(data.userCId, 'clientUser', data);
                        for (let i = 0; i < data.locationData.length; i++) {
                            await commondao.addGenericClientLocationNotUpdateClieniSepcs(data, data.locationData[i], data.userCId, 'clientUser');
                        }
                        await dao.updateUsersV2(data, empTableStatus[0].empId);
                        // ================================for gamification config ===================================
                        if (companyGamificationSetting == 1) {
                            let chkExistingUserinGamificationuserConfigId = await dao.chkExistingUserinGamificationuserConfig(empTableStatus[0].empId, data.clientId, getCurrentFinYrId);
                            if (chkExistingUserinGamificationuserConfigId != 0) {
                                // let updatedesignationId=await dao.updatedesignationId(getdesignationId[0].designationId,finalDate,data.userId,chkExistingUserinGamificationuserConfig[0].id);
                                await dao.updatedesignationIdForGamificationConfig(data, finalDate, getCurrentFinYrId, empTableStatus[0].empId, chkExistingUserinGamificationuserConfigId);
                            } else {
                                // let minlevelid=await dao.minlevelid(data);
                                await dao.adduseringamificationuserconfig(data, empTableStatus[0].empId, getCurrentFinYrId, minlevelid[0].levelId);
                                await dao.dataAddIntoPointsLog(data, empTableStatus[0].empId);
                            }
                        }
                        // ================================for gamification config ===================================
                        await dao.deleteEmployeeLocationData(empTableStatus[0].empId, 'user', data);
                        for (let j = 0; j < data.locationData.length; j++) {
                            // let updateClientLocationMapStatus = await dao.addEmployeelocation(data,data.locationData[i],data.userCId, 'user');
                            await commondao.addGenericClientLocationNotUpdateClieniSepcs(data, data.locationData[j], empTableStatus[0].empId, 'user');
                        }
                        await dao.updateUserMap(data, empTableStatus[0].empId, data.userCId);
                        return { success: true, status: util.statusCode.SUCCESS, message: 'User updated successfully', response: null };
                    } catch (e) {

                        return { success: false, status: util.statusCode.INTERNAL, message: 'Error occured while updating or re-adding existing user', response: null };
                    }
                } else {
                    try {
                        data['password'] = "password"; // set default password
                        data['password'] = util.passwordHash(data['password']);
                        await dao.updateClientUsersV2(data);
                        await dao.deleteEmployeeLocationData(data.userCId, 'clientUser', data);
                        for (let k = 0; k < data.locationData.length; k++) {
                            await commondao.addGenericClientLocationNotUpdateClieniSepcs(data, data.locationData[k], data.userCId, 'clientUser');
                        }
                        let userAddId = await dao.addUsersV2(data, data.userCId);
                        if (companyGamificationSetting == 1) {
                            // let minlevelid=await dao.minlevelid(data);
                            // let getfinancialyearDetail=await dao.getfinancialyearDetail(data,finalDate);
                            await dao.adduseringamificationuserconfig(data, userAddId, getCurrentFinYrId, minlevelid[0].levelId);
                            await dao.dataAddIntoPointsLog(data, empTableStatus[0].empId);
                        }
                        for (let l = 0; l < data.locationData.length; l++) {
                            await commondao.addGenericClientLocationNotUpdateClieniSepcs(data, data.locationData[l], userAddId, 'user');
                        }
                        await dao.updateUserMap(data, userAddId, data.userCId);
                        return { success: true, status: util.statusCode.SUCCESS, message: 'User updated successfully', response: null };
                    } catch (e) {

                        return { success: false, status: util.statusCode.INTERNAL, message: 'Error occured while adding new user', response: null };
                    }
                }
            } else {
                return { success: false, status: util.statusCode.LICENCED_EXCEED, message: 'User linsense exceed for this company', response: null };
            }
        } else {
            let empTableStatus = await dao.getIfeMPExsist(data);
            if (empTableStatus.length > 0) {
                try {
                    await dao.deleteUserEmp(data);
                    if (companyGamificationSetting == 1) {
                        // let getCurrentFinYrId = await dao.getfinancialyearDetail(data, finalDate)
                        let chkExistingUserinGamificationuserConfigId = await dao.chkExistingUserinGamificationuserConfig(empTableStatus[0].empId, data.clientId, getCurrentFinYrId);
                        if (chkExistingUserinGamificationuserConfigId != 0) {
                            // let delgamificationid=await dao.deletegamificationid(empTableStatus[0].empId,data.clientId,data.userId, getCurrentFinYrId, finalDate);
                            await dao.deletegamificationid(data, chkExistingUserinGamificationuserConfigId, finalDate);
                        }
                    }

                    await dao.deleteEmployeeLocationData(empTableStatus[0].empId, 'user', data);
                    await dao.updateClientUsersV2(data);
                    await dao.deleteEmployeeLocationData(data.userCId, 'clientUser', data);
                    for (let m = 0; m < data.locationData.length; m++) {
                        await commondao.addGenericClientLocationNotUpdateClieniSepcs(data, data.locationData[m], data.userCId, 'clientUser');
                    }
                    await dao.deleteUserId(data);
                    return { success: true, status: util.statusCode.SUCCESS, message: 'User updated successfully', response: null };
                } catch (e) {
                    return { success: false, status: util.statusCode.INTERNAL, message: 'Error occured while revoking user linsense', response: null };
                }
            } else {
                try {
                    await dao.updateClientUsersV2(data);
                    await dao.deleteEmployeeLocationData(data.userCId, 'clientUser', data);
                    for (let n = 0; n < data.locationData.length; n++) {
                        await commondao.addGenericClientLocationNotUpdateClieniSepcs(data, data.locationData[n], data.userCId, 'clientUser');
                    }
                    return { success: true, status: util.statusCode.SUCCESS, message: 'User updated successfully', response: null };
                } catch (e) {

                    return { success: false, status: util.statusCode.INTERNAL, message: 'Error occured while updating client user', response: null };
                }
            }
        }
    } catch (e) {

        return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null };
    }
}


/**
 * @author : Sukanta Samanta
 * @date : 23/06/2023
 * @description : get EMPLOYEE details
 * @argument : {}
 * @returns : token
 */
module.exports.gn_getUserDetails = async (data) => {
    try {
        let empData = await dao.getReqUserDetailsV3(data);
        let locationData = [];
        if (empData[0].userPermission == 1) {
            locationData = await commondao.getLocationDataByTableName(empData[0].userId, data.clientId, "user");
        } else {
            locationData = await commondao.getLocationDataByTableName(empData[0].userId, data.clientId, "clientUser");
        }
        let newArr = [];
        if (locationData.length > 0) {
            for (let m = 0; m < locationData.length; m++) {
                newArr.push(await hierearchyUtil.getUpperNodeByLeafId("L", data.clientId, locationData[m].mstHierarchyTypeId, locationData[m].hierarchyDataId));
            }
        }
        empData[0]["locationData"] = newArr;
        return { success: true, status: util.statusCode.SUCCESS, message: '', response: await util.encryptResponse(empData) };
    } catch (e) {
        return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null };
    }
}

/**
 * @author : Prosenjit Paul
 * @date : 28/11/2023
 * @description : add new User 
 * @argument : {}
 * @returns :
 */


module.exports.addUser = async (data)=>{
    try{
        if (data.firstName === undefined || data.firstName === null || data.firstName.length === 0) {
            data.firstName = null;
        }

        if (data.lastName === undefined || data.lastName === null || data.lastName.length === 0) {
            data.lastName = null;
        }

        if (data.address === undefined || data.address === null || data.address.length === 0) {
            data.address = "N/A";
        }

        if (data.profileImgUrl === undefined || data.profileImgUrl === null || data.profileImgUrl.length === 0) {
            data.profileImgUrl = "/images/profileImage.png";
        }

        if (data.dob === undefined || data.dob === null || data.dob.length === 0) {
            data.dob = null;
        }

        if (data.gender === undefined || data.gender === null || data.gender.length === 0) {
            data.gender = null;
        }

        if (data.dateOfJoin === undefined || data.dateOfJoin === null || data.dateOfJoin.length === 0) {
            data.dateOfJoin = null;
        }

        if (data.remark === undefined || data.remark === null || data.remark.length === 0) {
            data.remark = "N/A";
        }
        if (data.erpCode === undefined || data.erpCode === null || data.erpCode === "") {
            data.erpCode = 0 ;
        }

        const createdBy = await dao.getUserType(data);

        data.createdBy = createdBy.userId

        let emailExist = await dao.ifUserEmailExist(data);
        let phoneExist = await dao.ifUserPhoneExist(data);

        if(emailExist || phoneExist){
            return { success: true, status: util.statusCode.SUCCESS, message: 'User Already Exist', response: false };
        }else{

            const  respData = await dao.addUser_dao(data);

            if(respData){

                return { success: true, status: util.statusCode.SUCCESS, message: 'User added successfully', response: true };
            
            }else{
                
                return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null }
            }
        }
                
        // const  respData = await dao.addUser_dao(data);
        // if(respData){
        //     return { success: true, status: util.statusCode.SUCCESS, message: 'User added successfully', response: true };
        // }else{
        //     return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null }
        // }

    }catch(ex){

        return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null };
    }
}

module.exports.getModuleWiseConfigDataV2 = async (data) => {
    try {
        let respModulesP = [];

        respModulesP = await dao.getModuleWiseDataByAdmin(data, 0);

         //console.log("===================================>")
         //console.log(respModulesP)
         //console.log("===================================>")

        let childArray = [];

        if (respModulesP.length > 0) {

            for (let i = 0; i < respModulesP.length; i++) {

                if (data.roleId == '0' || data.roleId == '') {
                    respModulesP[i]['isView'] = false;
                    respModulesP[i]['addPem'] = false;
                    respModulesP[i]['editPem'] = false;
                    respModulesP[i]['deletePem'] = false;
                    respModulesP[i]['approvePem'] = false;
                    respModulesP[i]['commercialPem'] = false;

                } else {

                    let getModulesPermissions = await dao.getModulePremissions(data, respModulesP[i]['moduleId']);


                    if (getModulesPermissions.length > 0) {


                        respModulesP[i]['isView'] = getModulesPermissions[0]['isView'] == 1 ? true : false;
                        respModulesP[i]['addPem'] = getModulesPermissions[0]['addPem'] == 1 ? true : false;
                        respModulesP[i]['editPem'] = getModulesPermissions[0]['editPem'] == 1 ? true : false;
                        respModulesP[i]['deletePem'] = getModulesPermissions[0]['deletePem'] == 1 ? true : false;
                        respModulesP[i]['approvePem'] = getModulesPermissions[0]['approvePem'] == 1 ? true : false;
                        respModulesP[i]['commercialPem'] = getModulesPermissions[0]['commercialPem'] == 1 ? true : false;

                    } else {

                        respModulesP[i]['isView'] = false;
                        respModulesP[i]['addPem'] = false;
                        respModulesP[i]['editPem'] = false;
                        respModulesP[i]['deletePem'] = false;
                        respModulesP[i]['approvePem'] = false;
                        respModulesP[i]['commercialPem'] = false;

                    }

                }

                childArray = await dao.getModuleWiseDataByAdmin(data, respModulesP[i]['moduleId'])

                if (childArray.length > 0) {

                    for (let j = 0; j < childArray.length; j++) {

                        if (data.roleId == '0' || data.roleId == '') {

                            childArray[j]['isView'] = false;
                            childArray[j]['addPem'] = false;
                            childArray[j]['editPem'] = false;
                            childArray[j]['deletePem'] = false;
                            childArray[j]['approvePem'] = false;
                            childArray[j]['commercialPem'] = false;

                        } else {

                            let getModulesPermissionsChilds = await dao.getModulePremissions(data, childArray[j]['moduleId'])

                            if (getModulesPermissionsChilds.length > 0) {

                                childArray[j]['isView'] = getModulesPermissionsChilds[0]['isView'] == 1 ? true : false;
                                childArray[j]['addPem'] = getModulesPermissionsChilds[0]['addPem'] == 1 ? true : false;
                                childArray[j]['editPem'] = getModulesPermissionsChilds[0]['editPem'] == 1 ? true : false;
                                childArray[j]['deletePem'] = getModulesPermissionsChilds[0]['deletePem'] == 1 ? true : false;
                                childArray[j]['approvePem'] = getModulesPermissionsChilds[0]['approvePem'] == 1 ? true : false;
                                childArray[j]['commercialPem'] = getModulesPermissionsChilds[0]['commercialPem'] == 1 ? true : false;

                            } else {
                                childArray[j]['isView'] = false;
                                childArray[j]['addPem'] = false;
                                childArray[j]['editPem'] = false;
                                childArray[j]['deletePem'] = false;
                                childArray[j]['approvePem'] = false;
                                childArray[j]['commercialPem'] = false;

                            }
                        }

                    }

                }
                respModulesP[i]['childArray'] = childArray;
            }

        }else{

            respModulesP = await dao.getMainModulesDataByAdmin(data, 0)

            // console.log("0909")
            // console.log(respModulesP)
            // console.log("0909")

            if(respModulesP.length >0){

                for(let i=0;i<respModulesP.length;i++){

                    respModulesP[i]['isView'] = false;
                    respModulesP[i]['addPem'] = false;
                    respModulesP[i]['editPem'] = false;
                    respModulesP[i]['deletePem'] = false;
                    respModulesP[i]['approvePem'] = false;
                    respModulesP[i]['commercialPem'] = false;

                    let childArray = []

                    childArray = await dao.getChildModuleWiseDataByAdmin(data, respModulesP[i]['moduleId'])

                    if(childArray.length > 0){

                        for(let j=0;j<childArray.length;j++){

                            childArray[j]['isView'] = false;
                            childArray[j]['addPem'] = false;
                            childArray[j]['editPem'] = false;
                            childArray[j]['deletePem'] = false;
                            childArray[j]['approvePem'] = false;
                            childArray[j]['commercialPem'] = false;
                        }


                    }
                    respModulesP[i]['childArray'] = childArray;
                }
            }



        }

        let respData = []

        // console.log("==============>")
        // console.log(respModulesP)
        // console.log("==============>")

        respData.push({ "roleId": data.roleId, "clientId": data.clientId, "specificModuleId": data.specificModuleId, "moduleArr": respModulesP })

        // let respData = true;

        if (respModulesP.length > 0) {
            return { success: true, status: util.statusCode.SUCCESS, message: '', response: respData }
        } else {
            return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null }
        }
    } catch (e) {
        return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null }
    }
}

/**
 * @author : Prosenjit Paul
 * @date : 05/02/2024
 * @description : Simple excel file generate model
 * @argument : 
 * @returns
 */

module.exports.sampleExcel_model= async (data)=>{
    try{
        let moduleName ="UserUpload"
        let headers =['Role','First Name*',
                    'Last Name',
                    'Gender',
                    'Date Of Birth(YYYY/MM/DD)',
                    'Country Code*',
                    'Phone Number*',
                    'Email*',
                    'Designation*',
                    'Date Of Joining(YYYY/MM/DD)',
                    'Address*',
                    'ERP Code',
                    'Remarks',
                    'User Type*',
                    ]
        let getlocationLevel = await dao.EmployeeLocation(data);

        if(getlocationLevel.length !=0){

            for(let i=0;i<getlocationLevel.length;i++){
                headers.push(getlocationLevel[i].hmTypDesc+'*');
            }
            headers.push('Products');

            let generate_path =await util.generateHeaderExcel(headers,moduleName);
            return {success:true, message : "Success", path : generate_path }
        }else{
            return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null }
        }

    }catch(e){

        return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null }

    }
}

/**
 * @author : Prosenjit Paul
 * @date : 05/02/2024
 * @description : Upload Excel data modal
 * @argument : 
 * @returns
 */
function isObjectEmpty(obj) {
    for (const key in obj) {
      if (obj[key] !== null && obj[key] !== '') {
        return false;
      }
    }
    return true;
}
// module.exports.ExcelData_upload = async (data)=>{ commented 
//     try{
//         let actualPath = filePath + data.fileName;

//         const nameValidation = /^[a-zA-Z0-9_ \t\n]+$/;
//         const validPhoneNumber =  /^(\+\d{1,3}[- ]?)?\d{10}$/
//         const validEmail = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/
//         const dateValidation =/^\d{4}\/\d{2}\/\d{2}$/; 

//         var results = parser.parseXls2Json(actualPath);


//         function removeAsteriskFromKeys(obj) {
//             const newObj = {};
//             for (const key in obj) {
//                 const newKey = key.replace(/\*/g, '');
//                 const value = obj[key];
                
//                 if (newKey === 'Date_Of_Birth(YYYY/MM/DD)' || newKey === 'Date_Of_Joining(YYYY/MM/DD)') {
//                     newObj[newKey.replace(/\(.*\)/g, '')] = value.toString().trim();

//                 } else if (newKey === 'Products' && typeof value === 'string') {
//                     newObj[newKey] = value.split(',').map(product => product.trim()).filter(Boolean);
//                 } else {
//                     newObj[newKey] = typeof value === 'string' ? value.trim() : value.toString().trim();
//                 }
//             }
//             return newObj;
//         }

//         let result = results[0].map(removeAsteriskFromKeys);
//         result =  result.filter(obj => !isObjectEmpty(obj));

//         let date_ob = '';

//         if (data.currentDateTime=== undefined || data.currentDateTime == "" || data.currentDateTime == null) { 
//             date_ob = new Date();
//         }else{
//             date_ob = new Date(data.currentDateTime)
//         }
//         let date = ("0" + date_ob.getDate()).slice(-2);
//         let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
//         let year = date_ob.getFullYear();
//         let hours = date_ob.getHours();
//         let minutes = date_ob.getMinutes();
//         let seconds = date_ob.getSeconds();

//         let currentDateTime = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds
//         let currentDate = year + "-" + month + "-" + date;
//         let finalDate = year + '-' + month + '-' + date + ' ' + hours + ':' + minutes + ':' + seconds


//         data.currentDateTime = currentDateTime;

//         // if(data.moduleType !== undefined &&  data.moduleType != null && data.moduleType != '' && data.moduleType == 'companyadmin'){
            
//         //     data.moduleType = "companyadmin"

//         // }else{
//         //     data.moduleType = "SFA"
//         // }
        
//         if(data.moduleType !== undefined &&  data.moduleType != null && data.moduleType != ''){

//             if(data.moduleType =='superAdmin'){

//                 data.moduleType = "superAdmin"

//             }else if(data.moduleType =='companyadmin'){
                
//                 data.moduleType = "companyadmin"
//             }

//         }else{
//             data.moduleType = "SFA"
//         }

//         let finalRespArr = [];

//         for(let i=0; i<result.length;i++){
//             let userEmpPermit = 0
//             let role_id  = 0;
//             let designationId = 0
//             let locationData ;
//             let productData =[] ;
//             let empType ='';

//             if(result[i].Role !== undefined && result[i].Role != null && result[i].Role != ''){
//                 let getRole = await dao.getRoleId(data.clientId,result[i].Role);
//                 if(getRole != 0){
//                     role_id = getRole ;
//                     userEmpPermit = 1 ;
//                 }else{
//                     result[i].Comments ="Role Not Match"
//                     finalRespArr.push(result[i]);
//                     continue ;
//                 }
//             }

//             if(result[i].First_Name !== undefined && result[i].First_Name != undefined && result[i].First_Name != ''){

//                 if(! nameValidation.test(result[i].First_Name)){

//                     result[i].Comments =" '"+result[i].First_Name+"' Is Not A Valid First Name " 
//                     finalRespArr.push(result[i]);
//                     continue ;
//                 }
                
//                 if(result[i].Last_Name !== undefined && result[i].Last_Name != null && result[i].Last_Name != ''){

//                     if(! nameValidation.test(result[i].Last_Name)){

//                         result[i].Comments =" '"+result[i].Last_Name+"' Is Not A Valid Last Name " 
//                         finalRespArr.push(result[i]);
//                         continue ;
//                     }

//                     if(result[i].Phone_Number !== undefined && result[i].Phone_Number != null && result[i].Phone_Number != ''){

//                         if(validPhoneNumber.test(result[i].Phone_Number) && result[i].Phone_Number.length == 10){
                            
//                             if(userEmpPermit == 0){

//                                 let phoneExist_forClient = await dao.phoneExist_for_ClientUser(data.clientId, result[i].Phone_Number);

//                                 if(phoneExist_forClient.length != 0){
//                                     result[i].Comments ="Phone Number Already Exist"
//                                     finalRespArr.push(result[i]);
//                                     continue ;
//                                 }
//                             }else if(userEmpPermit ==1){

//                                 let phoneExist_forUser =await  dao.phoneExist_for_User(data.clientId, result[i].Phone_Number);

//                                 if(phoneExist_forUser.length !=0){

//                                     result[i].Comments ="Phone Number Already Exist"
//                                     finalRespArr.push(result[i]);
//                                     continue ;
//                                 }
//                             }
                            

//                         }else{
//                             result[i].Comments ='Employee Phone No "'+  result[i].Phone_Number+'" '+" Is Not A Valid Phone Number"
//                             finalRespArr.push(result[i]);
//                             continue ;
//                         }
//                     }else{
//                         result[i].Comments ="Phone Number (Mandatory) Missing Into Uploaded Data" 
//                         finalRespArr.push(result[i]);
//                         continue ;
//                     }

//                 }else{
//                     result[i].Comments ="Last Name (Mandatory) Missing Into Uploaded Data" 
//                     finalRespArr.push(result[i]);
//                     continue ;
//                 }
//             }else{
//                 result[i].Comments ="First Name (Mandatory) Missing Into Uploaded Data" 
//                 finalRespArr.push(result[i]);
//                 continue ;
//             } 

//             if(result[i].Address !== undefined && result[i].Address != null && result[i].Address != ''){

//                 result[i].Address = result[i].Address;
//             }else{
//                 result[i].Comments ="Address (Mandatory) Missing Into Uploaded Data" 
//                 finalRespArr.push(result[i]);
//                 continue ;

//             }
//             if(result[i].Email !== undefined &&  result[i].Email != null && result[i].Email != ''){
                
//                 if(validEmail.test(result[i].Email)){
//                     if(userEmpPermit == 0){
                        
//                         let emailExist_forClient = await dao.checkEmailExist(data.clientId, result[i],'clientUser');
                       
//                         if(emailExist_forClient != 0){

//                             result[i].Comments ="Email Address Already Exist"
//                             finalRespArr.push(result[i]);
//                             continue ;
//                         }

//                     }else if(userEmpPermit ==1){

//                         let emailExist_forUser = await dao.checkEmailExist(data.clientId,result[i],'user')
                       
//                         if(emailExist_forUser != 0){

//                             result[i].Comments ="Email Address Already Exist"
//                             finalRespArr.push(result[i]);
//                             continue ;
//                         }
//                     }

//                 }else{
//                     result[i].Comments ='Email" '+result[i].Email+'" '+" Is Not A Valid Email"
//                     finalRespArr.push(result[i])
//                     continue; 
//                 }
//             }else{

//                 result[i].Comments ="Email (Mandatory) Missing Into Uploaded Data" 
//                 finalRespArr.push(result[i]);
//                 continue ;
//             }

//             let loc_level = ""
//             let checkLocationLavel = await dao.get_locationLavels(data.clientId);
            
//             if(checkLocationLavel.length != 0){
//                 for(let l =0;l <checkLocationLavel.length; l++){
//                     if(result[i][checkLocationLavel[l].hmTypDesc] ==''){
//                         loc_level = checkLocationLavel[l].hmTypDesc;
//                         break;
//                     }
//                 }
//             }
//             if(loc_level != ""){
//                 result[i].Comments = ""+loc_level+" (Mandatory) Missing Into Uploaded Data"
//                 finalRespArr.push(result[i])
//                 continue;
//             }

//             if (result[i].Address !== undefined && result[i].Address != null && result[i].Address != '') {
//                 result[i].Address = result[i].Address;
//             }else{
//                 result[i].Address = null
//             }

//             if(result[i].Designation !== undefined  && result[i].Designation != null && result[i].Designation != ''){
//                 let getDesignation = await dao.UploadData_getdesignationId(data.clientId,result[i]);
//                 if(getDesignation != 0){

//                     designationId = getDesignation[0].designationId ;
//                 }else{
//                     result[i].Comments = "Designation Not Match"
//                     finalRespArr.push(result[i])
//                     continue;
//                 }
//             }else{

//                 result[i].Comments = "Designation (Mandatory) Missing Into Uploaded Data"
//                 finalRespArr.push(result[i])
//                 continue;

//             }
//             if (result[i].Date_Of_Joining !== undefined && result[i].Date_Of_Joining != null && result[i].Date_Of_Joining !='') {

//                 if(! dateValidation.test(result[i].Date_Of_Joining)){

//                     result[i].Comments = "Date Of Joining Is Not Valid Format. Follow (YYYY/MM/DD) Format"
//                     finalRespArr.push(result[i])
//                     continue;

//                 }
                
//             }else{
//                 result[i].Date_Of_Joining = null;
//             }
    
//             if (result[i].Gender == undefined || result[i].Gender == null || result[i].Gender =='') {
//                 data.Gender = null;
//             }
    
//             if (result[i].Date_Of_Birth !== undefined && result[i].Date_Of_Birth != null && result[i].Date_Of_Birth != '') {
                
//                 if(! dateValidation.test(result[i].Date_Of_Birth)){

//                     result[i].Comments = "Date Of Birth Is Not Valid Format. Follow (YYYY/MM/DD) Format"
//                     finalRespArr.push(result[i])
//                     continue;

//                 }

//             }else{
//                 result[i].Date_Of_Birth= null;
//             }
    
//             if (result[i].Remarks == undefined || result[i].Remarks== null || result[i].Remarks == '') {
//                 result[i].Remarks = "N/A";
//             }
//             if (result[i].ERP_Code == undefined || result[i].ERP_Code== null || result[i].ERP_Code == "") {
//                 result[i].ERP_Code= null;
//             }

//             if(result[i].User_Type !== undefined && result[i].User_Type != null && result[i].User_Type != ''){
//                 if(result[i].User_Type == "GT" || result[i].User_Type =="MT"){

//                     empType = result[i].User_Type
//                 }else{
//                     result[i].Comments = "User Type Not Match "
//                     finalRespArr.push(result[i])
//                     continue;
//                 }
//             }else{

//                 empType = "GT"
//             }

//             let getlocationLavels = await dao.locationLavels(data.clientId);

//             if(getlocationLavels.length > 0){
//                 for(let j=0;j< getlocationLavels.length;j++){

//                     let getLocationHierarchy = await dao.getLastLevelLocation(data.clientId,getlocationLavels[j].hierarchyTypeId , result[i][getlocationLavels[j].hmTypDesc]) 
                    
//                     if(getLocationHierarchy.length > 0){
//                         locationData = getLocationHierarchy
//                         break;
//                     }   
//                 }
//             }
         
//             if(result[i].Products !== undefined && result[i].Products != null && result[i].Products != ''){
                
//                 let getproductLavels = await dao.productLavels(data.clientId);

//                 if(getproductLavels.length > 0){
//                     for(let j = 0; j < result[i].Products.length; j++){

//                         let getProductHierarchy = await dao.getLastLevelProduct(data.clientId,getproductLavels[0].hierarchyTypeId , result[i].Products[j]) 
//                         if(getProductHierarchy.length > 0){

//                             productData.push(getProductHierarchy[0]);
//                         }
//                     }
//                 }   
//             }

//             let resObj ={
//                 "clientId":data.clientId,
//                 "userId":data.userId,
//                 "firstName" :result[i].First_Name,
//                 "lastName":result[i].Last_Name,
//                 "phoneNumber":result[i].Phone_Number,
//                 "email":result[i].Email,
//                 "address":result[i].Address,
//                 "remarks":result[i].Remarks,
//                 "dob":result[i].Date_Of_Birth,
//                 "erpCode" :result[i].ERP_Code,
//                 "dateOfJoin":result[i].Date_Of_Joining,
//                 "userEmpPermit" : userEmpPermit,
//                 "role_id":role_id,
//                 "designationId":designationId,
//                 "hierarchyDataIdArr":locationData,
//                 "productHierarchyDataIdArr":productData,
//                 "profileImgUrl":"/images/profileImage.png",
//                 "password":util.passwordHash('password'),
//                 "gender":result[i].Gender,
//                 "empType":empType,
//                 "countryId" : "0",
//                 "stateId" : "0",
//                 "cityId" :"0",
//                 "districtId": "0",
//                 "zoneId" : "0",
//                 "finalDate":finalDate
//             }

//             let companyGamificationSetting = await commondao.checkCompanyGamificationSettings(resObj.clientId)

//             let linsenseLimit0 = await dao.uploasData_getUserLimitCompany(resObj);
//             let linsensedUser0 = await dao.UploadData_getUserCountForLisense(resObj);

//             let linsenseLimit = linsenseLimit0[0].settingsValue
//             let linsensedUser = linsensedUser0[0].userCount

//             let getUserLoginSettingsValue = await commondao.checkCompanyLoginSettings(resObj.clientId)

//             if(getUserLoginSettingsValue != "0"){
    
//                 if(getUserLoginSettingsValue == "1"){
    
//                     resObj['username'] = resObj.phoneNumber;

//                 }else if(getUserLoginSettingsValue == "2"){
    
//                     resObj['username'] = resObj.email;
    
//                 }
//             }else{
    
//                 resObj['username'] = resObj.email;
//             }

//             let respCilentUserId = await dao.UploadData_addClientUsers(resObj);

//             for (let i = 0; i < resObj.hierarchyDataIdArr.length; i++) {

//                 let locationId = await dao.UploadData_addEmployeelocation(resObj, resObj.hierarchyDataIdArr[i], respCilentUserId, 'clientUser')
//             }

//             if (linsenseLimit > linsensedUser) {
//                 if (respCilentUserId) {

//                     if (resObj.userEmpPermit == '1') {
    
//                         let UserId = await dao.UploadData_addUsers(resObj, respCilentUserId);

//                         for (let i = 0; i < resObj.hierarchyDataIdArr.length; i++) {

//                             let locationId = await dao.UploadData_addEmployeelocation(resObj, resObj.hierarchyDataIdArr[i], UserId, 'user')
//                         }

//                         if(resObj.productHierarchyDataIdArr !== undefined && Array.isArray(resObj.productHierarchyDataIdArr) == true && resObj.productHierarchyDataIdArr.length > 0){

//                             for(let p = 0; p < resObj.productHierarchyDataIdArr.length ; p++){
    
//                                 let productMappedStatus = await dao.UploadData_insertProductEmpMapping(resObj, UserId, finalDate, resObj.productHierarchyDataIdArr[p]);
//                             }
//                         }

//                         let updateMainUserTable = await dao.updateUserData_Map(resObj, UserId, respCilentUserId);


//                         if (updateMainUserTable) {

//                             if (companyGamificationSetting == 1) {
//                                 let minlevelid = await dao.minlevelid_user(resObj.clientId);

//                                 let financialyearId = await dao.financialyearDetail_user(resObj, resObj.finalDate);
    
//                                 let adduseringamificationuserconfig = await dao.addingamificationuserconfig_user(resObj, UserId, financialyearId, minlevelid[0].levelId);


//                                 let addIntoPointsLog = await dao.dataAddIntoPointsLog_user(resObj, UserId)
    
//                             }
//                         }
//                     }
//                 }
//             }
//         }

//         if(finalRespArr.length > 0){

//             let downloadPath = await util.generateExcel_v2(finalRespArr);

//             if (downloadPath) {
//                 await commondao.addIntoClientDownloadListV2(data.clientId, data.userId, downloadPath, "Error During Employee Data Upload", data.currentDateTime, data.moduleType)   
//                 // return { success: true, status: util.statusCode.SUCCESS, message: 'Error during contact data upload', response:null}
//             }
//         }


//     }catch(e){

//         return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null }
//     }
// }


module.exports.ExcelData_upload = async (data)=>{
    try{
        let actualPath = filePath + data.fileName;

        const nameValidation = /^[a-zA-Z0-9_ \t\n]+$/;
        const validPhoneNumber =  /^(\+\d{1,3}[- ]?)?\d{10}$/
        const validEmail = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/
        const dateValidation =/^\d{4}\/\d{2}\/\d{2}$/; 
        const countryCodeValidation = /^\+?\d{1,4}$/;

        var results = parser.parseXls2Json(actualPath);


        function removeAsteriskFromKeys(obj) {
            const newObj = {};
            for (const key in obj) {
                const newKey = key.replace(/\*/g, '');
                const value = obj[key];
                
                if (newKey === 'Date_Of_Birth(YYYY/MM/DD)' || newKey === 'Date_Of_Joining(YYYY/MM/DD)') {
                    newObj[newKey.replace(/\(.*\)/g, '')] = value.toString().trim();

                }else if (newKey === 'Phone_Number') {
                    // newObj['Phone_Number'] = value.split(',').map(num => num.toString().trim());
                    newObj['Phone_Number'] = value.toString().split(',').map(num => { return num.toString().trim();});

                } else if (newKey === 'Products' && typeof value === 'string') {
                    newObj[newKey] = value.split(',').map(product => product.trim()).filter(Boolean);

                } else {
                    newObj[newKey] = typeof value === 'string' ? value.trim() : value.toString().trim();
                }
            }
            return newObj;
        }

        let result = results[0].map(removeAsteriskFromKeys);
        result =  result.filter(obj => !isObjectEmpty(obj));


        let date_ob = '';

        if (data.currentDateTime=== undefined || data.currentDateTime == "" || data.currentDateTime == null) { 
            date_ob = new Date();
        }else{
            date_ob = new Date(data.currentDateTime)
        }
        let date = ("0" + date_ob.getDate()).slice(-2);
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        let year = date_ob.getFullYear();
        let hours = date_ob.getHours();
        let minutes = date_ob.getMinutes();
        let seconds = date_ob.getSeconds();

        let currentDateTime = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds
        let currentDate = year + "-" + month + "-" + date;
        let finalDate = year + '-' + month + '-' + date + ' ' + hours + ':' + minutes + ':' + seconds


        data.currentDateTime = currentDateTime;

        // if(data.moduleType !== undefined &&  data.moduleType != null && data.moduleType != '' && data.moduleType == 'companyadmin'){
            
        //     data.moduleType = "companyadmin"

        // }else{
        //     data.moduleType = "SFA"
        // }
        
        if(data.moduleType !== undefined &&  data.moduleType != null && data.moduleType != ''){

            if(data.moduleType =='superAdmin'){

                data.moduleType = "superAdmin"

            }else if(data.moduleType =='companyadmin'){
                
                data.moduleType = "companyadmin"
            }

        }else{
            data.moduleType = "SFA"
        }

        let finalRespArr = [];

        for(let i=0; i<result.length;i++){
            let userEmpPermit = 0
            let role_id  = 0;
            let designationId = 0
            let locationData ;
            let productData =[] ;
            let empType ='';
            let countryCode =0;
            let registerNumber=0;
            var existingClient =0;

            if(result[i].Role !== undefined && result[i].Role != null && result[i].Role != ''){
                let getRole = await dao.getRoleId(data.clientId,result[i].Role);
                if(getRole != 0){
                    role_id = getRole ;
                    userEmpPermit = 1 ;
                }else{
                    result[i].Comments ="Role Not Match"
                    finalRespArr.push(result[i]);
                    continue ;
                }
            }


        // -----------------------------------------------------------------------------
            // if(result[i].Country_Code !== undefined &&  result[i].Country_Code !== null && result[i].Country_Code != ''){

            //     if( result[i].Country_Code.length >= 1 &&  result[i].Country_Code.length <= 5){
            //         countryCode = result[i].Country_Code;
            //     }else{
            //         result[i].Comments ='Country Code" '+  result[i].Country_Code+'" '+" Not Valid "
            //         finalRespArr.push(result[i].Country_Code);
            //         continue;

            //     }
            // }else{
            //     result[i].Comments ="Country Code (Mandatory) Missing Into Uploaded Data"
            //     finalRespArr.push(result[i]);
            //     continue;

            // }

            if(result[i].Country_Code !== undefined &&  result[i].Country_Code !== null && result[i].Country_Code != ''){

                if( countryCodeValidation.test(result[i].Country_Code)){
                    countryCode = result[i].Country_Code;
                }else{
                    result[i].Comments ='Country Code" '+  result[i].Country_Code+'" '+" Is Invalid"
                    finalRespArr.push(result[i])
                    continue;

                }
            }else{
                result[i].Comments ="Country Code (Mandatory) Missing Into Uploaded Data"
                finalRespArr.push(result[i])
                continue;

            }

            if(result[i].First_Name !== undefined && result[i].First_Name != undefined && result[i].First_Name != ''){

                if(! nameValidation.test(result[i].First_Name)){

                    result[i].Comments =" '"+result[i].First_Name+"' Is Not A Valid First Name " 
                    finalRespArr.push(result[i]);
                    continue ;
                }
                
                // if(result[i].Last_Name !== undefined && result[i].Last_Name != null && result[i].Last_Name != ''){

                    // if(! nameValidation.test(result[i].Last_Name)){

                    //     result[i].Comments =" '"+result[i].Last_Name+"' Is Not A Valid Last Name " 
                    //     finalRespArr.push(result[i]);
                    //     continue ;
                    // }


                 if(result[i].Phone_Number !== undefined && result[i].Phone_Number != null && Array.isArray(result[i].Phone_Number)){
                        let isValid = result[i].Phone_Number.every(phoneNumber=>validPhoneNumber.test(phoneNumber) && phoneNumber.length  ==10 && phoneNumber.trim() !== '' );

                        if(!isValid){
                                result[i].Comments =" Phone Number (Mandatory) Missing  '"+result[i].Phone_Number +"'  Or  Not Valid  " 
                                finalRespArr.push(result[i]);continue ;
                        }
                }



                    if(result[i].Phone_Number !== undefined && result[i].Phone_Number != null && Array.isArray(result[i].Phone_Number)){

                        // if(validPhoneNumber.test(result[i].Phone_Number) && result[i].Phone_Number.length == 10){
                            
                            if(userEmpPermit == 0){

                                let not_registeredClient =[];

                                for(let cpn =0; cpn < result[i].Phone_Number.length;cpn++){
                                    if(validPhoneNumber.test(result[i].Phone_Number[cpn]) && result[i].Phone_Number[cpn].length == 10){
                                        let phoneExist_forClient = await dao.phoneExist_for_ClientUser(data.clientId, result[i].Phone_Number[cpn]);


                                        if(phoneExist_forClient == 0){

                                            not_registeredClient.push(result[i].Phone_Number[cpn]);
                                           
                                        }else{
                                            registerNumber = result[i].Phone_Number[cpn];
                                            existingClient = phoneExist_forClient
                                            not_registeredClient.push(registerNumber);
                                        }
                                    }else{
                                        result[i].Comments ='Phone No " '+  result[i].Phone_Number[cpn]+'" '+" Is Not A Valid Phone Number"
                                        finalRespArr.push(result[i])
                                        continue; 
                                    } 
                                                                      
                                }
                                if(registerNumber != 0 &&  existingClient != 0){
                                    let updateRefisteredclientuser = await dao.registerCientUserUpdate(data.clientId,existingClient,registerNumber,not_registeredClient);
                                    result[i].Comments ="Phone Number '"+registerNumber+"' Already Exist ";
                                    finalRespArr.push(result[i]);
                                    continue ;
                                }
                                
                            }else if(userEmpPermit ==1){

                                let not_registeredUser =[];
                                let existingCustomer =0;
                                let customerPhone =0;


                                for(let uph =0; uph <  result[i].Phone_Number.length; uph++){
                                    if(validPhoneNumber.test(result[i].Phone_Number[uph]) && result[i].Phone_Number[uph].length == 10){

                                        let checkClientUser = await dao.phoneExist_for_ClientUser(data.clientId, result[i].Phone_Number[uph]);

                                        if(checkClientUser != 0){
                                            existingCustomer =  checkClientUser;
                                            customerPhone = result[i].Phone_Number[uph];
                                        }


                                        let phoneExist_forUser =await  dao.phoneExist_for_User(data.clientId, result[i].Phone_Number[uph]);
                                        

                                        if(phoneExist_forUser == 0){

                                            not_registeredUser.push(result[i].Phone_Number[uph]);
                                        
                                        }else{
                                            registerNumber = result[i].Phone_Number[uph];
                                            existingClient = phoneExist_forUser
                                            not_registeredUser.push(registerNumber);
                                        }
                                    }else{
                                        result[i].Comments ='Phone No " '+  result[i].Phone_Number[uph]+'" '+" Is Not A Valid Phone Number"
                                        finalRespArr.push(result[i])
                                        continue; 

                                    }

                                    
                                }

                                if(existingCustomer != 0 && customerPhone !=0){

                                    result[i].Comments ="Phone Number '"+customerPhone+"' Already Exist ";
                                    finalRespArr.push(result[i]);
                                    continue ;
                                }
                                
                                if(registerNumber != 0 &&  existingClient != 0){

                                    let updateRegisteredUser = await dao.registeredUserUpdate(data.clientId,existingClient,registerNumber,not_registeredUser);

                                    result[i].Comments ="Phone Number '"+registerNumber+"' Already Exist ";
                                    finalRespArr.push(result[i]);
                                    continue ;
                                }
                            }
                            

                        // }else{
                        //     result[i].Comments ='Employee Phone No "'+  result[i].Phone_Number+'" '+" Is Not A Valid Phone Number"
                        //     finalRespArr.push(result[i]);
                        //     continue ;
                        // }
                    }else{
                        result[i].Comments ="Phone Number (Mandatory) Missing Into Uploaded Data" 
                        finalRespArr.push(result[i]);
                        continue ;
                    }

                // }else{
                    // result[i].Comments ="Last Name (Mandatory) Missing Into Uploaded Data" 
                    // finalRespArr.push(result[i]);
                    // continue ;
                // }
            }else{
                result[i].Comments ="First Name (Mandatory) Missing Into Uploaded Data" 
                finalRespArr.push(result[i]);
                continue ;
            } 

            if(result[i].Address !== undefined && result[i].Address != null && result[i].Address != ''){

                result[i].Address = result[i].Address;
            }else{
                result[i].Comments ="Address (Mandatory) Missing Into Uploaded Data" 
                finalRespArr.push(result[i]);
                continue ;

            }
            if(result[i].Email !== undefined &&  result[i].Email != null && result[i].Email != ''){
                
                if(validEmail.test(result[i].Email)){
                    if(userEmpPermit == 0){
                        
                        let emailExist_forClient = await dao.checkEmailExist(data.clientId, result[i],'clientUser');
                       
                        if(emailExist_forClient != 0){

                            result[i].Comments ="Email Address Already Exist"
                            finalRespArr.push(result[i]);
                            continue ;
                        }

                    }else if(userEmpPermit ==1){

                        let emailExist_forUser = await dao.checkEmailExist(data.clientId,result[i],'user')
                       
                        if(emailExist_forUser != 0){

                            result[i].Comments ="Email Address Already Exist"
                            finalRespArr.push(result[i]);
                            continue ;
                        }
                    }

                }else{
                    result[i].Comments ='Email" '+result[i].Email+'" '+" Is Not A Valid Email"
                    finalRespArr.push(result[i])
                    continue; 
                }
            }else{

                result[i].Comments ="Email (Mandatory) Missing Into Uploaded Data" 
                finalRespArr.push(result[i]);
                continue ;
            }

            let loc_level = ""
            let checkLocationLavel = await dao.get_locationLavels(data.clientId);
            
            if(checkLocationLavel.length != 0){
                for(let l =0;l <checkLocationLavel.length; l++){
                    if(result[i][checkLocationLavel[l].hmTypDesc] ==''){
                        loc_level = checkLocationLavel[l].hmTypDesc;
                        break;
                    }
                }
            }
            if(loc_level != ""){
                result[i].Comments = ""+loc_level+" (Mandatory) Missing Into Uploaded Data"
                finalRespArr.push(result[i])
                continue;
            }

            if (result[i].Address !== undefined && result[i].Address != null && result[i].Address != '') {
                result[i].Address = result[i].Address;
            }else{
                result[i].Address = null
            }

            if(result[i].Designation !== undefined  && result[i].Designation != null && result[i].Designation != ''){
                let getDesignation = await dao.UploadData_getdesignationId(data.clientId,result[i]);
                if(getDesignation != 0){

                    designationId = getDesignation[0].designationId ;
                }else{
                    result[i].Comments = "Designation Not Match"
                    finalRespArr.push(result[i])
                    continue;
                }
            }else{

                result[i].Comments = "Designation (Mandatory) Missing Into Uploaded Data"
                finalRespArr.push(result[i])
                continue;

            }
            if (result[i].Date_Of_Joining !== undefined && result[i].Date_Of_Joining != null && result[i].Date_Of_Joining !='') {

                if(! dateValidation.test(result[i].Date_Of_Joining)){

                    result[i].Comments = "Date Of Joining Is Not Valid Format. Follow (YYYY/MM/DD) Format"
                    finalRespArr.push(result[i])
                    continue;

                }
                
            }else{
                result[i].Date_Of_Joining = null;
            }
    
            if (result[i].Gender == undefined || result[i].Gender == null || result[i].Gender =='') {
                result[i].Gender = null;
            }
    
            if (result[i].Date_Of_Birth !== undefined && result[i].Date_Of_Birth != null && result[i].Date_Of_Birth != '') {
                
                if(! dateValidation.test(result[i].Date_Of_Birth)){

                    result[i].Comments = "Date Of Birth Is Not Valid Format. Follow (YYYY/MM/DD) Format"
                    finalRespArr.push(result[i])
                    continue;

                }

            }else{
                result[i].Date_Of_Birth= null;
            }
    
            if (result[i].Remarks == undefined || result[i].Remarks== null || result[i].Remarks == '') {
                result[i].Remarks = "N/A";
            }
            if (result[i].ERP_Code == undefined || result[i].ERP_Code== null || result[i].ERP_Code == "") {
                result[i].ERP_Code= null;
            }

            if(result[i].User_Type !== undefined && result[i].User_Type != null && result[i].User_Type != ''){
                if(result[i].User_Type == "GT" || result[i].User_Type =="MT"){

                    empType = result[i].User_Type
                }else{

                    empType = result[i].User_Type
                }
            }else{
                result[i].Comments = "User Type (Mandatory) Missing Into Uploaded Data ";
                finalRespArr.push(result[i]);
                continue;

            }

            let getlocationLavels = await dao.locationLavels(data.clientId);

            if(getlocationLavels.length > 0){
                for(let j=0;j< getlocationLavels.length;j++){

                    let getLocationHierarchy = await dao.getLastLevelLocation(data.clientId,getlocationLavels[j].hierarchyTypeId , result[i][getlocationLavels[j].hmTypDesc]) 
                    
                    if(getLocationHierarchy.length > 0){
                        locationData = getLocationHierarchy
                        break;
                    }   
                }
            }
         
            if(result[i].Products !== undefined && result[i].Products != null && result[i].Products != ''){
                
                let getproductLavels = await dao.productLavels(data.clientId);

                if(getproductLavels.length > 0){
                    for(let j = 0; j < result[i].Products.length; j++){

                        let getProductHierarchy = await dao.getLastLevelProduct(data.clientId,getproductLavels[0].hierarchyTypeId , result[i].Products[j]) 
                        if(getProductHierarchy.length > 0){

                            productData.push(getProductHierarchy[0]);
                        }
                    }
                }   
            }

            let resObj ={
                "clientId":data.clientId,
                "userId":data.userId,
                "firstName" :result[i].First_Name,
                "lastName":result[i].Last_Name,
                "countryCode":countryCode,
                "phoneNumber":result[i].Phone_Number.join(','),
                "email":result[i].Email,
                "address":result[i].Address,
                "remarks":result[i].Remarks,
                "dob":result[i].Date_Of_Birth,
                "erpCode" :result[i].ERP_Code,
                "dateOfJoin":result[i].Date_Of_Joining,
                "userEmpPermit" : userEmpPermit,
                "role_id":role_id,
                "designationId":designationId,
                "hierarchyDataIdArr":locationData,
                "productHierarchyDataIdArr":productData,
                "profileImgUrl":"/images/profileImage.png",
                "password":util.passwordHash('password'),
                "gender":result[i].Gender,
                "empType":empType,
                "countryId" : "0",
                "stateId" : "0",
                "cityId" :"0",
                "districtId": "0",
                "zoneId" : "0",
                "finalDate":finalDate,
                "currentDateTime":data.currentDateTime
            }


            let companyGamificationSetting = await commondao.checkCompanyGamificationSettings(resObj.clientId)

            let linsenseLimit0 = await dao.uploasData_getUserLimitCompany(resObj);
            let linsensedUser0 = await dao.UploadData_getUserCountForLisense(resObj);

            let linsenseLimit = linsenseLimit0[0].settingsValue
            let linsensedUser = linsensedUser0[0].userCount

            let getUserLoginSettingsValue = await commondao.checkCompanyLoginSettings(resObj.clientId)

            if(getUserLoginSettingsValue != "0"){
    
                if(getUserLoginSettingsValue == "1"){
    
                    resObj['username'] = resObj.phoneNumber;

                }else if(getUserLoginSettingsValue == "2"){
    
                    resObj['username'] = resObj.email;
    
                }
            }else{
    
                resObj['username'] = resObj.email;
            }

            let respCilentUserId = await dao.UploadData_addClientUsers(resObj);


            for (let i = 0; i < resObj.hierarchyDataIdArr.length; i++) {

                let locationId = await dao.UploadData_addEmployeelocation(resObj, resObj.hierarchyDataIdArr[i], respCilentUserId, 'clientUser')
            }


            if (linsenseLimit > linsensedUser) {
                if (respCilentUserId) {

                    if (resObj.userEmpPermit == '1') {
    
                        let UserId = await dao.UploadData_addUsers(resObj, respCilentUserId);


                        for (let i = 0; i < resObj.hierarchyDataIdArr.length; i++) {

                            let locationId = await dao.UploadData_addEmployeelocation(resObj, resObj.hierarchyDataIdArr[i], UserId, 'user')
                        }

                        if(resObj.productHierarchyDataIdArr !== undefined && Array.isArray(resObj.productHierarchyDataIdArr) == true && resObj.productHierarchyDataIdArr.length > 0){

                            for(let p = 0; p < resObj.productHierarchyDataIdArr.length ; p++){
    
                                let productMappedStatus = await dao.UploadData_insertProductEmpMapping(resObj, UserId, finalDate, resObj.productHierarchyDataIdArr[p]);
                            }
                        }

                        let updateMainUserTable = await dao.updateUserData_Map(resObj, UserId, respCilentUserId);


                        if (updateMainUserTable) {

                            if (companyGamificationSetting == 1) {
                                let minlevelid = await dao.minlevelid_user(resObj.clientId);

                                let financialyearId = await dao.financialyearDetail_user(resObj, resObj.finalDate);
    
                                let adduseringamificationuserconfig = await dao.addingamificationuserconfig_user(resObj, UserId, financialyearId, minlevelid[0].levelId);


                                let addIntoPointsLog = await dao.dataAddIntoPointsLog_user(resObj, UserId)
    
                            }
                        }
                    }
                }
            }
        }

        if(finalRespArr.length > 0){

            let downloadPath = await util.generateExcel_v2(finalRespArr);

            if (downloadPath) {
                await commondao.addIntoClientDownloadListV2(data.clientId, data.userId, downloadPath, "Error During Employee Data Upload", data.currentDateTime, data.moduleType)   
                // return { success: true, status: util.statusCode.SUCCESS, message: 'Error during contact data upload', response:null}
            }
        }


    }catch(e){

        return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null }
    }
}



/**
 * @author : Sourav Bhoumik
 * @date : 21/11/2024
 * @description : get EMPLOYEE list
 * @argument : {}
 * @returns : token
 */

function findByCriteria(array, criteria) {
  return array.find(item => {
    return Object.keys(criteria).every(key => item[key] === criteria[key]);
  }) || null;
}

module.exports.getAllUserListOfCompany = async (data) => {
    try {

        // data.expenseTypeId = '38'
        // data.expenseCategoryId = '31'
        // data.expenseSubCategoryId = '81'
        // data.expenseCategoryModeId = '136'

        if (data.hierarchyDataIdArr !== undefined && data.hierarchyDataIdArr !== "") {
            let uniqueIdArr = [];

            if (Array.isArray(data.hierarchyDataIdArr) === true) {
                if (data.hierarchyDataIdArr.length > 0) {
                    uniqueIdArr = await commonmodel.getAllNodeByLeafId(data)
                }
                for (let i = 0; i < data.hierarchyDataIdArr.length; i++) {
                    uniqueIdArr.push(data.hierarchyDataIdArr[i].hierarchyDataId)
                }
                data.allZones = uniqueIdArr;
            }
        }


        let empData = await dao.getAllUserListOfCompany(data);

        if(empData){

            if(empData.length > 0){

                let empLocationHigherData = await hierearchyUtil.setUpperLevelDataWithId(empData, data.clientId, "L", "hierarchyDataId", true);

                for(let e = 0;e<empLocationHigherData.length;e++){

                    let empRates = []

                    if(empLocationHigherData[e].hmUpperNodes && empLocationHigherData[e].hmUpperNodes.length > 0){

                        if(data.expenseTypeId !== undefined && data.expenseTypeId != '' && data.expenseCategoryId !== undefined && data.expenseCategoryId != '' && data.expenseSubCategoryId !== undefined && data.expenseSubCategoryId != '' && data.expenseCategoryModeId !== undefined && data.expenseCategoryModeId != ''){

                            empRates = await dao.getAllUserListOfCompanyAndExapenseRate(empLocationHigherData[e], data)
                        }


                        // console.log("empRates========================>>>>", empRates)
                        // console.log("empRates========================>>>>", empLocationHigherData[e].hmUpperNodes)

                        for(l = 0;l < empLocationHigherData[e].hmUpperNodes.length; l++){

                            // console.log("empLocationHigherData[e].hmUpperNodes===============================>>>>", empLocationHigherData[e].hmUpperNodes[l])

                            if(empRates.length > 0){

                                if(empLocationHigherData[e].hmUpperNodes[l].dataArr.length > 0){

                                    for(let p = 0; p< empLocationHigherData[e].hmUpperNodes[l].dataArr.length ; p++){

                                        let getSearchRates = findByCriteria(empRates, {"hierarchyTypeId":empLocationHigherData[e].hmUpperNodes[l].hierarchyTypeId, "hierarchyDataId":empLocationHigherData[e].hmUpperNodes[l].dataArr[p].hierarchyDataId})

                                        if(getSearchRates != null){

                                            empLocationHigherData[e].hmUpperNodes[l].dataArr[p].rate = getSearchRates.rate;
                                            empLocationHigherData[e].hmUpperNodes[l].dataArr[p].HQmark = getSearchRates.HQmark;
                                        }else{

                                            empLocationHigherData[e].hmUpperNodes[l].dataArr[p].rate = 0;
                                            empLocationHigherData[e].hmUpperNodes[l].dataArr[p].HQmark = 0;
                                        }
                                    }

                                }

                                // for(let r = 0;r<empRates.length;r++){

                                //     // console.log("000000000000000000000000000000000000000000>", empRates[r].hierarchyTypeId)

                                //     if(Number(empRates[r].hierarchyTypeId) == Number(empLocationHigherData[e].hmUpperNodes[l].hierarchyTypeId)){

                                //         console.log("log check steps=======================================>>>>check0")

                                //         if(empLocationHigherData[e].hmUpperNodes[l].dataArr.length > 0){

                                //             for(let p = 0; p< empLocationHigherData[e].hmUpperNodes[l].dataArr.length ; p++){

                                //                 if(Number(empRates[r].hierarchyDataId) == Number(empLocationHigherData[e].hmUpperNodes[l].dataArr[p].hierarchyDataId)){

                                //                     console.log("=====================================cjeck000>>")
                                //                     console.log("=====================================cjeck000>>", empRates[r])

                                //                     empLocationHigherData[e].hmUpperNodes[l].dataArr[p].rate = empRates[r].rate;
                                //                     empLocationHigherData[e].hmUpperNodes[l].dataArr[p].HQmark = empRates[r].HQmark;
                                //                 }else{

                                //                    empLocationHigherData[e].hmUpperNodes[l].dataArr[p].rate = 0 
                                //                    empLocationHigherData[e].hmUpperNodes[l].dataArr[p].HQmark = 0 
                                //                 }


                                //             }
                                //         }

                                //         console.log("======arr============>>")
                                //         console.log(empLocationHigherData[e].hmUpperNodes[l].dataArr)
                                //         console.log("==================>>")

                                        
                                //     }else{

                                //         // console.log("==================>>check1")

                                //         if(empLocationHigherData[e].hmUpperNodes[l].dataArr.length > 0){

                                //             for(let p = 0; p< empLocationHigherData[e].hmUpperNodes[l].dataArr.length ; p++){

                                //                 empLocationHigherData[e].hmUpperNodes[l].dataArr[p].rate = 0 
                                //                 empLocationHigherData[e].hmUpperNodes[l].dataArr[p].HQmark = 0 

                                //             }
                                //         }


                                //     }
                                // }
                            }else{

                                // console.log("===================>>check2")

                                if(empLocationHigherData[e].hmUpperNodes[l].dataArr.length > 0){

                                    for(let p = 0; p< empLocationHigherData[e].hmUpperNodes[l].dataArr.length ; p++){

                                        empLocationHigherData[e].hmUpperNodes[l].dataArr[p].rate = 0 
                                        empLocationHigherData[e].hmUpperNodes[l].dataArr[p].HQmark = 0 

                                    }
                                }

                            }


                        }

                        // console.log(JSON.stringify(empLocationHigherData[e].hmUpperNodes))
                    }
                }

                // console.log("======rep>")
                // console.log(JSON.stringify(empLocationHigherData))
                // console.log("======rep>")

                return { success: true, status: util.statusCode.SUCCESS, message: '', response: await util.encryptResponse(empLocationHigherData) };

            }else{

               return { success: true, status: util.statusCode.SUCCESS, message: '', response: await util.encryptResponse(empData) }; 
            }

        }else{

           return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null } 
        }
        // return { success: true, status: util.statusCode.SUCCESS, message: '', response: await util.encryptResponse(empData) };
    } catch (e) {
        console.log(e)
        return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null };
    }
}