const util = require('../utility/util');



module.exports.getExsistingCmpnyLstReq = (data) => {
    let errcounter = 0;
    if (data.userId === undefined || data.userId == null || data.userId == "") {
        util.createLog("userId is missing");
        errcounter++;
    }
    if (data.clientId === undefined || data.clientId == null || data.clientId == "") {
        util.createLog("clientId is missing");
        errcounter++;
    }
    if (data.selectedClientId === undefined || data.selectedClientId == null || data.selectedClientId == "") {
        util.createLog("selectedClientId is missing");
        errcounter++;
    }
    return errcounter <= 0;
}


module.exports.updateExsistingCmpnyLstReq = (data) => {
    let errcounter = 0;
    if (data.userId === undefined || data.userId == null) {
        util.createLog("userId is missing");
        errcounter++;
    }
    if (data.clientId === undefined || data.clientId == null) {
        util.createLog("clientId is missing");
        errcounter++;
    }
    if (data.settingsId === undefined || data.settingsId == null) {
        util.createLog("settingsId is missing");
        errcounter++;
    }
    if (data.settingsValue === undefined || data.settingsValue == null) {
        util.createLog("settingsValue is missing");
        errcounter++;
    }
    return errcounter <= 0;
}


module.exports.getAllCompnayUsersReq = (data) => {
    let errcounter = 0;
    if (data.userId === undefined || data.userId == null) {
        util.createLog("userId is missing");
        errcounter++;
    }
    if (data.selectedClientId === undefined || data.selectedClientId == null) {
        util.createLog("selectedClientId is missing");
        errcounter++;
    }
    return errcounter <= 0;
}

module.exports.addCompnayUsersRolesReq = (data) => {
    let errcounter = 0;
    if (data.userId === undefined || data.userId == null) {
        util.createLog("userId is missing");
        errcounter++;
    }
    if (data.selectedClientId === undefined || data.selectedClientId == null) {
        util.createLog("selectedClientId is missing");
        errcounter++;
    }
    if (data.roleName === undefined || data.roleName == null) {
        util.createLog("roleName is missing");
        errcounter++;
    }
    return errcounter <= 0;
}

module.exports.deleteCompnayUsersRolesReq = (data) => {
    let errcounter = 0;
    if (data.userId === undefined || data.userId == null) {
        util.createLog("userId is missing");
        errcounter++;
    }
    if (data.selectedRoleId === undefined || data.selectedRoleId == null) {
        util.createLog("selectedRoleId is missing");
        errcounter++;
    }
    return errcounter <= 0;
}

module.exports.updateCompnayUsersRolesReq = (data) => {
    let errcounter = 0;
    if (data.userId === undefined || data.userId == null) {
        util.createLog("userId is missing");
        errcounter++;
    }
    if (data.selectedClientId === undefined || data.selectedClientId == null) {
        util.createLog("selectedClientId is missing");
        errcounter++;
    }
    if (data.roleName === undefined || data.roleName == null) {
        util.createLog("roleName is missing");
        errcounter++;
    }
        if (data.selectedRoleId === undefined || data.selectedRoleId == null) {
        util.createLog("selectedRoleId is missing");
        errcounter++;
    }
    return errcounter <= 0;
}

module.exports.addNewCompnayUserReq = (data) => {
    let errcounter = 0;
    if (data.userId === undefined || data.userId == null) {
        util.createLog("userId is missing");
        errcounter++;
    }
    if (data.selectedClientId === undefined || data.selectedClientId == null) {
        util.createLog("selectedClientId is missing");
        errcounter++;
    }
    if (data.firstName === undefined || data.firstName == null) {
        util.createLog("firstName is missing");
        errcounter++;
    }
    if (data.lastName === undefined || data.lastName == null) {
        util.createLog("lastName is missing");
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
    if (data.selectedRoleId === undefined || data.selectedRoleId == null) {
        util.createLog("selectedRoleId is missing");
        errcounter++;
    }
    return errcounter <= 0;
}

module.exports.updateCompnayUserDataReq = (data) => {
    let errcounter = 0;
    if (data.userId === undefined || data.userId == null) {
        util.createLog("userId is missing");
        errcounter++;
    }
    if (data.selectedUserId === undefined || data.selectedUserId == null) {
        util.createLog("selectedUserId is missing");
        errcounter++;
    }
    if (data.firstName === undefined || data.firstName == null) {
        util.createLog("firstName is missing");
        errcounter++;
    }
    if (data.lastName === undefined || data.lastName == null) {
        util.createLog("lastName is missing");
        errcounter++;
    }
    if (data.phone === undefined || data.phone == null) {
        util.createLog("phone is missing");
        errcounter++;
    }
    if (data.selectedRoleId === undefined || data.selectedRoleId == null) {
        util.createLog("selectedRoleId is missing");
        errcounter++;
    }
    return errcounter <= 0;
}

module.exports.deleteCompnayUserDataReq = (data) => {
    let errcounter = 0;
    if (data.userId === undefined || data.userId == null) {
        util.createLog("userId is missing");
        errcounter++;
    }
    if (data.selectedUserId === undefined || data.selectedUserId == null) {
        util.createLog("selectedUserId is missing");
        errcounter++;
    }
    return errcounter <= 0;
}


module.exports.allowAllUserReq = (data) => {
    let errcounter = 0;
    if (data.selectedUserId === undefined || data.selectedUserId == null) {
        util.createLog("selectedUserId is missing");
        errcounter++;
    }
    if (data.selectedClientId === undefined || data.selectedClientId == null) {
        util.createLog("selectedClientId is missing");
        errcounter++;
    }
    return errcounter <= 0;
}

module.exports.allowForSelectedMenuPermissionReq = (data) => {
    let errcounter = 0;
    if (data.selectedClientId === undefined || data.selectedClientId == null) {
        util.createLog("selectedClientId is missing");
        errcounter++;
    }
    if (data.specificModuleId === undefined || data.specificModuleId == null) {
        util.createLog("specificModuleId is missing");
        errcounter++;
    }
    if (data.selectedRoleId === undefined || data.selectedRoleId == null) {
        util.createLog("selectedRoleId is missing");
        errcounter++;
    }
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

module.exports.getAllMasterModulesReq = (data) => {
    let errcounter = 0;
    if (data.userId === undefined || data.userId == null) {
        util.createLog("userId is missing");
        errcounter++;
    }

    return errcounter <= 0;
}

module.exports.addNewModuleReq = (data) => {
    let errcounter = 0;
    if (data.userId === undefined || data.userId == null) {
        util.createLog("userId is missing");
        errcounter++;
    }
    if (data.moduleName === undefined || data.moduleName == null) {
        util.createLog("moduleName is missing");
        errcounter++;
    }
    if (data.parentModuleId === undefined || data.parentModuleId == null) {
        util.createLog("parentModuleId is missing");
        errcounter++;
    }
    // if (data.modulePath === undefined || data.modulePath == null) {
    //     util.createLog("modulePath is missing");
    //     errcounter++;
    // }
    if (data.specificModuleId === undefined || data.specificModuleId == null) {
        util.createLog("specificModuleId is missing");
        errcounter++;
    }
    // if (data.sequence === undefined || data.sequence == null) {
    //     util.createLog("sequence is missing");
    //     errcounter++;
    // }

    return errcounter <= 0;
}

module.exports.updateModuleDataReq = (data) => {
    let errcounter = 0;
    if (data.userId === undefined || data.userId == null || data.userId == "") {
        util.createLog("userId is missing");
        errcounter++;
    }
    if (data.moduleId === undefined || data.moduleId == null || data.moduleId == "") {
        util.createLog("moduleId is missing");
        errcounter++;
    }
    if (data.moduleName === undefined || data.moduleName == null || data.moduleName == "") {
        util.createLog("moduleName is missing");
        errcounter++;
    }
    if (data.parentModuleId === undefined || data.parentModuleId == null || data.parentModuleId == "") {
        util.createLog("parentModuleId is missing");
        errcounter++;
    }
    if (data.modulePath === undefined || data.modulePath == null || data.modulePath == "") {
        util.createLog("modulePath is missing");
        errcounter++;
    }
    if (data.specificModuleId === undefined || data.specificModuleId == null || data.specificModuleId == "") {
        util.createLog("specificModuleId is missing");
        errcounter++;
    }
    // if (data.sequence === undefined || data.sequence == null || data.sequence == "") {
    //     util.createLog("sequence is missing");
    //     errcounter++;
    // }

    return errcounter <= 0;
}

module.exports.deleteModuleReq = (data) => {
    let errcounter = 0;
    if (data.userId === undefined || data.userId == null || data.userId == "") {
        util.createLog("userId is missing");
        errcounter++;
    }
    if (data.moduleId === undefined || data.moduleId == null || data.moduleId == "") {
        util.createLog("moduleId is missing");
        errcounter++;
    }
    return errcounter <= 0;
}

module.exports.masterModulesListReq = (data) => {
    let errcounter = 0;
    if (data.userId === undefined || data.userId == null || data.userId == "") {
        util.createLog("userId is missing");
        errcounter++;
    }
    if (data.clientId === undefined || data.clientId == null || data.clientId == "") {
        util.createLog("clientId is missing");
        errcounter++;
    }
    if (data.roleId === undefined || data.roleId == null || data.roleId == "") {
        util.createLog("roleId is missing");
        errcounter++;
    }
    return errcounter <= 0;
}

module.exports.addMasterModulesReq = (data) => {
    let errcounter = 0;
    if (data.userId === undefined || data.userId == null || data.userId == "") {
        util.createLog("userId is missing");
        errcounter++;
    }
    if (data.clientId === undefined || data.clientId == null || data.clientId == "") {
        util.createLog("clientId is missing");
        errcounter++;
    }
    if (data.roleId === undefined || data.roleId == null || data.roleId == "") {
        util.createLog("roleId is missing");
        errcounter++;
    }
    if (data.modulesName === undefined || data.modulesName == null || data.modulesName == "") {
        util.createLog("modulesName is missing");
        errcounter++;
    }
    return errcounter <= 0;
}

module.exports.updateMasterModulesReq = (data) => {
    let errcounter = 0;
    if (data.userId === undefined || data.userId == null || data.userId == "") {
        util.createLog("userId is missing");
        errcounter++;
    }
    if (data.clientId === undefined || data.clientId == null || data.clientId == "") {
        util.createLog("clientId is missing");
        errcounter++;
    }
    if (data.roleId === undefined || data.roleId == null || data.roleId == "") {
        util.createLog("roleId is missing");
        errcounter++;
    }
    if (data.modulesName === undefined || data.modulesName == null || data.modulesName == "") {
        util.createLog("modulesName is missing");
        errcounter++;
    }
    if (data.masterModuleId === undefined || data.masterModuleId == null || data.masterModuleId == "") {
        util.createLog("masterModuleId is missing");
        errcounter++;
    }
    return errcounter <= 0;
}

module.exports.deleteMasterModulesReq = (data) => {
    let errcounter = 0;
    if (data.userId === undefined || data.userId == null || data.userId == "") {
        util.createLog("userId is missing");
        errcounter++;
    }
    if (data.clientId === undefined || data.clientId == null || data.clientId == "") {
        util.createLog("clientId is missing");
        errcounter++;
    }
    if (data.roleId === undefined || data.roleId == null || data.roleId == "") {
        util.createLog("roleId is missing");
        errcounter++;
    }
    if (data.masterModuleId === undefined || data.masterModuleId == null || data.masterModuleId == "") {
        util.createLog("masterModuleId is missing");
        errcounter++;
    }
    return errcounter <= 0;
}


module.exports.getAllEntityList = (data) => {
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


module.exports.addNewEntityData = (data) => {
    let errcounter = 0;
    if (data.userId === undefined || data.userId == null || data.userId == "") {
        util.createLog("userId is missing");
        errcounter++;
    }
    if (data.clientId === undefined || data.clientId == null || data.clientId == "") {
        util.createLog("clientId is missing");
        errcounter++;
    }
    if (data.entityName === undefined || data.entityName == null || data.entityName == "") {
        util.createLog("entityName is missing");
        errcounter++;
    }
    if (data.createdAt === undefined || data.createdAt == null || data.createdAt == "") {
        util.createLog("createdAt is missing");
        errcounter++;
    }
    return errcounter <= 0;
}

module.exports.updateEntityData = (data) => {
    let errcounter = 0;
    if (data.userId === undefined || data.userId == null || data.userId == "") {
        util.createLog("userId is missing");
        errcounter++;
    }
    if (data.clientId === undefined || data.clientId == null || data.clientId == "") {
        util.createLog("clientId is missing");
        errcounter++;
    }
    if (data.entityName === undefined || data.entityName == null || data.entityName == "") {
        util.createLog("entityName is missing");
        errcounter++;
    }
    if (data.modifiedAt === undefined || data.modifiedAt == null || data.modifiedAt == "") {
        util.createLog("modifiedAt is missing");
        errcounter++;
    }
    if (data.entityId === undefined || data.entityId == null || data.entityId == "") {
        util.createLog("entityId is missing");
        errcounter++;
    }
    return errcounter <= 0;
}


module.exports.deleteEntityName = (data) => {
    let errcounter = 0;
    if (data.userId === undefined || data.userId == null || data.userId == "") {
        util.createLog("userId is missing");
        errcounter++;
    }
    if (data.clientId === undefined || data.clientId == null || data.clientId == "") {
        util.createLog("clientId is missing");
        errcounter++;
    }
    if (data.modifiedAt === undefined || data.modifiedAt == null || data.modifiedAt == "") {
        util.createLog("modifiedAt is missing");
        errcounter++;
    }
    if (data.entityId === undefined || data.entityId == null || data.entityId == "") {
        util.createLog("entityId is missing");
        errcounter++;
    }
    return errcounter <= 0;
}


module.exports.addNewEntityKeyValues = (data) => {
    let errcounter = 0;
    if (data.userId === undefined || data.userId == null || data.userId == "") {
        util.createLog("userId is missing");
        errcounter++;
    }
    if (data.clientId === undefined || data.clientId == null || data.clientId == "") {
        util.createLog("clientId is missing");
        errcounter++;
    }
    if (data.createdAt === undefined || data.createdAt == null || data.createdAt == "") {
        util.createLog("createdAt is missing");
        errcounter++;
    }
    if (data.entityId === undefined || data.entityId == null || data.entityId == "") {
        util.createLog("entityId is missing");
        errcounter++;
    }
    if (data.entities === undefined || data.entities == null ||data.entities.length == 0) {
        util.createLog("entities is missing");
        errcounter++;
    }else{
        for(let i = 0; i < data.entities.length; i++){
            if (data.entities[i].entityKey === undefined || data.entities[i].entityKey  == null || data.entities[i].entityKey == "") {
                util.createLog("entityKey is missing");
                errcounter++;
            }
            if (data.entities[i].entityValue === undefined || data.entities[i].entityValue  == null || data.entities[i].entityValue == "") {
                util.createLog("entityValue is missing");
                errcounter++;
            }
            if (data.entities[i].entityDataId === undefined || data.entities[i].entityDataId  == null || data.entities[i].entityDataId == "") {
                util.createLog("entityDataId is missing");
                errcounter++;
            }
        }
    }
    return errcounter <= 0;
}


module.exports.deleteEntityKeyValues = (data) => {
    let errcounter = 0;
    if (data.userId === undefined || data.userId == null || data.userId == "") {
        util.createLog("userId is missing");
        errcounter++;
    }
    if (data.clientId === undefined || data.clientId == null || data.clientId == "") {
        util.createLog("clientId is missing");
        errcounter++;
    }
    if (data.modifiedAtd === undefined || data.modifiedAtd == null || data.modifiedAtd == "") {
        util.createLog("modifiedAtd is missing");
        errcounter++;
    }
    if (data.entityDataId === undefined || data.entityDataId == null || data.entityDataId == "") {
        util.createLog("entityDataId is missing");
        errcounter++;
    }

    return errcounter <= 0;
}


module.exports.getEntityKeyValuesById = (data) => {
    let errcounter = 0;
    if (data.userId === undefined || data.userId == null || data.userId == "") {
        util.createLog("userId is missing");
        errcounter++;
    }
    if (data.clientId === undefined || data.clientId == null || data.clientId == "") {
        util.createLog("clientId is missing");
        errcounter++;
    }
    if (data.entityId === undefined || data.entityId == null || data.entityId == "") {
        util.createLog("entityId is missing");
        errcounter++;
    }

    return errcounter <= 0;
}

module.exports.getFormFieldsById = (data) => {
    let errcounter = 0;
    if (data.userId === undefined || data.userId == null || data.userId == "") {
        util.createLog("userId is missing");
        errcounter++;
    }
    if (data.clientId === undefined || data.clientId == null || data.clientId == "") {
        util.createLog("clientId is missing");
        errcounter++;
    }
    if (data.formId === undefined || data.formId == null || data.formId == "") {
        util.createLog("formId is missing");
        errcounter++;
    }

    return errcounter <= 0;
}

module.exports.saveFormFields = (data) => {
    let errcounter = 0;
    if (data.userId === undefined || data.userId == null || data.userId == "") {
        util.createLog("userId is missing");
        errcounter++;
    }
    if (data.clientId === undefined || data.clientId == null || data.clientId == "") {
        util.createLog("clientId is missing");
        errcounter++;
    }
    if (data.formId === undefined || data.formId == null || data.formId == "") {
        util.createLog("formId is missing");
        errcounter++;
    }

    if (data.formData === undefined || data.formData == null || data.formData == "") {
        util.createLog("formData is missing");
        errcounter++;
    } else {
	if(Array.isArray(data.formData)===false){
		util.createLog("formData is not array");
        	errcounter++;
	} else {
		if(data.formData.length===0){
			util.createLog("formData is not array");
        		errcounter++;
		} else {
			for(let i=0;i<data.formData.length;i++){
				let fData = data.formData[i];
				if(fData.name === undefined || fData.name == null || fData.name == ""){
					util.createLog("name is missing in formdata "+i+" index");
        				errcounter++;
					break;
				}
				if(fData.label === undefined || fData.label == null || fData.label == ""){
					util.createLog("label is missing in formdata "+i+" index");
        				errcounter++;
					break;
				}
				if(fData.type === undefined || fData.type == null || fData.label == ""){
					util.createLog("type is missing in formdata "+i+" index");
        				errcounter++;
					break;
				}
				if( ((fData.type !="input" && fData.type != "calendar" && fData.type != "upload" && fData.type != "mail") && fData.subType=="0" && (fData.value === undefined || fData.value == null || fData.value == ""))){
					util.createLog("value is missing in formdata "+i+" index");
        				errcounter++;
					break;
				}

				if((fData.type !="input" && fData.type != "calendar" && fData.type != "upload" && fData.type != "mail") && (fData.subType === undefined || fData.subType == null || fData.subType == "")){
					util.createLog("subType is missing in formdata "+i+" index");
        				errcounter++;
					break;
				}
				if((fData.type !="input" && fData.type != "calendar" && fData.type != "upload" && fData.type != "mail") && fData.subType=="1" && (fData.subTypeId === undefined || fData.subTypeId == null || fData.subTypeId == "")){
					util.createLog("subTypeId is missing in formdata "+i+" index");
        				errcounter++;
					break;
				}
			}
		}
	}

    }

    return errcounter <= 0;
}

module.exports.getFormFieldsValueById = (data) => {
    let errcounter = 0;
    if (data.userId === undefined || data.userId == null || data.userId == "") {
        util.createLog("userId is missing");
        errcounter++;
    }
    if (data.clientId === undefined || data.clientId == null || data.clientId == "") {
        util.createLog("clientId is missing");
        errcounter++;
    }
    if (data.formId === undefined || data.formId == null || data.formId == "") {
        util.createLog("formId is missing");
        errcounter++;
    }

    if (data.refId === undefined || data.refId == null) {
        util.createLog("formId is missing");
        errcounter++;
    }

    return errcounter <= 0;
}

module.exports.saveFormFieldsValue = (data) => {
    let errcounter = 0;
    if (data.userId === undefined || data.userId == null || data.userId == "") {
        util.createLog("userId is missing");
        errcounter++;
    }
    if (data.clientId === undefined || data.clientId == null || data.clientId == "") {
        util.createLog("clientId is missing");
        errcounter++;
    }
    if (data.formId === undefined || data.formId == null || data.formId == "") {
        util.createLog("formId is missing");
        errcounter++;
    }

    if (data.refId === undefined || data.refId == null || data.refId == "") {
        util.createLog("refId is missing");
        errcounter++;
    }

    if (data.formData === undefined || data.formData == null || data.formData == "") {
        util.createLog("formData is missing");
        errcounter++;
    } else {
	if(Array.isArray(data.formData)===false){
		util.createLog("formData is not array");
        	errcounter++;
	} else {
		if(data.formData.length===0){
			util.createLog("formData is not array");
        		errcounter++;
		} else {
			for(let i=0;i<data.formData.length;i++){
				let fData = data.formData[i];
				if(fData.name === undefined || fData.name == null || fData.name == ""){
					util.createLog("name is missing in formdata "+i+" index");
        				errcounter++;
					break;
				}
				if(fData.fieldId === undefined || fData.fieldId == null || fData.fieldId == ""){
					util.createLog("fieldId is missing in formdata "+i+" index");
        				errcounter++;
					break;
				}
				
				
			}
		}
	}

    }

    return errcounter <= 0;
}


module.exports.getLocationsForCompanyAdmin = (data) => {
    
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

// ================================================================================================

/**
 * @author : Sourav Bhoumik
 * @date : 07/06/2024
 * @description : get lead stages
 * @argument : 
 * @returns
 */

module.exports.getLeadSatages = (data) => {
    
    let errcounter = 0;
    if (data.selectedClientId === undefined || data.selectedClientId == null || data.selectedClientId == "") {
        util.createLog("selectedClientId is missing");
        errcounter++;
    }
    


    return errcounter <= 0;
}