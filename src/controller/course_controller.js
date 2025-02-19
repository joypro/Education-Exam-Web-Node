const express = require('express');
const router = express.Router();
const validator = require('../utility/validator');
const model = require('../model/course_model');
const validate = require('../validation/course_validation');
const util = require('../utility/util');


/**
 * @author : Poritosh
 * @date : 23/01/2025
 * @description : CourseList
 * @argument : 
 * @returns
 */

router.post('/v1/course/getCourseList', async (req, res) => {

    let reqData = validator.requestFilter(req.body);
    if (validate.getCourseList(reqData)) {
        const resp = await model.getCourseList(req.body);
        res.json({ success: resp.success, status: resp.status, message: resp.message, response: resp.response });
    } else {
        res.json({ success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null });
    }
});



/**
 * @author : Poritosh
 * @date : 23/01/2025
 * @description : getCourseSubjects
 * @argument : 
 * @returns
 */

router.post('/v1/course/getCourseSubjects', async (req, res) => {

    let reqData = validator.requestFilter(req.body);
    if (validate.getCourseSubjects(reqData)) {
        const resp = await model.getCourseSubjects(req.body);
        res.json({ success: resp.success, status: resp.status, message: resp.message, response: resp.response });
    } else {
        res.json({ success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null });
    }
});


/**
 * @author : Poritosh
 * @date : 23/01/2025
 * @description : getCourseMaterials
 * @argument : 
 * @returns
 */

router.post('/v1/course/getCourseMaterials', async (req, res) => {

    let reqData = validator.requestFilter(req.body);
    if (validate.getCourseMaterials(reqData)) {
        const resp = await model.getCourseMaterials(req.body);
        res.json({ success: resp.success, status: resp.status, message: resp.message, response: resp.response });
    } else {
        res.json({ success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null });
    }
});


/**
 * @author : Poritosh
 * @date : 23/01/2025
 * @description : getCourseMaterials
 * @argument : 
 * @returns
 */

router.post('/v1/course/getMaterialDetails', async (req, res) => {

    let reqData = validator.requestFilter(req.body);
    if (validate.getMaterialDetails(reqData)) {
        const resp = await model.getMaterialDetails(req.body);
        res.json({ success: resp.success, status: resp.status, message: resp.message, response: resp.response });
    } else {
        res.json({ success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null });
    }
});


module.exports = router;
