const Job = require("../models/Job");
const User = require("../models/User");
const Company = require("../models/Company")
const ApiError = require("../errors/ApiError");

class JobController {
    async getAll(req, res, next) {
        try {
            return res.json(await Job.find().populate('requiredSkills').populate('companyAffiliation'))
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async createJob(req, res, next) {
        try {
            const job = req.body

            const job_candid = await Job.create({
                position: job.position,
                location: job.location,
                employmentType: job.employmentType,
                remoteJob: job.remoteJob,
                experience: job.experience,
                qualification: job.qualification,
                requiredSkills: job.requiredSkills,
                salaryMin: job.salaryMin,
                salaryMax: job.salaryMax,
                shareMin: job.shareMin,
                shareMax: job.shareMax,
                currency: job.currency,
                description: job.description,
                companyAffiliation: job.companyAffiliation,
                creationDate: Date.now()
            })
            const company = await Company.findById(job.companyAffiliation)
            company.jobs.push(job_candid.id)
            await company.save()
            return res.json(job_candid)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async editJob(req, res, next) {
        try {
            const {jobId, jobData} = req.body
            await Job.findByIdAndUpdate(jobId, jobData)
            return res.json({message: 'changes to job saved'})
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async deleteJob(req, res, next) {
        try {
            const job = req.body
            await Job.deleteOne({_id: job._id})
            await Company.updateOne({_id: job.companyAffiliation}, {$pull: {jobs: job._id}})
            await User.updateMany({_id: {$in: job.bookmarkedBy}}, {$pull: {bookmarkedJobs: job._id}})
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getBookmarkedJobs(req, res, next) {
        try {
            const id = req.user.id
            const user = await User.findById(id).populate({
                path: 'bookmarkedJobs',
                populate: [{
                    path: 'companyAffiliation'
                }, {
                    path: 'requiredSkills'
                }
                ]
            })
            res.json(user.bookmarkedJobs)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async addJobToBookmark(req, res, next) {
        try {
            const {job} = req.body
            const id = req.user.id
            await User.findByIdAndUpdate(id, {$addToSet: {bookmarkedJobs: job}})
            await Job.findByIdAndUpdate(job._id, {$addToSet: {bookmarkedBy: id}})
            res.json({status: 200})
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async deleteJobFromBookmark(req, res, next) {
        try {
            const {job} = req.body
            const id = req.user.id
            await User.findByIdAndUpdate(id, {$pull: {bookmarkedJobs: job._id}})
            await Job.findByIdAndUpdate(job._id, {$pull: {bookmarkedBy: id}})
            res.json({})
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getUserResponses(req, res, next) {
        try {
            const id = req.user.id
            const user = await User.findById(id).populate({
                path: 'responses',
                populate: [{
                    path: 'companyAffiliation'
                }, {
                    path: 'requiredSkills'
                }
                ]
            })
            res.json(user.responses)
        } catch (e) {
            next(ApiError.internalServerError(e.message))
        }
    }

    async getJobResponses(req, res, next) {
        try {
            const {job} = req.query.job
            const jobDB = await Job.findById(job._id).populate('responses')
            res.json(jobDB.responses)
        } catch (e) {
            next(ApiError.internalServerError(e.message))
        }
    }

    async addToResponses(req, res, next) {
        try {
            const id = req.user.id
            const {job} = req.body
            await Job.findByIdAndUpdate(job._id, {$addToSet: {responses: id}})
            await User.findByIdAndUpdate(id, {$addToSet: {responses: job._id}})
            res.json({status: 200})
        } catch (e) {
            next(ApiError.internalServerError(e.message))
        }
    }

    async deleteFromResponses(req, res, next) {
        try {
            const {id, job} = req.body
            await Job.findByIdAndUpdate(job._id, {$pull: {responses: id}})
            await User.findByIdAndUpdate(id, {$pull: {responses: job._id}})
            res.json({status: 200})
        } catch (e) {
            next(ApiError.internalServerError(e.message))
        }
    }

    async getFilteredJobs(req, res, next) {
        try {
            const filter = req.query.jobFilter
            console.log(filter)
            const jobs = await Job.find(filter)
            res.json({jobs})
        } catch (e) {
            next(ApiError.internalServerError(e.message))
        }
    }
}


module.exports = new JobController()