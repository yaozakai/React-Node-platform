if (process.env.NODE_ENV != 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()

const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB_CONNECTION_STRING), () => {
    console.log('mongao koneckt!!!!')
}


const authRoutes = require('./routes/auth-routes')
const dashboardRoutes = require('./routes/dashboard-routes')
const check_auth = require('./routes/auth-check')

const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const cookieSession = require('cookie-session')
const methodOverride = require('method-override')

// Mongo DB access
const User = require('./db/user-model')

const fs = require('fs').promises

const port = 3000

app.set('view-engine', 'ejs')
// to avoid using POST and require devs to use DELETE
app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: false }))
app.use(express.static(__dirname + '/public/'))
app.use(flash())
// app.use(session({
//     secret: process.env.SESSION_SECRET,
//     cookie: {
//         maxAge: 3 * 24 * 60 * 60 * 1000,  // 3 days
//         keys: [process.env.SESSION_SECRET]
//     },
//     resave: false,
//     saveUninitialized: false
// }))
app.use(cookieSession({
        maxAge: 3 * 24 * 60 * 60 * 1000,  // 3 days
        keys: [process.env.SESSION_SECRET]
}))
app.use(passport.initialize())
app.use(passport.session())

// add routes from other files here
app.use('/auth', authRoutes)
app.use('/dashboard', dashboardRoutes)

// login modules
const initializePassport = require('./passport-config')
initializePassport(
    passport,
    email => User.findOne({email: email}).email,
    id => User.findOne({googleId: id}.id)
    // email =>  users.find(user => user.email === email),
    // id => users.find(user => user.id === id)
)

app.get('/', check_auth.not, (req, resp) => {
    // resp.send(await fs.readFile('./home.html', 'utf8'))
    resp.render('home.ejs')
})

// app.post('/login', check_auth.not, passport.authenticate('local', {
//     successRedirect: '/dashboard',
//     failureRedirect: '/',
//     failureFlash: true
//  }))

// app.post('/register', check_auth.not, async (req, resp) => {

//     try {
//         const hashedPassword = await bcrypt.hash(req.body.password, 10)
//         users.push({
//             id: Date.now().toString(),
//             username: req.body.username,
//             email: req.body.email,
//             password: hashedPassword
//         })
//         resp.redirect('/')
//     } catch {
//         resp.redirect('/')
//     }
//     console.log(users)
// })

// app.delete('/logout', (req, resp) => {
//     req.logout(function(err) {
//         if (err) { return next(err) }
//         resp.redirect('/')
//     })
    

// })






app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })