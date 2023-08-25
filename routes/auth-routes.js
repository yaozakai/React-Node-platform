const check_auth = require('./auth-check')
const router = require('express').Router()
const passport = require('passport')
const bcrypt = require('bcrypt')
const User = require('./../db/user-model')


router.get('/login', (req, resp) => {
    resp.render('/')
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
        User.findOne({ where: {username: req.body.username}}).then((currentUser) => {
            User.findOne({ where: {email: req.body.email}}).then((emailFound) => {
                if (currentUser || emailFound){
                    // user exists
                    resp.redirect('/')
                } else {
                    // create user
                    new User({
                        username: req.body.username,
                        email: req.body.email,
                        googleId: '',
                        image: '',
                        password: hashedPassword
                    }).save().then((newUser) => {
                        resp.redirect('/dashboard')
                    })
                }
            }) 
        })
    } catch {
        resp.redirect('/')
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