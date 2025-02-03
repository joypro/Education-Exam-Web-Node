const express = require('express');
const router = express.Router();
const validator = require('../utility/validator');
const model = require('../model/userRolePermission_model');
const taskValidate = require('../validation/userRolePermission_validation');
const util = require('../utility/util');
const fileUpload            = require('../utility/fileUploadUtil');



router.post('/v1/userRolePermission/addRole', async (req, res) => {

    let reqData = validator.requestFilter(req.body);
    if (taskValidate.addRoleReq(reqData)) {
        const resp = await model.addRole(req.body);
        res.json({ success: resp.success, status: resp.status, message: resp.message, response: resp.response });
    } else {
        res.json({ success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null });
    }
});


router.post('/v1/userRolePermission/updateRole', async (req, res) => {

    // util.createLog("=====================================")
    // util.createLog(req.body)
    // util.createLog("=====================================")

    let reqData = validator.requestFilter(req.body);
    if (taskValidate.updateRoleReq(reqData)) {
        const resp = await model.updateRole(req.body);
        res.json({ success: resp.success, status: resp.status, message: resp.message, response: resp.response });
    } else {
        res.json({ success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null });
    }
});

router.post('/v1/userRolePermission/getRoleListings', async (req, res) => {

    let reqData = validator.requestFilter(req.body);
    if (taskValidate.getRoleListingReq(reqData)) {
        const resp = await model.getRoles(req.body);

        res.json({ success: resp.success, status: resp.status, message: resp.message, response: resp.response });
    } else {
        res.json({ success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null });
    }
});


router.post('/v1/userRolePermission/deleteRole', async (req, res) => {

    let reqData = validator.requestFilter(req.body);
    if (taskValidate.deleteRoleReq(reqData)) {
        const resp = await model.deleteRole(req.body);
        res.json({ success: resp.success, status: resp.status, message: resp.message, response: resp.response });
    } else {
        res.json({ success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null });
    }
});


router.post('/v1/userRolePermission/getRolesDropdown', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (taskValidate.basicAuthCheck(reqData)) {
        const resp = await model.getRolesDropdown(req.body);
        res.json({ success: resp.success, status: resp.status, message: resp.message, response: resp.response });
    } else {
        res.json({ success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null });
    }
});


router.post('/v1/userRolePermission/getPermissionForRolesDetails', async (req, res) => {

    let reqData = validator.requestFilter(req.body);
    if (taskValidate.getPermissionForRolesDetails(reqData)) {
        const resp = await model.getPermissionForRolesDetails(req.body);
        res.json({ success: resp.success, status: resp.status, message: resp.message, response: resp.response });
    } else {
        res.json({ success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null });
    }
});


router.post('/v1/userRolePermission/getPermissionForRolesChilds', async (req, res) => {
    let reqData = validator.requestFilter(req.body);

    if (taskValidate.getPermissionForRolesChildsReq(reqData)) {
        const resp = await model.getPermissionForRolesChildsData(req.body);
        res.json({ success: resp.success, status: resp.status, message: resp.message, response: resp.response });
    } else {
        res.json({ success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null });
    }
});


router.post('/v1/userRolePermission/updatePermissionForRolesDetails', async (req, res) => {

    let reqData = validator.requestFilter(req.body);
    if (taskValidate.updatePermissionForRolesDetails(reqData)) {
        const resp = await model.updatePermissionForRolesDetails(req.body);
        res.json({ success: resp.success, status: resp.status, message: resp.message, response: resp.response });
    } else {
        res.json({ success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null });
    }
});


router.post('/v1/userRolePermission/getDesignationDropdown', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (taskValidate.basicAuthCheck(reqData)) {
        const resp = await model.getDesignationDropdown(req.body);
        res.json({ success: resp.success, status: resp.status, message: resp.message, response: resp.response });
    } else {
        res.json({ success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null });
    }
});

// ################################################################################## USER ADDITION ###########################################################################################?

router.post('/v1/userRolePermission/addEmpUser', async (req, res) => {

    let reqData = validator.requestFilter(req.body);
    if (taskValidate.addEmpUsrReq(reqData)) {
        const resp = await model.addEmpUsrReq(req.body);
        res.json({ success: resp.success, status: resp.status, message: resp.message, response: resp.response });
    } else {
        res.json({ success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null });
    }
});

router.post('/v1/userRolePermission/ifPhoneExist', async (req, res) => {

    let reqData = validator.requestFilter(req.body);
    if (taskValidate.ifPhoneExist(reqData)) {
        const resp = await model.ifPhoneExist(req.body);

        res.json({ success: resp.success, status: resp.status, message: resp.message, response: resp.response });
    } else {
        res.json({ success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null });
    }
});

router.post('/v1/userRolePermission/ifPhoneExistCustomer', async (req, res) => {

    let reqData = validator.requestFilter(req.body);
    if (taskValidate.ifPhoneExistCustomer(reqData)) {
        const resp = await model.ifPhoneExistCustomer(req.body);

        res.json({ success: resp.success, status: resp.status, message: resp.message, response: resp.response });
    } else {
        res.json({ success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null });
    }
});

router.post('/v1/userRolePermission/ifEmailExist', async (req, res) => {

    let reqData = validator.requestFilter(req.body);
    if (taskValidate.ifEmailExist(reqData)) {
        const resp = await model.ifEmailExist(req.body);

        res.json({ success: resp.success, status: resp.status, message: resp.message, response: resp.response });
    } else {
        res.json({ success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null });
    }
});

router.post('/v2/userRolePermission/addEmpUser', async (req, res) => {

    let reqData = validator.requestFilter(req.body);
    if (taskValidate.addEmpUsrReqV2(reqData)) {
        const resp = await model.addEmpUsrReqV2(req.body);
        res.json({ success: resp.success, status: resp.status, message: resp.message, response: resp.response });
    } else {
        res.json({ success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null });
    }
});

router.post('/v1/userRolePermission/updateEmpUser', async (req, res) => {

    let reqData = validator.requestFilter(req.body);
    if (taskValidate.updateEmpUsrReq(reqData)) {
        const resp = await model.updateEmpUsrReq(req.body);
        res.json({ success: resp.success, status: resp.status, message: resp.message, response: resp.response });
    } else {
        res.json({ success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null });
    }
});


router.post('/v2/userRolePermission/updateEmpUser', async (req, res) => {

    let reqData = validator.requestFilter(req.body);
    if (taskValidate.updateEmpUsrReqV2(reqData)) {
        const resp = await model.updateEmpUsrReqV2(req.body);
        res.json({ success: resp.success, status: resp.status, message: resp.message, response: resp.response });
    } else {
        res.json({ success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null });
    }
});

router.post('/v3/userRolePermission/updateEmpUser', async (req, res) => {

    let reqData = validator.requestFilter(req.body);
    if (taskValidate.updateEmpUsrReqV3(reqData)) {
        const resp = await model.updateEmpUsrReqV3(req.body);
        res.json({ success: resp.success, status: resp.status, message: resp.message, response: resp.response });
    } else {
        res.json({ success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null });
    }
});

router.post('/v1/userRolePermission/updateEmpUserPassword', async (req, res) => {

    let reqData = validator.requestFilter(req.body);
    if (taskValidate.updateEmpUserPasswordReq(reqData)) {
        const resp = await model.updateEmpUserPassword(req.body);
        res.json({ success: resp.success, status: resp.status, message: resp.message, response: resp.response });
    } else {
        res.json({ success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null });
    }
});

router.post('/v1/userRolePermission/linsensedUserCheck', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (taskValidate.getlinsensedUserReq(reqData)) {
        const resp = await model.getlinsensedUserMod(req.body);
        res.json({ success: resp.success, status: resp.status, message: resp.message, response: resp.response });
    } else {
        res.json({ success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null });
    }
});



router.post('/v1/userRolePermission/getNormalUserList', async (req, res) => {

    let reqData = validator.requestFilter(req.body);
    if (taskValidate.getReqUserListCheck(reqData)) {
        const resp = await model.getusersDataList(req.body);
        res.json({ success: resp.success, status: resp.status, message: resp.message, response: resp.response });
    } else {
        res.json({ success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null });
    }
});
router.post('/v1/userRolePermission/getNormalUserList_download', async (req, res) => {

    // util.createLog("=====================================")
    // util.createLog(req.body)
    // util.createLog("=====================================")

    let reqData = validator.requestFilter(req.body);
    if (taskValidate.getReqUserListCheckDownload(reqData)) {
        const resp = await model.getusersDataList_download(req.body);
        res.json({ success: resp.success, status: resp.status, message: resp.message, response: resp.response });
    } else {
        res.json({ success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null });
    }
});

router.post('/v2/userRolePermission/getNormalUserList', async (req, res) => {

    let reqData = validator.requestFilter(req.body);
    if (taskValidate.getReqUserListCheck(reqData)) {
        const resp = await model.getusersDataListV2(req.body);
        res.json({ success: resp.success, status: resp.status, message: resp.message, response: resp.response });
    } else {
        res.json({ success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null });
    }
});

router.post('/v1/userRolePermission/getMasterLists', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (taskValidate.getReqUserList(reqData)) {
        const resp = await model.getusersList(req.body);
        res.json({ success: resp.success, status: resp.status, message: resp.message, response: resp.response });
    } else {
        res.json({ success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null });
    }
});

// #############################################      USER activity log ==========================================================================================
// #############################################      USER activity log ==========================================================================================


router.post('/v1/userRolePermission/getUserDetails', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (taskValidate.getReqUserDetails(reqData)) {
        const resp = await model.getReqUserDetails(req.body);
        res.json({ success: resp.success, status: resp.status, message: resp.message, response: resp.response });
    } else {
        res.json({ success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null });
    }
});

router.post('/v2/userRolePermission/getUserDetails', async (req, res) => {

    let reqData = validator.requestFilter(req.body);
    if (taskValidate.getReqUserDetails(reqData)) {
        const resp = await model.getReqUserDetailsV2(req.body);
        res.json({ success: resp.success, status: resp.status, message: resp.message, response: resp.response });
    } else {
        res.json({ success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null });
    }
});

router.post('/v1/userRolePermission/addUserActivity', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (taskValidate.addUserActivityReq(reqData)) {
        const resp = await model.addUserActivityList(req.body);
        res.json({ success: resp.success, status: resp.status, message: resp.message, response: resp.response });
    } else {
        res.json({ success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null });
    }
});



router.post('/v1/userRolePermission/getUserAllActivity', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (taskValidate.getUserActivitiesReq(reqData)) {
        const resp = await model.getUserActivitiesList(req.body);
        res.json({ success: resp.success, status: resp.status, message: resp.message, response: resp.response });
    } else {
        res.json({ success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null });
    }
});



router.post('/v1/userRolePermission/getDetailUserActivity', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (taskValidate.getDetailUserActivityReq(reqData)) {
        const resp = await model.getDetailUserActivityList(req.body);
        res.json({ success: resp.success, status: resp.status, message: resp.message, response: resp.response });
    } else {
        res.json({ success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null });
    }
});


router.post('/v1/userRolePermission/updateUserActivityStatus', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (taskValidate.updateUserActivityStatusReq(reqData)) {
        const resp = await model.updateUserActivityStatusList(req.body);
        res.json({ success: resp.success, status: resp.status, message: resp.message, response: resp.response });
    } else {
        res.json({ success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null });
    }
});


router.post('/v1/userRolePermission/changeUserStatus', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (taskValidate.changeUserStatus(reqData)) {
        const resp = await model.changeUserStatus(req.body);
        res.json({ success: resp.success, status: resp.status, message: resp.message, response: resp.response });
    } else {
        res.json({ success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null });
    }
});


router.post('/v1/userRolePermission/userDeleteStatus', async (req, res) => {

    let reqData = validator.requestFilter(req.body);
    if (taskValidate.deleteUserStatus(reqData)) {
        const resp = await model.deleteUserStatus(req.body);
        res.json({ success: resp.success, status: resp.status, message: resp.message, response: resp.response });
    } else {
        res.json({ success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null });
    }
});

router.post('/v1/userRolePermission/download', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    // if (taskValidate.deleteUserStatus(reqData)) {
    const resp = await model.download(req.body);
    res.json({ success: resp.success, status: resp.status, message: resp.message, response: resp.response });
    // } else {
    //     res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    // }
});


router.post('/v1/userRolePermission/getModuleWiseConfig', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (taskValidate.getModuleWiseConfigReq(reqData)) {
        const resp = await model.getModuleWiseConfigData(req.body);
        res.json({ success: resp.success, status: resp.status, message: resp.message, response: resp.response });
    } else {
        res.json({ success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null });
    }
});


router.post('/v1/userRolePermission/saveModuleWisepermissions', async (req, res) => {

    let reqData = validator.requestFilter(req.body);
    if (taskValidate.saveModuleWiseConfigReq(reqData)) {
        const resp = await model.saveModuleWiseConfig(req.body);
        res.json({ success: resp.success, status: resp.status, message: resp.message, response: resp.response });
    } else {
        res.json({ success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null });
    }
});




// ===================================================================== NEW GENERIC API =====================================================

/**
 * @author : Sukanta Samanta
 * @date : 23/06/2023
 * @description : add NEW EMPLOYEE
 * @argument : {}
 * @returns : token
 */

router.post('/v1/userRolePermission/gn_addEmpUser', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (taskValidate.gn_addEmpUser(reqData)) {
        const resp = await model.gn_addEmpUser(req.body);
        res.json({ success: resp.success, status: resp.status, message: resp.message, response: resp.response });
    } else {
        res.json({ success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null });
    }
});
/**
 * @author : Sukanta Samanta
 * @date : 23/06/2023
 * @description : Update EMPLOYEE
 * @argument : {}
 * @returns : token
 */
router.post('/v1/userRolePermission/gn_updateEmpUser', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (taskValidate.gn_updateEmpUser(reqData)) {
        const resp = await model.gn_updateEmpUser(req.body);
        res.json({ success: resp.success, status: resp.status, message: resp.message, response: resp.response });
    } else {
        res.json({ success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null });
    }
});

/**
 * @author : Sukanta Samanta
 * @date : 23/06/2023
 * @description : get EMPLOYEE details
 * @argument : {}
 * @returns : token
 */
router.post('/v1/userRolePermission/gn_getUserDetails', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (taskValidate.getReqUserDetails(reqData)) {
        const resp = await model.gn_getUserDetails(req.body);
        res.json({ success: resp.success, status: resp.status, message: resp.message, response: resp.response });
    } else {
        res.json({ success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null });
    }
});




/**
 * @author : Prosenjit Paul
 * @date : 28/11/2023
 * @description : add new User 
 * @argument : {}
 * @returns :
 */
router.post('/v1/userRolePermission/demo_addUser', async (req,res)=>{

    let reqData = validator.requestFilter(req.body);
    if(taskValidate.addUserValidation(reqData)){
        const resp = await model.addUser(req.body);
        res.json({ success: resp.success, status: resp.status, message: resp.message, response: resp.response });
    }else{
        res.json({ success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null });
    }
});



/**
 * Subham Chatterjee on 19/12/23
 */

router.post('/v2/userRolePermission/getModuleWiseConfig', async (req, res) => {
    // console.log("----------------")
    // console.log(req.body)
    // console.log("----------------")
    let reqData = validator.requestFilter(req.body);
    if (taskValidate.getModuleWiseConfigReq(reqData)) {
        const resp = await model.getModuleWiseConfigDataV2(req.body);
        res.json({ success: resp.success, status: resp.status, message: resp.message, response: resp.response });
    } else {
        res.json({ success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null });
    }
});

/**
 * @author : Prosenjit Paul
 * @date : 05/02/2024
 * @description : generate simple excel 
 * @argument : 
 * @returns
 */

router.post('/v1/userRolePermission/sampleEmpoloyeeExcel', async (req, res) => {


    let reqData = validator.requestFilter(req.body);
    if (taskValidate.simpleExcel_req(reqData)) {
        const resp = await model.sampleExcel_model(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.path});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});


/**
 * @author : Prosenjit Paul
 * @date : 05/02/2024
 * @description : Upload Excel Functionality 
 * @argument : 
 * @returns
 */

router.post('/v1/userRolePermission/uploadEmployeeExcel',async (req,res)=>{
    
    const respData = await fileUpload.uploadUserTargetFile(req, 'file');

    if(respData.status === 200){
        const resp = await model.ExcelData_upload(respData.response);
        res.json({success: respData.status === 200, status: respData.status, message: respData.message, response: respData.response});
    }else{
        // res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
        res.json({success: false, status: respData.status, message: respData.message, response: null});
    }
});



/**
 * @author : Sourav Bhoumik
 * @date : 21/11/2024
 * @description : get EMPLOYEE list
 * @argument : {}
 * @returns : token
 */
router.post('/v1/userRolePermission/getAllUserListOfCompany', async (req, res) => {
    // console.log("============>")
    // console.log(req.body)
    // console.log("============>")
    let reqData = validator.requestFilter(req.body);
    if (taskValidate.simpleExcel_req(reqData)) {
        const resp = await model.getAllUserListOfCompany(req.body);
        res.json({ success: resp.success, status: resp.status, message: resp.message, response: resp.response });
    } else {
        res.json({ success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null });
    }
});









module.exports = router;
