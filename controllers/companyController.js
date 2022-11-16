const ApiError = require("../errors/ApiError");
const User = require("../models/User");
const Company = require("../models/Company")
const Job = require("../models/Job")

class CompanyController {

    async createCompany(req, res, next) {
        try {
            const company = req.body
            const company_candid = await Company.create({
                name: company.name,
                website: company.website,
                country: company.country,
                employeesNumber: company.employeesNumber,
                owner: company.owner.id,
                url: company.name.replace(/\s+/g, '').toLowerCase()
            })
            const user = await User.findById(company.owner.id)
            user.companies.push(company_candid.id)
            await user.save()
            return res.json(company_candid)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req, res, next) {
        try {
            return res.json(await Company.find())
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getMyCompanies(req, res, next) {
        try {
            let companyList = []
            companyList = await Company.find({owner: req.user.id})
            return res.json(companyList)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getOne(req, res, next) {
        try {
            const {url} = req.params
            const company = await Company.findOne({url}).populate({
                path: 'jobs',
                populate: [{
                    path: 'requiredSkills'
                }, {
                    path: 'companyAffiliation'
                }, {
                    path: 'responses',
                    populate: {
                        path: 'skills'
                    }
                }]
            }).populate('owner')
            res.json(company)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async deleteCompany(req, res, next) {
        try {
            const company = req.body
            await Job.deleteMany({companyAffiliation: company})
            await Company.deleteOne({_id: company._id})
            await User.updateOne({_id: company.owner}, {$pull: {companies: company._id}})
            res.json({})
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async editCompany(req, res, next) {
        try {
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getAllCompanyResponses(req, res, next) {
        try {
            const {url} = req.params
            const company = await Company.findOne({url}).populate({
                path: 'jobs',
                populate: {
                    path: 'responses'
                }
            })
            res.json(company.jobs)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async uploadFile(req, res, next) {
        try {
            if (req.file) {
                await Company.findOneAndUpdate({name: req.body.companyName}, {logo: req.file.path})
                res.json({message: 'file successfully uploaded', file: req.file})
            } else {
                res.json({message: "Wrong file format"})
            }

        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new CompanyController()