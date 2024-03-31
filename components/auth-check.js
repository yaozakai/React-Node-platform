// const User = require('./../db/user-model')
const { sql } = require('@vercel/postgres');
const { getUserByEmail } = require('./user-model');


module.exports = {
    verifyEmail: async function ( req, resp, next) {
        // Retrieve user by email
        const user = await getUserByEmail(req.body.email);
        if (user) {
            if (user.isVerified) {
                // logged in and verified. just go to dashboard
                return resp.redirect('/dashboard')
            }
        }
        next()
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
    login: async function (req, resp, next){
        // if offline, redirect to login
        if (!req.isAuthenticated()) {
            try {
                // Get the user by email from the database
                const user = await getUserByEmail(req.body.email);

                if (user) {
                    // If a user with the provided email exists
                    if (!user.is_verified) {
                        req.flash('resendEmail', req.body.email);
                        req.flash('error', 'Cannot sign in until you verify your email!');
                        resp.redirect('/');
                        return;
                    } else {
                        // User is verified, proceed to the next middleware
                        next();
                        return;
                    }
                } else {
                    // User with the provided email does not exist
                    req.flash('error', 'User does not exist');
                    resp.redirect('/');
                    return;
                }
            } catch (error) {
                console.error('Error checking user:', error);
                resp.status(500).json({ error: 'An error occurred while checking user' });
                return;
            }
        } else {
            // logged in and verified. just go to dashboard
            return resp.redirect('/dashboard');
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