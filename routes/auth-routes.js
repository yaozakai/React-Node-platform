const check_auth = require('./auth-check')
const users = require('./../db/db_access.js')

const router = require('express').Router()
const passport = require('passport')
const session = require('express-session')


router.get('/login', (req, resp) => {
    resp.render('/')
})

router.post('/login', check_auth.not, passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/',
    failureFlash: true
 }))

 router.delete('/logout', (req, resp) => {
    req.logout(function(err) {
        if (err) { return next(err) }
        resp.redirect('/')
    })
})

router.post('/register', check_auth.not, async (req, resp) => {

    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        users.push({
            id: Date.now().toString(),
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        })
        resp.redirect('/')
    } catch {
        resp.redirect('/')
    }
    console.log(users)
})

 router.get('/google', (req, resp) => {

    resp.send('Logging in with Google')
 })

 module.exports = router