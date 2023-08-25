if (process.env.NODE_ENV != 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()

const authRoutes = require('./routes/auth-routes')
const check_auth = require('./routes/auth-check')

const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')

const users = require('./db/db_access.js')

const initializePassport = require('./passport-config')
// const get_users = require('./db/db_access.js')
initializePassport(
    passport,
    email =>  users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)

const fs = require('fs').promises

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
app.use(methodOverride('_method'))
app.use('/auth', authRoutes)

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


app.get('/dashboard', check_auth.is, (req, resp) => {


    resp.render('dashboard.ejs', { name: req.user.username })

    // resp.send(await fs.readFile('./home.html', 'utf8'))

    // fs.readFile('./home.html', 'utf8', (err, html) => {
    //     if (err) {
    //         resp.status(500).send('html file read error')
    //     }
    // })
})



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })