const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    username: String,
    email: String,
    password: String,
    image: String,
    googleId: String,
    locale: String
})

const User = mongoose.model('user', userSchema)

module.exports = User