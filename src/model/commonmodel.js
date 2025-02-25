const commondao = require('../dao/commondao');
const token = require('../utility/token');
const util = require('../utility/util');
const config = require('../config');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const commonvalidate = require('../validation/commonvalidation');
const hierearchyUtil = require('../utility/hirarchyUtil');
const moment = require('moment');
var sha1 = require('sha1');
const userdao = require('../dao/user_dao');


/**
 * @author : Poritosh
 * @date : 23/01/2025
 * @description :getHeirarchyTypes
 * @argument : 
 * @returns
 */
module.exports.getHeirarchyTypes = async (data) => {
    try {
        data = await util.setCurrentDateTime(data)
        let resp = await dao.getHierarchyTypes(data);
        if (resp.length > 0) {
            return { success: true, status: util.statusCode.SUCCESS, message: '', response: resp }
        }else {
            return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'No Course Found', response: null }   
        }

    } catch (e) {
        util.createLog(e)
        return { success: false, status: util.statusCode.INTERNAL, message: util.Message.INTERNAL, response: null }
    }
}




async function getAllNodeByLeafId(data) {
	try {

		let lastLeafNodeId = "0";
		let finalSearchIdArr = [];
		let uniqueIdArr = [];

		let lastLeafNodeIdData = await commondao.getClientLocationLastLevelDataTypeId(data.clientId, 1);


		if (lastLeafNodeIdData) {
			if (lastLeafNodeIdData.length > 0) {

				lastLeafNodeId = lastLeafNodeIdData[0].hierarchyTypeId;

			}
		}

		for (let m = 0; m < data.hierarchyDataIdArr.length; m++) {

			if (lastLeafNodeId !== "0" && data.hierarchyDataIdArr[m].hierarchyTypeId !== lastLeafNodeId) {

				let allLastNodeIds = await hierearchyUtil.getLastNodeId("L", data.clientId, data.hierarchyDataIdArr[m].hierarchyTypeId, data.hierarchyDataIdArr[m].hierarchyDataId);


				finalSearchIdArr.push(allLastNodeIds)

			} else {

				finalSearchIdArr.push(data.hierarchyDataIdArr[m].hierarchyDataId)


			}

			uniqueIdArr = [...new Set(finalSearchIdArr)]

		}

		return uniqueIdArr
	} catch (e) {
		util.createLog(e);
		return [];
	}
}

module.exports.getAllNodeByLeafId = getAllNodeByLeafId;





module.exports.generateToken = async (data) => {
	try {
		let bearerData = await token.GetWebToken({
			"userId": data.userId,
			"userTypeId": data.userTypeId
		});
		util.createLog('barrier >> ' + bearerData)
		return { success: true, status: 200, message: '', response: await util.encryptResponse({ "token": bearerData }) }
	} catch (e) {
		return { success: false, status: 500, message: 'Some error occurred', response: null }
	}
}


module.exports.pickUserCurrentLocation = async (data) => {
	try {
		if (commonvalidate.pickUserCurrentLocation(data)) {
			if (!data.type) {
				data["type"] = "user";
			}
			if (!data.isLatest) {
				data["isLatest"] = "1";
			}
			await commondao.updateActivityLocation(data);
			if (await commondao.pickUserCurrentLocation(data)) {
				return { success: true, status: util.statusCode.SUCCESS, message: '', response: true };
			} else {
				return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null };
			}
		} else {
			return { success: false, status: util.statusCode.PARAM_MISSING, message: '', response: null };
		}
	} catch (e) {
		return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null };
	}
}

module.exports.pickCustomerCurrentLocation = async (data) => {
	try {
		if (commonvalidate.pickCustomerCurrentLocation(data)) {
			if (!data.type) {
				data["type"] = "clientCustomer";
			}
			if (!data.isLatest) {
				data["isLatest"] = "1";
			}
			await commondao.updateCustomerActivityLocation(data);
			if (await commondao.pickCustomerCurrentLocation(data)) {
				return { success: true, status: util.statusCode.SUCCESS, message: '', response: true };
			} else {
				return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null };
			}
		} else {
			return { success: false, status: util.statusCode.PARAM_MISSING, message: '', response: null };
		}
	} catch (e) {
		return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null };
	}
}


module.exports.takenLatLongData = async (data) => {
	try {

		return { success: true, status: 200, message: 'location lat long fetched', response: true }
	} catch (e) {
		return { success: false, status: 500, message: 'Some error occurred', response: null }
	}
}


module.exports.getHierarchyTypesSlNo = async (data) => {
	try {

		let hmTYpeId = 1;

		if (data.typeOfItem === undefined || data.typeOfItem == null){

			if(data.typeOfItem == "2"){
				hmTYpeId = 2;
			}else if(data.typeOfItem == "1"){
				hmTYpeId = 1;
			}
		}else{

			hmTYpeId = data.typeOfItem;

		}
		let userHierarchyTypesSlNo = await commondao.getClientmstHierarchyTypes(data.clientId, hmTYpeId)

		return { success: true, status: 200, message: '', response: await util.encryptResponse(userHierarchyTypesSlNo) }
	} catch (e) {
		return { success: false, status: 500, message: 'Some error occurred', response: null }
	}
}

module.exports.getHierarchyTypesName = async (data) => {
	try {

		let hmTYpeId = 1;

		if (data.typeOfItem === undefined || data.typeOfItem == null){

			if(data.typeOfItem == "2"){
				hmTYpeId = 2;
			}else if(data.typeOfItem == "1"){
				hmTYpeId = 1;
			}
		}else{

			hmTYpeId = data.typeOfItem;
		}
		
		data.hmTYpeId = hmTYpeId;

		let userHierarchyTypesName = await commondao.getHierarchyTypesName(data)

		return { success: true, status: 200, message: '', response: await util.encryptResponse(userHierarchyTypesName) }
	} catch (e) {
		return { success: false, status: 500, message: 'Some error occurred', response: null }
	}
}

function sortArrayOfJSON(array, propertyName) {
  return array.sort((a, b) => {
    const propertyA = a[propertyName].toUpperCase();
    const propertyB = b[propertyName].toUpperCase();

    if (propertyA < propertyB) {
      return -1;
    }
    if (propertyA > propertyB) {
      return 1;
    }
    return 0;
  });
}

// Function to get distinct IDs
function getDistinctIds(jsonArray) {
    const idSet = new Set();
    jsonArray.forEach(obj => {
        if (obj.hierarchyDataId !== null && obj.hierarchyDataId !== 0) { // Check for null and 0
            idSet.add(obj.hierarchyDataId);
        }
    });
    return Array.from(idSet);
}

function searchId(jsonArray, idToSearch) {
    for (let obj of jsonArray) {
        if (obj.hierarchyDataId.toString() === idToSearch.toString()) {
            return obj; // Return the object if ID is found
        }
    }
    return null; // Return null if ID is not found
}



module.exports.getUserImmediateChildData = async (data) => {
	try {

		let finalArr = [];

		let childIds = [];

		let resp = [];

		let hmTyp = '';
		let hmTypId = '';

		let getTypOfItemId = await commondao.getTypeOfItemFromHierarchyType(data)

		if(getTypOfItemId.length > 0){

			if(getTypOfItemId[0].hmName == 'Location'){

				hmTyp = 'L'
				hmTypId = getTypOfItemId[0].hmId;
			}else if(getTypOfItemId[0].hmName == 'Product'){
				hmTyp = 'P'
				hmTypId = getTypOfItemId[0].hmId;
			}


		}

		let getImmediateLocationChilds = await commondao.getImmediateLocationChilds(data.clientId, data.hierarchyTypeId, data.hierarchyDataIdArr, hmTypId)

		if (getImmediateLocationChilds !== false) {

			if (getImmediateLocationChilds.length > 0) {

				if(hmTyp == 'L'){

					let childTypId = data.hierarchyChildTypeId;
					var getAllLastLevelLocationsUser = [];
					if (data.forCustomer !== undefined && data.forCustomer != null && data.forCustomer !== "" && data.forCustomer == "1") {
						getAllLastLevelLocationsUser = await commondao.getCustomerAllLastLevelLocationData(data.clientId, data.customerId)
					} else {
						getAllLastLevelLocationsUser = await commondao.getUserAllLastLevelLocationData(data.clientId, data.userId)
					}
	
					if (getAllLastLevelLocationsUser !== false) {
	
						if (getAllLastLevelLocationsUser.length > 0) {

	
							for (let j = 0; j < getAllLastLevelLocationsUser.length; j++) {
	
								let upperData = await hierearchyUtil.getUpperNodeByLeafId(hmTyp, data.clientId, getAllLastLevelLocationsUser[j].mstHierarchyTypeId, getAllLastLevelLocationsUser[j].hierarchyDataId)

								// console.log(upperData)
	
								let foundFlag = false;
	
								if (upperData !== false && upperData != null) {
	
									if (upperData.length > 0) {

										for(let s=0;s<getImmediateLocationChilds.length;s++){

											for (let i = 0; i < upperData.length; i++){

												if(getImmediateLocationChilds[s].hierarchyDataId == upperData[i].id && getImmediateLocationChilds[s].mstHierarchyTypeId == upperData[i].typeId){

													if (upperData[i].typeId == childTypId){

														finalArr.push({"hierarchyDataId":upperData[i].id, "hmName":upperData[i].name, "mstHierarchyTypeId":upperData[i].typeId, "hmTypeName":upperData[i].typeName})
													}


												}


											}

										}
	

									}
	
								}
	
							}
						}
					}
					if(finalArr.length == 0){

						resp = await hierearchyUtil.getCommonObjects(getImmediateLocationChilds, getImmediateLocationChilds)
					}else{

						resp = await hierearchyUtil.getCommonObjectsFormOneArray(finalArr, "hierarchyDataId")
					}
					

				}else if(hmTyp == 'P'){

					resp = await hierearchyUtil.getCommonObjects(getImmediateLocationChilds, getImmediateLocationChilds)
				}

				// console.log(resp)
				let actualResp = []

				let finalResp = sortArrayOfJSON(resp, "hmName")

				// console.log("finalResp")
				// console.log(finalResp)
				// console.log("finalResp")

				let allDistinctHierarchyDataId = getDistinctIds(finalResp)

				let getAllHierarchyDataStatus = await commondao.getHierarchyDataStatus(allDistinctHierarchyDataId)

				// console.log("getAllHierarchyDataStatus")
				// console.log(getAllHierarchyDataStatus)
				// console.log("getAllHierarchyDataStatus")

				if(getAllHierarchyDataStatus.length > 0){

					for(let l=0;l<finalResp.length;l++){

						// console.log(finalResp[l].hierarchyDataId)

						let respObj = searchId(getAllHierarchyDataStatus, finalResp[l].hierarchyDataId)

						// console.log("===================><")
						// console.log(respObj)
						// console.log("===================><")

						// console.log(l)

						if(respObj['status'] == 1){

							actualResp.push(finalResp[l])
						}
					}
				}

				// console.log("actualResp")
				// console.log(actualResp)
				// console.log("actualResp")


				return { success: true, status: 200, message: '', response: await util.encryptResponse(actualResp) }


			} else {

				return { success: true, status: 200, message: 'Data Not Found', response: null }

			}

		} else {

			return { success: false, status: 500, message: 'Some error occurred', response: null }
		}
	} catch (e) {

		return { success: false, status: 500, message: 'Some error occurred', response: null }
	}
}


async function dataOperationDone(clientId) {
	try {

		for (let i = 1414; i <= 2200; i++) {

			let getAllUser = await commondao.getAllUserData(clientId, i)

			getAllUser.tempCreatedDateMod = moment(getAllUser[0].tempCreatedDate, 'DD-MM-YYYY').format('YYYY-MM-DD');

			let insertIntoClientCustomerId = await commondao.insercustomer(getAllUser[0], clientId)


			let getLastNodes = await hierearchyUtil.getLastNodeId('L', clientId, "10", getAllUser[0].regionId)
			let getLastNodesVale = getLastNodes.split(',')

			if (Array.isArray(getLastNodesVale) === true) {

				for (let j = 0; j < getLastNodesVale.length; j++) {


					let insertIntoClientUser = await commondao.insertIntoLocatioTable(clientId, insertIntoClientCustomerId, 'clientCustomer', 12, getLastNodesVale[j])

				}
			}

		}



		return true;

	} catch (e) {
		util.createLog(e);
		return [];
	}
}


module.exports.dataInsert = async (data) => {
	try {

		let getCompnies = await commondao.getAllComapnys(data)

		for(let i = 0;i<getCompnies.length;i++){

			let clientSecret = null;
			clientSecret = sha1(getCompnies[i].clientId);

			let companyKey = null;
			companyKey = sha1(getCompnies[i].shortCode);

			await commondao.updateSatasdfe(getCompnies[i].clientId, clientSecret, companyKey)
		}


		let userHierarchyTypesSlNo = true;

		return { success: true, status: 200, message: '', response: await util.encryptResponse(userHierarchyTypesSlNo) }
	} catch (e) {

		return { success: false, status: 500, message: 'Some error occurred', response: null }
	}
}


/**
 * @author : Sukanta Samanta
 * @date : 24/06/2023
 * @description : get Daily Activity list model
 * @argument : 
 * @returns
 */

module.exports.getDailyActivities = async (data) => {
	try {
		let dailyActivities = await commondao.getDailyActivities(data)
		return { success: true, status: 200, message: '', response: await util.encryptResponse(dailyActivities) }
	} catch (e) {
		return { success: false, status: 500, message: 'Some error occurred', response: null }
	}
}

/**
 * @author : SKH
 * @date : 11/07/2023
 * @description : get All Measurements units list
 * @argument : type (	1=branding, 2=items,3=expenses)
 * @returns : ListData
 */

module.exports.getAllMeasurementUnitList = async (data) => {
	try {
		let list = await commondao.getAllMeasurementUnitList(data)
		return { success: true, status: 200, message: '', response: await util.encryptResponse(list) }
	} catch (e) {
		return { success: false, status: 500, message: 'Some error occurred', response: null }
	}
}


/**
 * @author : sourav bhoumik
 * @date : 19/07/2023
 * @description : get All download list
 * @argument : clientId, userId
 * @returns : ListData
 */

module.exports.getAllDownloadList = async (data) => {
	try {
		let list = await commondao.getAllDownloadList(data);

		return { success: true, status: 200, message: '', response: list }
	} catch (e) {
		return { success: false, status: 500, message: 'Some error occurred', response: null }
	}
}

/**
 * @author : Josimoddin Shaikh
 * @date : 06/03/2024
 * @description : get All download list with Status
 * @argument : clientId, userId
 * @returns : ListData
 * @UpdatedBy : Poritosh Byapari
 * @date : 06/03/2024
 */
module.exports.getAllDownloadProcessList = async (data) => {
	try {
		let finalList = await commondao.getAllDownloadProcessList(data);

		// let list1 = await commondao.getAllDownloadList(data);

		// let finalList = [...list, ...list1]

		for(let i=0; i < finalList.length; i++){
			if(finalList[i].downloadStatus.toString() == "0"){
				finalList[i].downloadStatus = 'Pending'
			}
			else if(finalList[i].downloadStatus.toString() == "1"){
				finalList[i].downloadStatus = 'In Progress'
			}
			else if(finalList[i].downloadStatus.toString() == "2"){
				finalList[i].downloadStatus = 'Completed'
			}
			else if(finalList[i].downloadStatus.toString() == "3"){
				finalList[i].downloadStatus = 'Error'
			}
			else{
				finalList[i].downloadStatus = ''
			}
		}

		return { success: true, status: 200, message: '', response: finalList }
	} catch (e) {
		return { success: false, status: 500, message: 'Some error occurred', response: null }
	}
}



/**
 * @author : Poritosh Byapari
 * @date : 08/03/2024
 * @description : get download Process Status
 * @argument : clientId, userId
 * @returns : objectData
 */
module.exports.getDownloadProcessStatus = async (data) => {
	try {
		let [list, list2]  = await commondao.getDownloadProcessStatus(data);
		let finalList = [...list, ...list2];
		finalList.sort((a, b) => b.createdAt - a.createdAt);
		return { success: true, status: 200, message: '', response: finalList[0] }
	} catch (e) {
		return { success: false, status: 500, message: 'Some error occurred', response: null }
	}
}


/**
 * @author : Sourav Bhoumik
 * @date : 05/09/2023
 * @description : get token for external users
 * @argument : clientId, roleId, userId
 * @returns : token
 */

module.exports.getToken = async (data) => {
	try {

		let systemUserId = await commondao.getSystemUserId(data.clientId);

		let userIdCheck = await commondao.ifUserExsist(data.clientId, data.userId);
		let roleIdCheck = await commondao.ifRoleExsist(data.clientId, data.roleId);
		let cleintIdCheck = await commondao.ifClientExsist(data.clientId);

		if (cleintIdCheck == '1' && userIdCheck == '1' && roleIdCheck == '1') {

			let bearerData = {
				"userId": data.userId,
				"clientId": data.clientId,
				"roleId": data.roleId
			};

			let tokenData = await token.createJWTToken(bearerData)

			return { success: true, status: util.statusCode.SUCCESS, message: 'Token generated successfully.It will be valid for next 24 hours', response: { "token": tokenData, "userId": data.userId, "clientId": data.clientId, "roleId": data.roleId } }


		} else {


			if (cleintIdCheck == '0') {

				return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Not exsistence of the provided clientId', response: null }

			} else if (userIdCheck == '0') {

				return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Not exsistence of the provided userId', response: null }


			} else if (roleIdCheck == '0') {

				return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Not exsistence of the provided roleId', response: null }


			} else {

				return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Not exsistence of the provided data', response: null }

			}

		}


	} catch (e) {
		return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null }
	}
}

/**
 * @author : sourav bhoumik
 * @date : 19/07/2023
 * @description : get All download list
 * @argument : clientId, userId
 * @returns : ListData
 */

module.exports.getAllLastLevelDataForUser = async (data) => {
	try {
		let list = await commondao.getAllLastLevelDataForUser(data);

		return { success: true, status: 200, message: '', response: list }
	} catch (e) {
		return { success: false, status: 500, message: 'Some error occurred', response: null }
	}
}


/**
 * @author : sourav bhoumik
 * @date : 19/07/2023
 * @description : get All download list
 * @argument : clientId, userId
 * @returns : ListData
 */

async function getALLChildsByParent(dataArr, data) {
	try {

		let uniqueIdArr = [];

		for(let i=0;i<dataArr.length;i++){

			let getChilds = await commondao.getChildData(data, dataArr[i]);

			if(getChilds){

				if(getChilds.length > 0){

					for(let h=0;h<getChilds.length;h++){

						uniqueIdArr.push(getChilds[h])
					}
				}
			}
		}


		return uniqueIdArr
	} catch (e) {
		util.createLog(e);
		return [];
	}
}


async function getALLChildAttributesByParent(dataArr, data) {

	try {

		let uniqueIdArr = [];

		for(let i=0;i<dataArr.length;i++){

			let getChilds = await commondao.getChildDataAttributes(data, dataArr[i]);

			if(getChilds){

				if(getChilds.length > 0){

					for(let h=0;h<getChilds.length;h++){

						uniqueIdArr.push(getChilds[h])
					}
				}
			}
		}


		return uniqueIdArr
	} catch (e) {
		util.createLog(e);
		return [];
	}
}


module.exports.getOfflineLtemsConfig = async (data) => {
	try {

		let finalRespProducts = [];
		let finalRespProductsAttributes = [];

		data.hmId = "2";

		let productMasterHierarchyTypes = await userdao.getHierarchyTypesData(data.clientId, 2);

		let getMaxProductLevelTypId = await userdao.getMaXpRODUCTlEVELtYPEiD(data.clientId);

		let getEmpHigherLevelProductMapping = await commondao.empsMappedHigherLevelProducts(data);

		if(getEmpHigherLevelProductMapping && getEmpHigherLevelProductMapping.length == 0){

			getEmpHigherLevelProductMapping = await userdao.getAllMaxLevelNameForProducts(data.clientId, getMaxProductLevelTypId);

		}

		finalRespProducts = finalRespProducts.concat(getEmpHigherLevelProductMapping);


		if(getEmpHigherLevelProductMapping.length > 0){

			let getChildsForLevelData_one = await getALLChildsByParent(getEmpHigherLevelProductMapping, data);

			if(getChildsForLevelData_one.length > 0){

				finalRespProducts = finalRespProducts.concat(getChildsForLevelData_one);

				let getChildsForLevelData_two = await getALLChildsByParent(getChildsForLevelData_one, data);


				if(getChildsForLevelData_two.length > 0){

					finalRespProducts = finalRespProducts.concat(getChildsForLevelData_two);

					let getLastLevelAttributes = await getALLChildAttributesByParent(getChildsForLevelData_two, data);

					if(getLastLevelAttributes.length > 0){

						finalRespProductsAttributes = finalRespProductsAttributes.concat(getLastLevelAttributes)
					}



				}

			}

		}

		return { success: true, status: 200, message: '', response: {"itemList": finalRespProducts, "itemAttributes":finalRespProductsAttributes} }
	} catch (e) {

		return { success: false, status: 500, message: 'Some error occurred', response: null }
	}
}




module.exports.getOfflineVisitFeedbackConfig = async (data) => {
	try {

		let mstVisitFeedbackCategoryData = [];
		let mstVisitFeedbackSubCategoryData = [];
		let mstVisitStatusData = [];

		mstVisitStatusData = await commondao.visitStatusListing(data);

		mstVisitFeedbackCategoryData = await commondao.getVisitFeedbackCategoryData(data);

		if(mstVisitFeedbackCategoryData.length > 0){

			for(let i=0;i<mstVisitFeedbackCategoryData.length;i++){

				let getSubCategories = await commondao.getVisitSubCtegoryByCategpory(mstVisitFeedbackCategoryData[i]);

				if(getSubCategories && getSubCategories.length > 0){

					mstVisitFeedbackCategoryData[i].visitFeedbackSubCategories = getSubCategories;
				}else{

					mstVisitFeedbackCategoryData[i].visitFeedbackSubCategories = [];

				}

			}

		}

		return { success: true, status: 200, message: '', response: {"mstVisitStatusData": mstVisitStatusData, "mstVisitFeedbackCategoryData":mstVisitFeedbackCategoryData} }
	} catch (e) {
		return { success: false, status: 500, message: 'Some error occurred', response: null }
	}
}



module.exports.getOfflineLtemsConfigModified1 = async (data) => {
	try {

		let finalRespProducts = [];
		let finalRespProductsAttributes = [];

		data.hmId = "2";

		let productMasterHierarchyTypes = await userdao.getHierarchyTypesData(data.clientId, 2);

		let getMaxProductLevelTypId = await userdao.getMaXpRODUCTlEVELtYPEiD(data.clientId);



		let getEmpHigherLevelProductMapping = await commondao.empsMappedHigherLevelProducts(data);

		if(getEmpHigherLevelProductMapping && getEmpHigherLevelProductMapping.length == 0){

			getEmpHigherLevelProductMapping = await userdao.getAllMaxLevelNameForProducts(data.clientId, getMaxProductLevelTypId);

		}

		finalRespProducts = finalRespProducts.concat(getEmpHigherLevelProductMapping);

		let i = 0;

		while(finalRespProducts[i].leafLevel != 0){

			let getChilds = await commondao.getChildData(data, {"id":finalRespProducts[i].id, "typeId":finalRespProducts[i].typeId});

			if(getChilds){

				if(getChilds.length > 0){

					for(let h=0;h<getChilds.length;h++){

						finalRespProducts.push(getChilds[h])

						let attributesData = await commondao.getChildDataAttributes(data, {"id":getChilds[h].id})

						if(attributesData){

							if(attributesData.length > 0){

								for(let x=0;x<attributesData.length;x++){

									finalRespProductsAttributes.push(attributesData[x])
								}
							}
						}

					}
				}
			}

			i+=1;
		}


		return { success: true, status: 200, message: '', response: {"itemList": finalRespProducts, "itemAttributes":finalRespProductsAttributes} }
	} catch (e) {

		return { success: false, status: 500, message: 'Some error occurred', response: null }
	}
}



module.exports.getAddressByLatLng = async (data) => {
	try {

		let address = await commondao.getAddressFromGoogleApi(data.lattitude, data.longitude);

		return { success: true, status: 200, message: '', response: address }
	} catch (e) {

		return { success: false, status: 500, message: 'Some error occurred', response: null }
	}
}


/**
 * @author : Sourav Bhoumik
 * @date : 28/04/2024
 * @description : delete data master
 * @argument : data
 * @returns : message
 */

module.exports.deleteMasterData = async (data) => {
	try {

		let currentDate = '';

        if (data.currentDateTime === undefined || data.currentDateTime == "" || data.currentDateTime == null) {
            currentDate = new Date();

        } else {
            currentDate = new Date(data.currentDateTime)
        }

        let currentYear = currentDate.getFullYear();
        let currentMonth = ("0" + (currentDate.getMonth() + 1)).slice(-2);
        let day = ("0" + currentDate.getDate()).slice(-2);

        let timeHours = ("0" + currentDate.getHours()).slice(-2);
        let timeMinutes = ("0" + currentDate.getMinutes()).slice(-2);
        let seconds = ("0" + currentDate.getSeconds()).slice(-2);

        data.currentDateTime = currentYear + '-' + currentMonth + '-' + day + ' ' + timeHours + ':' + timeMinutes + ':' + seconds;
        data.currentDate = currentYear + '-' + currentMonth + '-' + day;



		let tableName = ''

		let delResp = false

        if (data.type == "1") {

            tableName = "contactManagement"

            delResp = await commondao.deleteContactDate(data);

        } else if (data.type == "2") {

            tableName = "organizationManagement"

            delResp = await commondao.deleteOrganizationDate(data);


        } else if (data.type == "3") {

            tableName = "leadManagement" 

            delResp = await commondao.deleteLeadDate(data);


        } else if (data.type == "4") {

            tableName = "enqueryManagement" 

            delResp = await commondao.deleteEnqueryDate(data);


        }

        if(delResp){ 

        	return { success: true, status: 200, message: 'Deleted successfully', response: null }

        }else{

        	return { success: false, status: 500, message: 'Some error occurred', response: null }
        }

	} catch (e) {
		return { success: false, status: 500, message: 'Some error occurred', response: null }
	}
}