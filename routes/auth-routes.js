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

router.post('/login', check_auth.login, passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/',
    failureFlash: true
    })
)

router.delete('/logout', (req, resp) => {
   req.logout()
   resp.redirect('/')
       
})

router.post('/change', (req, resp) => {
    req.user.username = req.body.newName
    req.user.save().then(() => {
        var response = {
            status  : 200,
            success : 'Updated Successfully',
            newGame: req.body.newName
        }
        resp.end(JSON.stringify(response));
        

    }).catch(() => {
        return false
    })
})

router.post('/register', check_auth.verify, async (req, resp) => {
    
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        // check if user exists
        User.findOne({ username: req.body.username }).then((currentUser) => {
            // user found via username
            if( currentUser ){
                req.flash('error', 'Sorry, username already exists! Pick a different one.')
                resp.redirect('/') 
            } else {
                User.findOne({ email: req.body.email}).then((currentUser) => {
                    if( currentUser ){
                        // user found via email
                        if( currentUser.isVerified ) {
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
                            created: Date.now(),
                            lastSession: '',
                            loginCount: 0,
                            isVerified: false,
                            email: req.body.email,
                            username: req.body.username,
                            emailToken: crypto.randomBytes(64).toString('hex'),
                            forgotToken: '',
                            googleId: '',
                            image: '',
                            password: hashedPassword,
                            locale: ''
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

// forgot password
// 1. /send_forgot send initial request
// 2. /reset_pass comes from the email
// 3. /set_pass comes from user setting new password
router.post('/send_forgot', check_auth.home, async(req, resp, next) => {
    try {
        // check if user exists
        User.findOne({ email: req.body.email }).then((currentUser) => {
            if( currentUser ){
                toolEmail.sendForgot(req, resp, currentUser)
                return 
            }
            req.flash('error', `Email ${req.body.email} does not exist!`)
            resp.redirect('/')
            return
        })
    } catch {
        resp.redirect('/')
    }
})

router.get('/reset_pass', check_auth.home, async(req, resp, next) => {
    try {
        // search for forgotToken
        User.findOne({ forgotToken: req.query.token }).then((currentUser) => {
            if( currentUser ){
                // req.flash('forgotToken', req.query.token)
                resp.render('forgot.ejs', { user: currentUser })
                return 
            }
            req.flash('error', `Invalid token, please get a new email by clicking on "Forgot Password?"`)
            resp.render('forgot.ejs')
            return
        })
    } catch {
        resp.redirect('/')
    }
})

router.post('/set_pass', check_auth.home, async(req, resp, next) => {
    try {
        // search for forgotToken
        User.findOne({ forgotToken: req.query.token }).then( async (currentUser) => {
            if( currentUser ){
                // change the password
                const hashedPassword = await bcrypt.hash(req.body.password, 10)
                currentUser.password = hashedPassword
                await currentUser.save()
                req.flash('error', `Password successfully changed! Sign in to continue.`)
                resp.redirect('/')
                return 
            }
            req.flash('error', `Invalid token, please get a new email by clicking on "Forgot Password?"`)
            resp.redirect('/')
            return
        })
    } catch {
        resp.redirect('/')
    }
})

// login process
router.get('/verifyEmail', check_auth.verifyEmail, async(req, resp, next) => {
    try {
        // check if user exists
        User.findOne({ email: req.query.email }).then((currentUser) => {
            if( currentUser ){
                toolEmail.sendVerify(req, resp, currentUser)
            } else {
                req.flash('error', `User doesn't exist.`)
                resp.redirect('/')
                return 
            }
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
                    req.flash('error', `Hi ${currentUser.username}! You're verified! Sign in to continue 😎`)
                    resp.redirect('/')
                    return
                })
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

 router.get('/google', check_auth.verify, passport.authenticate('google', {
        scope: ['profile']
    })
 )

 router.get('/google/redirect', check_auth.verify, passport.authenticate('google'), async (req, resp) => {
    req.user.loginCount++
    req.user.lastSession = req.session.created
    await req.user.save()
    resp.redirect('/dashboard')
 })

 module.exports = router