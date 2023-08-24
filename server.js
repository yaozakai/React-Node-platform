if (process.env.NODE_ENV != 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')

const initializePassport = require('./passport-config')
initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)

const fs = require('fs').promises

const users = []

const port = 3000

app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(express.static(__dirname + '/public/'))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

app.get('/', checkNotAuthenticated, (req, resp) => {
    // resp.send(await fs.readFile('./home.html', 'utf8'))
    
    resp.render('home.ejs')
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/',
    failureFlash: true
 }))

app.post('/register', checkNotAuthenticated, async (req, resp) => {

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

app.get('/dashboard', checkAuthenticated, (req, resp) => {


    resp.render('dashboard.ejs', { name: req.user.username })

    // resp.send(await fs.readFile('./home.html', 'utf8'))

    // fs.readFile('./home.html', 'utf8', (err, html) => {
    //     if (err) {
    //         resp.status(500).send('html file read error')
    //     }
    // })
})

function checkAuthenticated( req, resp, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    return resp.redirect('/')
}

function checkNotAuthenticated( req, resp, next) {
    if (req.isAuthenticated()) {
        resp.redirect('/dashboard')
    }
    next()
}

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })