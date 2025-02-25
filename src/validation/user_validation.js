const util = require('../utility/util');


module.exports.signUp = (data)=>{
    let errcounter = 0;

    if (data.firstName === undefined || data.firstName == null) {
        util.createLog("firstName is missing");
        errcounter++;
    }
    
    if (data.email === undefined || data.email == null) {
        util.createLog("email is missing");
        errcounter++;
    }
    
    
    return errcounter <= 0;
}




module.exports.verifySignUpOtp = (data)=>{
    let errcounter = 0;
    
    if (data.email === undefined || data.email == null) {
        util.createLog("email is missing");
        errcounter++;
    }
    
    if (data.password === undefined || data.password == null) {
        util.createLog("password is missing");
        errcounter++;
    }
    
    
    return errcounter <= 0;
}


module.exports.signIn = (data)=>{
    let errcounter = 0;

    if (data.email === undefined || data.email == null) {
        util.createLog("email is missing");
        errcounter++;
    }
    
    if (data.password === undefined || data.password == null) {
        util.createLog("password is missing");
        errcounter++;
    }
    
    return errcounter <= 0;
}




module.exports.updateUserDetail = (data)=>{
    let errcounter = 0;

    if (data.userId === undefined || data.userId == null) {
        util.createLog("userId is missing");
        errcounter++;
    }

    return errcounter <= 0;
}