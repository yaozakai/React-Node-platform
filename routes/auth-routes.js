const check_auth = require('./auth-check')
const router = require('express').Router()
const passport = require('passport')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const User = require('./../db/user-model')

const toolEmail = require('./tool-email')
var ObjectId = require('mongodb').ObjectId;


router.get('/login', (req, resp) => {
    resp.redirect('/')
})

router.post('/login', check_auth.verify, passport.authenticate('local', {
    failureRedirect: '/',
    failureFlash: true
    }), (req, resp) => {
        if (req.user.isVerified === true) {
            return resp.redirect('/dashboard')
        }
        // remind user to confirm email
        req.flash('resendEmail', true)
        req.flash('error', 'Account already exists but you have not yet verified your email!')
        resp.redirect('/')
    }
)

 router.delete('/logout', (req, resp) => {
    req.logout()
    resp.redirect('/')
        
})

router.post('/register', check_auth.verify, async (req, resp) => {
    
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        // check if user exists
        User.findOne({ username: req.body.username }).then((currentUser) => {
            // user found via username
            if( currentUser ){
                // req.flash('alertTitle', 'Username already exists!')
                // req.flash('alertMsg', 'Pick a different username')
                req.flash('error', 'Sorry, username already exists! Pick a different one.')
                resp.redirect('/') 
            } else {
                User.findOne({ email: req.body.email}).then((currentUser) => {
                    if( currentUser ){
                        // user found via email
                        if( currentUser.isVerified ) {
                            // user already verified
                            // req.flash('alertTitle', 'Account already exists!')
                            // req.flash('alertMsg', 'Please sign in with your credentials, or click "forgot password" to reset.')
                            req.flash('error', 'Account already exists! Please sign in with your credentials, or click "forgot password" to reset.')
                            resp.redirect('/')
                        } else {
                            // request resending of verify email
                            req.flash('resendEmail', true)
                            req.flash('error', 'Account already exists but you have not yet verified your email!')
                            resp.redirect('/')
                        }
                    } else {
                        // create user
                        new User({
                            isVerified: false,
                            email: req.body.email,
                            username: req.body.username,
                            emailToken: crypto.randomBytes(64).toString('hex'),
                            googleId: '',
                            image: '',
                            password: hashedPassword,
                            locale: req.body.locale
                        }).save().then((newUser) => {
                            toolEmail.sendVerify(req, resp, newUser)                        
                        })
                    }
                }).catch( ( ) => {
                    req.flash('alertTitle', 'Server error')
                    req.flash('Please try later (not my fault)')
                    resp.redirect('/')   
                })
            }
        }).catch(() => {
            req.flash('alertTitle', 'Server error')
            req.flash('Please try later (not my fault)')
            resp.redirect('/')   
        }) 
    } catch {
        req.flash('alertTitle', 'Server error')
        req.flash('Please try later (not my fault)')
        resp.redirect('/')   
    }
})

router.get('/verifyEmail', check_auth.verifyEmail, async(req, resp, next) => {
    try {
        // check if user exists
        User.findOne({ email: req.query.email }).then((currentUser) => {
            toolEmail.sendVerify(req, resp, currentUser)
        })
    } catch {
        resp.redirect('/')

    }
})

router.get('/email', async(req, resp, next) => {

    try {
        User.findOne({ emailToken: req.query.token }).then( async ( currentUser) => {
            if( currentUser ){
                currentUser.emailToken = ''
                currentUser.isVerified = true
                await currentUser.save()
                req.login(currentUser, loginError => {
                    if( loginError ){
                        console.log( loginError )
                    }
                    req.flash('error', `Hi ${çcurrentUser.username}! Welcome to the site for the first time! 😎`)
                    resp.redirect('/dashboard')
                    return
                })
                    // req.login(savedUser).then((loginUser) => {
                    //     req.flash('error', `Hi ${loginUser.username}! Welcome to the site for the first time! 😎`)
                    //     // req.flash('alertTitle', `Hi ${currentUser.username}!`)
                    //     // req.flash('alertMsg', 'Welcome to the site for the first time! 😎')
                    //     resp.redirect('/dashboard')
                    //     return
                    // }).catch((error) => {
                    //     throw (error)
                    // })
            }
        }).catch((error) => {
            req.flash('alertTitle', `Email error:${error}`)
            req.flash('alertMsg', 'Email token is invalid, please try registering again.')
            resp.redirect('/')
            return
        })
        
    } catch(error) {
        req.flash('alertTitle', 'Login error')
        req.flash('alertMsg', 'System is down.')
        return
    }
})

 router.get('/google', passport.authenticate('google', {
        scope: ['profile']
    })
 )

 router.get('/google/redirect', passport.authenticate('google'), (req, resp) => {
    // resp.send(req.user)
    // resp.send('you are logged in: ' + req.user.username) 
    resp.redirect('/dashboard')
 })

 module.exports = router