/* eslint-disable no-undef */
const respon = require("../Helpers/respon")
const model = require("../Models/history")
const loggers = require("../Configs/wins")

class Histories {
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
            const result = await model.addHistories(req.body)
            return respon(res, 200, result)
        } catch (error) {
            return respon(res, 500, error)
        }
    }

    async get(req, res) {
        try {
            const result = await model.getHistories()
            loggers.info("Get all Histories", result)
            return respon(res, 200, result)
        } catch (error) {
            loggers.warn("Cannot get Histories", error)
            return respon(res, 500, error)
        }
    }

    async update(req, res) {
        try {
            if (req.body.cashier == undefined ||
                req.body.date == undefined ||
                req.body.orders == undefined ||
                req.body.amount == undefined
                ) {
                loggers.info("Cannot update Histories: check data input")
                return respon(res, 401, {message: "Make sure all data is filled."})
            }
            else {
                const result = await model.updateHistories(req.body)
                loggers.info("Histories updated", result)
                return respon(res, 200, result)
            }
            
        } catch (error) {
            loggers.warn("Cannot update Histories", error)
            return respon(res, 500, error)
        }
    }

    async del(req, res) {
        try {
            const result = await model.delHistories(req.query.id)
            loggers.info("Histories was deleted", result)
            return respon(res, 200, result)
        } catch (error) {
            loggers.warn("Cannot delete Histories", error)
            return respon(res, 500, error)
        }
    }
}

module.exports = new Histories()