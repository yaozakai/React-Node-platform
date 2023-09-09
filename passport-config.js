const LocalStrategy = require('passport-local').Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy
const FacebookStrategy = require('passport-facebook').Strategy

const bcrypt = require('bcrypt')
const User = require('./db/user-model')

const hostname = require('os').hostname()
var url = 'https://2517-2001-b011-2000-13b9-1046-5720-eb27-40e5.ngrok-free.app'
if( hostname === 'srv.gambits.vip'){
    url = 'https://gambits.vip'
}

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
                    facebookId: '',
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
    const authenticateFBUser = async (accessToken, refreshToken, profile, done) => {
        // check if user exists
        User.findOne({facebookId: profile.id}).then((currentUser) => {
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
                    googleId: '',
                    facebookId: profile.id,
                    image: '',
                    password: '',
                    locale: ''

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
    passport.use(
        new FacebookStrategy({
            callbackURL: url + "/auth/facebook/redirect",
            clientID: process.env.FACEBOOK_APP_ID,
            clientSecret: process.env.FACEBOOK_APP_SECRET},
            authenticateFBUser))

    // cookie
    passport.serializeUser((user, done) => { done(null, user.id) })
    passport.deserializeUser((id, done) => { 
        User.findById(id).then((user) => {
            done(null, user)    
        })
    })
}

module.exports = initialize