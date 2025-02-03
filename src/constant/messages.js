// mapping for alert messages


const MESSAGE = Object.freeze({
    MOBILE: {
        MOBILE_EMPTY: "Please enter your mobile no !"
    },
    EMAIL: {
        EMAIL_NOT_EXIST: "Email does not exist"
    },
    USER: {
        DEACTIVATED_USER:"Deactivated User",
        INCORRECT_PASSWORD: "Incorrect password",
        OTP_NOT_GENARETED: "OTP not generated",
        OTP_EXPIRE: "Otp expired",
        OTP_VERIFIED:"OTP verified successfully",
        OTP_NOT_VERIFIED:"OTP is not verified",
        OTP_ALREADY_USED:"OTP Already Used",
        PASSWORD_UPDATED:"Password updated",
        LOG_OUT: "Log out successfully",
        PASSWORD_MISMATCH: "Password not match with previous password",
        OTP_SENT:"OTP sent to your email"
    },
    GENERAL_MESSAGE:{
        INTERNAL_SERVER_ERROR: "Internal Server Error",
        SUCCESS: "Success",
        PARAMETER_MISSING: "Parameter missing"
    },
    ATTENDENCE:{
        ADD_ATTENDENCE: "Attendence added successfully",
        ATTENDENCE_ALREADY_SUBMITTED: "Attendence already submitted for today"
    }
});

module.exports ={
    MESSAGE:MESSAGE
}