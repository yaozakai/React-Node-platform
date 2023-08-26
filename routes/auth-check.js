module.exports = {
    is: function ( req, resp, next) {
        if (!req.user) {
            // not logged in
            resp.redirect('/')            
        } else {
            // logged in
            next()
        }
    },    
    not: function ( req, resp, next) {
        if (req.isAuthenticated()) {
            // req.flash('success_msg', 'Welcome');
            return resp.redirect('/dashboard')
        }
        next()
    }    
}