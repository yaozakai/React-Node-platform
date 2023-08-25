const check_auth = require('./auth-check')
const router = require('express').Router()


router.get('/', check_auth.is, (req, resp) => {
    // resp.send('you are logged in: ' + req.user.username) 

    resp.render('dashboard.ejs', { name: req.user.username })
})

module.exports = router