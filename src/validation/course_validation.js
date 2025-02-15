const util = require('../utility/util');


module.exports.getCourseList = (data)=>{
    let errcounter = 0;

    if (data.userId === undefined || data.userId == null) {
        util.createLog("userId is missing");
        errcounter++;
    }
    // if (data.userType === undefined || data.userType == null) {
    //     util.createLog("userType is missing");
    //     errcounter++;
    // }

    return errcounter <= 0;
}