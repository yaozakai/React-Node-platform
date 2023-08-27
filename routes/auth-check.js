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
        if( !req.user ) {
            // not logged in
            next()
            return
        }
        // logged in, check verified
        if( req.user.isVerified ) {
            // logged in and verified. just go to dashboard
            return resp.redirect('/dashboard')    
        } else {
            // not verified, return to home, request resending of verify email
            req.flash('resendEmail', req.user.email)
            req.flash('error', 'Account already exists but you have not yet verified your email!')
            resp.redirect('/')
            return 
        }
    },
    // to decide on which ejs file to
    dash: function ( req, resp, next) {
        if( req.user ) {
            if( req.user.isVerified ) {
                // logged in and verified, proceed
                next()
                return
ß            } else {
                // not verified, return to home, request resending of verify email
                req.flash('resendEmail', true)
                req.flash('error', 'Account already exists but you have not yet verified your email!')
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
        if( req.user ) {
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
    // toDashboard: function ( req, resp, next) {
    //     if (!req.user) {
    //         // not logged in
    //         // check if the user is verified
    //         User.findOne({ email: req.body.email }).then((currentUser) => {
    //             // user is logginng in (user exists)
    //             if( currentUser.isVerified ){
    //                 next()
    //             } else {
    //                 // remind user to confirm email
    //                 req.flash('resendEmail', req.body.email)                    
    //                 resp.redirect('/')
    //             }
    //         }).catch(() => {
    //             // user is registering (no user found)
    //             next()
    //         })    
    //     } else {
    //         // logged in
    //         next()
    //     }
        
    // }
}