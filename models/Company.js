const {Schema, model} = require('mongoose')

const company = Schema({
    name: {type: String, required: true, unique: true},
    website: {type: String, required: true},
    country: {type: String, required: true},
    city: {type: String},
    companyDescription: {type: String},
    oneLinePitch: {type: String},
    fundingRounds: [{
        stage: {
            type: String,
            enum: ["pre-seed", "seed", "A", "B", "C"]
        },
        description: {type: String}
    }],
    foundationDate: {type: Date},
    logo: {type: String, default: 'images\\defaultLogo.png'},
    employeesNumber: {
        type: String,
        required: true,
        enum: ["1-10", "11-50", "51-100", "100-1000", "1000+"]
    },
    url: {type: String},
    owner: {type: Schema.Types.ObjectId, ref: 'User'},
    jobs: [{type: Schema.Types.ObjectId, ref: 'Job'}]
})

module.exports = model('Company', company)