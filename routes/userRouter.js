const {Router} = require('express')
const router = Router()
const userController = require('../controllers/userController')
const {check} = require('express-validator')
const authCheck = require('../middleware/authCheck')
const accessLevel = require('../middleware/accessLevel')
const avatarUpload = require('../middleware/avatarUpload')
const pdfUpload = require('../middleware/pdfUpload')
const config = require('config')

router.get('/auth', authCheck, userController.updateToken)
router.get('/all', accessLevel(config.get('ROLE_ADMIN')), userController.getAll)
router.get('/talents', userController.getTalents)
router.get('/getUserInfo', authCheck, userController.getUserInfo)
router.get('/:id', userController.getOne)

router.post(
    '/register',
    [
    check('email', 'Некорректный email адрес').isEmail(),
    check('password', 'Минимальная длина пароля - 6 символов').isLength({min: 6})
    ],
    userController.register)

router.post(
    '/login',
    [
    check('email', 'Некорректный email адрес').normalizeEmail().isEmail(),
    check('password', 'Введите пароль').exists().isLength({min: 6})],
    userController.login)

router.post('/login-google', userController.loginGoogle)

router.post(
    '/savesettingschanges',

    [
        check('newData.email', 'Некорректный email адрес').optional().isEmail()
    ],
    userController.saveProfileSettingsChanges)

router.post(
    '/fileupload', authCheck, avatarUpload.single('avatar'), userController.uploadFile)

router.post(
    '/cvupload', authCheck, pdfUpload.single('cv'), userController.uploadFile)

module.exports = router