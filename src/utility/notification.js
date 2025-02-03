const superagent = require('superagent');
const config = require('../config')


module.exports.sendPushNotification = async(data, cb) => {
    try {

        if (data.to.length == 0 || data.to == "") {
            return(false);
        } else {
            let serverKey = "";
            if (data.deviceType == "ios") {
                serverKey = config.IOS_PUSH_SERVER_KEY;
            } else {
                serverKey = config.ANDROID_PUSH_SERVER_KEY;
            }
            let dataNoti = {
                "to": data.to,
                "notification": {
                    "title": data.subject,
                    "body": data.body
                }
            }

            let notiData = await superagent.post(config.PUSH_FCM_URL)
                .send(dataNoti).set("Authorization", 'key=' + serverKey)
                .set("Content-Type", 'application/json')

            return(notiData.body);
        }
    } catch (err) {

        cb(null, err)
    }
}
