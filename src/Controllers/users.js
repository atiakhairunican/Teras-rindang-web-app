/* eslint-disable no-undef */
const hashPassword = require("../Helpers/hash")
const respon = require("../Helpers/respon")
const model = require("../Models/users")
const loggers = require("../Configs/wins")

class Users {
    async commit(req, res) {
        try {
            const result = await model.commit()
            return respon(res, 200, result)
        } catch (err) {
            return respon(res, 500, err)
        }
    }

    async drop(req, res) {
        try {
            const result = await model.drop()
            return respon(res, 200, result)
        } catch (err) {
            return respon(res, 500, err)
        }
    }

    async add(req, res) {
        try {
            const check = await model.getByEmail(req.body.email)
            if(check.length > 0) {
                loggers.info("Cannot add users: check email.")
                return respon(res, 401, {message: "Email is already registered."})
            }
            else if (req.body.name == undefined || req.body.email == undefined
                || req.body.password == undefined || req.body.role == undefined) {
                loggers.info("Cannot add users: check data input.")
                return respon(res, 401, {message: "Make sure all data is filled."})
            }
            else if (req.body.role != "admin" && req.body.role != "customer") {
                loggers.info("Cannot add users: check role.")
                return respon(res, 401, {message: "Filled between admin or customer."})
            }
            else {
                const newPassword = await hashPassword(req.body.password)
                const users = {
                    name : req.body.name,
                    email : req.body.email,
                    password : newPassword,
                    role : req.body.role
                }
                const result = await model.add(users)
                loggers.info("Users added", result)
                return respon(res, 200, result)
            }
            
        } catch (error) {
            loggers.warn("Cannot add users", error)
            return respon(res, 500, error)
        }
    }

    async getAll(req, res) {
        try {
            const result = await model.getAll()
            loggers.info("Get all users", result)
            return respon(res, 200, result)
        } catch (error) {
            loggers.warn("Cannot get users", error)
            return respon(res, 500, error)
        }
    }

    async update(req, res) {
        try {
            const check = await model.getByEmail(req.body.email)
            if (req.body.name == undefined || req.body.email == undefined
                || req.body.password == undefined || req.body.role == undefined
                || req.body.id == undefined) {
                loggers.info("Cannot update users: check data input")
                return respon(res, 401, {message: "Make sure all data is filled."})
            }
            else if (req.body.role != "admin" && req.body.role != "customer") {
                loggers.info("Cannot update users: check role")
                return respon(res, 401, {message: "Filled between admin or customer."})
            }
            else {
                const newPassword = await hashPassword(req.body.password)
                const users = {
                    id : req.body.id,
                    name : req.body.name,
                    email : req.body.email,
                    password : newPassword,
                    role : req.body.role
                }
                const result = await model.update(users)
                loggers.info("Users updated", result)
                return respon(res, 200, result)
            }
            
        } catch (error) {
            loggers.warn("Cannot update users", error)
            return respon(res, 500, error)
        }
    }

    async del(req, res) {
        try {
            const result = await model.del(req.query.id)
            loggers.info("Users was deleted", result)
            return respon(res, 200, result)
        } catch (error) {
            loggers.warn("Cannot delete users", error)
            return respon(res, 500, error)
        }
    }
}

module.exports = new Users()