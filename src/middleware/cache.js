const respone = require("../Helpers/respon")
const { redisdb } = require("../Configs/redis")
const loggers = require("../Configs/wins")

const getAll = (req, res, next) => {
    redisdb.get("products", (err, data) => {
        if (err) {
            loggers.warn("Redis doesn't get data", err)
            return respone(res, 500, err)
        }

        if (data !== null) {
            const result = JSON.parse(data)
            loggers.info("Get data from redis", result);
            return respone(res, 200, result)
        } else {
            next()
        }
    })
}

module.exports = getAll
