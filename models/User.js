const {Schema, model} = require('mongoose')

const user = Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true, select: false},
    firstName: {type: String},
    lastName: {type: String},
    country: {type: String},
    city: {type: String},
    role: {
        type: String,
        enum: ["ADMIN", "BASIC"]
    },
    skills: [{type: Schema.Types.ObjectId, ref: 'Skill'}],
    companies: [{type: Schema.Types.ObjectId, ref: 'Company'}],
    resumeCV: {type: String},
    avatar: {type: String, default: 'images\\defaultAvatar.svg'},
    contactInfo: [{
        method: {
            type: String,
            enum: ["telegram", "instagram", "whatsup", "discord", "phone", "other"]
        },
        link: String
    }],
    bookmarkedJobs: [{
        type: Schema.Types.ObjectId,
        ref: 'Job', unique: true
    }],
    responses: [{
        type: Schema.Types.ObjectId,
        ref: 'Job', unique: true
    }],

    githubLink: {type: String},
    previousJobs: [{
        companyName: String,
        jobTitle: String,
        workDuration: Number
    }],
    desiredSalary: {type: Number},
    desiredCurrency: {type: String},
    experienceYears: {type: Number}

})

module.exports = model('User', user)