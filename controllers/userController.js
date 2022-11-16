const ApiError = require('../errors/ApiError')
const User = require("../models/User")
const Role = require("../models/Role")
const bcrypt = require("bcryptjs")
const {validationResult} = require('express-validator')
const jwt = require("jsonwebtoken");
const config = require("config");
const {OAuth2Client} = require('google-auth-library');

const generate_jwt_token = (id, email, role, skills, companies) => {
    return jwt.sign(
        {id, email, role, skills, companies},
        config.get("jwt-secret-key"),
        {expiresIn: '12h'}
    )
}

class UserController {

    async register(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty())
                return res.status(400).json({errors: errors.array(), message: "Ошибка при регистрации"})
            const {email, password, role} = req.body
            const candidate = await User.findOne({email})

            if (candidate)
                return next(ApiError.badRequest('Такой пользователь уже зарегестрирован'))

            const hashedPassword = await bcrypt.hash(password, 7)
            const userRole = await Role.findOne({value: role})
            const user = new User({email: email, password: hashedPassword, role: userRole.value})
            const token = generate_jwt_token(user.id, user.email, user.role, [], [])
            await user.save()
            res.status(201).json({message: 'Пользователь создан', token: token})
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async loginGoogle(req, res, next) {
        try {
            const {id_token} = req.body
            const CLIENT_ID = config.get("CLIENT_ID")
            const client = new OAuth2Client(CLIENT_ID);

            async function verify() {
                const ticket = await client.verifyIdToken({
                    idToken: id_token,
                    audience: CLIENT_ID
                });
                const payload = ticket.getPayload();
                let user = await User.findOne({email: payload.email})
                if (!user) {
                    const hashedPassword = await bcrypt.hash(config.get("google_pass"), 7)
                    user = new User({email: payload.email, password: hashedPassword, role: 'BASIC'})
                    await user.save()
                    const token = generate_jwt_token(user.id, user.email, user.role, user.skills, user.companies)
                    res.status(201).json({message: 'Пользователь создан', token: token})
                } else {
                    const token = generate_jwt_token(user.id, user.email, user.role, user.skills, user.companies)
                    res.json({message: 'Пользователь авторизован', token: token, user_id: user.id})
                }
            }

            verify().catch((e) => {
                console.log(e.message)
                next(ApiError.badRequest(e.message))
            })
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async login(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty())
                return res.status(400).json({errors: errors.array(), message: "Ошибка при авторизации"})
            const {email, password} = req.body
            const user = await User.findOne({email: email}).select('+password')
            if (!user)
                return next(ApiError.badRequest('Пользователь не найден'))
            const isMatchPassword = await bcrypt.compareSync(password, user.password)
            if (!isMatchPassword)
                return next(ApiError.badRequest('Неверный пароль'))
            const token = generate_jwt_token(user.id, user.email, user.role, user.skills, user.companies)
            res.json({message: 'Пользователь авторизован', token: token, user_id: user.id})
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req, res, next) {
        try {
            const users = await User.find()
            res.json(users)
        } catch (e) {
            next(ApiError.internalServerError(e.message))
        }
    }

    async getOne(req, res, next) {
        try {
            const {id} = req.params
            const user = await User.findById(id).populate('skills')
            res.json(user)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getUserInfo(req, res, next) {
        try {
            const id = req.user.id
            const user = await User.findById(id).populate('skills')
            res.json(user)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async saveProfileSettingsChanges(req, res, next) {
        const errors = validationResult(req)
        if (!errors.isEmpty())
            return res.status(400).json({errors: errors.array(), message: "Ошибка при сохранении"})

        try {

            const {user, newData} = req.body
            await User.findByIdAndUpdate(user.id, newData)
            const token = generate_jwt_token(user.id, newData.email || user.email, user.role, newData.skill || user.skills, user.companies)
            res.json({message: 'changes to profile saved', token: token})

        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getTalents(req, res, next) {
        try {
            const talents = await User.find({skills: {$exists: true, $ne: []}}).populate('skills')
            res.json(talents)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async uploadFile(req, res, next) {
        try {
            const id = req.user.id
            if (req.file) {
                if (req.file.fieldname === 'avatar') await User.findByIdAndUpdate(id, {avatar: req.file.path})
                else await User.findByIdAndUpdate(id, {resumeCV: req.file.path})
                res.json({status: 200, message: 'file successfully uploaded', file: req.file})
            } else {
                res.json({status: 400, message: "Wrong file format"})
            }
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async updateToken(req, res, next) {
        try {
            const user_upd = await User.findOne({email: req.user.email}).populate('skills')
            const token = generate_jwt_token(user_upd.id, user_upd.email, user_upd.role, user_upd.skills, user_upd.companies)
            return res.json({token})
        } catch (e) {
            res.json(e.message)
        }
    }

}

module.exports = new UserController()