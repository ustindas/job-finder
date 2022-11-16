const {Router} = require('express')
const router = Router()
const jobController = require('../controllers/jobController')
const authCheck = require('../middleware/authCheck')

router.get('/all',jobController.getAll)
router.get('/bookmarked-jobs',authCheck, jobController.getBookmarkedJobs)
router.get('/user-responses', authCheck, jobController.getUserResponses)
router.get('/job-responses', authCheck, jobController.getJobResponses)
router.get('/filter-job',jobController.getFilteredJobs)

router.post('/create-job',jobController.createJob)
router.post('/edit-job',jobController.editJob)
router.post('/add-job-to-bookmark', authCheck, jobController.addJobToBookmark)
router.post('/add-to-responses', authCheck, jobController.addToResponses)

router.delete('/deleteJob', jobController.deleteJob)
router.delete('/delete-job-from-bookmark',authCheck, jobController.deleteJobFromBookmark)
router.delete('/delete-from-responses',authCheck, jobController.deleteFromResponses)

module.exports = router