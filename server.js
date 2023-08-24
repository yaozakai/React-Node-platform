const express = require('express')
const bcrypt = require('bcrypt')
const fs = require('fs').promises

const users = []

const app = express()
const port = 3000

app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(express.static(__dirname + '/public/'))

app.get('/', async (req, resp) => {

    // resp.send(await fs.readFile('./home.html', 'utf8'))
    
    resp.render('home.ejs')
})

app.post('/login', async (req, resp) => {

    req.body.username
    req.body.email
    req.body.password 
    
    resp.render('home.ejs')
})

app.post('/register', async (req, resp) => {

    try {
        const hashedPassword = bcrypt.hash(req.body.password, 10)
        users.push({
            id: Date.now().toString,
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        })
        resp.redirect('/login')
    } catch {
        resp.redirect('/')
    }
})

app.get('/dashboard', async (req, resp) => {

    resp.render('dashboard.html', { name: Walt })

    resp.send(await fs.readFile('./home.html', 'utf8'))

    // fs.readFile('./home.html', 'utf8', (err, html) => {
    //     if (err) {
    //         resp.status(500).send('html file read error')
    //     }
    // })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })