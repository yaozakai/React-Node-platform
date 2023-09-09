const User = require('./../db/user-model')


module.exports = {
    verifyEmail: function ( req, resp, next) {
        // logged in, check verified
        if( req.user.isVerified ) {
            // logged in and verified. just go to dashboard
            return resp.redirect('/dashboard')    
        } else {
            next()
        }
    },
    verify: function ( req, resp, next) {
        // if offline, redirect to login
        if( !req.isAuthenticated() ) {
            // not logged in
            next()
            return
        } else {
            // logged in and verified. just go to dashboard
            return resp.redirect('/dashboard')    
        }
        // User.findOne({ email: req.body.email }).then((currentUser) => {
        //     if( currentUser ){
        //         if( !currentUser.isVerified ){
        //             // not verified, return to home, request resending of verify email
        //             req.flash('resendEmail', req.body.email)
        //             req.flash('error', 'Account already exists but you have not yet verified your email!')
        //             resp.redirect('/')
        //             return 
        //         } else {
        //             // logged in and verified. just go to dashboard
        //             return resp.redirect('/dashboard')    
        //         }
        //     }
        // })        
    },
    login: function (req, resp, next){
        // if offline, redirect to login
        if( !req.isAuthenticated() ) {
            // not logged in
            User.findOne({ email: req.body.email }).then((currentUser) => {
                if( !currentUser.isVerified ){
                    req.flash('resendEmail', req.body.email)
                    req.flash('error', 'Can not sign in until your verify your email!')
                    resp.redirect('/')
                    return
                } else {
                    next()
                    return
                }
            })
        } else {
            // logged in and verified. just go to dashboard
            return resp.redirect('/dashboard')    
        }
    },
    dash: function ( req, resp, next) {
        if( req.isAuthenticated() ) {
            if( req.user.isVerified || req.user.googleId ) {
                // logged in and verified, proceed
                next()
                return
ß            } else {
                // not verified, return to home, request resending of verify email
                req.flash('resendEmail', req.user.email)
                req.flash('error', 'You need to verify your account before trying the dashboard!')
                resp.redirect('/')
                return       
            }
        } else {
            // not logged in
            resp.redirect('/')
            return
        }
    },
    home: function ( req, resp, next) {
        if( req.isAuthenticated() ) {
            if( req.user.isVerified ) {
                // logged in and verified, proceed
                resp.redirect('/dashboard')
                return
ß            } else {
                // not logged in
                next()
                return
            }
        } else {
            // not logged in
            next()
            return
        }
    }
}