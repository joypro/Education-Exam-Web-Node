const util = require('../utility/util');


module.exports.getCourseList = (data)=>{
    let errcounter = 0;

    if (data.userId === undefined || data.userId == null) {
        util.createLog("userId is missing");
        errcounter++;
    }
    if (data.userType === undefined || data.userType == null) {
        util.createLog("userType is missing");
        errcounter++;
    }

    return errcounter <= 0;
}



module.exports.getCourseSubjects = (data)=>{
    let errcounter = 0;

    if (data.userId === undefined || data.userId == null) {
        util.createLog("userId is missing");
        errcounter++;
    }
    if (data.userType === undefined || data.userType == null) {
        util.createLog("userType is missing");
        errcounter++;
    }
    if (data.courseId === undefined || data.courseId == null) {
        util.createLog("courseId is missing");
        errcounter++;
    }

    return errcounter <= 0;
}



module.exports.getCourseMaterials = (data)=>{
    let errcounter = 0;

    if (data.userId === undefined || data.userId == null) {
        util.createLog("userId is missing");
        errcounter++;
    }
    if (data.userType === undefined || data.userType == null) {
        util.createLog("userType is missing");
        errcounter++;
    }
    if (data.courseId === undefined || data.courseId == null) {
        util.createLog("courseId is missing");
        errcounter++;
    }
    if (data.subjectId === undefined || data.subjectId == null) {
        util.createLog("subjectId is missing");
        errcounter++;
    }

    return errcounter <= 0;
}



module.exports.getMaterialDetails = (data)=>{
    let errcounter = 0;

    if (data.userId === undefined || data.userId == null) {
        util.createLog("userId is missing");
        errcounter++;
    }
    if (data.userType === undefined || data.userType == null) {
        util.createLog("userType is missing");
        errcounter++;
    }
    if (data.courseId === undefined || data.courseId == null) {
        util.createLog("courseId is missing");
        errcounter++;
    }
    if (data.subjectId === undefined || data.subjectId == null) {
        util.createLog("subjectId is missing");
        errcounter++;
    }
    if (data.materialId === undefined || data.materialId == null) {
        util.createLog("materialId is missing");
        errcounter++;
    }
    
    return errcounter <= 0;
}



