const dao 			        =	require('../dao/appVersions_dao');
const token 				=	require('../utility/token');
const util 					=	require('../utility/util');

const contactdao 			        =	require('../dao/contactManagement_dao');
const commondao 			=    require('../dao/commondao');

const mstClientdao 			        =    require('../dao/mstClient_dao');
var sha1 = require('sha1');




module.exports.getAllAppVersions = async (data) => {
	try{

		let resp = await dao.getAllAppVersions(data)

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



module.exports.addNewAppVersion = async (data) => {
	try{

		let resp = false;

		// for copy insert-=================
		if(data.insertType == '2'){

			let inactiveAllPreviousVersions = await dao.inactiveAllPreviousVersions(data);

			if(inactiveAllPreviousVersions){

				resp = await dao.addNewAppVersion(data);

			}

		}else{

			resp = await dao.addNewAppVersion(data);

		} 


		if(resp){
			return {success: true, status: util.statusCode.SUCCESS, message: 'Version Added Successfully', response: null}
		}else{
			return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
		}

	} catch (e) {
		return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null}
	}
}


module.exports.changeUpdateStatus = async (data) => {
	try{

		let resp = await dao.changeUpdateStatus(data)

		if (resp){

			return {success: true, status: util.statusCode.SUCCESS, message: 'App update status changed Successfully', response: null}
		}
		else {
			return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}

		}

	} catch (e) {
		return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null}
	}
}

module.exports.deleteAppVersion = async (data) => {
	try{

		let resp = await dao.deleteAppVersion(data)

		if (resp){

			return {success: true, status: util.statusCode.SUCCESS, message: 'App verson deleted Successfully', response: null}
		}
		else {
			return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}

		}

	} catch (e) {
		return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null}
	}
}


module.exports.updateNewAppVersion = async (data) => {
	try{

		let resp = await dao.updateNewAppVersion(data)

		if (resp){

			return {success: true, status: util.statusCode.SUCCESS, message: 'App verson updated Successfully', response: null}
		}
		else {
			return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}

		}

	} catch (e) {
		return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null}
	}
}