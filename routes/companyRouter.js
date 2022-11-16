const {Router} = require('express')
const router = Router()
const companyController = require('../controllers/companyController')
const authCheck = require('../middleware/authCheck')
const avatarUpload = require('../middleware/avatarUpload')

router.get('/all', companyController.getAll)
router.get('/mycompanies', authCheck, companyController.getMyCompanies)
router.get('/company-responses/:url', companyController.getAllCompanyResponses)
router.post('/create',
    companyController.createCompany)
router.post('/fileupload',
    avatarUpload.single('avatar'), companyController.uploadFile)
router.delete('/deleteCompany', companyController.deleteCompany)
router.get('/id/:url', companyController.getOne)

module.exports = router