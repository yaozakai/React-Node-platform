const check_auth = require('./auth-check')
const router = require('express').Router()


router.get('/', check_auth.dash, (req, resp) => {
    // resp.send('you are logged in: ' + req.user.username) 
    
    resp.render('dashboard.ejs', { user: req.user })
    req.flash('success_msg', 'Welcome')
})

module.exports = router