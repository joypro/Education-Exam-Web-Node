const dao 			        = require('../dao/mstClient_dao');
const token 				= require('../utility/token');
const util 					= require('../utility/util');
const commondao 			= require('../dao/commondao');
var sha1 					= require('sha1');
const transaction 			= require('../transaction');
const redisCon 				= require('../dbconnection').redisCon;
const spawn 				= require("child_process").spawn;
const config 				= require('../config');


const clientSettingsDataArray = [

		{
			"title":"User Limit",
			"settingsType":"userLimit",
			"settingsValue":"10"

		},
		{
			"title":"Is System Approval Required?",
			"settingsType":"systemApprovalRequired",
			"settingsValue":"0"

		},
		{
			"title":"Mark Opportunity As Sales?",
			"settingsType":"opportunityAsSales",
			"settingsValue":"0"

		},
		{
			"title":"Product Identity",
			"settingsType":"productIdentity",
			"settingsValue":"1"

		},
		{
			"title":"Show CRM?",
			"settingsType":"hasCRM",
			"settingsValue":"0"

		},
		{
			"title":"Show Cliky CRM?",
			"settingsType":"hasClikyCRM",
			"settingsValue":"0"

		},
		{
			"title":"Show SFA?",
			"settingsType":"hasSFA",
			"settingsValue":"0"

		},
		{
			"title":"Company logo",
			"settingsType":"companyLogo",
			"settingsValue":"/images/profileImage.png"

		},
		{
			"title":"Show OTS?",
			"settingsType":"hasOTS",
			"settingsValue":"0"

		},
		{
			"title":"Consolidated OTS Database?",
			"settingsType":"consolidatedOTSdatabase",
			"settingsValue":"0"

		},
		{
			"title":"Show MMS?",
			"settingsType":"hasMMS",
			"settingsValue":"0"

		},
		{
			"title":"Consolidated MMS Database?",
			"settingsType":"consolidatedMMSdatabase",
			"settingsValue":"0"

		},
		{
			"title":"Show LMS?",
			"settingsType":"hasLMS",
			"settingsValue":"0"

		},
		{
			"title":"Show DMS?",
			"settingsType":"hasDMS",
			"settingsValue":"0"

		},
		{
			"title":"Show EMS?",
			"settingsType":"hasEMS",
			"settingsValue":"0"

		},
		{
			"title":"Consolidated LMS Database?",
			"settingsType":"consolidatedLMSdatabase",
			"settingsValue":"0"

		},
		{
			"title":"Is System Approval Required For Customer?",
			"settingsType":"systemApprovalRequiredForCustomer",
			"settingsValue":"0"

		},
		{
			"title":"Is System Approval Required For Influencer?",
			"settingsType":"systemApprovalRequiredForInfluencer",
			"settingsValue":"0"

		},
		{
			"title":"Is System Approval Required For Target?",
			"settingsType":"systemApprovalRequiredForTarget",
			"settingsValue":"0"

		},
		{
			"title":"Is System Approval Required For Conversion?",
			"settingsType":"systemApprovalRequiredForConversion",
			"settingsValue":"0"

		},
		{
			"title":"Is System Approval Required For Employee?",
			"settingsType":"systemApprovalRequiredForEmployee",
			"settingsValue":"0"

		},
		{
			"title":"Is System Approval Required For User?",
			"settingsType":"systemApprovalRequiredForUser",
			"settingsValue":"0"

		},
		{
			"title":"Is System Approval Required For Enquery?",
			"settingsType":"systemApprovalRequiredForEnquery",
			"settingsValue":"0"

		},
		{
			"title":"Is System Approval Required For Expense?",
			"settingsType":"systemApprovalRequiredForExpense",
			"settingsValue":"0"

		},
		{
			"title":"Late will be consider after",
			"settingsType":"lateTime",
			"settingsValue":"00:00:00"

		},
		{
			"title":"User login parameter",
			"settingsType":"userLoginParam",
			"settingsValue":"1"

		},
		{
			"title":"Company allowed for Gamification",
			"settingsType":"companyGamificationSetting",
			"settingsValue":"0"

		},
		{
			"title":"Company allowed for Cliky Magic",
			"settingsType":"companyClikyMagicSetting",
			"settingsValue":"0"

		},
		{
			"title":"Is Order verified by OTP",
			"settingsType":"orderOTPVerification",
			"settingsValue":"0"

		},
		{
			"title":"Is offline Enabled",
			"settingsType":"offlineEnabled",
			"settingsValue":"0"

		},
		{
			"title":"Is System Approval Required For Order?",
			"settingsType":"systemApprovalRequiredForOrder",
			"settingsValue":"0"

		}

	]

const MASTER_MODULES = [
	{
		"type": "hasCRM",
		"userType": 4,
		"name": "crm",
		"menuid": [
			{
				"moduleid": 1,
				"isModuleAdmin": true,
				"ids": [
					{
						"id": 39,
						"view": 1,
						"add": 0,
						"edit": 0,
						"delete": 0
					},
					{
						"id": 2,
						"view": 1,
						"add": 1,
						"edit": 1,
						"delete": 1
					},
					{
						"id": 37,
						"view": 1,
						"add": 1,
						"edit": 1,
						"delete": 1
					},
					{
						"id": 4,
						"view": 1,
						"add": 0,
						"edit": 1,
						"delete": 0
					},
					{
						"id": 10,
						"view": 1,
						"add": 1,
						"edit": 1,
						"delete": 1
					},
					{
						"id": 1,
						"view": 1,
						"add": 1,
						"edit": 1,
						"delete": 1
					}
				]
			}, {
				"moduleid": 4,
				"isModuleAdmin": true,
				"ids": [
					{
						"id": 226,
						"view": 1,
						"add": 1,
						"edit": 1,
						"delete": 1
					},
					{
						"id": 225,
						"view": 1,
						"add": 0,
						"edit": 1,
						"delete": 0
					}
				]
			}, {
				"moduleid": 7,
				"isModuleAdmin": false,
				"ids": [
					{
						"id": 296,
						"view": 1,
						"add": 0,
						"edit": 0,
						"delete": 0,
						"name": "CRM Sales"
					},
					{
						"id": 275,
						"view": 1,
						"add": 1,
						"edit": 1,
						"delete": 1,
						"name": "Sales Stage"
					},
					{
						"id": 280,
						"view": 1,
						"add": 1,
						"edit": 1,
						"delete": 1,
						"name": "Lead Source"
					},
					{
						"id": 283,
						"view": 1,
						"add": 1,
						"edit": 1,
						"delete": 1,
						"name": "Expense Category"
					}, {
						"id": 305,
						"view": 1,
						"add": 0,
						"edit": 0,
						"delete": 0,
						"name": "Masters"
					}, {
						"id": 303,
						"view": 1,
						"add": 0,
						"edit": 1,
						"delete": 0,
						"name": "Target Master"
					}, {
						"id": 304,
						"view": 1,
						"add": 1,
						"edit": 1,
						"delete": 1,
						"name": "Partner Master"
					}, {
						"id": 302,
						"view": 1,
						"add": 1,
						"edit": 1,
						"delete": 1,
						"name": "Organization Master"
					}, {
						"id": 402,
						"view": 1,
						"add": 0,
						"edit": 0,
						"delete": 0,
						"name": "Mapping"
					}, {
						"id": 403,
						"view": 1,
						"add": 1,
						"edit": 1,
						"delete": 1,
						"name": "Employee Location Mapping"
					}, {
						"id": 404,
						"view": 1,
						"add": 1,
						"edit": 1,
						"delete": 1,
						"name": "Customer Location Mapping"
					}, {
						"id": 405,
						"view": 1,
						"add": 1,
						"edit": 1,
						"delete": 1,
						"name": " Employee Hierarchy Mapping"
					},
				]
			}
		]
	},
	{
		"type": "hasSFA",
		"userType": 5,
		"name": "sfa",
		"menuid": [
			{
				"moduleid": 2,
				"isModuleAdmin": true,
				"ids": [

					{
						"id": 34,
						"view": 1,
						"add": 0,
						"edit": 0,
						"delete": 0,
						"name": "Attandance"
					}, {
						"id": 14,
						"view": 1,
						"add": 0,
						"edit": 0,
						"delete": 0,
						"name": "Self Service"
					},
					{
						"id": 32,
						"view": 1,
						"add": 0,
						"edit": 0,
						"delete": 0,
						"name": "Odometer Reading"
					}, {
						"id": 2,
						"view": 1,
						"add": 0,
						"edit": 0,
						"delete": 0,
						"name": "Reports"
					},
					{
						"id": 348,
						"view": 1,
						"add": 0,
						"edit": 0,
						"delete": 0,
						"name": "Order Management"
					},
					{
						"id": 350,
						"view": 1,
						"add": 0,
						"edit": 0,
						"delete": 0,
						"name": "Order History"
					},
					{
						"id": 8,
						"view": 1,
						"add": 0,
						"edit": 0,
						"delete": 0,
						"name": "Visits"
					},
					{
						"id": 29,
						"view": 1,
						"add": 0,
						"edit": 0,
						"delete": 0,
						"name": "Create PJP"
					},
					{
						"id": 30,
						"view": 1,
						"add": 1,
						"edit": 0,
						"delete": 0,
						"name": "PJP Schedule"
					},
					{
						"id": 53,
						"view": 1,
						"add": 0,
						"edit": 0,
						"delete": 0,
						"name": "Master List"
					},
					{
						"id": 212,
						"view": 1,
						"add": 1,
						"edit": 1,
						"delete": 1,
						"name": "Partners"
					},
					{
						"id": 7,
						"view": 1,
						"add": 0,
						"edit": 0,
						"delete": 0,
						"name": "Activity"
					},
					{
						"id": 462,
						"view": 1,
						"add": 0,
						"edit": 0,
						"delete": 0,
						"name": "User Activity"
					},
					{
						"id": 46,
						"view": 1,
						"add": 0,
						"edit": 0,
						"delete": 0,
						"name": "Calender"
					}
				]
			}, {
				"moduleid": 5,
				"isModuleAdmin": true,
				"ids": [
					{
						"id": 240,
						"view": 1,
						"add": 0,
						"edit": 0,
						"delete": 0,
						"name": "Calender"
					},
					{
						"id": 238,
						"view": 1,
						"add": 1,
						"edit": 0,
						"delete": 0,
						"name": "Attendance"
					},
					{
						"id": 235,
						"view": 1,
						"add": 1,
						"edit": 0,
						"delete": 0,
						"name": "Odometer"
					},
					{
						"id": 217,
						"view": 1,
						"add": 1,
						"edit": 1,
						"delete": 0,
						"name": "Unplanned Visit"
					},
					{
						"id": 218,
						"view": 1,
						"add": 1,
						"edit": 1,
						"delete": 0,
						"name": "Planned Visit"
					},
					{
						"id": 242,
						"view": 1,
						"add": 1,
						"edit": 1,
						"delete": 0,
						"name": "Project Visit"
					},
					{
						"id": 243,
						"view": 1,
						"add": 1,
						"edit": 1,
						"delete": 0,
						"name": "Retail Visit"
					}
				]
			}, {
				"moduleid": 7,
				"isModuleAdmin": false,
				"ids": [
					{
						"id": 297,
						"view": 1,
						"add": 0,
						"edit": 0,
						"delete": 0,
						"name": "SFA"
					},
					{
						"id": 290,
						"view": 1,
						"add": 1,
						"edit": 1,
						"delete": 1,
						"name": "Visit Status"
					}, {
						"id": 305,
						"view": 1,
						"add": 0,
						"edit": 0,
						"delete": 0,
						"name": "Masters"
					}, {
						"id": 303,
						"view": 1,
						"add": 0,
						"edit": 1,
						"delete": 0,
						"name": "Target Master"
					}, {
						"id": 304,
						"view": 1,
						"add": 1,
						"edit": 1,
						"delete": 1,
						"name": "Partner Master"
					}, {
						"id": 402,
						"view": 1,
						"add": 0,
						"edit": 0,
						"delete": 0,
						"name": "Mapping"
					}, {
						"id": 403,
						"view": 1,
						"add": 1,
						"edit": 1,
						"delete": 1,
						"name": "Employee Location Mapping"
					}, {
						"id": 404,
						"view": 1,
						"add": 1,
						"edit": 1,
						"delete": 1,
						"name": "Customer Location Mapping"
					}, {
						"id": 405,
						"view": 1,
						"add": 1,
						"edit": 1,
						"delete": 1,
						"name": " Employee Hierarchy Mapping"
					},
				]
			}
		]
	},
	{
		"type": "hasMMS",
		"userType": 7,
		"name": "mms",
		"menuid": [
			{
				"moduleid": 3,
				"isModuleAdmin": true,
				"ids": [
					{
						"id": 74,
						"view": 1,
						"add": 0,
						"edit": 0,
						"delete": 0,
						"name": "Dashboard"
					},
					{
						"id": 75,
						"view": 1,
						"add": 0,
						"edit": 0,
						"delete": 0,
						"name": "Indent and Meetings"
					},
					{
						"id": 78,
						"view": 1,
						"add": 1,
						"edit": 1,
						"delete": 1,
						"name": "View Meetings"
					},
					{
						"id": 337,
						"view": 1,
						"add": 1,
						"edit": 1,
						"delete": 0,
						"name": "Commercial Approval"
					}
				]
			}, {
				"moduleid": 7,
				"isModuleAdmin": false,
				"ids": [
					{
						"id": 470,
						"view": 1,
						"add": 0,
						"edit": 0,
						"delete": 0,
						"name": "MMS"
					},
					{
						"id": 474,
						"view": 1,
						"add": 1,
						"edit": 1,
						"delete": 1,
						"name": "Meeting Expense Category"
					}, {
						"id": 475,
						"view": 1,
						"add": 1,
						"edit": 1,
						"delete": 1,
						"name": "Meeting Expense"
					}, {
						"id": 305,
						"view": 1,
						"add": 0,
						"edit": 0,
						"delete": 0,
						"name": "Masters"
					}, {
						"id": 304,
						"view": 1,
						"add": 1,
						"edit": 1,
						"delete": 1,
						"name": "Partner Master"
					}, {
						"id": 476,
						"view": 1,
						"add": 1,
						"edit": 1,
						"delete": 1,
						"name": "Meeting Type"
					}, {
						"id": 477,
						"view": 1,
						"add": 1,
						"edit": 1,
						"delete": 1,
						"name": "Role Wise Approval"
					}
				]
			}
		]
	},
	{
		"type": "hasLMS",
		"userType": 8,
		"name": "lms",
		"menuid": []
	},
	{
		"type": "hasDMS",
		"userType": 9,
		"name": "dms",
		"menuid": [
			{
				"moduleid": 7,
				"isModuleAdmin": false,
				"ids": [
					{
						"id": 305,
						"view": 1,
						"add": 0,
						"edit": 0,
						"delete": 0,
						"name": "Masters"
					}, {
						"id": 304,
						"view": 1,
						"add": 1,
						"edit": 1,
						"delete": 1,
						"name": "Partner Master"
					}, {
						"id": 402,
						"view": 1,
						"add": 0,
						"edit": 0,
						"delete": 0,
						"name": "Mapping"
					}, {
						"id": 404,
						"view": 1,
						"add": 1,
						"edit": 1,
						"delete": 1,
						"name": "Customer Location Mapping"
					}
				]
			}
		]
	},
	{
		"type": "hasEMS",
		"userType": 10,
		"name": "ems",
		"menuid": [
			{
				"moduleid": 9,
				"isModuleAdmin": true,
				"ids": [
					{
						"id": 309,
						"view": 1,
						"add": 0,
						"edit": 0,
						"delete": 0,
						"name": "Expenses"
					}, {
						"id": 316,
						"view": 1,
						"add": 0,
						"edit": 1,
						"delete": 0,
						"name": "Add Expenses"
					}, {
						"id": 317,
						"view": 1,
						"add": 0,
						"edit": 1,
						"delete": 0,
						"name": "Expense Rate config"
					}, {
						"id": 318,
						"view": 1,
						"add": 0,
						"edit": 1,
						"delete": 0,
						"name": "Approved Expense"
					}
				]
			}
		]
	}
]
const COMPANY_ADMIN_GENERIC_MODULE = [
	{
		"id": 293,
		"view": 1,
		"add": 0,
		"edit": 0,
		"delete": 0,
		"name": "Specific Unit"
	},
	{
		"id": 262,
		"view": 1,
		"add": 1,
		"edit": 1,
		"delete": 1,
		"name": "Designation"
	},
	{
		"id": 263,
		"view": 1,
		"add": 1,
		"edit": 1,
		"delete": 1,
		"name": "Department"
	},
	{
		"id": 264,
		"view": 1,
		"add": 1,
		"edit": 1,
		"delete": 1,
		"name": "Employee Role"
	},
	{
		"id": 266,
		"view": 1,
		"add": 1,
		"edit": 1,
		"delete": 1,
		"name": "Contact Type"
	},
	{
		"id": 265,
		"view": 1,
		"add": 1,
		"edit": 1,
		"delete": 1,
		"name": "Hierarchy Setup"
	},
	{
		"id": 268,
		"view": 1,
		"add": 1,
		"edit": 1,
		"delete": 1,
		"name": "Unit"
	},
	{
		"id": 295,
		"view": 1,
		"add": 0,
		"edit": 0,
		"delete": 0,
		"name": "Approval"
	},
	{
		"id": 270,
		"view": 1,
		"add": 1,
		"edit": 1,
		"delete": 1,
		"name": "Contacts"
	},
	{
		"id": 271,
		"view": 1,
		"add": 1,
		"edit": 1,
		"delete": 1,
		"name": "Organization"
	},
	{
		"id": 272,
		"view": 1,
		"add": 1,
		"edit": 1,
		"delete": 1,
		"name": "Leads"
	},
	{
		"id": 274,
		"view": 1,
		"add": 1,
		"edit": 1,
		"delete": 1,
		"name": "Customers"
	},
	{
		"id": 305,
		"view": 1,
		"add": 0,
		"edit": 0,
		"delete": 0,
		"name": "Masters"
	},
	{
		"id": 391,
		"view": 1,
		"add": 1,
		"edit": 1,
		"delete": 1,
		"name": "Hierarchy Type"
	},
	{
		"id": 393,
		"view": 1,
		"add": 1,
		"edit": 1,
		"delete": 1,
		"name": "Hierarchy Master"
	},
	{
		"id": 394,
		"view": 1,
		"add": 1,
		"edit": 1,
		"delete": 1,
		"name": "Hierarchy Data"
	},
	{
		"id": 395,
		"view": 1,
		"add": 1,
		"edit": 1,
		"delete": 1,
		"name": "Hierarchy Attribute"
	},
	{
		"id": 396,
		"view": 1,
		"add": 1,
		"edit": 1,
		"delete": 1,
		"name": "Hierarchy Attribute Type"
	}
]
const ADMIN_WEB_MODULE = 7;


// ================================================================== new ly added ======================================================

/**
 * @author : SOURAV
 * @date : 17/07/2024
 * @description : TEST API FOR LOCATION INTEGRATION
 * @argument : 
 * @returns
 */


const insertDataAndConf = async (clientId, userId, currentDateTime, mstHierarchyTypeData, hmTypeName, hmName, parentHMtypId, parentHMId, leafLevel, relation) => {
	try {

		let insrtedHmDataId = 0
		let getUpperOfParents = []

		connection = await transaction.getConnection();
		await transaction.beginTransaction(connection);

		// console.log("model called====================>>>")
		// console.log("mstHierarchyTypeData", mstHierarchyTypeData)

		let hierarchyDataObj = {

			"clientId"			:clientId,
			"hmId"				:'1',
			"mstHierarchyTypeId":mstHierarchyTypeData['hierarchyTypeId'],
			"hmName"			:hmName,
			"hmDescription"		:hmName,
			"parentHMtypId"		:parentHMtypId,
			"parentHMId"		:parentHMId,
			"leafLevel"			:leafLevel,
			"status"			:1,
			"createdAt"			:currentDateTime,
			"createdBy"			:userId
		}

		// console.log("hierarchyDataObj", hierarchyDataObj)

		insrtedHmDataId = await dao.insertHierarchyData(connection,hierarchyDataObj)

		let HierarchyMapConfDataObj = {

			"clientId"			:clientId,
			"hmId"				:'1',
			"hierarchyDesc"		:hmTypeName,
			"mstHierarchyDataId":insrtedHmDataId,
			"status"			:1,
			"createdAt"			:currentDateTime

		}

		let confResp = await dao.insertHierarchyMapConf(connection,HierarchyMapConfDataObj)

		let leafJson = {

			"id"		: insrtedHmDataId.toString(),
			"typeId"	: mstHierarchyTypeData['hierarchyTypeId'].toString(),
			"name"		: hmName,
			"typeName"	: mstHierarchyTypeData['hmTypDesc'].toString(),
			"slNo"		: mstHierarchyTypeData['SlNo'].toString()
        }

        getUpperOfParents.push(leafJson);

		if(parentHMId != '-1' && relation.length > 0){

			// console.log("for childs================>>>")
			for(let j=0;j<relation.length;j++){

				getUpperOfParents.push(relation[j])
			}
		}

        let gen_value = getUpperOfParents.sort((a, b) => b.slNo - a.slNo);

        let gen_key = clientId.toString() + ':' + '1' + ':' + mstHierarchyTypeData['hierarchyTypeId'].toString() + ':' + insrtedHmDataId.toString() + ':LU';

        // console.log("gen_key==>", gen_key)
        // console.log("gen_value==>", gen_value)


        let insertMysqlRedisConf = await dao.insertMYSQLredisConfig_V2(connection, gen_key.toString(), JSON.stringify(gen_value), currentDateTime)

        redisCon.set(gen_key.toString(), JSON.stringify(gen_value))


		await transaction.commitTransaction(connection);
		connection.release();

		return {"insrtedHmDataId":insrtedHmDataId, "relation":gen_value, 'success':true}

	} catch (e) {
		await connection.rollback();
		connection.release();
		util.createLog(e);
		return {"insrtedHmDataId":0, "relation":[], 'success':false};
	}
}

const callPythonFunction = async (clientId, hmId) => {

	console.log("py function called=================>>>")

	return new Promise((resolve, reject) => {
        const pyprocess = spawn('python3',[config.BASEPATH + "/src/utility/dlocationProcess.py", clientId, hmId]);

        let result = '';
        pyprocess.stdout.on('data', (data) => {
            result = data.toString();
            // resolve(result.trim());
        });

        pyprocess.stderr.on('data', (data) => {
            reject(data.toString());
        });

        pyprocess.on('close', (code) => {
            if (code === 0) {
                resolve(result.trim());
            } else {
                reject(`Process exited with code: ${code}`);
            }
        });
    });

}

const mappedDefaultLocations = async (clientId, userId, currentDateTime) => {
	try {

		// console.log("model called====================>>>")
		// console.log("clientId===>>", clientId)
		// console.log("userId===>>", userId)
		// console.log("currentDateTime===>>", currentDateTime)

		// console.log("mstHierarchyTypes===>", mstHierarchyTypes)

		const mstHierarchyTypes = [
			{
				"hmId"		: 1,
				"SlNo" 		: 1,
				"hmTypDesc" : "Country"
			},
			{
				"hmId"		: 1,
				"SlNo" 		: 2,
				"hmTypDesc" : "State"
			},
			{
				"hmId"		: 1,
				"SlNo" 		: 3,
				"hmTypDesc" : "District"
			},
			{
				"hmId"		: 1,
				"SlNo" 		: 4,
				"hmTypDesc" : "City"
			}

		]

		connection = await transaction.getConnection();
		await transaction.beginTransaction(connection);

		let addLocationHierarchyTypes = await dao.insertDefHierarchyTypes(connection,clientId,currentDateTime,mstHierarchyTypes)

		// console.log("addLocationHierarchyTypes==============>>>>>>>>>", addLocationHierarchyTypes)

		await transaction.commitTransaction(connection);
		connection.release();

		if(addLocationHierarchyTypes.success){

			let getDistinctCountries = await dao.getDistinctLocationsValues('country', '')

			// console.log("getDistinctCountries==>>", getDistinctCountries)

			if(getDistinctCountries.length > 0){

				// let getCountryHTypData = await dao.getLocHierarchyTypId(clientId, 'Country')


				let getCountryHTypData = mstHierarchyTypes.find(item => item["hmTypDesc"] === "Country");

				// console.log("getCountryHTypData===============================>>>>>", getCountryHTypData)

				let countryHmTypId = addLocationHierarchyTypes['countryHmTypId']

				getCountryHTypData['hierarchyTypeId'] = addLocationHierarchyTypes['countryHmTypId']

				// console.log("countryHmTypId===================================>>>>>", countryHmTypId)

				for(let i=0;i<getDistinctCountries.length;i++){

					country = getDistinctCountries[i]['country']

					// let countryHmData = await insertDataAndConf(connection,clientId,userId, currentDateTime, getCountryHTypData[0], 'country', country, '-1', '-1', '1', [])
					
					let countryHmData = await insertDataAndConf(clientId,userId, currentDateTime, getCountryHTypData, 'country', country, '-1', '-1', '1', [])

					// console.log("countryHmData==>", countryHmData)

					if(countryHmData['success']){

						let getStatesByCountry = await dao.getDistinctLocationsValues('state', country)

						// console.log("getStatesByCountry", getStatesByCountry)

						if(getStatesByCountry.length > 0){

							// let getStateHTypData = await dao.getLocHierarchyTypId(clientId, 'State')

							let getStateHTypData = mstHierarchyTypes.find(item => item["hmTypDesc"] === "State");

							// console.log("getStateHTypData===============================>>>>>", getStateHTypData)

							let stateHmTypId = addLocationHierarchyTypes['stateHmTypId']

							getStateHTypData['hierarchyTypeId'] = addLocationHierarchyTypes['stateHmTypId']

							// console.log("getCountryHTypData=========================>>>>>>", getCountryHTypData)

							for(let s=0;s<getStatesByCountry.length;s++){

								state = getStatesByCountry[s]['state']

								// let stateHmData = await insertDataAndConf(connection,clientId,userId, currentDateTime, getStateHTypData[0], 'state', state, getCountryHTypData[0]['hierarchyTypeId'], countryHmData['insrtedHmDataId'], '1', countryHmData['relation'])
								
								let stateHmData = await insertDataAndConf(clientId,userId, currentDateTime, getStateHTypData, 'state', state, getCountryHTypData['hierarchyTypeId'], countryHmData['insrtedHmDataId'], '1', countryHmData['relation'])

								// console.log("stateHmData", stateHmData)

								if(stateHmData['success']){

									let getDistrictsByState = await dao.getDistinctLocationsValues('district', state)

									// console.log("getDistrictsByState", getDistrictsByState)

									if(getDistrictsByState.length > 0){

										// let getDistrictHTypData = await dao.getLocHierarchyTypId(clientId, 'District')

										let getDistrictHTypData = mstHierarchyTypes.find(item => item["hmTypDesc"] === "District");

										// console.log("getDistrictHTypData===============================>>>>>", getDistrictHTypData)

										let districtHmTypId = addLocationHierarchyTypes['districtHmTypId']

										getDistrictHTypData['hierarchyTypeId'] = addLocationHierarchyTypes['districtHmTypId']

										// console.log("getDistrictHTypData=========================>>>>>>", getDistrictHTypData)

										for(let d=0;d<getDistrictsByState.length;d++){

											district = getDistrictsByState[d]['district']

											// let districtHmData = await insertDataAndConf(connection,clientId,userId, currentDateTime, getDistrictHTypData[0], 'district', district, getStateHTypData[0]['hierarchyTypeId'], stateHmData['insrtedHmDataId'], '1', stateHmData['relation'])

											let districtHmData = await insertDataAndConf(clientId,userId, currentDateTime, getDistrictHTypData, 'district', district, getStateHTypData['hierarchyTypeId'], stateHmData['insrtedHmDataId'], '1', stateHmData['relation'])

											// console.log("districtHmData", districtHmData)

											if(districtHmData['success']){

												let getCitiesByDistrict = await dao.getDistinctLocationsValues('city', district)

												// console.log("getCitiesByDistrict", getCitiesByDistrict)

												if(getCitiesByDistrict.length > 0){

													// let getCityHTypData = await dao.getLocHierarchyTypId(clientId, 'City')

													let getCityHTypData = mstHierarchyTypes.find(item => item["hmTypDesc"] === "City");

													// console.log("getCityHTypData===============================>>>>>", getCityHTypData)

													let cityHmTypId = addLocationHierarchyTypes['cityHmTypId']

													getCityHTypData['hierarchyTypeId'] = addLocationHierarchyTypes['cityHmTypId']

													// console.log("getCityHTypData=========================>>>>>>", getCityHTypData)

													for(let c=0;c<getCitiesByDistrict.length;c++){

														city = getCitiesByDistrict[c]['city']

														// let cityHmData = await insertDataAndConf(connection,clientId,userId, currentDateTime, getCityHTypData[0], 'city', city, getDistrictHTypData[0]['hierarchyTypeId'], districtHmData['insrtedHmDataId'], '0', districtHmData['relation'])

														let cityHmData = await insertDataAndConf(clientId,userId, currentDateTime, getCityHTypData, 'city', city, getDistrictHTypData['hierarchyTypeId'], districtHmData['insrtedHmDataId'], '0', districtHmData['relation'])

														// console.log("cityHmData", cityHmData)
													}
												}

											}
										}

									}

								}

							}

						}

					}

				}
			}

			// // const pythonProcess = spawn('python3',[config.BASEPATH + "/src/utility/dlocationProcess.py", clientId, '1']);
			const pythonProcess = await callPythonFunction(clientId, '1');
		}

		console.log("end====================")

		return true

	} catch (e) {
		util.createLog("error of main function===================================>>>>>>>>>", e);
		await connection.rollback();
		connection.release();
		
		return false;
	}
}


// =============================================================================================================================================================================







module.exports.mstAllClientData = async () => {
	try{
		let clientData = await dao.getAllClient()
		if (clientData) {
			return {success: true, status: util.statusCode.SUCCESS, message: '', response: await util.encryptResponse(clientData)}
		} else {
			return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
		}
	} catch (e) {
		return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null}
	}
}

function searchByClientId(jsonArray, idToSearch) {
    for (let obj of jsonArray) {
        if (obj.clientId === idToSearch) {
            return obj; // Return the object if ID is found
        }
    }
    return null; // Return null if ID is not found
}

module.exports.mstClientdata = async (data) => {
	try{
		let mstClientData = await dao.mstClientdata(data)

		if (mstClientData) {

			let getLocsUpdate = await dao.getLocHierarchyTypDataetc(data)

			for(let i=0;i<mstClientData.data.length;i++){

				let clientLoc = searchByClientId(getLocsUpdate, mstClientData.data[i]['clientId'])

				if(clientLoc != null){

					mstClientData.data[i]['isDefaultLocation'] = '1'

				}

			}

			return {success: true, status: util.statusCode.SUCCESS, message: '', response: await util.encryptResponse(mstClientData)}
		} else {
			return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
		}
	} catch (e) {
		console.log(e)
		return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null}
	}
}
module.exports.addClient = async (data) => {
	try{
		const isEmailCheck = await dao.checkEmailExistance(data.email);
		if (isEmailCheck) {
			const isPhoneCheck = await dao.checkPhoneExistance(data.phone);
			if (isPhoneCheck) {
				let newClientId = await dao.addClient(data);
				if(newClientId){
					let getNewCompanyData = await dao.getNewAddedCompanyData(newClientId);

					let clientSecret = null;
					clientSecret = sha1(getNewCompanyData[0].clientId);

					let companyKey = null;
					companyKey = sha1(getNewCompanyData[0].shortCode);

					let updateCompanySecrets = await dao.updateCompanySecrets(newClientId, clientSecret, companyKey)

					data.clientId = newClientId;
					let clientLocationMapId = await commondao.addclientlocation(data,newClientId,'mstClient');
					let caData = {
						"erpCode": 0,
						"clientUserId": 0,
						"clientId": newClientId,
						"firstName": data.clientName,
						"lastName": "Admin",
						"password": util.passwordHash("password"),
						"username": data.clientName+"Admin",
						"email": data.email,
						"phone": data.phone,
						"countryId": 0,
						"stateId": 0,
						"cityId": 0,
						"userId": data.userId,
						"designationId": 0,
						"userType": 1,
						"profileImgUrl": "/images/profileImage.png",
						"roleId": 0
					}
					let companyAdminId = await dao.addCompanyAdminUser(caData); // insert in user table
					let updateCompanyAdmin = await dao.updateCompanyAdmin(companyAdminId);  // set erpcode in user table
					// insert into role table by "company admin"
					let roleData = {
						"clientId": newClientId,
						"roleName": "Company Admin",
						"description" : "role assisgned by CLIKY admin",
						"createdBy" : data.userId
					}
					let roleId = await dao.addRole(roleData);  // add role for company admin
					// insert into designation table by "company admin"
					let designationData = {
						"clientId" : newClientId,
						"designationName" : "Company Admin",
						"createdBy" : data.userId 
					}
					let designationId = await dao.addDesignation(designationData); // add designationfor company admin
					// update role id and designation id in user table
					await dao.updateRoleAndDesignation(newClientId,companyAdminId,roleId,designationId); // update role and designation in user table

					// if(companyAdminId){
					// 	let addLocationData = await commondao.addclientlocation(data,companyAdminId,'user') // add location 'user'

					// }
					
					if(companyAdminId){
						let suData = {
							"erpCode":0,
							"clientUserId":0,
							"clientId": newClientId,
							"firstName": "System",
							"lastName": "User",
							"password":util.passwordHash("PASSWORD"),
							"username": "System Admin",
							"email": data.email,
							"phone": data.phone,
							"countryId": 0,
							"stateId":0,
							"cityId":0,
							"userId":data.userId,
							"designationId":0,
							"userType":3,
							"profileImgUrl":"/images/profileImage.png",
							"roleId":0
						}
						let systemUserId = await dao.addCompanyAdminUser(suData); // add system user
						let updateCompanyAdmin = await dao.updateCompanyAdmin(systemUserId); //update erpcode
						// insert in zone NA for country state district NA

						// await dao.addNAzone(newClientId,data.userId); // add NA zone 

						// // insert in client settings
						// let clientSettingsData = {
						// 	"clientId" : newClientId,
						// 	"title" : ["User Limit","Is System Approval Required?","Is System Approval Required customer?","Is System Approval Required contact?","Is System Approval Required organization?","Is System Approval Required lead?","Is System Approval Required enquiry?","Is System Approval Required user?","Mark Opportunity As Sales?","Product Identity","Show CRM?","Show SFA?", "Company logo","Show OTS?","Consolidated OTS Database","Show MMS?","Consolidated MMS Database","Show LMS?", "Consolidated LMS Database","Late will be consider after"],
						// 	"settingsType" : ["userLimit","systemApprovalRequired","systemApprovalRequiredCustomer","systemApprovalRequiredContact","systemApprovalRequiredOrganization","systemApprovalRequiredLead","systemApprovalRequiredEnquiry","systemApprovalRequiredUser","opportunityAsSales","productIdentity","hasCRM","hasSFA", "companyLogo","hasOTS","consolidatedOTSdatabase","hasMMS","consolidatedMMSdatabase","hasLMS","consolidatedLMSdatabase","lateTime"],
						// 	"settingsValue" : ["1","0","0","0","0","0","0","0","0","0","0","0", "/images/profileImage.png","0","0","0","0","0","0","00:00:00"]
						// }
						// for(let i = 0; i < clientSettingsData.title.length; i++){
						// 	await dao.addClientSettings(clientSettingsData.clientId,clientSettingsData.title[i],clientSettingsData.settingsType[i],clientSettingsData.settingsValue[i]); // add client settings
						// }

						let settingsArr = clientSettingsDataArray;

						if(settingsArr.length > 0){

							for(let s = 0; s < settingsArr.length; s++){

								await dao.addClientSettings(newClientId, settingsArr[s].title, settingsArr[s].settingsType, settingsArr[s].settingsValue)

							}


						}

						// if(systemUserId){
						// 	let addLocationData = await commondao.addclientlocation(data,systemUserId,'user')

						// }
					}
				}
				return {success: true, status: util.statusCode.SUCCESS, message: 'Client added successfully', response: null}
			} else {
				return {success: false, status: util.statusCode.PHONE_EXISTS, message: 'Phone number already exists', response: null}
			}
		} else {
			return {success: false, status: util.statusCode.EMAIL_EXISTS, message: 'Email already exists', response: null}
		}
	} catch (e) {

		return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null}
	}
}
module.exports.updateClient = async (data) => {
	try{

		let currentDate = '';

        if (data.currentDateTime === undefined || data.currentDateTime == "" || data.currentDateTime == null) {
            data.currentDateTime = new Date();
            currentDate = new Date()
        } else {
            currentDate = new Date(data.currentDateTime)
        }

        let date = ("0" + currentDate.getDate()).slice(-2);
        let month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
        let year = currentDate.getFullYear();
        let hours = ("0" + currentDate.getHours()).slice(-2);
        let minutes = ("0" + currentDate.getMinutes()).slice(-2);
        let seconds = ("0" + currentDate.getSeconds()).slice(-2);

        let currentDateTime = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
        let currentDateVal = year + "-" + month + "-" + date;

        data.currentDateTime = currentDateTime;
        data.currentDate = currentDateVal;

	    if (data.address === undefined || data.address == null || data.address == "") {
	        data.address = null
	    }

		const isEmailCheck = await dao.checkEmailExistanceUpdate(data);


		if (isEmailCheck==0) {
			const isPhoneCheck = await dao.checkPhoneExistanceUpdate(data);

			if (isPhoneCheck==0) {
				if(data.clientSortCode !== undefined && data.clientSortCode != '' && data.clientSortCode != null){

					data.companyKey = sha1(data.clientSortCode);

				}else{
					data.companyKey = null;
				}
				const resp = await dao.updateClient(data);
				if(resp){
					// let clientLocationMapId = await dao.updateClientLocationMap(data);
					let caData = {
						"firstName": data.clientName,
						"username": data.clientName+"Admin",
						"email": data.email,
						"phone": data.phone,
						"countryId": 0,
						"stateId": 0,
						"cityId": 0,
						"userType": 1
					}
					let companyAdminId = await dao.updateUser(caData);
					if(companyAdminId){
						let suData = {
							"firstName": "System",
							"username": "Syatem Admin",
							"email": data.email,
							"phone": data.phone,
							"countryId": 0,
							"stateId":0,
							"cityId":0,
							"userType": 3
						}
						let systemUserId = await dao.updateUser(suData);
					}
				}

				if(data.deafultLocation !== undefined && data.deafultLocation != '' && data.deafultLocation == '1'){

					let mappedResp = await mappedDefaultLocations(data.clientId, data.userId, data.currentDateTime);

					if(mappedResp){

						let updatDftLoc = await dao.updatDftLocations(data.clientId)
					}

					// let updatDftLoc = await dao.updatDftLocations(data.clientId)

				}

				return {success: true, status: util.statusCode.SUCCESS, message: 'Client updated successfully', response: null}
			} else {
				return {success: false, status: util.statusCode.PHONE_EXISTS, message: 'Phone number already exists', response: null}
			}
		} else {
			return {success: false, status: util.statusCode.EMAIL_EXISTS, message: 'Email already exists', response: null}
		}
	} catch (e) {
		console.log(e)

		return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null}
	}
}


module.exports.deleteClient = async (data) => {
	try{

		const resp = await dao.deleteClient(data);
		if (resp) {
			return {success: true, status: util.statusCode.SUCCESS, message: 'Client deleted successfully', response: null}
		} else {
			return {success: true, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
		}
	} catch (e) {
		return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null}
	}
}



/**
 * @author : Sourav Bhoumik
 * @date : 07/08/2023
 * @description : upload company's promotional banners
 * @argument : 
 * @returns
 */

module.exports.uploadCompanyBanners_model = async (data) => {
	try{
		let resp = true;
		let addRESP = 0;

		// console.log("data")
		// console.log(data)
		// console.log("data")

		// let insertResp = await dao.insertBannerIntoDb(data);

		if(data.success.length > 0){

			for(let i = 0;i<data.success.length;i++){
				let insertResp = await dao.insertBannerIntoDb(data.success[i]);

				if(insertResp){

					addRESP +=1;
				}
			}
		}

		// if (resp) {
		// 	return {success: true, status: util.statusCode.SUCCESS, message: 'Client deleted successfully', response: null}
		// } else {
		// 	return {success: true, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
		// }
	} catch (e) {
		return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null}
	}
}


/**
 * @author : Indranil
 * @date : 08/08/2023
 * @description : list promotional banners
 * @argument : 
 * @returns
 */


module.exports.uploadPromationalBannersdata = async (data) => {
	try{
		let uploadPromationalBannersdata = await dao.uploadPromationalBannersdata(data)
		if (uploadPromationalBannersdata) {
			return {success: true, status: util.statusCode.SUCCESS, message: '', response: await util.encryptResponse(uploadPromationalBannersdata)}
		} else {
			return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
		}
	} catch (e) {
		return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null}
	}
}

/**
 * @author : Indranil
 * @date : 08/08/2023
 * @description : delete promotional banners
 * @argument : 
 * @returns
 */


module.exports.deleteUploadPromationalBanners = async (data) => {
	try{

		const resp = await dao.deleteUploadPromationalBanners(data);
		if (resp) {
			return {success: true, status: util.statusCode.SUCCESS, message: 'Upload Promational Banners deleted successfully', response: null}
		} else {
			return {success: true, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
		}
	} catch (e) {
		return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null}
	}
}


/**
 * @author : Indranil
 * @date : 08/08/2023
 * @description : active or inactive promotional banners
 * @argument : 
 * @returns
 */


module.exports.activeUploadPromationalBanners = async (data) => {
	try{

		const resp = await dao.activeUploadPromationalBanners(data);

		if (resp.value) {
			if(resp.status==0){
				return {success: true, status: util.statusCode.SUCCESS, message: 'Upload Promational Banners inactive successfully', response: null}
			}else{
				return {success: true, status: util.statusCode.SUCCESS, message: 'Upload Promational Banners active successfully', response: null}
			}
			
		} else {
			return {success: true, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
		}
	} catch (e) {
		return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null}
	}
}


/**
 * @author : Indranil
 * @date : 08/08/2023
 * @description : active or inactive promotional banners multiple
 * @argument : 
 * @returns
 */


module.exports.activeUploadPromationalBannersMultiple = async (data) => {
	try{


		let resp = true;
		let addRESP = 0;

		if(data.array.length > 0){

			for(let i = 0;i<data.array.length;i++){
				let insertResp = await dao.activeUploadPromationalBannersMultiple(data.array[i], data);;

				if(insertResp){

					addRESP +=1;
				}
			}
		}
		// if (resp) {
			
		// 	return {success: true, status: util.statusCode.SUCCESS, message: 'Upload Promational Banners active successfully', response: null}
			
		// } else {
		// 	return {success: true, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
		// }
	} catch (e) {
		return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null}
	}
}


/**
 * @author : Prosenjit Paul
 * @date : 06/10/2023
 * @description : get ClientDetails
 * @argument : 
 * @returns
 */


module.exports.clientDetails_data = async (data) => {
    try { 

    	let resp = {};

		resp.locationMasterHierarchyTypes = await dao.getHierarchyTypesData(data.selectedClientId, 1);
		resp.productMasterHierarchyTypes = await dao.getHierarchyTypesData(data.selectedClientId, 2);

		resp.mappedCountires = await dao.getTopHierarchyData(data.selectedClientId, 1) ;
		resp.mappedMaxLevelForProducts = await dao.getTopHierarchyData(data.selectedClientId, 2);
		resp.selectedClientId = data.selectedClientId



        if(resp){

        	return {success: true, status: util.statusCode.SUCCESS, message: '', response: resp}

        }else{

        	return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null }
        }

    } catch (e) {

        return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null }
    }
}


/**
 * @author : Sarbojit
 * @date : 27/11/2023
 * @description : Add New Client
 * @argument : 
 * @returns
 */

module.exports.addClientV2 = async (data) => {
	try {
		const isEmailCheck = await dao.checkEmailExistance(data.email);
		if(isEmailCheck){
			const isPhoneCheck = await dao.checkPhoneExistance(data.phone);
			if(isPhoneCheck){

				let newClientId = await dao.addClientV2(data);

				if(newClientId){

					if (data.currentDateTime === undefined || data.currentDateTime == "" || data.currentDateTime == null) {
						currentDate = new Date();
					
					}else{
						currentDate = new Date(data.currentDateTime)
					}

					let clientSecrect = null;
					clientSecrect = sha1(newClientId);

					let companyKey = null;
					companyKey = sha1(data.clientSortCode)

					let updateCompanySecrets = await dao.updateCompanySecretsV2(newClientId,clientSecrect,companyKey)

					data.clientId = newClientId;
					// let clientLocationMapId = await commondao.addclientlocation(data,newClientId,'mstClient');

					let companyData = {
						"erpCode": 0,
						"clientUserId": 0,
						"clientId": newClientId,
						"firstName": data.clientName,
						"lastName": "Admin",
						"password": util.passwordHash("password"),
						"username": data.clientName+"Admin",
						"email": data.email,
						"phone": data.phone,
						"countryId": 0,
						"stateId": 0,
						"cityId": 0,
						"userId": 0,
						"designationId": 0,
						"userType": 1,
						"profileImgUrl": "/images/profileImage.png",
						"roleId": 0
					}
					let companyAdminId = await dao.addCompanyAdminUser(companyData); //creating user data
					
					let updateCompanyAdmin = await dao.updateCompanyAdmin(companyAdminId);  // set erpcode in user table

					// insert role data
					let roleData = {
						"clientId" : newClientId,
						"roleName" : "Comapny Admin",
						"description" : "role assign for demo purpose",
						"createdBy" : "0"
					}
					let roleId = await dao.addRoleV2(roleData) // add role for company admin

					//insert designation data
					let designationData = {
						"clientId" : newClientId,
						"designationName" : "Company Admin",
						"createdBy" : "0" 
					}
					let designationId = await dao.addDesignationV2(designationData); // add designationf or company admin

					let userDesignationData = {
						"clientId" : newClientId,
						"designationName" : "User",
						"createdBy" : "0" 
					}
					let userDesignationId =  await dao.addDesignationV2(designationData); // add designation for user

					// update role id and designation id in user table
					await dao.updateRoleAndDesignation(newClientId,companyAdminId,roleId,designationId); // update role and designation in user table

					if(companyAdminId){
						let systemUserData = {
							"erpCode":0,
							"clientUserId":0,
							"clientId": newClientId,
							"firstName": "System",
							"lastName": "User",
							"password": util.passwordHash("PASSWORD"),
							"username": "System Admin",
							"email": data.email,
							"phone": data.phone,
							"countryId": 0,
							"stateId":0,
							"cityId":0,
							"userId":0,
							"designationId":0,
							"userType":3,
							"profileImgUrl":"/images/profileImage.png",
							"roleId":0
						}
						let systemUserId = await dao.addCompanyAdminUser(systemUserData); // add system user

						let updateCompanyAdmin = await dao.updateCompanyAdmin(systemUserId); //update erpcode

						let settingsArr = clientSettingsDataArray;

						if(settingsArr.length > 0){

								for(let s = 0; s < settingsArr.length; s++){
									await dao.addClientSettings(newClientId, settingsArr[s].title, settingsArr[s].settingsType, settingsArr[s].settingsValue)
								}


							}

					}

					let bearerData = {
	                    "userId": companyAdminId,
	                    "userTypeId": 1,
	                    "clientId": newClientId,
	                    "roleId": roleId
	                };
	                let tokenData = await token.createJWTToken(bearerData)

					return {success: true, status: util.statusCode.SUCCESS, message: 'Client added successfully', response:{'clientId':newClientId, 'userId':companyAdminId, 'roleId':roleId, 'token':tokenData}}
				}else{

					return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null }
				}

			} else {
				return {success: false, status: util.statusCode.PHONE_EXISTS, message: 'Phone number already exists', response: null}
			}
		} else{
			return {success: false, status: util.statusCode.EMAIL_EXISTS, message: 'Email already exists', response: null}
		}
	} catch (e){

		return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null}
	}
}

/**
 * @author : Sarbojit
 * @date : 27/11/2023
 * @description : Update Client
 * @argument : 
 * @returns
 */

module.exports.updateClientV2 = async (data) => {
	try {
		const isEmailCheck = await dao.checkEmailExistanceUpdate(data);

		if(isEmailCheck == 0){
			const isPhoneCheck = await dao.checkPhoneExistanceUpdate(data);

			if(isPhoneCheck == 0){
				if(data.clientSortCode !== undefined && data.clientSortCode != '' && data.clientSortCode != null){

					data.companyKey = sha1(data.clientSortCode);

				}else{
					data.companyKey = null;
				}

				if (data.currentDateTime === undefined || data.currentDateTime == "" || data.currentDateTime == null) {
					currentDate = new Date();
				
				}else{
					currentDate = new Date(data.currentDateTime)
				}

				const resp = await dao.updateClientV2(data);

				if(resp){

					if(data.countryId === undefined && data.countryId == '' &&
					data.countryId == null){
						data.countryId = 0;
					}
					let clientLocationMapId = await dao.updateClientLocationMapV2(data);
					let caData = {
						"firstName": data.clientName,
						"username": data.clientName+"Admin",
						"email": data.email,
						"phone": data.phone,
						"countryId": 0,
						"stateId": 0,
						"cityId": 0,
						"userType": 1
					}
					let companyAdminId = await dao.updateUser(caData);
					if(companyAdminId){
						let suData = {
							"firstName": "System",
							"username": "Syatem Admin",
							"email": data.email,
							"phone": data.phone,
							"countryId": 0,
							"stateId":0,
							"cityId":0,
							"userType": 3
						}
						let systemUserId = await dao.updateUser(suData);
					}
				}
				return {success: true, status: util.statusCode.SUCCESS, message: 'Client updated successfully', response: null}
			} else {
				return {success: false, status: util.statusCode.PHONE_EXISTS, message: 'Phone number already exists', response: null}
			}
		} else {
			return {success: false, status: util.statusCode.EMAIL_EXISTS, message: 'Email already exists', response: null}
		}
	} catch(e){
		return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null}
	}
}

/**
 * @author : Sarbojit
 * @date : 27/11/2023
 * @description : Delete Client
 * @argument : 
 * @returns
 */

module.exports.deleteClientV2 = async (data) => {
	try{

		if (data.currentDateTime === undefined || data.currentDateTime == "" || data.currentDateTime == null) {
			currentDate = new Date();
		
		}else{
			currentDate = new Date(data.currentDateTime)
		}
		const resp = await dao.deleteClientv2(data);
		if (resp) {
			return {success: true, status: util.statusCode.SUCCESS, message: 'Client deleted successfully', response: null}
		} else {
			return {success: true, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
		}
	} catch (e) {
		return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null}
	}
}
/**
 * @author : Subham
 * @date : 08/01/2024
 * @description : Delete Client
 * @argument : 
 * @returns
 */
module.exports.deleteClientV3 = async (data) => {
	let connection;
	try {
		connection = await transaction.getConnection();
		await transaction.beginTransaction(connection);
		await dao.deleteClientV3(connection, data);
		await dao.deleteUserV3(connection, data);
		await dao.deleteDesignationV3(connection, data);
		await dao.deleteUserRoleV3(connection, data);
		await dao.deleteUserRoleModuleV3(connection, data);
		
		await transaction.commitTransaction(connection);
		connection.release();
		return { success: true, status: util.statusCode.SUCCESS, message: 'Client deleted successfully', response: null }

	} catch (e) {
		if (connection) {
			await connection.rollback();
			connection.release();
		}
		return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null }
	}
}
/**
 * @author : Subham
 * @date : 11/11/2023
 * @description : Add New Client
 * @argument : 
 * @returns
 */
module.exports.gn_addClient = async (data) => {
	let connection;
	try {
		const isUserEmailCheck = await dao.checkUserEmailExistance(data.email);
		if (isUserEmailCheck) {
			const isUserPhoneCheck = await dao.checkUserPhoneExistance(data.phone);
			if (isUserPhoneCheck) {
				const isEmailCheck = await dao.checkEmailExistance(data.email);
				if (isEmailCheck) {
					const isPhoneCheck = await dao.checkPhoneExistance(data.phone);

					if (isPhoneCheck) {
						connection = await transaction.getConnection();
						await transaction.beginTransaction(connection);
						let newClientId = await dao.gn_addClient(connection, data);
						if (newClientId) {

							if (data.currentDateTime === undefined || data.currentDateTime == "" || data.currentDateTime == null) {
								currentDate = new Date();

							} else {
								currentDate = new Date(data.currentDateTime)
							}

							let clientSecrect = null;
							clientSecrect = sha1(newClientId);

							let companyKey = null;
							companyKey = sha1(data.clientSortCode)

							await dao.gn_updateCompanySecrets(connection, newClientId, clientSecrect, companyKey)

							data.clientId = newClientId;

							let allusers = [];
							/**
							 * Creating a Admin User,Role and Designation for mapped module
							 */
							let allmodules = []
							for (let i = 0; i < MASTER_MODULES.length; i++) {
								if (data.modules[MASTER_MODULES[i].type] == 1) {
									let menus = MASTER_MODULES[i].menuid;
									let moduleMenus = [];
									for (let j = 0; j < menus.length; j++) {

										for (let k = 0; k < menus[j].ids.length; k++) {
											menus[j].ids[k].specificModule = menus[j].moduleid;
											if (menus[j].isModuleAdmin) {
												moduleMenus.push(menus[j].ids[k])
											}
											allmodules.push(menus[j].ids[k])
										}
									}
									 util.createLog('---->' + JSON.stringify(moduleMenus)+ ': '+MASTER_MODULES[i].name)
									let newusername = MASTER_MODULES[i].name + newClientId + '@' + data.clientSortCode;
									let isAdded = await createUserAndMapwithRoleDesignation(connection, newClientId, MASTER_MODULES[i].name + " Admin", MASTER_MODULES[i].name + " Admin", data, MASTER_MODULES[i].userType, moduleMenus, newusername, newusername)
									if (!isAdded.success) {
										await connection.rollback();
										connection.release();
										return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null }
									}
									allusers.push({ name: MASTER_MODULES[i].name, username: newusername })
								}
							}
							for (let i = 0; i < COMPANY_ADMIN_GENERIC_MODULE.length; i++) {
								COMPANY_ADMIN_GENERIC_MODULE[i].specificModule = ADMIN_WEB_MODULE;
								allmodules.push(COMPANY_ADMIN_GENERIC_MODULE[i])
							}
							/**
							 * Creating Client admin,role and designation.
							 *  Also map module/menu under client admin role
							 */
							let companyAdmin = await createUserAndMapwithRoleDesignation(connection, newClientId, "Company Admin", "Company Admin", data, 1, allmodules, data.email, data.email)
							if (!companyAdmin.success) {
								await connection.rollback();
								connection.release();
								return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null }
							} else {
								let companyAdminId = 0;
								let roleId = 0;
								if (companyAdmin) {
									companyAdminId = companyAdmin.companyAdminId;
									roleId = companyAdmin.roleId
								}
								util.createLog('companyAdmin:' + JSON.stringify(companyAdmin))
								allusers.push({ name: "Company", username: data.email })
								if (companyAdminId > 0) {

									/**
									 * Create system admin user
									 */
									let systemUserData = {
										"erpCode": 0,
										"clientUserId": 0,
										"clientId": newClientId,
										"firstName": "System",
										"lastName": "User",
										"password": util.passwordHash("PASSWORD"),
										"username": "System Admin",
										"email": data.email,
										"phone": data.phone,
										"countryId": 0,
										"stateId": 0,
										"cityId": 0,
										"userId": 0,
										"designationId": 0,
										"userType": 3,
										"profileImgUrl": "/images/profileImage.png",
										"roleId": 0
									}
									let systemUserId = await dao.gn_addCompanyAdminUser(connection, systemUserData); // add system user

									await dao.gn_updateCompanyAdmin(connection, systemUserId); //update erpcode

									let orgData = {
										"clientId": newClientId,
										"organizationName": 'No Organization',
										"ownerName": data.clientName,
										"email": data.email,
										"phone": data.phone,
										"assignTo": companyAdminId,
										"assignType": 1,
										"contactId": 0,
										"contactType": 1,
										"description": 'No organization for data mapping',
										"accessId": companyAdminId,
										"approvedStatus": 1,
										"approvedBy": systemUserId,
										"createdBy": companyAdminId
									}
									await dao.gn_addOrganization(connection, orgData)

									/**
									 * Map basic  configuration for client
									 */
									let modules = Object.keys(data.modules)
									let settingsArr = await dao.fetchClientConfiguration();
									if (settingsArr && settingsArr.length > 0) {
										for (let s = 0; s < settingsArr.length; s++) {
											modules.forEach((key) => {
												if (settingsArr[s].settingsType == key) {
													settingsArr[s].settingsValue = data.modules[key]
												}
											})
											await dao.gn_addClientSettings(connection, newClientId, settingsArr[s].title, settingsArr[s].settingsType, settingsArr[s].settingsValue)
										}
									}

								}
								let bearerData = {
									"userId": companyAdminId,
									"userTypeId": 1,
									"clientId": newClientId,
									"roleId": roleId
								};
								let tokenData = await token.createJWTToken(bearerData)

								await transaction.commitTransaction(connection);
								connection.release();
								let message = '<b>Dear ' + data.clientName + ', </b> <br><br> A new Client is created along with ' + allusers.length + ' users.' +
									' Please find the user credentials along with the role.<br><br>'
								for (let i = 0; i < allusers.length; i++) {
									message = message + '<b> Role : </b>' + allusers[i].name.toUpperCase() + ' ADMIN , <b> User Name: </b>' + allusers[i].username + '  ,<b> Password:</b> password  <br></br>'
								}
								message = message + '<p style="color:red;"> <b>N.B:</b> Please Change the default password after first login.</p><br><br> <b> Best Wishes,<br>Clicky Team</b>'
								util.sendMail({ toemail: data.email, subject: 'Client Created Successfully', message: message })
								return { success: true, status: util.statusCode.SUCCESS, message: 'Client added successfully', response: { 'clientId': newClientId, 'userId': companyAdminId, 'roleId': roleId, 'token': tokenData } }
							}
						} else {
							await connection.rollback();
							connection.release();
							return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null }
						}

					} else {

						return { success: false, status: util.statusCode.PHONE_EXISTS, message: 'Phone number already exists', response: null }
					}
				} else {

					return { success: false, status: util.statusCode.EMAIL_EXISTS, message: 'Email already exists', response: null }
				}
			} else {

				return { success: false, status: util.statusCode.PHONE_EXISTS, message: 'Phone number already exists', response: null }
			}
		} else {

			return { success: false, status: util.statusCode.EMAIL_EXISTS, message: 'Email already exists', response: null }
		}
	} catch (e) {
		if (connection) {
			await connection.rollback();
			connection.release();
		}

		return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null }
	}
}
/**
 * 
 * @param {*} connection 
 * @param {*} clientid 
 * @param {*} rolename 
 * @param {*} designationname 
 * @param {*} data  user data contains email and phone
 * @param {*} userType  
 * @param {*} modulePermission 
 * @param {*} username 
 * @returns 
 * This function create  role,designation for user and map them with the user.
 * Also map the module and menu under the created role and generate a ERP code for the created user.
 */
async function createUserAndMapwithRoleDesignation(connection, clientid, rolename, designationname, data, userType, modulePermission, username, email) {
	try {
		// insert role data
		createRole = async () => {
			let roleData = {
				"clientId": clientid,
				"roleName": rolename,
				"description": "role assign for demo purpose",
				"createdBy": "0"
			}
			return await dao.gn_addRole(connection, roleData) // add role for company admin
		}

		//insert designation data
		createDesignation = async () => {
			let designationData = {
				"clientId": clientid,
				"designationName": designationname,
				"createdBy": "0"
			}
			return await dao.gn_addDesignation(connection, designationData); // add designationf or company admin
		}
		let [roleId, designationId] = await Promise.all([
			createRole(),
			createDesignation()
		]);
		addMenuPermission = async () => {
			for (let i = 0; i < modulePermission.length; i++) {
				await dao.gn_addMenuPermission(connection, clientid, modulePermission[i], roleId)
			}
			return true
		}
		addUser = async () => {
			let companyData = {
				"erpCode": 0,
				"clientUserId": 0,
				"clientId": clientid,
				"firstName": username,
				"lastName": "Admin",
				"password": util.passwordHash("password"),
				"username": username,
				"email": email,
				"phone": data.phone,
				"countryId": 0,
				"stateId": 0,
				"cityId": 0,
				"userId": 0,
				"designationId": designationId,
				"userType": userType,
				"profileImgUrl": "/images/profileImage.png",
				"roleId": roleId
			}
			let companyAdminId = await dao.gn_addCompanyAdminUser(connection, companyData); //creating user data
			await dao.gn_updateCompanyAdmin(connection, companyAdminId);  // set erpcode in user table
			return companyAdminId

		}
		let [perm, companyAdminId] = await Promise.all([
			addMenuPermission(),
			addUser()
		]);

		util.createLog(username + " created with role " + rolename + " having userid and roleid :" + companyAdminId + " ," + roleId)
		return { companyAdminId: companyAdminId, roleId: roleId, success: true }
	} catch (e) {
		util.createLog(e);

		return { success: false };
	}
}









/**
 * @author : Sourav Bhoumik
 * @date : 15/07/2024
 * @description : Add New Client with new feature
 * @argument : 
 * @returns
 */
module.exports.addNewClient = async (data) => {
	let connection;
	try {

		let currentDate = '';

        if (data.currentDateTime === undefined || data.currentDateTime == "" || data.currentDateTime == null) {
            data.currentDateTime = new Date();
            currentDate = new Date()
        } else {
            currentDate = new Date(data.currentDateTime)
        }

        let date = ("0" + currentDate.getDate()).slice(-2);
        let month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
        let year = currentDate.getFullYear();
        let hours = ("0" + currentDate.getHours()).slice(-2);
        let minutes = ("0" + currentDate.getMinutes()).slice(-2);
        let seconds = ("0" + currentDate.getSeconds()).slice(-2);

        let currentDateTime = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
        let currentDateVal = year + "-" + month + "-" + date;

        data.currentDateTime = currentDateTime;
        data.currentDate = currentDateVal;

        if (data.address === undefined || data.address == "" || data.address == null) {
            data.address = null
        }

		const isUserEmailCheck = await dao.checkUserEmailExistance(data.email);
		if (isUserEmailCheck) {
			const isUserPhoneCheck = await dao.checkUserPhoneExistance(data.phone);
			if (isUserPhoneCheck) {
				const isEmailCheck = await dao.checkEmailExistance(data.email);
				if (isEmailCheck) {
					const isPhoneCheck = await dao.checkPhoneExistance(data.phone);

					if (isPhoneCheck) {
						connection = await transaction.getConnection();
						await transaction.beginTransaction(connection);
						let newClientId = await dao.addClientForNewClient(connection, data);
						if (newClientId) {

							let clientSecrect = null;
							clientSecrect = sha1(newClientId);

							let companyKey = null;
							companyKey = sha1(data.clientSortCode)

							await dao.gn_updateCompanySecrets(connection, newClientId, clientSecrect, companyKey)

							data.clientId = newClientId;

							let allusers = [];
							/**
							 * Creating a Admin User,Role and Designation for mapped module
							 */

							let adminRoleDataObj = {
									"clientId"		: newClientId,
									"roleName"		: "Company Admin",
									"description" 	: "Role assisgned by CLIKY admin",
									"createdBy" 	: data.userId,
									"createDate" 	: data.currentDateTime
							}

							let createdAdminRoleId = await dao.addRoleForNewClient(connection, adminRoleDataObj);

							let adminDesignationDataObj = {
									"clientId"			: newClientId,
									"designationName"	: "Company Admin",
									"createdBy" 		: data.userId,
									"createdAt" 		: data.currentDateTime
							}

							let createdAdminDesignationId = await dao.addDesignationForNewClient(connection, adminDesignationDataObj);

							let companyAdminData = {
								"erpCode"		: 0,
								"clientUserId"	: 0,
								"clientId"		: newClientId,
								"firstName"		: data.clientName,
								"lastName"		: "Admin",
								"empType"       : "Admin",
								"password"		: util.passwordHash("password"),
								"username"		: data.email,
								"email"			: data.email,
								"phone"			: data.phone,
								"countryCode"	: data.countryCode,
								"userId"		: data.userId,
								"address"		: data.address,
								"designationId"	: createdAdminDesignationId,
								"userType"		: 1,
								"profileImgUrl"	: "/images/profileImage.png",
								"roleId"		: createdAdminRoleId,
								"createdAt"		: data.currentDateTime,
								"createdBy"		: data.userId,
								"isApproved"		: 1,
								"approvedBy"		: data.userId,
								"approvedAt"		: data.currentDateTime,
								"approvedRemarks" 	: "Approved during company add",
								"userType"			: 1
							}
							
							let companyAdminId = await dao.addCompanyAdminUserForNewClient(connection, companyAdminData); // insert in user table
							let updateCompanyAdmin = await dao.gn_updateCompanyAdmin(connection, companyAdminId);  // set erpcode in user table

							let systemAdminData = {
								"erpCode"		: 0,
								"clientUserId"	: 0,
								"clientId"		: newClientId,
								"firstName"		: "System",
								"lastName"		: "Admin",
								"empType"       : "Admin",
								"password"		: "PASSWORD",
								"username"		: data.email,
								"email"			: data.email,
								"phone"			: data.phone,
								"countryCode"	: data.countryCode,
								"userId"		: data.userId,
								"address"		: data.address,
								"designationId"	: createdAdminDesignationId,
								"userType"		: 1,
								"profileImgUrl"	: "/images/profileImage.png",
								"roleId"		: createdAdminRoleId,
								"createdAt"		: data.currentDateTime,
								"createdBy"		: data.userId,
								"isApproved"		: 1,
								"approvedBy"		: data.userId,
								"approvedAt"		: data.currentDateTime,
								"approvedRemarks" 	: "Approved during company add",
								"userType"			: 3
							}
							
							let systemAdminId = await dao.addCompanyAdminUserForNewClient(connection, systemAdminData); // insert in user table
							let updateSystemAdmin = await dao.gn_updateCompanyAdmin(connection, systemAdminId);  // set erpcode in user table

							let getAllModulesPermissionOfAdmin = await dao.addMenuPermissionForNewClient(connection, newClientId,data.userId, createdAdminRoleId, 'admin', data.currentDateTime)


							let addNotAssignContactType = await dao.addNotAssignContactTypeDaoForNewClient(connection, newClientId,data, companyAdminId)

							let orgData = {

								"clientId"			: newClientId,
								"organizationName"	: 'No Organization',
								"ownerName"			: data.clientName,
								"email"				: data.email,
								"phone"				: data.phone,
								"assignTo"			: companyAdminId,
								"assignType"		: 1,
								"contactId"			: 0,
								"contactType"		: 1,
								"address"			: data.address,
								"description"		: 'No organization for data mapping',
								"accessId"			: companyAdminId,
								"approvedStatus"	: 1,
								"approvedBy"		: systemAdminId,
								"approvedDatetime"	: data.currentDateTime,
								"approvedRemarks"	: 'No Organization approved by the System user',
								"createdBy"			: companyAdminId,
								"createdAt"			: data.currentDateTime
							}
							
							let norOrgId = await dao.addNoOrganizationForNewClient(connection, orgData)


							let addClientSettingsResp = await dao.addClientSettingsForNewClient(connection, newClientId,data)


							// await transaction.commitTransaction(connection);
							// connection.release();

							if(data.deafultLocation == '1'){

								let mappedResp = await mappedDefaultLocations(newClientId, companyAdminId, data.currentDateTime);

								if(mappedResp){

									let updatDftLoc = await dao.updatDftLocations(newClientId)
								}

							}

							await transaction.commitTransaction(connection);
							connection.release();

							return { success: true, status: util.statusCode.SUCCESS, message: 'Client added successfully', response: { 'clientId': newClientId, 'userId': companyAdminId } }

						} else {
							await connection.rollback();
							connection.release();
							return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null }
						}

					} else {

						return { success: false, status: util.statusCode.PHONE_EXISTS, message: 'Phone number already exists', response: null }
					}
				} else {

					return { success: false, status: util.statusCode.EMAIL_EXISTS, message: 'Email already exists', response: null }
				}
			} else {

				return { success: false, status: util.statusCode.PHONE_EXISTS, message: 'Phone number already exists', response: null }
			}
		} else {

			return { success: false, status: util.statusCode.EMAIL_EXISTS, message: 'Email already exists', response: null }
		}
	} catch (e) {
		console.log(e)
		if (connection) {
			await connection.rollback();
			connection.release();
		}

		return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null }
	}
}















module.exports.testLocationMapping = async (data) => {
	try{

		data.currentDateTime = "2024-07-19 16:52:36"

		let resp = true;
		// console.log("============================>>> model calling")

		// console.log("clientId====>>>", data.client_id)

		let clientId = data.client_id
		let userId = data.userId
		let currentDateTime = data.currentDateTime

		let mappedResp = await mappedDefaultLocations(clientId, userId, currentDateTime);

		// const pythonProcess = spawn('python3',[config.BASEPATH + "/src/utility/dlocationProcess.py", clientId, '1']);

		// let result = await callPythonFunction(clientId, '1')

        // console.log("result===========>>>", result)


		if (resp) {
			return {success: true, status: util.statusCode.SUCCESS, message: 'Client Mapped successfully', response: null}
		} else {
			return {success: true, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
		}
	} catch (e) {
		console.log("error==>>", e)
		return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null}
	}
}