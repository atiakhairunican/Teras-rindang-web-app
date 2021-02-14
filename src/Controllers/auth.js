const bcr = require("bcrypt")
const model = require("../Models/users")
const respon = require("../Helpers/respon")
const jwt = require("jsonwebtoken")
const loggers = require("../Configs/wins")

class Auth {
    login = async (req, res) => {
        try {
            const passDB = await model.getByEmail(req.body.email)
            const passUsers = req.body.password
            
            if (req.body.email == undefined || req.body.password == undefined) {
                loggers.info("Login failed: check data input.")
                return respon(res, 200, {message: "Make sure all data is filled"})
            }
            else if (passDB.length == 0) {
                loggers.info("Login failed: check email.")
                return respon(res, 200, {message: "Email has not been registered."})
            }
            const check = await bcr.compare(passUsers, passDB[0].password)

            if (check) {
                const result = await this.setToken(req.body.email, passDB[0].role)
                loggers.info("Login was successfull", result)
                return respon(res, 200, result)
            }
            else {
                loggers.info("Login failed: check password.")
                return respon(res, 200, {message: "Check your password!"})
            }
        } catch (error) {
            loggers.warn("Login failed", error)
            return respon(res, 500, error)
        }
    }

    setToken = async (email, role) => {
        try {
            const payload = {
                email : email,
                role : role,
            }
            const token = jwt.sign(payload, process.env.JWT_KEYS, {expiresIn: '1d'})
            const result = {
                message : "Token created",
                token : token,
                role : role
            }
            loggers.info("Token created", result)
            return result
        } catch (error) {
            loggers.warn("Set token failed", error)
            throw error
        }
    }
}

module.exports = new Auth()