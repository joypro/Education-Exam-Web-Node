const express = require('express');
const router = express.Router();
const validator = require('../utility/validator');
const model = require('../model/user_model');
const validate = require('../validation/user_validation');
const util = require('../utility/util');


/**
 * @author : Poritosh
 * @date : 23/01/2025
 * @description : Login via Web
 * @argument : 
 * @returns
 */

router.post('/v1/user/signIn', async (req, res) => {

    let reqData = validator.requestFilter(req.body);
    if (validate.signIn(reqData)) {
        const resp = await model.signIn(req.body);
        res.json({ success: resp.success, status: resp.status, message: resp.message, response: resp.response });
    } else {
        res.json({ success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null });
    }
});


/**
 * @author : Poritosh
 * @date : 23/01/2025
 * @description : signup via Web
 * @argument : 
 * @returns
 */

router.post('/v1/user/signUp', async (req, res) => {

    let reqData = validator.requestFilter(req.body);
    if (validate.signUp(reqData)) {
        const resp = await model.signUp(req.body);
        res.json({ success: resp.success, status: resp.status, message: resp.message, response: resp.response });
    } else {
        res.json({ success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null });
    }
});


/**
 * @author : Pori
 * @date : 23/01/2025
 * @description : get User Detail
 * @argument : 
 * @returns
 */

router.post('/v1/user/getUserDetail', async (req, res) => {

    let reqData = validator.requestFilter(req.body);
    if (validate.updateUserDetail(reqData)) {
        const resp = await model.getUserDetail(req.body);
        res.json({ success: resp.success, status: resp.status, message: resp.message, response: resp.response });
    } else {
        res.json({ success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null });
    }
});


/**
 * @author : Pori
 * @date : 23/01/2025
 * @description : update User Detail
 * @argument : 
 * @returns
 */

router.post('/v1/user/updateUserDetail', async (req, res) => {

    let reqData = validator.requestFilter(req.body);
    if (validate.updateUserDetail(reqData)) {
        const resp = await model.updateUserDetail(req.body);
        res.json({ success: resp.success, status: resp.status, message: resp.message, response: resp.response });
    } else {
        res.json({ success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null });
    }
});



module.exports = router;
