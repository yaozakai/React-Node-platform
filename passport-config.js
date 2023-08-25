const LocalStrategy = require('passport-local').Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy
const bcrypt = require('bcrypt')
const User = require('./db/user-model')

function initialize(passport) {
    const authenticateUser = async (email, password, done) => {
        User.findOne({email: email}).then( async (user) => {
            if (user){
                try {
                    if (await bcrypt.compare(password, user.password)) {
                        return done( null, user)
                    } else {
                        return done( null, false, { message: 'Incorrect password'})
                    }
                } catch (e) {
                    return done(e)
                }
            } else {
                return done(null, false, { message: 'No user exists'})
            }
        })

        // const user = User.findOne({email: email})
        // if (user == null) {
        //     return done(null, false, { message: 'No user exists'})
        // }
        // try {
        //     if (await bcrypt.compare(password, user.password)) {
        //         return done( null, user)
        //     } else {
        //         return done( null, false, { message: 'Incorrect password'})
        //     }
        // } catch (e) {
        //     return done(e)
        // }

    }
    const authenticateGoogleUser = async (accessToken, refreshToken, profile, done) => {
        // check if user exists
        User.findOne({googleId: profile.googleId}).then((currentUser) => {
            if (currentUser){
                // user exists
                done(null, currentUser)
            } else {
                // create user
                new User({
                    username: profile.displayName,
                    email: '',
                    googleId: profile.googleId,
                    image: profile.photos[0]['value']
                }).save().then((newUser) => {
                    done(null, newUser)
                })
            }
        })
    }

    passport.use(
        new LocalStrategy({ 
            usernameField: 'email', 
            passwordField: 'password'}, 
            authenticateUser))
    passport.use(
        new GoogleStrategy({ 
            callbackURL: '/auth/google/redirect',
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET},
            authenticateGoogleUser))

    // cookie
    passport.serializeUser((user, done) => { done(null, user.id) })
    passport.deserializeUser((id, done) => { 
        User.findById(id).then((user) => {
            done(null, user)    
        })
    })
}

module.exports = initialize