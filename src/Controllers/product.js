/* eslint-disable no-undef */
const respon = require("../Helpers/respon")
const model = require("../Models/product")
const cloudUpload = require("../Helpers/cloudUpload")
const {redisdb} = require("../Configs/redis")
const loggers = require("../Configs/wins")

class Products {
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
            if (req.file === undefined) {
                return respon(res, 500, {message: "Image must be filled"})
            }
            req.body.image = await cloudUpload(req.file.path)
            const result = await model.addProducts(req.body)
            redisdb.del("terasproducts")
            loggers.info("Add product was successfull", result)
            return respon(res, 200, result)
        } catch (error) {
            loggers.warn("Cannot add product", error);
            return respon(res, 500, error)
        }
    }

    async get(req, res) {
        try {
            const result = await model.getProducts()
            const saveRedis = JSON.stringify(result)
            redisdb.setex("terasproducts", 3600, saveRedis)
            loggers.info("Get product from postgres", result)
            return respon(res, 200, result)
        } catch (error) {
            loggers.warn("Cannot get product", error)
            return respon(res, 400, error)
        }
    }

    async search(req, res) {
        try {
            const result = await model.searchProducts(req.body.name)
            loggers.info("Search name product", result)
            return respon(res, 200, result)
        } catch (error) {
            loggers.warn("Cannot search name product", error)
            return respon(res, 400, error)
        }
    }
    
    async orderedAll(req, res) {
        try {
            const {name, price, category, orderBy, order} = req.query
            const result = await model.orderedAllProducts(name, price, category, orderBy, order)
            loggers.info("Search product", result)
            return respon(res, 200, result)
        } catch (error) {
            loggers.warn("Cannot search product", error)
            return respon(res, 400, error)
        }
    }
    
    async ordered(req, res) {
        try {
            const result = await model.orderedProducts(req.query.orderBy, req.query.order)
            loggers.info("Order product", result)
            return respon(res, 200, result)
        } catch (error) {
            loggers.warn("Cannot order product", error)
            return respon(res, 400, error)
        }
    }

    async update(req, res) {
        try {
            if (req.file === undefined) {
                loggers.info("Update product failed: check image product")
                return respon(res, 500, {message: "Image must be filled"})
            }
            const nameAsId = await model.searchProducts(req.body.oldName)
            if (nameAsId.length == 0) {
                loggers.info("Update product failed: check old name product")
                return respon(res, 200, {message: `Data with old name = ${nameAsId[0].name_product} doesn't exist`})
            }
            req.body.id = nameAsId[0].id_product
            req.body.image = await cloudUpload(req.file.path)
            const result = await model.updateProducts(req.body)
            redisdb.del("terasproducts")
            loggers.info("Update product was successfull", result)
            return respon(res, 200, result)
        } catch (error) {
            loggers.warn("Update product failed", error)
            return respon(res, 502, error)
        }
    }

    async del(req, res) {
        try {
            const result = await model.delProducts(req.query.name)
            redisdb.del("terasproducts")
            loggers.info("Product was deleted", result)
            return respon(res, 200, result)
        } catch (error) {
            loggers.warn("Delete product failed", error)
            return respon(res, 404, error)
        }
    }
}

module.exports = new Products()