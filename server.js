const express = require('express')
const fs = require('fs').promises

const app = express()
const port = 3000

app.set('view-engine', 'ejs')
// app.set('views', __dirname + '/views/')
app.use(express.static(__dirname + '/public/'))

app.get('/', async (req, resp) => {

    // resp.send(await fs.readFile('./home.html', 'utf8'))
    
    resp.render('home.ejs')
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