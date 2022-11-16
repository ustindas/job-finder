const Skill = require('../models/Skill')
const ApiError = require("../errors/ApiError");

class SkillController {
    async create(req, res, next) {
        console.log("opa")
        try {
            const {name, color} = req.body
            console.log(name, color)
            const skill = await Skill.create({name: name, color: color})
            return res.json({skill, status: 200})
        } catch (e) {
            next(ApiError.badRequest(e))
        }
    }

    async delete(req, res, next) {
        try {
            const skill = req.body
            await Skill.deleteOne({_id: skill._id})
            res.json({status: 'OK'})
        } catch (e) {
            next(ApiError.badRequest(e))
        }
    }

    async getAll(req, res, next) {
        try {
            return res.json(await Skill.find())
        } catch (e) {
            next(ApiError.badRequest(e))
        }
    }
}

module.exports = new SkillController()