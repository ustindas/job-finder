const ApiError = require("../errors/ApiError")
const jwt = require('jsonwebtoken')
const config = require("config")

module.exports = function (role) {
    return function (req, res, next) {
        if (req.method === "OPTIONS")
            next()
        try {
            const token = req.headers.authorization.split(' ')[1]
            const {role: userRole} = jwt.verify(token, config.get('jwt-secret-key'))
            if (role !== userRole)
                return next(ApiError.forbidden("Доступ запрещен"))
            next()
        } catch (e) {
            return next(ApiError.forbidden("Доступ запрещен"))
        }
    }
}
