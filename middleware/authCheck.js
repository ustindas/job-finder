const ApiError = require("../errors/ApiError")
const jwt = require('jsonwebtoken')
const config = require("config")

module.exports = function (req, res, next){
    if(req.method === "OPTIONS")
        next()
    try{
        const token = req.headers.authorization.split(' ')[1]
        if(!token)
            return next(ApiError.unauthorized("Вы не авторизированы"))
        req.user = jwt.verify(token, config.get('jwt-secret-key'))
        next()
    }
    catch (e){
        return next(ApiError.unauthorized("Вы не авторизированы. Токен истек"))
    }
}