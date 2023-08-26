const check_auth = require('./auth-check')
const router = require('express').Router()
const passport = require('passport')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const User = require('./../db/user-model')

const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_KEY)


router.get('/login', (req, resp) => {
    resp.redirect('/')
})

router.post('/login', check_auth.not, passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/',
    failureFlash: true
 }))

 router.delete('/logout', (req, resp) => {
    req.logout()
    resp.redirect('/')
        
})

router.post('/register', check_auth.not, async (req, resp) => {
    
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        // check if user exists
        User.findOne({ username: req.body.username }).then((currentUser) => {
            User.findOne({ email: req.body.email}).then((emailFound) => {
                if (currentUser || emailFound){
                    // user exists
                    req.flash('alertTitle', 'Confirmation email resent!')
                    req.flash('alertMsg', 'Your account already exists, so we sent a confirmation email to ' + req.body.email + '. Please verify your account through the link sent to you.')
                    resp.redirect('/')
                } else {
                    // create user
                    new User({
                        username: req.body.username,
                        email: req.body.email,
                        emailToken: crypto.randomBytes(64).toString('hex'),
                        googleId: '',
                        image: '',
                        password: hashedPassword
                    }).save().then((newUser) => {

                        const msg = {
                            from: 'no-reply@waltyao.com',
                            to: req.body.email,
                            subject: 'Please confirm your account',
                            text: `Thanks for stopping by, click on this link to confirm: 
                            http://${req.headers.host}/auth/email?token=${newUser.emailToken}
                            `,
                            html: `<a href="http://${req.headers.host}/auth/email?token=${newUser.emailToken})">`
                        }
                        sgMail.send(msg).then(() => {
                            req.flash('alertTitle', 'Check your email!')
                            req.flash('alertMsg', 'Email has been sent to ' + req.body.email + '. Please verify your account through the link sent to you.')
                            resp.redirect('/')
                        }).catch((error) => {
                            req.flash('alertTitle', 'Email error')
                            req.flash('alertMsg', 'Something when wrong when sending email. Please try again.')
                        }) 
                    })
                }
            }) 
        })
    } catch {
        resp.redirect('/')
    }
})

router.get('/email', async(req, resp, next) => {

    try {
        User.findOne({ emailToken: req.query.token }).then((currentUser) => {
            // req.flash('alertTitle', 'Account confirmed!')
            // req.flash('alertMsg', 'Logging in..')
            currentUser.emailToken = NULL
            currentUser.isVerified = true
            currentUser.save()
            req.login(currentUser).then(() => {
                req.flash('alertTitle', `Hi ${currentUser.username}!`)
                req.flash('alertMsg', 'Welcome to the site for the first time! 😎')
                const redirectURL = req.session.redirectTo || '/dashboard'
                delete req.session.redirectTo
                resp.redirect(redirectURL)
            }).catch((error) => {
                req.flash('alertTitle', 'Login error')
                req.flash('alertMsg', 'Something.')
            })
            return resp.redirect('/')
        }).catch((error) => {
            req.flash('alertTitle', 'Email error')
            req.flash('alertMsg', 'Email token is invalid, please try registering again.')
            return resp.redirect('/')
        })
        
    } catch(error) {

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