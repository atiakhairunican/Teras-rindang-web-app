/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const respon = require("../Helpers/respon")
const jwt = require("jsonwebtoken")
const loggers = require("../Configs/wins")

const checkToken = (role) => {
    return function(req, res, next) {
        const {authtoken} = req.headers
        let isAccess = false

        if (!authtoken) {
            loggers.info("Invalid token: login first")
            return respon(res, 401, {message: "Please login"})
        }

        jwt.verify(authtoken, process.env.JWT_KEYS, (err, decode) => {
            if (err) {
                loggers.warn("Check token failed", err)
                return respon(res, 401, err)
            }
            role.map(value => {
                if (value == decode.role) {
                    isAccess = true
                }
            })
            
            if(isAccess) {
                next()
            }
            else {
                loggers.info("Token not permitted")
                return respon(res, 401, {message: "You are not permitted"})
            }
        })
    }
}

module.exports = checkToken