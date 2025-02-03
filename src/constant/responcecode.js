// define all fields error codes

const RESPONCE = Object.freeze({
    ERROR: {
        WITHOUT_ERROR: 0,
        WITH_ERROR: 1
    },
    RESPONCE_CODE: {
        SUCCESS: 200,
        UNAUTHORIZED_USER: 401,
        EMAIL_NOT_EXIST: 101,
        INCORRECT_PASSWORD: 102,
        USER_NOT_EXIST: 103,
        EMAIL_EXIST: 104,
        OTP_NOT_VERIFIED: 105,
        PASSWORD_MISMATCH: 106,
        OTP_EXPIRE: 110, 
        OTP_ALREADY_USED: 111, 
        DEACTIVATED_USER: 107,
        PARAMETER_MISSING: 108,
        CLIENT_MAP_WITH_DEPT: 109,
        INTERNAL_SERVER_ERROR: 500,
        DUPLICATE_FEEDBACK: 117
    }
});

module.exports={
    RESPONCE:RESPONCE
}