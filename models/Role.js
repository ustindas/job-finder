const {Schema, model} = require('mongoose')

const role = Schema({
    value: {type: String, unique: true, default : "BASIC"}
})

module.exports = model('Role', role)