const check_auth = require('../components/auth-check')
const router = require('express').Router()
const moment = require('moment')


router.get('/', check_auth.dash, async (req, resp) => {
    // update recent session date (might already be updated)
    req.user.lastSession = req.session.created
    req.user.markModified('lastSession');
    await req.user.save()

    resp.render('dashboard.ejs', { user: req.user, moment:moment })
    req.flash('success_msg', 'Welcome')
})

module.exports = router