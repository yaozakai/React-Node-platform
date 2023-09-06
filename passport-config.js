const LocalStrategy = require('passport-local').Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy
const bcrypt = require('bcrypt')
const User = require('./db/user-model')

function initialize(passport) {
    const authenticateUser = async (email, password, done) => {

        User.findOne({email: email}).then( async (user) => {
            if (user){
                if( user.isVerified ){
                    try {
                        if (await bcrypt.compare(password, user.password)) {
                            // update user stats (after passport authenticate, otherwise, user is redirected at check_auth.verify)
                            user.loginCount++
                            await user.save()
                            return done( null, user)
                        } else {
                            return done( null, false, { message: 'Incorrect password'})
                        }
                    } catch (e) {
                        return done(e)
                    }
                } else {
                    return done( null, user, { message: 'User not verified'})
                }
            } else {
                return done(null, false, { message: 'No user exists'})
            }
        })

        // return done(null, false, { message: 'No user exists'})

    }
    const authenticateGoogleUser = async (accessToken, refreshToken, profile, done) => {
        // check if user exists
        User.findOne({googleId: profile.id}).then((currentUser) => {
            if (currentUser){
                // user exists
                done(null, currentUser)
            } else {
                // create user
                new User({
                    created: Date.now(),
                    lastSession: '',
                    loginCount: 0,
                    isVerified: true,
                    email: '',
                    username: profile.displayName,
                    emailToken: '',
                    forgotToken: '',
                    googleId: profile.id,
                    image: profile.photos[0]['value'],
                    password: '',
                    locale: profile.locale

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