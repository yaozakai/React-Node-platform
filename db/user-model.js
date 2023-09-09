const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    created: Date,
    lastSession: Date,
    loginCount: Number,
    isVerified: Boolean,
    username: String,
    email: String,
    emailToken: String,
    forgotToken: String,
    password: String,
    image: String,
    googleId: String,
    facebookId: String,
    locale: String
})

const User = mongoose.model('user', userSchema)

module.exports = User