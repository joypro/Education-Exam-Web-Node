const nodemailer            =    require('nodemailer');
const config                =    require('../config');

module.exports.sendRejectEmailCarrier = (senderEmail) => {
    try{
        console.log('senderEmail >> ', senderEmail);
        return true;
    } catch(e) {

        return false;
    }
}
