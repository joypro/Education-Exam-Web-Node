const dao 			        =	require('../dao/adminManagement_dao');
const token 				=	require('../utility/token');
const util 					=	require('../utility/util');

const contactdao 			        =	require('../dao/contactManagement_dao');
const commondao 			=    require('../dao/commondao');

const mstClientdao 			        =    require('../dao/mstClient_dao');
const hierearchyUtil = require('../utility/hirarchyUtil.js');
var sha1 = require('sha1');




module.exports.getExsistingCmpnyLstData = async (data) => {
	try{

		let resp = await dao.getExsistingCmpnyLstData(data)

		if (resp){

			return {success: true, status: util.statusCode.SUCCESS, message: '', response: await util.encryptResponse(resp)}
		}
		else {
			return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}

		}

	} catch (e) {
		return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null}
	}
}


module.exports.updateExsistingCmpnyLstData = async (data) => {
	try{

		let crmId = await dao.checkCRMSetId(data)

		let crmUserId = await dao.checkCRMShowStatus(data)

		if(crmUserId == 0 && crmId == Number(data.settingsId) &&  data.settingsValue == '1'){

			let crmUserRoleId = 0;

			let getCRMAdminRole = await dao.checkCRMSetRoleId(data)

			if(getCRMAdminRole == 0){

				crmUserRoleId = await dao.addCRMSetRoleId(data);

			}else{

				crmUserRoleId = getCRMAdminRole;

			}



			let getAdminUserDetails = await dao.getAdminUserData(data)

			if(getAdminUserDetails.length > 0){

					let crmData = {
						"erpCode": 0,
						"clientUserId": 0,
						"clientId": data.clientId,
						"firstName": getAdminUserDetails[0].firstName,
						"lastName": "CRMAdmin",
						"password": util.passwordHash('password'),
						"username": getAdminUserDetails[0].firstName+"CRMAdmin",
						"email": getAdminUserDetails[0].email,
						"phone": getAdminUserDetails[0].phone,
						"countryId": getAdminUserDetails[0].countryId,
						"stateId": getAdminUserDetails[0].stateId,
						"cityId": getAdminUserDetails[0].districId,
						"userId": getAdminUserDetails[0].userId,
						"designationId": 0,
						"userType": 4,
						"profileImgUrl": "/images/profileImage.png",
						"roleId": crmUserRoleId
					}

					let CRMAdminId = await mstClientdao.addCompanyAdminUser(crmData);
					let updateCompanyAdmin = await mstClientdao.updateCompanyAdmin(CRMAdminId);
					if(CRMAdminId){
						let addLocationData = await commondao.addclientlocation(data,CRMAdminId,'user')

					}
			}else{
			}

		}else if(crmUserId != 0 && crmId == Number(data.settingsId) &&  data.settingsValue == '0'){
			let deleteCRMUser = await dao.deleteCRMUserData(data, crmUserId)

		}else if(crmUserId != 0 && crmId == Number(data.settingsId) &&  data.settingsValue == '1'){
			let activeCRMUser = await dao.activeCRMUserData(data, crmUserId)
		}

		let resp = await dao.updateExsistingCmpnyLstData(data)

		if (resp){

			return {success: true, status: util.statusCode.SUCCESS, message: 'Settings updated successfully', response: null}
		}
		else {
			return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}

		}

	} catch (e) {
		return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null}
	}
}


module.exports.getAllCompnayUsersData = async (data) => {
	try{
		let getAllCompnayUsers = await dao.getAllCompnayUsersData(data)
		if (getAllCompnayUsers.status) {
			return {success: true, status: util.statusCode.SUCCESS, message: '', response: await util.encryptResponse(getAllCompnayUsers)}
		} else {
			return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
		}
	} catch (e) {
		return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null}
	}
}

module.exports.getAllCompnayUsersRolesData = async (data) => {
	try{
		let getAllCompnayUserRoles = await dao.getAllCompnayUsersRolesData(data)
		if (getAllCompnayUserRoles) {
			return {success: true, status: util.statusCode.SUCCESS, message: '', response: await util.encryptResponse(getAllCompnayUserRoles)}
		} else {
			return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
		}
	} catch (e) {
		return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null}
	}
}

module.exports.addCompnayUsersRolesData = async (data) => {
	try{

		if (data.description === undefined || data.description == null || data.description == '') {

			data.description = null;
	    }


		let getAllCompnayUserRoles = await dao.addCompnayUsersRolesData(data)
		if (getAllCompnayUserRoles) {
			return {success: true, status: util.statusCode.SUCCESS, message: 'Role added', response: null}
		} else {
			return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
		}
	} catch (e) {
		return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null}
	}
}


module.exports.updateCompnayUsersRolesData = async (data) => {
	try{

		if (data.description === undefined || data.description == null || data.description == '') {

			data.description = null;
	    }

		let getAllCompnayUserRoles = await dao.updateCompnayUsersRolesData(data)
		if (getAllCompnayUserRoles) {
			return {success: true, status: util.statusCode.SUCCESS, message: 'Role updated', response: null}
		} else {
			return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
		}
	} catch (e) {
		return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null}
	}
}

module.exports.deleteCompnayUsersRolesData = async (data) => {
	try{
		let deleted = await dao.deleteCompnayUsersRolesData(data)
		if (deleted) {
			return {success: true, status: util.statusCode.SUCCESS, message: 'Role Deleted', response: null}
		} else {
			return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
		}
	} catch (e) {
		return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null}
	}
}

module.exports.addCompnayUsersRolesData = async (data) => {
	try{

		if (data.description === undefined || data.description == null || data.description == '') {

			data.description = null;
	    }


		let getAllCompnayUserRoles = await dao.addCompnayUsersRolesData(data)
		if (getAllCompnayUserRoles) {
			return {success: true, status: util.statusCode.SUCCESS, message: 'Role added', response: null}
		} else {
			return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
		}
	} catch (e) {
		return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null}
	}
}


module.exports.addNewCompnayUser = async (data) => {
	try{

		if (data.address === undefined || data.address == null || data.address == '') {

			data.address = null;
	    }
		if(data.profilePic === undefined || data.profilePic == null || data.profilePic == ""){
			data.profilePic = "/images/profileImage.png";
		}
		data.password = util.passwordHash("password");
		data.username = data.email;


		let addedUserId = await dao.addNewCompnayUserData(data);

		if (addedUserId) {

			let insertCount = 0;

			let allZones = await dao.getAllCompanyZones(data);

			if(allZones.status){

				for(let i = 0; i < allZones.data.length; i++){
					let locationObj = {
						"clientId" : data.selectedClientId,
						"userId" : data.userId,
						"countryId" : 0,
						"stateId" : 0,
						"districtId" : 0,
						"zoneId" : 0,
						"mstHierarchyTypeId" : allZones.data[i].mstHierarchyTypeId,
						"hierarchyDataId" : allZones.data[i].hierarchyDataId
					}
					let locationData = await dao.addUserLocationData(locationObj, addedUserId, "user");

					if(locationData){

						insertCount += 1;
					}
				}

				if(insertCount == allZones.data.length){

					return {success: true, status: util.statusCode.SUCCESS, message: 'Company User Added Successfully', response: null}
				}else{

					return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
				}

			}else{

				return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
			}
		} else {
			return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
		}
	} catch (e) {

		return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null}
	}
}

module.exports.updateCompnayUserData = async (data) => {
	try{
		let updateUser = await dao.updateCompnayUserData(data)
		if (updateUser) {
			return {success: true, status: util.statusCode.SUCCESS, message: 'User Updated Successfully', response: ''}
		} else {
			return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
		}
	} catch (e) {

		return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null}
	}
}

module.exports.deleteCompnayUserData = async (data) => {
	try{
		let deleteUser = await dao.deleteCompnayUserData(data)
		if (deleteUser) {
			let deleteLocationData = await dao.deleteUserLocationData(data.selectedUserId,"user");
			return {success: true, status: util.statusCode.SUCCESS, message: 'User Deleted Successfully', response: ''}
		} else {
			return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
		}
	} catch (e) {

		return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null}
	}
}


module.exports.allowAllUserData = async (data) => {
	try{
		let deleteAllUser = await dao.updateAllUserHierarchy(data);

		if(deleteAllUser){

			let allUsers = await dao.getAllCompanyUsers(data);

			if(allUsers.status == true){

				let insertCount = 0;

				for(let i = 0; i < allUsers.data.length; i++){

					let addUserInHierarchy = await dao.addUserInHierarchy(data, allUsers.data[i]['userId'])

					if(addUserInHierarchy){

						insertCount +=1;
					}
				}

				if(insertCount == allUsers.data.length){

					return {success: true, status: util.statusCode.SUCCESS, message: 'Users Hierarchy Mapped Successfully', response: ''}

				}else{

					return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}

				}

			}else{

				return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
			}

		}else {
			return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
		}
	} catch (e) {

		return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null}
	}
}

/*
module.exports.allowAllZoneData = async (data) => {
	try{
		let deleteAllZones = await dao.updateAllZoneMapping(data);

		if(deleteAllZones){

			let insertCount = 0;

			let allZones = await dao.getAllCompanyZones(data);

			if(allZones.status){

				for(let i = 0; i < allZones.data.length; i++){
					let locationObj = {
						"clientId" : data.selectedClientId,
						"userId" : data.userId,
						"countryId" : allZones.data[i].countryId,
						"stateId" : allZones.data[i].stateId,
						"districtId" : allZones.data[i].cityId,
						"zoneId" : allZones.data[i].zoneId
					}
					let locationData = await dao.addUserLocationData(locationObj, data.selectedUserId, "user");

					if(locationData){

						insertCount += 1;
					}
				}

				if(insertCount == allZones.data.length){

					return {success: true, status: util.statusCode.SUCCESS, message: 'All Location Mapped successfully', response: null}
				}else{

					return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
				}
			}

		}else {
			return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
		}
	} catch (e) {
		return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null}
	}
}
*/

// module.exports.allowAllZoneData = async (data) => {
// 	try{
// 		let deleteAllZones = await dao.updateAllZoneMappingV2(data);

// 		if(deleteAllZones){

// 			let insertCount = 0;

// 			let allZones = await dao.getAllCompanyZones(data);

// 			if(allZones.status){

// 				for(let i = 0; i < allZones.data.length; i++){
// 					let locationObj = {
// 						"clientId" : data.selectedClientId,
// 						"userId" : data.userId,
// 						"countryId" : "0", //allZones.data[i].countryId,
// 						"stateId" : "0", //allZones.data[i].stateId,
// 						"districtId" : "0", //allZones.data[i].cityId,
// 						"zoneId" : "0", //allZones.data[i].zoneId
// 						"hierarchyDataId":allZones.data[i].hierarchyDataId,
// 						"mstHierarchyTypeId":allZones.data[i].mstHierarchyTypeId
// 					}
// 					let locationData = await dao.addUserLocationData(locationObj, data.selectedUserId, "user");

// 					if(locationData){

// 						insertCount += 1;
// 					}
// 				}

// 				if(insertCount == allZones.data.length){

// 					return {success: true, status: util.statusCode.SUCCESS, message: 'All Location Mapped successfully', response: null}
// 				}else{

// 					return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
// 				}
// 			}

// 		}else {
// 			return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
// 		}
// 	} catch (e) {

// 		return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null}
// 	}
// }

function chunkArray(array, chunkSize) {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
}


module.exports.allowAllZoneData = async (data) => {
	try{
		let currentDate = '';

        if (data.currentDateTime === undefined || data.currentDateTime == "" || data.currentDateTime == null) {
            data.currentDateTime = new Date();
            currentDate = new Date()
        }else{
            currentDate = new Date(data.currentDateTime)
        }

        let date = ("0" + currentDate.getDate()).slice(-2);
        let month = ("0" + (currentDate.getMonth() + 1)).slice(-2); 
        let year = currentDate.getFullYear();
        let hours = ("0" + currentDate.getHours()).slice(-2);
        let minutes = ("0" + currentDate.getMinutes()).slice(-2);
        let seconds = ("0" + currentDate.getSeconds()).slice(-2);

        let currentDateVal = year + "-" + month + "-" + date;

        let currentDateTime = year + "-" + month + "-" + date + ' ' + hours + ":" + minutes + ":" + seconds;

		let deleteAllZones = await dao.updateAllZoneMappingV2(data);

		if(deleteAllZones){

			let insertCount = 0;

			let allZones = await dao.getAllCompanyZones(data);

			if(allZones.status){

				for(let i = 0; i < allZones.data.length; i++){

					allZones.data[i].clientId = data.selectedClientId
					allZones.data[i].tableName = "user"
					allZones.data[i].refId = data.selectedUserId
					// allZones[i].mstHierarchyTypeId = data.mstHierarchyTypeId
					// allZones[i].hierarchyDataId = data.hierarchyDataId
					allZones.data[i].status = 1
					allZones.data[i].assignedBy = data.userId
					allZones.data[i].createDate = currentDateTime
					allZones.data[i].isApproved = 1

				}

				let arrayOfLastLevels = allZones.data.map(obj => [obj.mstHierarchyTypeId,obj.hierarchyDataId,obj.clientId, obj.tableName, obj.refId,obj.status, obj.assignedBy, obj.createDate,obj.isApproved]);

				let chunkLastLvlsArrs = chunkArray(arrayOfLastLevels, 500);

				if(chunkLastLvlsArrs.length > 0){

					for(let c=0;c<chunkLastLvlsArrs.length;c++){

						let insertLsts = await dao.insertChunkLastLevels(chunkLastLvlsArrs[c])

						if(insertLsts){

							insertCount += chunkLastLvlsArrs[c].length
						}
					}
				}

				if(insertCount == allZones.data.length){

					return {success: true, status: util.statusCode.SUCCESS, message: 'All Location Mapped successfully', response: null}
				}else{

					return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
				}
			}

		}else {
			return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
		}
	} catch (e) {

		return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null}
	}
}



























module.exports.allowForSelectedMenuPermissionModel = async (data) => {
	try{

        if(data.isView){
            data.isViewVal = 1;
        }else{
            data.isViewVal = 0;
        }

        if(data.isAdd){
            data.addPemVal = 1;
        }else{
            data.addPemVal = 0;
        }

        if(data.isEdit){
            data.editPemVal = 1;
        }else{
            data.editPemVal = 0;
        }

        if(data.isDelete){
            data.deletePemVal = 1;
        }else{
            data.deletePemVal = 0;
        }

        if(data.isApprove){
            data.approvePemVal = 1;
        }else{
            data.approvePemVal = 0;
        }

        if(data.isCommercial){
            data.commercialPemVal = 1;
        }else{
            data.commercialPemVal = 0;
        }

		let deleteAllPermission = await dao.updatePermissionOfTheModule(data);

		if(deleteAllPermission){

			let insertCount = 0;

			let allModules = await dao.getAllSpecificModule(data);

			if(allModules.status){

				for(let i = 0; i < allModules.data.length; i++){
					let permissionObj = {

						"clientId" : data.selectedClientId,
						"specificModule":data.specificModuleId,
						"roleId":data.selectedRoleId,
						"moduleId":allModules.data[i]['id'],
						"isView":data.isViewVal,
						"addPem":data.addPemVal,
						"editPem":data.editPemVal,
						"deletePem":data.deletePemVal,
						"approvePem":data.approvePemVal,
						"commercialPem":data.commercialPemVal,
						"createdBy":data.userId

					}
					let menuData = await dao.addMenuPermission(permissionObj);

					if(menuData){

						insertCount += 1;
					}
				}

				if(insertCount == allModules.data.length){

					return {success: true, status: util.statusCode.SUCCESS, message: 'All Menu Mapping Successfully', response: null}
				}else{

					return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
				}
			}

		}else {
			return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
		}
	} catch (e) {

		return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null}
	}
}

module.exports.getAllMasterModulesData = async (data) => {
	try{
		let getAllMasterModules = await dao.getAllMasterModulesData(data)

		if (getAllMasterModules.status) {
			return {success: true, status: util.statusCode.SUCCESS, message: '', response: await util.encryptResponse(getAllMasterModules)}
		} else {
			return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
		}
	} catch (e) {
		return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null}
	}
}

module.exports.getAllParentMasterModulesData = async (data) => {
	try{
		let getAllParentMasterModulesData = await dao.getAllParentMasterModulesData(data)
		if (getAllParentMasterModulesData.status) {
			return {success: true, status: util.statusCode.SUCCESS, message: '', response: await util.encryptResponse(getAllParentMasterModulesData)}
		} else {
			return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
		}
	} catch (e) {
		return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null}
	}
}

module.exports.addNewModuleData = async (data) => {
	try{

		if (data.modulePath === undefined || data.modulePath == null || data.modulePath == '') {

			data.modulePath = "";
	    }
		// get sequence and set next sequence 
		if(data.parentModuleId != "0"){
			let sequence = await dao.getModuleSequence(data);
			data.sequence = sequence + 1;
		}else{
			data.sequence = "0";
		}

		let addNewModuleData = await dao.addNewModuleData(data)
		if (addNewModuleData) {
			return {success: true, status: util.statusCode.SUCCESS, message: 'Module added', response: null}
		} else {
			return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
		}
	} catch (e) {
		return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null}
	}
}

module.exports.updateModuleData = async (data) => {
	try{
		if (data.modulePath === undefined || data.modulePath == null || data.modulePath == '') {

			data.modulePath = null;
	    }
		// data.sequence = 0;
		let updateModuleData = await dao.updateModuleData(data)
		if (updateModuleData) {
			return {success: true, status: util.statusCode.SUCCESS, message: 'Module Updated', response: null}
		} else {
			return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
		}
	}catch(e){
		return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null}
	}
}

module.exports.deleteModule = async (data) => {
	try{
		let deleteModule = await dao.deleteModule(data);
		if(deleteModule){
			return {success: true, status: util.statusCode.SUCCESS, message: 'Module Deleted', response: null}
		}else{
			return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
		}
	}catch(e){
		return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null}
	}
}

module.exports.masterModulesList = async (data) => {
	try{

		let finalResp = []
		let masterModulesList = await dao.masterModulesList(data);

		if(data.moduleType == 'superAdmin'){

			finalResp = masterModulesList;

		}else{

			let getCompanySettings = await dao.getSettings(data.clientId);

			let hasCRM = 0;
			let hasSFA = 0;
			let hasOTS = 0;
			let hasMMS = 0;
			let hasLMS = 0;
			let hasDMS = 0;
			let companyGamificationSetting = 0;
			let companyClikyMagicSetting = 0;
			let hasTMS = 0;
			let hasEMS = 0;
			let hasClikyCRM = 0;

			if(getCompanySettings && getCompanySettings.length > 0){

				for(let i=0;i < getCompanySettings.length;i++){

					if(getCompanySettings[i].settingsType == 'hasCRM'){

						if(getCompanySettings[i].settingsValue == '1' || getCompanySettings[i].settingsValue == 1){

							hasCRM = 1
						}
					}

					if(getCompanySettings[i].settingsType == 'hasSFA'){

						if(getCompanySettings[i].settingsValue == '1' || getCompanySettings[i].settingsValue == 1){

							hasSFA = 1
						}
					}

					if(getCompanySettings[i].settingsType == 'hasOTS'){

						if(getCompanySettings[i].settingsValue == '1' || getCompanySettings[i].settingsValue == 1){

							hasOTS = 1
						}
					}

					if(getCompanySettings[i].settingsType == 'hasMMS'){

						if(getCompanySettings[i].settingsValue == '1' || getCompanySettings[i].settingsValue == 1){

							hasMMS = 1
						}
					}

					if(getCompanySettings[i].settingsType == 'hasLMS'){

						if(getCompanySettings[i].settingsValue == '1' || getCompanySettings[i].settingsValue == 1){

							hasLMS = 1
						}
					}

					if(getCompanySettings[i].settingsType == 'hasDMS'){

						if(getCompanySettings[i].settingsValue == '1' || getCompanySettings[i].settingsValue == 1){

							hasDMS = 1
						}
					}

					if(getCompanySettings[i].settingsType == 'companyGamificationSetting'){

						if(getCompanySettings[i].settingsValue == '1' || getCompanySettings[i].settingsValue == 1){

							companyGamificationSetting = 1
						}
					}

					if(getCompanySettings[i].settingsType == 'companyClikyMagicSetting'){

						if(getCompanySettings[i].settingsValue == '1' || getCompanySettings[i].settingsValue == 1){

							companyClikyMagicSetting = 1
						}
					}

					if(getCompanySettings[i].settingsType == 'hasTMS'){

						if(getCompanySettings[i].settingsValue == '1' || getCompanySettings[i].settingsValue == 1){

							hasTMS = 1
						}
					}

					if(getCompanySettings[i].settingsType == 'hasEMS'){

						if(getCompanySettings[i].settingsValue == '1' || getCompanySettings[i].settingsValue == 1){

							hasEMS = 1
						}
					}

					if(getCompanySettings[i].settingsType == 'hasClikyCRM'){

						if(getCompanySettings[i].settingsValue == '1' || getCompanySettings[i].settingsValue == 1){

							hasClikyCRM = 1
						}
					}
				}

			}

			if(masterModulesList.length > 0){

				if(hasCRM == 1){

					const result1 = masterModulesList.find(item => item.modulesName === 'CRMweb');
					const result2 = masterModulesList.find(item => item.modulesName === 'CRMapp');

					if(result1){
						finalResp.push(result1)
					}
					if(result2){
						finalResp.push(result2)
					}
				}

				if(hasClikyCRM == 1){

					const result1 = masterModulesList.find(item => item.modulesName === 'CRM2.1web');
					const result2 = masterModulesList.find(item => item.modulesName === 'CRM2.1app');

					if(result1){
						finalResp.push(result1)
					}
					if(result2){
						finalResp.push(result2)
					}
				}

				if(hasSFA == 1){

					const result3 = masterModulesList.find(item => item.modulesName === 'SFAweb');
					const result4 = masterModulesList.find(item => item.modulesName === 'SFAapp');

					if(result3){
						finalResp.push(result3)
					}
					if(result4){
						finalResp.push(result4)
					}
				}

				if(hasOTS == 1){

					const result5 = masterModulesList.find(item => item.modulesName === 'OTSweb');
					const result6 = masterModulesList.find(item => item.modulesName === 'OTSapp');

					if(result5){
						finalResp.push(result5)
					}
					if(result6){
						finalResp.push(result6)
					}
				}

				if(hasMMS == 1){

					const result7 = masterModulesList.find(item => item.modulesName === 'MMSweb');
					const result8 = masterModulesList.find(item => item.modulesName === 'MMSapp');

					if(result7){
						finalResp.push(result7)
					}
					if(result8){
						finalResp.push(result8)
					}
				}

				if(hasLMS == 1){

					const result9 = masterModulesList.find(item => item.modulesName === 'LMSweb');
					const result10 = masterModulesList.find(item => item.modulesName === 'LMSapp');

					if(result9){
						finalResp.push(result9)
					}
					if(result10){
						finalResp.push(result10)
					}
				}

				if(hasDMS == 1){

					const result11 = masterModulesList.find(item => item.modulesName === 'DMSweb');
					const result12 = masterModulesList.find(item => item.modulesName === 'DMSapp');

					if(result11){
						finalResp.push(result11)
					}
					if(result12){
						finalResp.push(result12)
					}
				}

				if(companyClikyMagicSetting == 1){

					const result13 = masterModulesList.find(item => item.modulesName === 'ClikyMagicWeb');
					const result14 = masterModulesList.find(item => item.modulesName === 'ClikyMagicApp');

					if(result13){
						finalResp.push(result13)
					}
					if(result14){
						finalResp.push(result14)
					}
				}

				if(hasTMS == 1){

					const result15 = masterModulesList.find(item => item.modulesName === 'TMSweb');
					const result16 = masterModulesList.find(item => item.modulesName === 'TMSapp');

					if(result15){
						finalResp.push(result15)
					}
					if(result16){
						finalResp.push(result16)
					}
				}

				if(hasEMS == 1){

					const result17 = masterModulesList.find(item => item.modulesName === 'EMSweb');
					const result18 = masterModulesList.find(item => item.modulesName === 'EMSapp');

					if(result17){
						finalResp.push(result17)
					}
					if(result18){
						finalResp.push(result18)
					}
				}

				if(companyGamificationSetting == 1){

					const result19 = masterModulesList.find(item => item.modulesName === 'GamificationWeb');
					const result20 = masterModulesList.find(item => item.modulesName === 'GamificationApp');

					if(result19){
						finalResp.push(result19)
					}
					if(result20){
						finalResp.push(result20)
					}
				}

			}


		}

		return {success: true, status: util.statusCode.SUCCESS, message: '', response: finalResp}

		// if(){
		// 	return {success: true, status: util.statusCode.SUCCESS, message: '', response: masterModulesList}
		// }else{
		// 	return {success: true, status: util.statusCode.INTERNAL, message: 'No data Found ', response: null}
		// }
	}catch(e){
		return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null}
	}
}

module.exports.addMasterModules = async (data) => {
	try{
		let addMasterModules = await dao.addMasterModules(data);
		if(addMasterModules){
			return {success: true, status: util.statusCode.SUCCESS, message: 'Master Module Added ', response: null};
		}else{
			return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null};
		}
	}catch(e){
		return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null};
	}
}

module.exports.updateMasterModules = async (data) => {
	try{
		let updateMasterModules = await dao.updateMasterModules(data);
		if(updateMasterModules){
			return {success: true, status: util.statusCode.SUCCESS, message: 'Master Module Updated ', response: null};
		}else{
			return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null};
		}
	}catch(e){
		return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null};
	}
}

module.exports.deleteMasterModules = async (data) => {
	try{
		let deleteMasterModules = await dao.deleteMasterModules(data);
		if(deleteMasterModules){
			return {success: true, status: util.statusCode.SUCCESS, message: 'Master Module Deleted ', response: null};
		}else{
			return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null};
		}
	}catch(e){
		return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null};
	}
}


/**
 * @author : Sourav Bhoumik
 * @date : 26/04/2023
 * @description : get list of all entity
 * @argument : 
 * @returns
 */
module.exports.getAllEntityList = async (data) => {
    try {

    	let resp = await dao.getAllEntityList(data);

        if (resp.resstatus) {

            return { success: true, status: util.statusCode.SUCCESS, message: '', response: resp }

        } else {

            return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null }
        }

    } catch (e) {
        return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null }
    }
}


/**
 * @author : Sourav Bhoumik
 * @date : 26/04/2023
 * @description : addNewEntityData
 * @argument : 
 * @returns
 */
module.exports.addNewEntityData = async (data) => {
    try {

	   	if (data.description === undefined || data.description == null || data.description == "") {

	   		data.description = null;
	    }

        let resp = await dao.addNewEntityData(data);
        if (resp) {
            return { success: true, status: util.statusCode.SUCCESS, message: 'Entity added successfully', response: null }
        } else {
            return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null }
        }
        
    } catch (e) {
        return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null }
    }
}


/**
 * @author : Sourav Bhoumik
 * @date : 26/04/2023
 * @description : updateEntityData
 * @argument : 
 * @returns
 */
module.exports.updateEntityData = async (data) => {
    try {

	   	if (data.description === undefined || data.description == null || data.description == "") {

	   		data.description = null;
	    }

        let resp = await dao.updateEntityData(data);
        if (resp) {
            return { success: true, status: util.statusCode.SUCCESS, message: 'Entity updated successfully', response: null }
        } else {
            return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null }
        }
        
    } catch (e) {

        return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null }
    }
}


/**
 * @author : Sourav Bhoumik
 * @date : 26/04/2023
 * @description : deleteEntityName
 * @argument : 
 * @returns
 */
module.exports.deleteEntityName = async (data) => {
    try {



        let resp = await dao.deleteEntityName(data);
        if (resp) {
            return { success: true, status: util.statusCode.SUCCESS, message: 'Entity deleted successfully', response: null }
        } else {
            return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null }
        }
        
    } catch (e) {

        return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null }
    }
}



/**
 * @author : Sourav Bhoumik
 * @date : 26/04/2023
 * @description : addNewEntityKeyValues
 * @argument : 
 * @returns
 */
module.exports.addNewEntityKeyValues = async (data) => {
    try {

    	let objCnt = 0;

    	for(let i = 0; i < data.entities.length; i++){

    		if(data.entities[i].entityDataId == "0"){

    			let insertStatus = await dao.insertEntityMapping(data.clientId, data.entityId,data.userId, data.createdAt, data.entities[i])


    		}else{

    			let updateStatus = await dao.updateEntityMapping(data.clientId,data.entityId, data.userId, data.createdAt, data.entities[i])

    		}

    		objCnt += 1;


    	}

        if (data.entities.length == objCnt) {
            return { success: true, status: util.statusCode.SUCCESS, message: 'Entity Map entered successfully', response: null }
        } else {
            return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null }
        }
        
    } catch (e) {

        return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null }
    }
}


/**
 * @author : Sourav Bhoumik
 * @date : 26/04/2023
 * @description : deleteEntityKeyValues
 * @argument : 
 * @returns
 */
module.exports.deleteEntityKeyValues = async (data) => {
    try {



        let resp = await dao.deleteEntityKeyValues(data);
        if (resp) {
            return { success: true, status: util.statusCode.SUCCESS, message: 'Entity mapped deleted successfully', response: null }
        } else {
            return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null }
        }
        
    } catch (e) {

        return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null }
    }
}

/**
 * @author : Sourav Bhoumik
 * @date : 26/04/2023
 * @description : get all entity key-value by entity id
 * @argument : 
 * @returns
 */
module.exports.getEntityKeyValuesById = async (data) => {
    try {



        let resp = await dao.getEntityKeyValuesById(data);
        if (resp) {
            return { success: true, status: util.statusCode.SUCCESS, message: '', response: resp }
        } else {
            return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null }
        }
        
    } catch (e) {

        return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null }
    }
}

/**
 * @author : Moloy Mondal
 * @date : 28/04/2023
 * @description : get Additional Form Fields By Form Id
 * @argument : 
 * @returns
 */



function searchSalesStageId(jsonArray, idToSearch) {
    for (let obj of jsonArray) {
        if (obj.salesStageId === idToSearch) {
            return obj; // Return the object if ID is found
        }
    }
    return null; // Return null if ID is not found
}

module.exports.getFormFieldsById = async (data) => {
    try {
        let resp = await dao.getFormFieldsById(data);
        if (resp) {

        	let totalLeadStages = await dao.getLeadSatages({"selectedClientId":data.clientId})

        	// console.log("===========totalLeadStages>>>")
        	// console.log(totalLeadStages)
        	// console.log("===========totalLeadStages>>>")

        	for(let i=0;i<resp.length;i++){

        		resp[i]['formModuleSubNameById'] = ""

        		if(resp[i]['formModuleSubId'] != null && resp[i]['formId'] == "LEADSTAGE"){

        			let slaesStageSearchObj = searchSalesStageId(totalLeadStages, resp[i]['formModuleSubId'])

        			if(slaesStageSearchObj != null){

        				resp[i]['formModuleSubNameById'] = slaesStageSearchObj['salesStageName']
        			}
        		}

        	}

            return { success: true, status: util.statusCode.SUCCESS, message: '', response: resp }
        } else {
            return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null }
        }
        
    } catch (e) {

    	console.log(e)

        return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null }
    }
}

/**
 * @author : Moloy Mondal
 * @date : 28/04/2023
 * @description : Save Additional Form Fields 
 * @argument : 
 * @returns
 */
module.exports.saveFormFields = async (data) => {
    try {

    	await dao.deleteFormFieldsById(data);
		for(let i=0;i<data.formData.length;i++){
			let fData = data.formData[i];
			if(fData.type!="input" && fData.subType=="1" && (fData.subTypeId !== undefined && fData.subTypeId !== null && fData.subTypeId != 0)){
				let opData = await dao.listEntityKeyValuesById({entityId:fData.subTypeId,clientId:data.clientId});
				if(opData!==false){
					let oData = [];
					for(j=0;j<opData.length;j++){
						oData.push({k:opData[j].entityKey,v:opData[j].entityValue});
					}
					fData.value = 	JSON.stringify(oData);			
				}
			}
			fData.clientId = data.clientId;
			fData.formId= data.formId;
			if(fData.formModuleSubId === undefined || fData.formModuleSubId == "" || fData.formModuleSubId == null){

				fData.formModuleSubId = null
			}
			await dao.saveFormFields(fData);
		}
		let resp = true;
        if (resp) {
            return { success: true, status: util.statusCode.SUCCESS, message: '', response: resp }
        } else {
            return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null }
        }
        
    } catch (e) {

        return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null }
    }
}

/**
 * @author : Moloy Mondal
 * @date : 03/05/2023
 * @description : get Additional Form Fields with value By Form Id and RefId
 * @argument : 
 * @returns
 */
module.exports.getFormFieldsValueById = async (data) => {
    try {
        let resp = await dao.getFormFieldsValueById(data);
        if (resp) {
            return { success: true, status: util.statusCode.SUCCESS, message: '', response: resp }
        } else {
            return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null }
        }
        
    } catch (e) {

        return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null }
    }
}

/**
 * @author : Moloy Mondal
 * @date : 03/05/2023
 * @description : Save Additional Form Fields value 
 * @argument : 
 * @returns
 */

// Function to get distinct IDs
function getDistinctformModuleSubIds(jsonArray) {
    const idSet = new Set();
    jsonArray.forEach(obj => {
        if (obj.formModuleSubId !== undefined && obj.formModuleSubId !== null && obj.formModuleSubId !== 0) { // Check for null and 0
            idSet.add(obj.formModuleSubId);
        }
    });
    return Array.from(idSet);
}

module.exports.saveFormFieldsValue = async (data) => {
    try {
    	let ifFormModuleSubIds = getDistinctformModuleSubIds(data.formData)

    	if(ifFormModuleSubIds.length == 0){

    		await dao.deleteFormFieldsValueById(data);

    	}else{

    		for(let id = 0; id < ifFormModuleSubIds.length;id++){

    			await dao.deleteFormFieldsValueById({"refId":data.refId, "formId":data.formId, "clientId":data.clientId, "formModuleSubId":ifFormModuleSubIds[id]});

    		}
    	}

    	// await dao.deleteFormFieldsValueById(data);
		for(let i=0;i<data.formData.length;i++){

			if(data.formData[i]['type'] == "mail"){

				if(typeof data.formData[i]['fieldValue'] === 'object'){

					let userName = "Cliky Admin"

					let sendBy = await dao.getUserNameById(data.userId)

					if(sendBy != ""){

						userName = sendBy
					}

					let mailObj = {

				            "subject": data.formData[i]['fieldValue']['subject'],
				            "toemail": data.formData[i]['fieldValue']['receiver'],
				            // "message": data.formData[i]['fieldValue']['body']
				            "message": "Hi,<br> <br>   "+data.formData[i]['fieldValue']['body']+".<br> <br> <br> Regards <br> "+userName+""
				        }

		        	let Mailingto = await util.sendEmail(mailObj)

			        let fData = data.formData[i];
					fData.refId = data.refId;
					fData.clientId = data.clientId;
					fData.formId= data.formId;
					fData.mailBody= JSON.stringify(data.formData[i]['fieldValue']);
					fData.fieldValue= "Mail Send";
					await dao.saveFormFieldsValue(fData);

				}


			}else{
				let fData = data.formData[i];
				fData.refId = data.refId;
				fData.clientId = data.clientId;
				fData.formId= data.formId;
				fData.mailBody= null;
				if(Array.isArray(fData.fieldValue) || typeof fData.fieldValue === 'object'){
					fData.fieldValue = fData.fieldValue.join(",")
				}
				// fData.fieldValue = JSON.stringify(fData.fieldValue)
				await dao.saveFormFieldsValue(fData);

			}
		}
		let resp = true;
        if (resp) {
            return { success: true, status: util.statusCode.SUCCESS, message: '', response: resp }
        } else {
            return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null }
        }
        
    } catch (e) {
    	console.log(e)
        return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null }
    }
}


/**
 * @author : Sourav Bhoumik
 * @date : 29/11/2023
 * @description : get location for company admin use
 * @argument : 
 * @returns
 */

module.exports.getLocationsForCompanyAdmin = async (data) => {
    try {

    	let getHighestLevelLocationHierrarchyId = await dao.hihgerLevelLocationForCompany(data)


        let loctionsArr = await dao.getLocationsForCompanyAdmin(data);

        if (loctionsArr) {

        	if(loctionsArr.length > 0){

        		let countryArr = [];
                let countryFinalArr = [];

                for (let i = 0; i < loctionsArr.length; i++) {

                    let locationData = await hierearchyUtil.getUpperNodeByLeafId('L', data.clientId, loctionsArr[i].hierarchyTypeId, loctionsArr[i].hierarchyDataId)

                    if (locationData != null && locationData.length > 0) {

                    	for(let k=0;k<locationData.length;k++){

                    		if(locationData[k].typeId == getHighestLevelLocationHierrarchyId){

                    			countryArr.push(locationData[k])
                    		}
                    	}

                    }

                }

                if(countryArr.length > 0){

                    countryFinalArr = await hierearchyUtil.getDistinctObjFormArray(countryArr, 'id');
                }

                return { success: true, status: util.statusCode.SUCCESS, message: '', response: countryFinalArr }

        	}else{

        		return { success: false, status: util.statusCode.INTERNAL, message: 'Location last level not found', response: null }
        	}
            
        } else {
            return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null }
        }
        
    } catch (e) {
    	
        return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null }
    }
}


/**
 * @author : Sourav Bhoumik
 * @date : 07/06/2024
 * @description : get lead stages
 * @argument : 
 * @returns
 */

module.exports.getLeadSatages = async (data) => {
    try {
        let resp = await dao.getLeadSatages(data);
        if (resp) {
            return { success: true, status: util.statusCode.SUCCESS, message: '', response: resp }
        } else {
            return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null }
        }
        
    } catch (e) {

        return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null }
    }
}