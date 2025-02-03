const express = require('express');
const router = express.Router();
const validator = require('../utility/validator');
const commonmodel = require('../model/commonmodel');
const commonvalidate = require('../validation/commonvalidation');

// router.get('/hc', (req, res) => {
//     res.json({ success: true, status: 200, message: "Success", response: null });
// });

router.post('/v1/gettoken', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (commonvalidate.getTokenReq(reqData)) {
        const resp = await commonmodel.generateToken(req.body);
        res.json({ success: resp.success, status: resp.status, message: resp.message, response: resp.response });
    } else {
        res.json({ success: false, status: 1001, message: "Parameter missing", response: null });
    }
});


router.post('/v1/pickUserCurrentLocation', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    const resp = await commonmodel.pickUserCurrentLocation(reqData);
    res.json({ success: resp.success, status: resp.status, message: resp.message, response: resp.response });
});

router.post('/v1/pickCustomerCurrentLocation', async (req, res) => {

    let reqData = validator.requestFilter(req.body);
    const resp = await commonmodel.pickCustomerCurrentLocation(reqData);
    res.json({ success: resp.success, status: resp.status, message: resp.message, response: resp.response });
});


router.post('/v1/common/takenLatLongData', async (req, res) => {

    let reqData = validator.requestFilter(req.body);
    if (commonvalidate.takenLatLongDataReq(reqData)) {
        const resp = await commonmodel.takenLatLongData(req.body);
        res.json({ success: resp.success, status: resp.status, message: resp.message, response: resp.response });
    } else {
        res.json({ success: false, status: 1001, message: "Parameter missing", response: null });
    }
});


router.post('/v1/common/getHierarchyTypesSlNo', async (req, res) => {

    let reqData = validator.requestFilter(req.body);
    if (commonvalidate.getHierarchyTypesSlNo(reqData)) {
        const resp = await commonmodel.getHierarchyTypesSlNo(req.body);
        res.json({ success: resp.success, status: resp.status, message: resp.message, response: resp.response });
    } else {
        res.json({ success: false, status: 1001, message: "Parameter missing", response: null });
    }
});


router.post('/v1/common/getUserImmediateChildData', async (req, res) => {

    let reqData = validator.requestFilter(req.body);
    if (commonvalidate.getUserImmediateChildData(reqData)) {
        const resp = await commonmodel.getUserImmediateChildData(req.body);
        res.json({ success: resp.success, status: resp.status, message: resp.message, response: resp.response });
    } else {
        res.json({ success: false, status: 1001, message: "Parameter missing", response: null });
    }
});
/**
 * @author : Sourav Bhoumik
 * @date : 16/06/2023
 * @description : get all HierarchyTypes name of mstHierarchyTypes
 * @argument : 
 * @returns
 */

router.post('/v1/common/getHierarchyTypesName', async (req, res) => {

    let reqData = validator.requestFilter(req.body);
    if (commonvalidate.getHierarchyTypesSlNo(reqData)) {
        const resp = await commonmodel.getHierarchyTypesName(req.body);
        res.json({ success: resp.success, status: resp.status, message: resp.message, response: resp.response });
    } else {
        res.json({ success: false, status: 1001, message: "Parameter missing", response: null });
    }
});




// router.post('/v1/common/dataInsert', async (req, res) => {

//     let reqData = validator.requestFilter(req.body);
//     if (commonvalidate.getHierarchyTypesSlNo(reqData)) {
//         const resp = await commonmodel.dataInsert(req.body);
//         res.json({ success: resp.success, status: resp.status, message: resp.message, response: resp.response });
//     } else {
//         res.json({ success: false, status: 1001, message: "Parameter missing", response: null });
//     }
// });



/**
 * @author : Sukanta Samanta
 * @date : 24/06/2023
 * @description : get Daily Activity list
 * @argument : 
 * @returns
 */
router.post('/v1/common/getDailyActivities', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (commonvalidate.getDailyActivities(reqData)) {
        const resp = await commonmodel.getDailyActivities(req.body);
        res.json({ success: resp.success, status: resp.status, message: resp.message, response: resp.response });
    } else {
        res.json({ success: false, status: 1001, message: "Parameter missing", response: null });
    }
});


/**
 * @author : SKH
 * @date : 11/07/2023
 * @description : get All Measurements units list
 * @argument : type (	1=branding, 2=items,3=expenses)
 * @returns : ListData
 */
router.post('/v1/common/getAllMeasurementUnitList', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (commonvalidate.getAllMeasurementUnitList(reqData)) {
        const resp = await commonmodel.getAllMeasurementUnitList(req.body);
        res.json({ success: resp.success, status: resp.status, message: resp.message, response: resp.response });
    } else {
        res.json({ success: false, status: 1001, message: "Parameter missing", response: null });
    }
});


/**
 * @author : sourav bhoumik
 * @date : 19/07/2023
 * @description : get All download list
 * @argument : clientId, userId
 * @returns : ListData
 */
router.post('/v1/common/getAllDownloadList', async (req, res) => {

    let reqData = validator.requestFilter(req.body);
    if (commonvalidate.getAllDownloadList(reqData)) {
        // const resp = await commonmodel.getAllDownloadList(req.body);
        const resp = await commonmodel.getAllDownloadProcessList(req.body);

        res.json({ success: resp.success, status: resp.status, message: resp.message, response: resp.response });
    } else {
        res.json({ success: false, status: 1001, message: "Parameter missing", response: null });
    }
});


/**
 * @author : Josimoddin Shaikh
 * @date : 06/03/2024
 * @description : get All download list with Status
 * @argument : clientId, userId
 * @returns : ListData
 */
router.post('/v1/common/getAllDownloadProcessList', async (req, res) => {

    let reqData = validator.requestFilter(req.body);
    if (commonvalidate.getAllDownloadList(reqData)) {
        const resp = await commonmodel.getAllDownloadProcessList(req.body);

        res.json({ success: resp.success, status: resp.status, message: resp.message, response: resp.response });
    } else {
        res.json({ success: false, status: 1001, message: "Parameter missing", response: null });
    }
});


/**
 * @author : Poritosh Byapari
 * @date : 08/03/2024
 * @description : get download Process Status
 * @argument : clientId, userId
 * @returns : ListData
 */
router.post('/v1/common/getDownloadProcessStatus', async (req, res) => {

    let reqData = validator.requestFilter(req.body);
    if (commonvalidate.getAllDownloadList(reqData)) {
        const resp = await commonmodel.getDownloadProcessStatus(req.body);

        res.json({ success: resp.success, status: resp.status, message: resp.message, response: resp.response });
    } else {
        res.json({ success: false, status: 1001, message: "Parameter missing", response: null });
    }
});

/**
 * @author : Sourav Bhoumik
 * @date : 05/09/2023
 * @description : get token for external users
 * @argument : clientId, roleId, userId
 * @returns : token
 */

router.post('/v1/common/getToken', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (commonvalidate.getToken(reqData)) {
        const resp = await commonmodel.getToken(reqData);

        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});


/**
 * @author : sourav bhoumik
 * @date : 19/07/2023
 * @description : get All download list
 * @argument : clientId, userId
 * @returns : ListData
 */
router.post('/v1/common/getAllLastLevelLocationDataForUser', async (req, res) => {

    let reqData = validator.requestFilter(req.body);
    if (commonvalidate.getAllDownloadList(reqData)) {
        const resp = await commonmodel.getAllLastLevelDataForUser(req.body);

        res.json({ success: resp.success, status: resp.status, message: resp.message, response: resp.response });
    } else {
        res.json({ success: false, status: 1001, message: "Parameter missing", response: null });
    }
});




/**
 * @author : sourav bhoumik
 * @date : 19/07/2023
 * @description : get Visit data configuration for user as per company
 * @argument : clientId, userId
 * @returns : ListData
 */
router.post('/v1/common/getOfflineLtemsConfig', async (req, res) => {

    let reqData = validator.requestFilter(req.body);
    if (commonvalidate.getAllDownloadList(reqData)) {
        // const resp = await commonmodel.getOfflineLtemsConfig(req.body);
        const resp = await commonmodel.getOfflineLtemsConfigModified1(req.body);
        res.json({ success: resp.success, status: resp.status, message: resp.message, response: resp.response });
    } else {
        res.json({ success: false, status: 1001, message: "Parameter missing", response: null });
    }
});

// /**
//  * @author : sourav bhoumik
//  * @date : 19/07/2023
//  * @description : get Visit data configuration for user as per company
//  * @argument : clientId, userId
//  * @returns : ListData
//  */
// router.post('/v2/common/getOfflineLtemsConfig', async (req, res) => {

//     let reqData = validator.requestFilter(req.body);
//     if (commonvalidate.getAllDownloadList(reqData)) {
//         const resp = await commonmodel.getOfflineLtemsConfigModified1(req.body);

//         res.json({ success: resp.success, status: resp.status, message: resp.message, response: resp.response });
//     } else {
//         res.json({ success: false, status: 1001, message: "Parameter missing", response: null });
//     }
// });


/**
 * @author : sourav bhoumik
 * @date : 19/07/2023
 * @description : get Visit data configuration for user as per company
 * @argument : clientId, userId
 * @returns : ListData
 */
router.post('/v1/common/getOfflineVisitFeedbackConfig', async (req, res) => {

    let reqData = validator.requestFilter(req.body);
    if (commonvalidate.getAllDownloadList(reqData)) {
        const resp = await commonmodel.getOfflineVisitFeedbackConfig(req.body);

        res.json({ success: resp.success, status: resp.status, message: resp.message, response: resp.response });
    } else {
        res.json({ success: false, status: 1001, message: "Parameter missing", response: null });
    }
});





/**
 * @author : Josimoddin Shaikh
 * @date : 10/01/2024
 * @description : get address by lat,lng
 * @argument : lat,lng
 * @returns : ListData
 */
router.post('/v1/common/getAddressByLatLng', async (req, res) => {

    let reqData = validator.requestFilter(req.body);
    if (commonvalidate.getAddressByLatLng(reqData)) {
        const resp = await commonmodel.getAddressByLatLng(req.body);

        res.json({ success: resp.success, status: resp.status, message: resp.message, response: resp.response });
    } else {
        res.json({ success: false, status: 1001, message: "Parameter missing", response: null });
    }
});


/**
 * @author : Sourav Bhoumik
 * @date : 28/04/2024
 * @description : delete data master
 * @argument : data
 * @returns : message
 */
router.post('/v4/common/deleteMasterData', async (req, res) => {

    let reqData = validator.requestFilter(req.body);
    if (commonvalidate.deleteMasterData(reqData)) {
        const resp = await commonmodel.deleteMasterData(req.body);

        res.json({ success: resp.success, status: resp.status, message: resp.message, response: resp.response });
    } else {
        res.json({ success: false, status: 1001, message: "Parameter missing", response: null });
    }
});





module.exports = router;
