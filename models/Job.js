const {Schema, model} = require('mongoose')


const job = Schema({
    position: {type: String, required: true},
    location: {type: String,required: true},
    remoteJob: {type: String},
    experience: {type: String},
    qualification: {type: String},
    requiredSkills: [{
        type: Schema.Types.ObjectId,
        ref: 'Skill'
    }],
    employmentType: {type: String},
    salaryMin: {type: Number},
    salaryMax: {type: Number},
    shareMin: {type: Number},
    shareMax: {type: Number},
    currency: {
        type: String,
        enum: ["₽", "$", "€"]
    },
    description: {type: String},
    creationDate: {type: Date, required: true},
    companyAffiliation: {type: Schema.Types.ObjectId, ref: 'Company', required: true},
    bookmarkedBy: [{type: Schema.Types.ObjectId, ref: 'User', unique: true}],
    responses: [{type: Schema.Types.ObjectId, ref: 'User', unique: true}]
})

module.exports = model('Job', job)