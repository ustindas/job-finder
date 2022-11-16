const {Router} = require('express')
const userRouter = require('./userRouter')
const companyRouter = require('./companyRouter')
const jobRouter = require('./jobRouter')
const skillRouter = require('./skillRouter')

const router = Router()

router.use('/user', userRouter)
router.use('/skill',skillRouter)
router.use('/company', companyRouter)
router.use('/job', jobRouter)

module.exports = router