const {Schema, model} = require('mongoose')

const skill = Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    color: String
})

module.exports = model('Skill', skill)