const express               = require('express');
const router                = express.Router();
const validator             = require('../utility/validator');
const mstclientmodel        = require('../model/mstClient_model');
const mstclientvalidate     = require('../validation/mstClient_validation');
const util 					= require('../utility/util');
const fileuploadUtil    =   require('../utility/fileUploadUtil');


// router.get('/v1/client/getAllClient', async (req, res) => {
//     const resp = await mstclientmodel.mstAllClientData();
//     res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
// });

router.post('/v1/client/getMstClientList', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (mstclientvalidate.mstClientReq(reqData)) {
        const resp = await mstclientmodel.mstClientdata(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: data.response});
    }
});

router.post('/v1/client/addClient', async (req, res) => {
    // console.log("=============================>>>>")
    // console.log(req.body)
    // console.log("=============================>>>>")
    let reqData = validator.requestFilter(req.body);
    // if (mstclientvalidate.addClientReq(reqData)) {
    if (mstclientvalidate.addNewClient(reqData)) {
        // const resp = await mstclientmodel.addClient(req.body);
        const resp = await mstclientmodel.addNewClient(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: data.response});
    }
});

router.post('/v1/client/updateClient', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (mstclientvalidate.updateClientReq(reqData)) {
        const resp = await mstclientmodel.updateClient(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: data.response});
    }
});

router.post('/v1/client/deleteClient', async (req, res) => {
    let reqData = validator.requestFilter(req.body);

    if (mstclientvalidate.deleteClientReq(reqData)) {
        const resp = await mstclientmodel.deleteClient(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: data.response});
    }
});






/**
 * @author : Sourav Bhoumik
 * @date : 07/08/2023
 * @description : upload company's promotional banners
 * @argument : 
 * @returns
 */

router.post('/v1/client/uploadPromationalBanners', async (req, res) => {

    // console.log("--<req>")
    // console.log(req)
    // console.log("--<req>")

    const respData = await fileuploadUtil.uploadCompanyBanners(req, 'file');

    // console.log("=======respData=======>>>")
    // console.log(respData)
    // console.log("=======respData=======>>>")

    if(respData.status === 200){
        const resp = await mstclientmodel.uploadCompanyBanners_model(respData.response);
        res.json({success: respData.status === 200, status: respData.status, message: respData.message, response: respData.response});
    }else{
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});



/**
 * @author : Indranil
 * @date : 08/08/2023
 * @description : list promotional banners
 * @argument : 
 * @returns
 */


router.post('/v1/client/getUploadPromationalBanners', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (mstclientvalidate.uploadPromationalBannersReq(reqData)) {
        const resp = await mstclientmodel.uploadPromationalBannersdata(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: data.response});
    }
});



/**
 * @author : Indranil
 * @date : 08/08/2023
 * @description : delete promotional banners
 * @argument : 
 * @returns
 */


router.post('/v1/client/deleteUploadPromationalBanners', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (mstclientvalidate.deleteUploadPromationalBannersReq(reqData)) {
        const resp = await mstclientmodel.deleteUploadPromationalBanners(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: data.response});
    }
});


/**
 * @author : Indranil
 * @date : 09/08/2023
 * @description : active or inactive promotional banners
 * @argument : 
 * @returns
 */


router.post('/v1/client/activeUploadPromationalBanners', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (mstclientvalidate.activeUploadPromationalBannersReq(reqData)) {
        const resp = await mstclientmodel.activeUploadPromationalBanners(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: data.response});
    }
});



/**
 * @author : Indranil
 * @date : 09/08/2023
 * @description : active or inactive promotional banners multidata
 * @argument : 
 * @returns
 */


router.post('/v1/client/activeUploadPromationalBannersMultiple', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (mstclientvalidate.activeUploadPromationalBannersReq(reqData)) {
        const resp = await mstclientmodel.activeUploadPromationalBannersMultiple(req.body);
        res.json({success: true, status: 200, message: "Update Successfully", response: null});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: data.response});
    }
});




/**
 * @author : Prosenjit
 * @date : 06/10/2023
 * @description : get Client Data
 * @argument : 
 * @returns
 */

router.post('/v1/client/clientHierarchyDetails', async (req, res) => {

    let reqData = validator.requestFilter(req.body);
    if (mstclientvalidate.getClientHierarchyValidation(reqData)) {
        const resp = await mstclientmodel.clientDetails_data(req.body);
        res.json({success: resp.success, status: resp.status, message: "", response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});


/**
 * @author : Sarbojit
 * @date : 27/11/2023
 * @description : get Client List
 * @argument : 
 * @returns
 */

router.post('/v2/client/getMstClientList', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (mstclientvalidate.mstClientReq(reqData)) {
        const resp = await mstclientmodel.mstClientdata(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: data.response});
    }
});


/**
 * @author : Sarbojit
 * @date : 27/11/2023
 * @description : Add New Client
 * @argument : 
 * @returns
 */

router.post('/v2/client/addClient', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (mstclientvalidate.addClientReqV2(reqData)) {

        const resp = await mstclientmodel.addClientV2(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: data.response});
    }
});

/**
 * @author : Sarbojit
 * @date : 27/11/2023
 * @description : Update Client
 * @argument : 
 * @returns
 */

router.post('/v2/client/updateClient', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (mstclientvalidate.updateClientReqV2(reqData)) {
        const resp = await mstclientmodel.updateClientV2(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: data.response});
    }
});

/**
 * @author : Sarbojit
 * @date : 27/11/2023
 * @description : Delete Client
 * @argument : 
 * @returns
 */

router.post('/v2/client/deleteClient', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (mstclientvalidate.deleteClientReqV2(reqData)) {
        const resp = await mstclientmodel.deleteClientV2(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: data.response});
    }
});
/**
 * @author : Subham
 * @date : 11/12/2023
 * @description : Add New Client
 * @argument : 
 * @returns
 */
router.post('/v3/client/deleteClient', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (mstclientvalidate.deleteClientReqV2(reqData)) {
        const resp = await mstclientmodel.deleteClientV3(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: data.response});
    }
});
/**
 * @author : Subham
 * @date : 11/12/2023
 * @description : Add New Client
 * @argument : 
 * @returns
 */

router.post('/v1/client/gn_addClient', async (req, res) => {

    let reqData = validator.requestFilter(req.body);
    if (mstclientvalidate.addClientReqV2(reqData)) {

        const resp = await mstclientmodel.gn_addClient(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: data.response});
    }
});



/**
 * @author : SOURAV
 * @date : 17/07/2024
 * @description : TEST API FOR LOCATION INTEGRATION
 * @argument : 
 * @returns
 */

router.post('/v1/client/testLocationMapping', async (req, res) => {

    let reqData = validator.requestFilter(req.body);
    if (mstclientvalidate.deleteClientReqV2(reqData)) {

        const resp = await mstclientmodel.testLocationMapping(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: data.response});
    }
});





module.exports = router;
