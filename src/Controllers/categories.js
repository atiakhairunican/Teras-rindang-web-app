/* eslint-disable no-undef */
const respon = require("../Helpers/respon")
const model = require("../Models/categories")
const loggers = require("../Configs/wins")

class Categories {
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
            const result = await model.addCategories(req.body)
            return respon(res, 200, result)
        } catch (error) {
            return respon(res, 500, error)
        }
    }

    async get(req, res) {
        try {
            const result = await model.getCategories()
            loggers.info("Get all Categories", result)
            return respon(res, 200, result)
        } catch (error) {
            loggers.warn("Cannot get Categories", error)
            return respon(res, 500, error)
        }
    }

    async update(req, res) {
        try {
            if (req.body.name == undefined) {
                loggers.info("Cannot update Categories: check data input")
                return respon(res, 401, {message: "Make sure all data is filled."})
            }
            else {
                const result = await model.updateCategories(req.body)
                loggers.info("Categories updated", result)
                return respon(res, 200, result)
            }
            
        } catch (error) {
            loggers.warn("Cannot update Categories", error)
            return respon(res, 500, error)
        }
    }

    async del(req, res) {
        try {
            const result = await model.delCategories(req.query.id)
            loggers.info("Categories was deleted", result)
            return respon(res, 200, result)
        } catch (error) {
            loggers.warn("Cannot delete Categories", error)
            return respon(res, 500, error)
        }
    }
}

module.exports = new Categories()